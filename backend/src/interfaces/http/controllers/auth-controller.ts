import { Router } from 'express'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import type { Env } from '../../../config/env'
import { parseCookies, serializeCookie } from '../../../utils/cookies'
import { AuthService } from '../../../application/services/auth-service'
import { TokenService } from '../../../application/services/token-service'
import { MailerService } from '../../../application/services/mailer-service'
import { UserRepository } from '../../../infrastructure/repositories/user-repository'
import { RefreshTokenRepository } from '../../../infrastructure/repositories/refresh-token-repository'
import { PasswordResetRepository } from '../../../infrastructure/repositories/password-reset-repository'
import type { Models } from '../../../models'
import { sendApiError } from '../../../utils/apiError'
import { MailBuilder } from '../mail-builder'
import type { HttpController } from '../api-router'

const strongPassword = z
  .string()
  .min(8)
  .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/u, 'Weak password')

const credentialsSchema = z.object({
  email: z.string().email(),
  password: strongPassword,
  name: z.string().min(1).max(120).optional()
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
})

const forgotSchema = z.object({
  email: z.string().email()
})

const resetSchema = z.object({
  token: z.string().min(10),
  password: strongPassword
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: strongPassword
})

const googleAuthSchema = z.object({
  credential: z.string().min(1)
})

export class AuthController implements HttpController {
  readonly basePath = '/auth'

  private readonly service: AuthService
  private readonly env: Env

  constructor(env: Env, models: Models) {
    this.env = env
    const tokenService = new TokenService(env)
    this.service = new AuthService(
      env,
      new UserRepository(models),
      new RefreshTokenRepository(models),
      new PasswordResetRepository(models),
      tokenService
    )
  }

  register(router: Router) {
    router.post('/register', async (req, res) => {
      const parsed = credentialsSchema.safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid payload', { details: parsed.error.issues })
      }

      try {
        const { accessToken, refreshToken, user } = await this.service.register(parsed.data)
        const cookie = serializeCookie('refreshToken', refreshToken, this.cookieConfig())
        res.setHeader('Set-Cookie', cookie)
        res.status(201).json({ token: accessToken, user })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to register user')
      }
    })

    router.post('/login', async (req, res) => {
      const parsed = loginSchema.safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid payload', { details: parsed.error.issues })
      }
      try {
        const { accessToken, refreshToken, user } = await this.service.login(parsed.data)
        const cookie = serializeCookie('refreshToken', refreshToken, this.cookieConfig())
        res.setHeader('Set-Cookie', cookie)
        res.json({ token: accessToken, user })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to login')
      }
    })

    router.post('/refresh', async (req, res) => {
      const cookies = parseCookies(req.headers.cookie)
      const token = cookies['refreshToken']
      if (!token) return sendApiError(res, 401, 'Missing refresh token')
      try {
        const { accessToken, user } = await this.service.refresh(token)
        res.json({ token: accessToken, user })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message)
        return sendApiError(res, 500, 'Failed to refresh token')
      }
    })

    router.post('/logout', async (req, res) => {
      const cookies = parseCookies(req.headers.cookie)
      const token = cookies['refreshToken']
      await this.service.logout(token)
      res.setHeader(
        'Set-Cookie',
        serializeCookie('refreshToken', '', { path: '/api/auth/refresh', httpOnly: true, maxAge: 0 })
      )
      res.json({ ok: true })
    })

    router.post('/forgot-password', async (req, res) => {
      const parsed = forgotSchema.safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid payload', { details: parsed.error.issues })
      }
      try {
        const { token, userEmail } = await this.service.forgotPassword(parsed.data.email)
        const appUrl = this.env.APP_URL || 'http://localhost:5173'
        const resetLink = `${appUrl}/reset-password?token=${token}`
        const builder = new MailBuilder()
        await new MailerService(this.env).send({
          to: userEmail,
          subject: 'Reset your Style Engine password',
          text: builder.plainReset(resetLink),
          html: builder.htmlReset(resetLink)
        })
        res.json({ ok: true })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to send reset email')
      }
    })

    router.post('/reset-password', async (req, res) => {
      const parsed = resetSchema.safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid payload', { details: parsed.error.issues })
      }
      try {
        await this.service.resetPassword(parsed.data)
        res.json({ ok: true })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to reset password')
      }
    })

    router.post('/change-password', async (req, res) => {
      const parsed = changePasswordSchema.safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid payload', { details: parsed.error.issues })
      }

      const authHeader = req.headers.authorization
      if (!authHeader) return sendApiError(res, 401, 'Missing authorization header')
      const [, token] = authHeader.split(' ')
      if (!token) return sendApiError(res, 401, 'Invalid authorization header')

      let userId: string | null = null
      try {
        const payload = jwt.verify(token, (req.app.get('envConfig') as Env).JWT_SECRET) as { sub: string }
        userId = payload.sub
      } catch {
        return sendApiError(res, 401, 'Invalid or expired token')
      }

      try {
        await this.service.changePassword({ userId: userId!, ...parsed.data })
        res.json({ ok: true })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to change password')
      }
    })

    router.post('/google', async (req, res) => {
      const parsed = googleAuthSchema.safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid payload', { details: parsed.error.issues })
      }
      try {
        const { accessToken, refreshToken, user } = await this.service.googleAuth(parsed.data.credential)
        const cookie = serializeCookie('refreshToken', refreshToken, this.cookieConfig())
        res.setHeader('Set-Cookie', cookie)
        res.json({ token: accessToken, user })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to authenticate with Google')
      }
    })
  }

  private cookieConfig() {
    const env = this.env ?? ({ NODE_ENV: 'development' } as Env)
    return {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/api/auth/refresh',
      maxAge: 30 * 24 * 60 * 60
    }
  }
}
