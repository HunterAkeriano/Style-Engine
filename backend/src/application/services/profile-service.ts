import fs from 'fs/promises'
import path from 'path'
import type { Env } from '../../config/env'
import type { User } from '../../models'
import { UserRepository } from '../../infrastructure/repositories/user-repository'
import { toApiError } from '../../utils/apiError'
import type { InferAttributes } from 'sequelize'
import { resolveUserRole, type UserRole } from '../../utils/roles'

type SafeUser = Omit<InferAttributes<User>, 'passwordHash'> & { role: UserRole }

export class ProfileService {
  // Use shared cache so invalidation works across controller instances
  private static cache = new Map<string, { user: SafeUser; expiresAt: number }>()
  private static readonly ttl = 60_000

  constructor(private readonly env: Env, private readonly users: UserRepository) {}

  private attachSuperFlag(user: Omit<InferAttributes<User>, 'passwordHash'>) {
    const roleData = resolveUserRole(this.env, { email: user.email, role: (user as any).role })
    return { ...user, role: roleData.role }
  }

  private toSafeUser(user: User | null) {
    if (!user) return null
    const { passwordHash: _ignored, ...plain } = user.get({ plain: true }) as InferAttributes<User>
    void _ignored
    return this.attachSuperFlag(plain)
  }

  private getCachedProfile(userId: string) {
    const cached = ProfileService.cache.get(userId)
    if (!cached) return null
    if (cached.expiresAt < Date.now()) {
      ProfileService.cache.delete(userId)
      return null
    }
    return cached.user
  }

  private setCachedProfile(userId: string, user: SafeUser) {
    ProfileService.cache.set(userId, { user, expiresAt: Date.now() + ProfileService.ttl })
  }

  clearCache(userId: string) {
    ProfileService.cache.delete(userId)
  }

  async getProfile(userId: string) {
    const cached = this.getCachedProfile(userId)
    if (cached) return cached

    const user = await this.users.findById(userId, [
      'id',
      'email',
      'name',
      'avatarUrl',
      'createdAt',
      'updatedAt',
      'isPayment',
      'subscriptionTier',
      'role',
      'subscriptionExpiresAt'
    ])
    const safe = this.toSafeUser(user)
    if (!safe) throw toApiError(404, 'User not found')
    this.setCachedProfile(userId, safe)
    return safe
  }

  async updateProfile(userId: string, payload: { name?: string; avatarUrl?: string }) {
    const user = await this.users.findById(userId)
    if (!user) throw toApiError(404, 'User not found')
    await this.users.update(user, {
      name: payload.name ?? user.name,
      avatarUrl: payload.avatarUrl ?? user.avatarUrl,
      updatedAt: new Date() as any
    })
    const safe = this.toSafeUser(user)
    if (safe) this.setCachedProfile(userId, safe)
    return safe
  }

  async updateAvatar(userId: string, fileName: string) {
    const user = await this.users.findById(userId)
    if (!user) throw toApiError(404, 'User not found')

    const oldAvatarUrl = user.avatarUrl || undefined
    const baseUrl = this.env.API_URL?.replace(/\/+$/, '') || ''
    const avatarUrl =
      baseUrl.length > 0
        ? new URL(`/uploads/avatars/${fileName}`, baseUrl).toString()
        : `/uploads/avatars/${fileName}`
    await this.users.update(user, { avatarUrl, updatedAt: new Date() as any })

    if (oldAvatarUrl) {
      const oldFileName = oldAvatarUrl.split('/uploads/avatars/')[1]
      if (oldFileName) {
        const filePath = path.join(__dirname, '../../uploads/avatars', path.basename(oldFileName))
        fs.unlink(filePath).catch(() => void 0)
      }
    }

    const safe = this.toSafeUser(user)
    if (safe) this.setCachedProfile(userId, safe)
    return { user: safe, avatarUrl }
  }
}
