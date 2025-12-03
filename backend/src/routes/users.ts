import bcrypt from 'bcryptjs'
import { Router, type Request, type Response } from 'express'
import { col, fn, literal, Op, where, type InferAttributes, type WhereOptions } from 'sequelize'
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
  users: PublicUser[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

type UserAttributes = InferAttributes<User>
type PublicUser = Omit<UserAttributes, 'passwordHash'>
type UserUpdates = Partial<
  Pick<UserAttributes, 'email' | 'name' | 'subscriptionTier' | 'subscriptionExpiresAt' | 'isPayment' | 'passwordHash' | 'updatedAt'>
>
interface UsersQuery {
  page?: string
  limit?: string
  tier?: string
  sortBy?: string
  sortOrder?: string
}

const allowedTiers: readonly Tier[] = ['all', 'free', 'pro', 'premium']
const allowedSortFields = ['name', 'email', 'createdat', 'subscriptiontier'] as const
type AllowedSortField = (typeof allowedSortFields)[number]
const sortFieldMap: Record<AllowedSortField, string> = {
  name: `COALESCE(NULLIF(name, ''), split_part(email, '@', 1))`,
  email: 'email',
  createdat: 'created_at',
  subscriptiontier: 'subscription_tier'
}

function isAllowedTier(value: string): value is Tier {
  return (allowedTiers as readonly string[]).includes(value)
}

function isAllowedSortField(value: string): value is AllowedSortField {
  return (allowedSortFields as readonly string[]).includes(value)
}

function serializeUser(user: User) {
  const { passwordHash: _passwordHash, ...rest } = user.get({ plain: true }) as UserAttributes
  void _passwordHash
  return rest
}

function normalizeQuery(req: Request<Record<string, string | undefined>, unknown, unknown, UsersQuery>): QueryOptions {
  const page = Math.max(1, parseInt(req.query.page ?? '') || 1)
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit ?? '') || 20))
  const tier = (req.query.tier ?? 'all').toLowerCase()
  const sortBy = (req.query.sortBy ?? 'createdAt').toLowerCase()
  const sortOrder = (req.query.sortOrder ?? 'desc').toLowerCase()

  const sanitizedTier: Tier = isAllowedTier(tier) ? tier : 'all'
  const sanitizedSortBy: AllowedSortField = isAllowedSortField(sortBy) ? sortBy : 'createdat'
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

  router.get('/public', async (req: Request<Record<string, string | undefined>, unknown, unknown, UsersQuery>, res: Response) => {
    try {
      const payload = await fetchUsers(normalizeQuery(req), User, superAdminEmail)
      res.json(payload)
    } catch (error) {
      console.error('Failed to load public users:', error)
      return sendApiError(res, 500, 'Failed to load users')
    }
  })

  router.get('/', auth, requireAdmin, async (req: Request<Record<string, string | undefined>, unknown, unknown, UsersQuery>, res: Response) => {
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

    const updates: UserUpdates = {}

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
      if (isUniqueConstraintError(error)) {
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

function isUniqueConstraintError(error: unknown): error is { code?: string; name?: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    ('code' in error || 'name' in error)
  )
}
