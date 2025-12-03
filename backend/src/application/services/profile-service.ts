import fs from 'fs/promises'
import path from 'path'
import type { Env } from '../../config/env'
import { isSuperAdminEmail } from '../../config/super-admin'
import type { User } from '../../models'
import { UserRepository } from '../../infrastructure/repositories/user-repository'
import { toApiError } from '../../utils/apiError'
import type { InferAttributes } from 'sequelize'

type SafeUser = Omit<InferAttributes<User>, 'passwordHash'> & { isSuperAdmin: boolean }

export class ProfileService {
  private readonly cache = new Map<string, { user: SafeUser; expiresAt: number }>()
  private readonly ttl = 60_000

  constructor(private readonly env: Env, private readonly users: UserRepository) {}

  private attachSuperFlag(user: Omit<InferAttributes<User>, 'passwordHash'>) {
    return { ...user, isSuperAdmin: isSuperAdminEmail(this.env, user.email) }
  }

  private toSafeUser(user: User | null) {
    if (!user) return null
    const { passwordHash: _ignored, ...plain } = user.get({ plain: true }) as InferAttributes<User>
    void _ignored
    return this.attachSuperFlag(plain)
  }

  private getCachedProfile(userId: string) {
    const cached = this.cache.get(userId)
    if (!cached) return null
    if (cached.expiresAt < Date.now()) {
      this.cache.delete(userId)
      return null
    }
    return cached.user
  }

  private setCachedProfile(userId: string, user: SafeUser) {
    this.cache.set(userId, { user, expiresAt: Date.now() + this.ttl })
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
      'isAdmin',
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

  async updateAvatar(userId: string, fileName: string, host: string, protocol: string) {
    const user = await this.users.findById(userId)
    if (!user) throw toApiError(404, 'User not found')

    const oldAvatarUrl = user.avatarUrl || undefined
    const avatarUrl = `${protocol}://${host}/uploads/avatars/${fileName}`
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
