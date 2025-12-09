import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { type InferAttributes } from 'sequelize'
import { OAuth2Client } from 'google-auth-library'
import type { Env } from '../../config/env'
import type { User } from '../../models'
import { TokenService } from './token-service'
import { UserRepository } from '../../infrastructure/repositories/user-repository'
import { RefreshTokenRepository } from '../../infrastructure/repositories/refresh-token-repository'
import { PasswordResetRepository } from '../../infrastructure/repositories/password-reset-repository'
import { toApiError } from '../../utils/apiError'
import { resolveUserRole, type UserRole } from '../../utils/roles'

export type SafeUser = Omit<InferAttributes<User>, 'passwordHash'> & { isSuperAdmin: boolean; role: UserRole; isAdmin: boolean }

export class AuthService {
  constructor(
    private readonly env: Env,
    private readonly users: UserRepository,
    private readonly refreshTokens: RefreshTokenRepository,
    private readonly resets: PasswordResetRepository,
    private readonly tokenService: TokenService
  ) {}

  private attachSuperFlag(user: Omit<InferAttributes<User>, 'passwordHash'>): SafeUser {
    const roleData = resolveUserRole(this.env, { email: user.email, isAdmin: user.isAdmin, isSuperAdmin: user.isSuperAdmin })
    return { ...user, ...roleData }
  }

  toSafeUser(user: User | null): SafeUser | null {
    if (!user) return null
    const { passwordHash: _ignored, ...rest } = user.get({ plain: true }) as InferAttributes<User>
    void _ignored
    return this.attachSuperFlag(rest)
  }

  async register(payload: { email: string; password: string; name?: string }) {
    const existing = await this.users.findByEmail(payload.email)
    if (existing) {
      throw toApiError(409, 'User already exists')
    }

    const passwordHash = await bcrypt.hash(payload.password, 10)
    const user = await this.users.create({
      email: payload.email.toLowerCase(),
      passwordHash,
      name: payload.name ?? null
    })

    const tokens = this.tokenService.signPair(user.id)
    await this.refreshTokens.create({
      userId: user.id,
      tokenHash: tokens.refreshHash,
      expiresAt: tokens.refreshExpires,
      revoked: false
    })

    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: this.toSafeUser(user)! }
  }

  async login(payload: { email: string; password: string }) {
    const user = await this.users.findByEmail(payload.email, [
      'id',
      'email',
      'passwordHash',
      'name',
      'avatarUrl',
      'createdAt',
      'isPayment',
      'isAdmin',
      'isSuperAdmin',
      'subscriptionTier',
      'subscriptionExpiresAt'
    ])
    if (!user) throw toApiError(401, 'Invalid credentials')

    const valid = await bcrypt.compare(payload.password, user.passwordHash)
    if (!valid) throw toApiError(401, 'Invalid credentials')

    const tokens = this.tokenService.signPair(user.id)
    await this.refreshTokens.create({
      userId: user.id,
      tokenHash: tokens.refreshHash,
      expiresAt: tokens.refreshExpires,
      revoked: false
    })

    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: this.toSafeUser(user)! }
  }

  async refresh(refreshToken: string) {
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    const record = await this.refreshTokens.findValid(tokenHash)
    if (!record) {
      throw toApiError(401, 'Invalid refresh token')
    }

    const user = await this.users.findById(record.userId, [
      'id',
      'email',
      'name',
      'avatarUrl',
      'subscriptionTier',
      'subscriptionExpiresAt',
      'isPayment',
      'isAdmin',
      'isSuperAdmin',
      'createdAt'
    ])
    if (!user) throw toApiError(401, 'Invalid refresh token')

    const accessToken = this.tokenService.issueAccess(user.id)
    return { accessToken, user: this.toSafeUser(user)! }
  }

  async logout(refreshToken: string | undefined) {
    if (!refreshToken) return
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex')
    await this.refreshTokens.revokeByHash(tokenHash)
  }

  async forgotPassword(email: string) {
    const user = await this.users.findByEmail(email, ['id', 'email'])
    if (!user) throw toApiError(404, 'Email not found')

    const token = crypto.randomBytes(24).toString('hex')
    const tokenHash = this.tokenService.hashResetToken(token)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

    await this.resets.create({
      userId: user.id,
      tokenHash,
      expiresAt,
      used: false
    })

    return { token, userEmail: user.email }
  }

  async resetPassword(payload: { token: string; password: string }) {
    const tokenHash = this.tokenService.hashResetToken(payload.token)
    const reset = await this.resets.findValid(tokenHash)
    if (!reset) throw toApiError(400, 'Invalid or expired token')

    const user = await this.users.findById(reset.userId, ['id', 'passwordHash'])
    if (!user) throw toApiError(400, 'Invalid or expired token')

    const newHash = await bcrypt.hash(payload.password, 10)
    await this.users.update(user, { passwordHash: newHash, updatedAt: new Date() as any })
    await this.resets.markUsed(reset)
  }

  async changePassword(payload: { userId: string; currentPassword: string; newPassword: string }) {
    const user = await this.users.findById(payload.userId, ['id', 'passwordHash'])
    if (!user) throw toApiError(401, 'User not found')

    const valid = await bcrypt.compare(payload.currentPassword, user.passwordHash)
    if (!valid) throw toApiError(400, 'Invalid current password')

    const newHash = await bcrypt.hash(payload.newPassword, 10)
    await this.users.update(user, { passwordHash: newHash, updatedAt: new Date() as any })
  }

  async googleAuth(credential: string) {
    const googleClientId = this.env.GOOGLE_CLIENT_ID
    if (!googleClientId) {
      throw toApiError(500, 'Google OAuth not configured')
    }

    const client = new OAuth2Client(googleClientId)

    let payload
    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: googleClientId
      })
      payload = ticket.getPayload()
    } catch (err) {
      console.error('Google token verification error:', err)
      throw toApiError(401, 'Invalid Google token')
    }

    if (!payload || !payload.email) {
      throw toApiError(401, 'Invalid Google token')
    }

    const email = payload.email.toLowerCase()
    const name = payload.name || payload.given_name || null
    const avatarUrl = payload.picture || null

    let user = await this.users.findByEmail(email, [
      'id',
      'email',
      'passwordHash',
      'name',
      'avatarUrl',
      'createdAt',
      'isPayment',
      'isAdmin',
      'isSuperAdmin',
      'subscriptionTier',
      'subscriptionExpiresAt'
    ])

    if (!user) {
      const randomPassword = crypto.randomBytes(32).toString('hex')
      const passwordHash = await bcrypt.hash(randomPassword, 10)
      user = await this.users.create({
        email,
        passwordHash,
        name,
        avatarUrl
      })
    } else if (!user.avatarUrl && avatarUrl) {
      await this.users.update(user, { avatarUrl })
    }

    const tokens = this.tokenService.signPair(user.id)
    await this.refreshTokens.create({
      userId: user.id,
      tokenHash: tokens.refreshHash,
      expiresAt: tokens.refreshExpires,
      revoked: false
    })

    return { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: this.toSafeUser(user)! }
  }
}
