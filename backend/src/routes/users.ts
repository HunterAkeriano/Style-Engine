import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { col, fn, literal, Op, where, type WhereOptions } from 'sequelize'
import { getModels } from '../config/db'
import type { Env } from '../config/env'
import { createAuthMiddleware, requireAdmin, type AuthRequest } from '../middleware/auth'
import type { User } from '../models'
import { sendApiError } from '../utils/apiError'

type Tier = 'all' | 'free' | 'pro' | 'premium'

interface QueryOptions {
  page: number
  limit: number
  tier: Tier
  sortBy: 'name' | 'email' | 'createdat' | 'subscriptiontier'
  sortOrder: 'asc' | 'desc'
}

interface UsersPayload {
  users: any[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

const allowedTiers: Tier[] = ['all', 'free', 'pro', 'premium']
const allowedSortFields = ['name', 'email', 'createdat', 'subscriptiontier'] as const
const sortFieldMap: Record<typeof allowedSortFields[number], string> = {
  name: `COALESCE(NULLIF(name, ''), split_part(email, '@', 1))`,
  email: 'email',
  createdat: 'created_at',
  subscriptiontier: 'subscription_tier'
}

function serializeUser(user: User) {
  const plain = user.get({ plain: true }) as any
  delete plain.passwordHash
  return plain
}

function normalizeQuery(req: any): QueryOptions {
  const page = Math.max(1, parseInt(req.query.page as string) || 1)
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20))
  const tier = ((req.query.tier as string) || 'all').toLowerCase()
  const sortBy = ((req.query.sortBy as string) || 'createdAt').toLowerCase()
  const sortOrder = ((req.query.sortOrder as string) || 'desc').toLowerCase()

  const sanitizedTier: Tier = allowedTiers.includes(tier as Tier) ? (tier as Tier) : 'all'
  const sanitizedSortBy = allowedSortFields.includes(sortBy as any)
    ? (sortBy as typeof allowedSortFields[number])
    : 'createdat'
  const sanitizedSortOrder = sortOrder === 'asc' ? 'asc' : 'desc'

  return { page, limit, tier: sanitizedTier, sortBy: sanitizedSortBy, sortOrder: sanitizedSortOrder }
}

async function fetchUsers(
  options: QueryOptions,
  userModel: typeof User,
  superAdminEmail: string
): Promise<UsersPayload> {
  const offset = (options.page - 1) * options.limit
  const whereConditions: WhereOptions[] = [
    where(fn('LOWER', col('email')), { [Op.ne]: superAdminEmail })
  ]

  if (options.tier !== 'all') {
    whereConditions.push({ subscriptionTier: options.tier } as WhereOptions)
  }
  const whereClause: WhereOptions = { [Op.and]: whereConditions }

  const sortField = sortFieldMap[options.sortBy] || 'created_at'
  const sortDirection = options.sortOrder === 'asc' ? 'ASC' : 'DESC'

  const total = await userModel.count({ where: whereClause })

  const users = await userModel.findAll({
    where: whereClause,
    attributes: ['id', 'email', 'name', 'avatarUrl', 'subscriptionTier', 'subscriptionExpiresAt', 'createdAt'],
    order: [
      [
        literal(
          `CASE WHEN "subscription_tier" = 'premium' THEN 1 WHEN "subscription_tier" = 'pro' THEN 2 WHEN "subscription_tier" = 'free' THEN 3 ELSE 4 END`
        ),
        'ASC'
      ],
      [literal(sortField), sortDirection]
    ],
    limit: options.limit,
    offset
  })

  return {
    users: users.map(serializeUser),
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      totalPages: Math.ceil(total / options.limit),
      hasMore: offset + options.limit < total
    }
  }
}

export function createUsersRouter(env: Env) {
  const router = Router()
  const { User } = getModels()
  const auth = createAuthMiddleware(env)
  const superAdminEmail = env.SUPER_ADMIN_EMAIL.toLowerCase()

  router.get('/public', async (req, res) => {
    try {
      const payload = await fetchUsers(normalizeQuery(req), User, superAdminEmail)
      res.json(payload)
    } catch (error) {
      console.error('Failed to load public users:', error)
      return sendApiError(res, 500, 'Failed to load users')
    }
  })


  router.get('/', auth, requireAdmin, async (req, res) => {
    try {
      const payload = await fetchUsers(normalizeQuery(req), User, superAdminEmail)
      res.json(payload)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      return sendApiError(res, 500, 'Failed to fetch users')
    }
  })

  router.put('/:id', auth, requireAdmin, async (req: AuthRequest, res) => {
    const { id } = req.params
    const { email, name, password, subscriptionTier, subscriptionDuration } = req.body

    if (!id) {
      return sendApiError(res, 400, 'User id is required')
    }

    const updates: any = {}

    if (email) updates.email = email
    if (name !== undefined) updates.name = name

    if (subscriptionTier) {
      const allowed = ['free', 'pro', 'premium']
      if (!allowed.includes(subscriptionTier)) {
        return sendApiError(res, 400, 'Invalid subscription tier')
      }

      const isPayment = subscriptionTier !== 'free'
      updates.subscriptionTier = subscriptionTier
      updates.isPayment = isPayment

      if (subscriptionTier === 'free') {
        updates.subscriptionExpiresAt = null
      } else if (subscriptionDuration === 'month') {
        updates.subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      } else if (subscriptionDuration === 'forever') {
        updates.subscriptionExpiresAt = new Date('2100-01-01T00:00:00Z')
      }
    }

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10)
      updates.passwordHash = passwordHash
    }

    if (!Object.keys(updates).length) {
      return sendApiError(res, 400, 'Nothing to update')
    }

    updates.updatedAt = new Date()

    try {
      const user = await User.findByPk(id)
      if (!user) {
        return sendApiError(res, 404, 'User not found')
      }
      await user.update(updates)
      res.json({
        user: serializeUser(user)
      })
    } catch (error) {
      console.error('Failed to update user:', error)
      if ((error as any).code === '23505' || (error as any).name === 'SequelizeUniqueConstraintError') {
        return sendApiError(res, 400, 'Email already in use')
      }
      return sendApiError(res, 500, 'Failed to update user')
    }
  })

  router.delete('/:id', auth, requireAdmin, async (req, res) => {
    const { id } = req.params
    if (!id) {
      return sendApiError(res, 400, 'User id is required')
    }
    const deleted = await User.destroy({ where: { id } })
    if (!deleted) {
      return sendApiError(res, 404, 'User not found')
    }
    res.status(204).send()
  })

  return router
}
