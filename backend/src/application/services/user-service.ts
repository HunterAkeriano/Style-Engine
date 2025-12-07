import bcrypt from 'bcryptjs'
import { col, fn, literal, Op, where, type WhereOptions } from 'sequelize'
import type { Env } from '../../config/env'
import { UserRepository } from '../../infrastructure/repositories/user-repository'
import type { Models, User } from '../../models'
import { toApiError } from '../../utils/apiError'
import { resolveUserRole, roleToFlags, type UserRole } from '../../utils/roles'

type Tier = 'all' | 'free' | 'pro' | 'premium'
type SortField = 'name' | 'email' | 'createdat' | 'subscriptiontier'

export interface UsersQueryOptions {
  page: number
  limit: number
  tier: Tier
  sortBy: SortField
  sortOrder: 'asc' | 'desc'
}

const sortFieldMap: Record<SortField, string> = {
  name: `COALESCE(NULLIF(name, ''), split_part(email, '@', 1))`,
  email: 'email',
  createdat: 'created_at',
  subscriptiontier: 'subscription_tier'
}

export class UserService {
  private readonly superAdminEmail: string

  constructor(private readonly env: Env, private readonly users: UserRepository, private readonly models: Models) {
    this.superAdminEmail = env.SUPER_ADMIN_EMAIL.toLowerCase()
  }

  private serializeUser(user: User, options: { hideSuperAdmin?: boolean } = {}) {
    const { passwordHash: _ignored, ...rest } = user.get({ plain: true }) as any
    void _ignored
    const roleData = resolveUserRole(this.env, rest)
    const serialized = { ...rest, ...roleData }
    if (options.hideSuperAdmin) {
      delete (serialized as any).isSuperAdmin
    }
    return serialized
  }

  async fetchUsers(options: UsersQueryOptions, extra?: { hideSuperAdmin?: boolean }) {
    const offset = (options.page - 1) * options.limit
    const whereConditions: WhereOptions[] = [where(fn('LOWER', col('email')), { [Op.ne]: this.superAdminEmail })]
    if (options.tier !== 'all') {
      whereConditions.push({ subscriptionTier: options.tier } as WhereOptions)
    }
    const whereClause: WhereOptions = { [Op.and]: whereConditions }
    const sortField = sortFieldMap[options.sortBy] || 'created_at'
    const sortDirection = options.sortOrder === 'asc' ? 'ASC' : 'DESC'

    const total = await this.users.findUsers({
      limit: options.limit,
      offset,
      search: undefined,
      attributes: ['id']
    }).then((res) => res.count)

    const ordered = await this.models.User.findAll({
      where: whereClause,
      attributes: [
        'id',
        'email',
        'name',
        'avatarUrl',
        'subscriptionTier',
        'subscriptionExpiresAt',
        'createdAt',
        'isAdmin',
        'isSuperAdmin'
      ],
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
      users: ordered.map((u: User) => this.serializeUser(u, { hideSuperAdmin: extra?.hideSuperAdmin })),
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages: Math.ceil(total / options.limit),
        hasMore: offset + options.limit < total
      }
    }
  }

  async updateUser(
    id: string,
    payload: {
      email?: string
      name?: string | null
      subscriptionTier?: 'free' | 'pro' | 'premium'
      subscriptionDuration?: 'month' | 'forever'
      password?: string
      role?: UserRole
    }
  ) {
    const user = await this.users.findById(id)
    if (!user) throw toApiError(404, 'User not found')

    const updates: any = {}
    if (payload.email) updates.email = payload.email
    if (payload.name !== undefined) updates.name = payload.name

    if (payload.subscriptionTier) {
      const tier = payload.subscriptionTier
      updates.subscriptionTier = tier
      updates.isPayment = tier !== 'free'
      if (tier === 'free') {
        updates.subscriptionExpiresAt = null
      } else if (payload.subscriptionDuration === 'month') {
        updates.subscriptionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      } else if (payload.subscriptionDuration === 'forever') {
        updates.subscriptionExpiresAt = new Date('2100-01-01T00:00:00Z')
      }
    }

    if (payload.password) {
      updates.passwordHash = await bcrypt.hash(payload.password, 10)
    }

    if (payload.role !== undefined) {
      const allowedRoles: UserRole[] = ['user', 'moderator', 'super_admin']
      if (!allowedRoles.includes(payload.role)) {
        throw toApiError(400, 'Invalid role')
      }
      const flags = roleToFlags(payload.role)
      updates.isAdmin = flags.isAdmin
      updates.isSuperAdmin = flags.isSuperAdmin
    }

    if (!Object.keys(updates).length) {
      throw toApiError(400, 'Nothing to update')
    }

    updates.updatedAt = new Date()
    await this.users.update(user, updates)
    return this.serializeUser(user)
  }

  async deleteUser(id: string) {
    const deleted = await (this.users as any).models.User.destroy({ where: { id } })
    if (!deleted) throw toApiError(404, 'User not found')
  }
}
