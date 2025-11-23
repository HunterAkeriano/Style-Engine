import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { getDb } from '../config/db'
import type { Env } from '../config/env'
import { createAuthMiddleware, requireAdmin, type AuthRequest } from '../middleware/auth'

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
  db: ReturnType<typeof getDb>,
  superAdminEmail: string
): Promise<UsersPayload> {
  const offset = (options.page - 1) * options.limit
  const queryParams: any[] = [superAdminEmail]
  let paramIndex = 2
  let whereClause = 'WHERE LOWER(email) != LOWER($1)'

  if (options.tier !== 'all') {
    whereClause += ` AND subscription_tier = $${paramIndex}`
    queryParams.push(options.tier)
    paramIndex++
  }

  const sortField = sortFieldMap[options.sortBy] || 'created_at'
  const sortDirection = options.sortOrder === 'asc' ? 'ASC' : 'DESC'

  const countQuery = `SELECT COUNT(*)::int AS total FROM users ${whereClause}`
  const countResult = await db.query(countQuery, queryParams)
  const total = countResult.rows[0]?.total || 0

  const usersQuery = `
    SELECT
      id,
      email,
      name,
      avatar_url as "avatarUrl",
      subscription_tier as "subscriptionTier",
      subscription_expires_at as "subscriptionExpiresAt",
      created_at as "createdAt"
    FROM users
    ${whereClause}
    ORDER BY
      CASE
        WHEN subscription_tier = 'premium' THEN 1
        WHEN subscription_tier = 'pro' THEN 2
        WHEN subscription_tier = 'free' THEN 3
        ELSE 4
      END,
      ${sortField} ${sortDirection}
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `

  queryParams.push(options.limit, offset)
  const usersResult = await db.query(usersQuery, queryParams)

  return {
    users: usersResult.rows,
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
  const db = getDb()
  const auth = createAuthMiddleware(env)
  const superAdminEmail = env.SUPER_ADMIN_EMAIL.toLowerCase()

  router.get('/public', async (req, res) => {
    try {
      const payload = await fetchUsers(normalizeQuery(req), db, superAdminEmail)
      res.json(payload)
    } catch (error) {
      console.error('Failed to load public users:', error)
      res.status(500).json({ message: 'Failed to load users' })
    }
  })

  /**
   * @swagger
   * /api/users:
   *   get:
   *     summary: Получить список пользователей
   *     description: Возвращает список всех пользователей с пагинацией, фильтрацией и сортировкой (исключая супер-админа)
   *     tags: [Users]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Номер страницы
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 20
   *         description: Количество на странице
   *       - in: query
   *         name: tier
   *         schema:
   *           type: string
   *           enum: [all, free, pro, premium]
   *           default: all
   *         description: Фильтр по тарифу
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [name, email, createdAt, subscriptionTier]
   *           default: createdAt
   *         description: Поле для сортировки
   *       - in: query
   *         name: sortOrder
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *           default: desc
   *         description: Направление сортировки
   *     responses:
   *       200:
   *         description: Список пользователей успешно получен
   */
  router.get('/', auth, requireAdmin, async (req, res) => {
    try {
      const payload = await fetchUsers(normalizeQuery(req), db, superAdminEmail)
      res.json(payload)
    } catch (error) {
      console.error('Failed to fetch users:', error)
      res.status(500).json({ message: 'Failed to fetch users' })
    }
  })

  router.put('/:id', auth, requireAdmin, async (req: AuthRequest, res) => {
    const { id } = req.params
    const { email, name, password, subscriptionTier, subscriptionDuration } = req.body

    if (!id) {
      return res.status(400).json({ message: 'User id is required' })
    }

    const updates: string[] = []
    const params: any[] = []
    let paramIndex = 1

    if (email) {
      updates.push(`email = $${paramIndex}`)
      params.push(email)
      paramIndex++
    }

    if (name !== undefined) {
      updates.push(`name = $${paramIndex}`)
      params.push(name)
      paramIndex++
    }

    if (subscriptionTier) {
      const allowed = ['free', 'pro', 'premium']
      if (!allowed.includes(subscriptionTier)) {
        return res.status(400).json({ message: 'Invalid subscription tier' })
      }

      updates.push(`subscription_tier = $${paramIndex}`)
      params.push(subscriptionTier)
      paramIndex++
      const isPayment = subscriptionTier !== 'free'
      updates.push(`is_payment = $${paramIndex}`)
      params.push(isPayment)
      paramIndex++

      if (subscriptionTier === 'free') {
        updates.push('subscription_expires_at = NULL')
      } else if (subscriptionDuration === 'month') {
        updates.push(`subscription_expires_at = NOW() + interval '30 days'`)
      } else if (subscriptionDuration === 'forever') {
        updates.push(`subscription_expires_at = '2100-01-01'::timestamptz`)
      }
    }

    if (password) {
      const passwordHash = await bcrypt.hash(password, 10)
      updates.push(`password_hash = $${paramIndex}`)
      params.push(passwordHash)
      paramIndex++
    }

    if (!updates.length) {
      return res.status(400).json({ message: 'Nothing to update' })
    }

    updates.push('updated_at = NOW()')
    const query = `
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, email, name, avatar_url as "avatarUrl", subscription_tier as "subscriptionTier", subscription_expires_at as "subscriptionExpiresAt",
                is_payment as "isPayment", is_admin as "isAdmin", created_at as "createdAt"
    `
    params.push(id)

    try {
      const result = await db.query(query, params)
      if (!result.rowCount) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.json({ user: result.rows[0] })
    } catch (error) {
      console.error('Failed to update user:', error)
      if ((error as any).code === '23505') {
        return res.status(400).json({ message: 'Email already in use' })
      }
      res.status(500).json({ message: 'Failed to update user' })
    }
  })

  router.delete('/:id', auth, requireAdmin, async (req, res) => {
    const { id } = req.params
    if (!id) {
      return res.status(400).json({ message: 'User id is required' })
    }
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id])
    if (!result.rowCount) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(204).send()
  })

  return router
}
