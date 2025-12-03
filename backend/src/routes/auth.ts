import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { z } from 'zod'
import { Op, type InferAttributes } from 'sequelize'
import { getModels } from '../config/db'
import type { Env } from '../config/env'
import type { PasswordReset, User } from '../models'
import { isSuperAdminEmail } from '../config/super-admin'
import { sendMail } from '../services/mailer'
import { parseCookies, serializeCookie } from '../utils/cookies'
import { generateRefreshToken, hashToken, signAccessToken } from '../utils/tokens'
import { sendApiError } from '../utils/apiError'

const strongPassword = z
  .string()
  .min(8)
  .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/u, 'Weak password')

const credentialsSchema = z.object({
  email: z.string().email(),
  password: strongPassword,
  name: z.string().min(1).max(120).optional()
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

type UserAttributes = InferAttributes<User>
type SafeUser = Omit<UserAttributes, 'passwordHash'> & { isSuperAdmin: boolean }

export function createAuthRouter(env: Env) {
  const router = Router()
  const { User, RefreshToken, PasswordReset } = getModels()

  PasswordReset.sync().catch((err) => console.error('Failed to ensure password_resets table', err))

  function attachSuperFlag(user: Omit<UserAttributes, 'passwordHash'>): SafeUser {
    if (!user) return user
    return { ...user, isSuperAdmin: isSuperAdminEmail(env, user.email) }
  }

  function toSafeUser(user: User | null): SafeUser | null {
    if (!user) return null
    const { passwordHash: _ignoredPassword, ...rest } = user.get({ plain: true }) as UserAttributes
    void _ignoredPassword
    return attachSuperFlag(rest)
  }

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Регистрация нового пользователя
   *     description: Создает новый аккаунт пользователя и возвращает access токен. Refresh токен устанавливается в httpOnly cookie.
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Email пользователя
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 minLength: 8
   *                 description: Пароль (минимум 8 символов)
   *                 example: password123
   *               name:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 120
   *                 description: Имя пользователя (опционально)
   *                 example: John Doe
   *     responses:
   *       201:
   *         description: Пользователь успешно зарегистрирован
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   description: JWT токен для авторизации
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Неверный формат данных
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: Пользователь с таким email уже существует
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/register', async (req, res) => {
    const parsed = credentialsSchema.safeParse(req.body)
    if (!parsed.success) {
      return sendApiError(res, 400, 'Invalid payload', { details: parsed.error.issues })
    }
    const { email, password, name } = parsed.data
    const existing = await User.findOne({ where: { email: email.toLowerCase() } })
    if (existing) return sendApiError(res, 409, 'User already exists')

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      name: name ?? null
    })
    const safeUser = toSafeUser(user)!
    const accessToken = signAccessToken(env, user.id)
    const refreshToken = generateRefreshToken()
    const refreshHash = hashToken(refreshToken)
    const refreshExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await RefreshToken.create({
      userId: user.id,
      tokenHash: refreshHash,
      expiresAt: refreshExpires,
      revoked: false
    })

    const cookie = serializeCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 30 * 24 * 60 * 60
    })
    res.setHeader('Set-Cookie', cookie)

    res.status(201).json({ token: accessToken, user: safeUser })
  })

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Авторизация пользователя
   *     description: Авторизует пользователя по email и паролю. Возвращает access токен, refresh устанавливается в httpOnly cookie.
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Email пользователя
   *                 example: user@example.com
   *               password:
   *                 type: string
   *                 description: Пароль пользователя
   *                 example: password123
   *     responses:
   *       200:
   *         description: Успешная авторизация
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   description: JWT токен для авторизации
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Неверный формат данных
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Неверные учетные данные
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/login', async (req, res) => {
    const parsed = credentialsSchema.omit({ name: true }).safeParse(req.body)
    if (!parsed.success) {
      return sendApiError(res, 400, 'Invalid payload', { details: parsed.error.issues })
    }
    const { email, password } = parsed.data
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      attributes: [
        'id',
        'email',
        'passwordHash',
        'name',
        'avatarUrl',
        'createdAt',
        'isPayment',
        'isAdmin',
        'subscriptionTier',
        'subscriptionExpiresAt'
      ]
    })
    if (!user) return sendApiError(res, 401, 'Invalid credentials')

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return sendApiError(res, 401, 'Invalid credentials')

    const accessToken = signAccessToken(env, user.id)
    const refreshToken = generateRefreshToken()
    const refreshHash = hashToken(refreshToken)
    const refreshExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await RefreshToken.create({
      userId: user.id,
      tokenHash: refreshHash,
      expiresAt: refreshExpires,
      revoked: false
    })

    const cookie = serializeCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 30 * 24 * 60 * 60
    })
    res.setHeader('Set-Cookie', cookie)

    res.json({ token: accessToken, user: toSafeUser(user) })
  })

  /**
   * @swagger
   * /api/auth/refresh:
   *   post:
   *     summary: Обновить access токен
   *     description: Читает refresh токен из httpOnly cookie и возвращает новый access токен
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Новый access токен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 token:
   *                   type: string
   *                   description: Новый access токен
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Refresh токен отсутствует или недействителен
   */
  router.post('/refresh', async (req, res) => {
    const cookies = parseCookies(req.headers.cookie)
    const token = cookies['refreshToken']
    if (!token) return sendApiError(res, 401, 'Missing refresh token')

    const tokenHash = hashToken(token)
    const record = await RefreshToken.findOne({
      where: {
        tokenHash,
        revoked: false,
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [
        {
          model: User,
          as: 'user',
          required: true,
          attributes: [
            'id',
            'email',
            'name',
            'avatarUrl',
            'subscriptionTier',
            'subscriptionExpiresAt',
            'isPayment',
            'isAdmin',
            'createdAt'
          ]
        }
      ]
    })
    if (!record || !record.user) return sendApiError(res, 401, 'Invalid refresh token')

    const accessToken = signAccessToken(env, record.user.id)
    res.json({ token: accessToken, user: toSafeUser(record.user) })
  })

  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: Выход из аккаунта
   *     description: Ревокает refresh токен и очищает cookie
   *     tags: [Auth]
   *     responses:
   *       200:
   *         description: Успешно
   */
  router.post('/logout', async (req, res) => {
    const cookies = parseCookies(req.headers.cookie)
    const token = cookies['refreshToken']
    if (token) {
      const tokenHash = hashToken(token)
      await RefreshToken.update({ revoked: true }, { where: { tokenHash } })
    }
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
    const { email } = parsed.data
    const user = await User.findOne({
      where: { email: email.toLowerCase() },
      attributes: ['id', 'email']
    })
    if (!user) {
      return sendApiError(res, 404, 'Email not found')
    }

    const token = crypto.randomBytes(24).toString('hex')
    const tokenHash = hashResetToken(token)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await PasswordReset.create({
      userId: user.id,
      tokenHash,
      expiresAt,
      used: false
    })

    const appUrl = env.APP_URL || 'http://localhost:5173'
    const resetLink = `${appUrl}/reset-password?token=${token}`
    const text = `We received a request to reset your password.\n\nReset link: ${resetLink}\nIf you did not request this, ignore the email.`
    const html = buildResetEmail(resetLink)
    await sendMail(env, {
      to: user.email,
      subject: 'Reset your Style Engine password',
      text,
      html
    })

    res.json({ ok: true })
  })

  router.post('/reset-password', async (req, res) => {
    const parsed = resetSchema.safeParse(req.body)
    if (!parsed.success) {
      return sendApiError(res, 400, 'Invalid payload', { details: parsed.error.issues })
    }
    const { token, password } = parsed.data

    const tokenHash = hashResetToken(token)
    const reset = await PasswordReset.findOne({
      where: {
        tokenHash,
        used: false,
        expiresAt: { [Op.gt]: new Date() }
      },
      include: [{ model: User, as: 'user', attributes: ['id', 'email'] }]
    })
    if (!reset || !reset.user) {
      return sendApiError(res, 400, 'Invalid or expired token')
    }

    const newHash = await bcrypt.hash(password, 10)
    await reset.user.update({ passwordHash: newHash, updatedAt: new Date() })
    await reset.update({ used: true })

    res.json({ ok: true })
  })

  router.post('/change-password', async (req, res) => {
    const parsed = changePasswordSchema.safeParse(req.body)
    if (!parsed.success) {
      return sendApiError(res, 400, 'Invalid payload', { details: parsed.error.issues })
    }
    const { currentPassword, newPassword } = parsed.data

    const authHeader = req.headers.authorization
    if (!authHeader) return sendApiError(res, 401, 'Missing authorization header')
    const [, token] = authHeader.split(' ')
    if (!token) return sendApiError(res, 401, 'Invalid authorization header')

    let userId: string | null = null
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string }
      userId = payload.sub
    } catch {
      return sendApiError(res, 401, 'Invalid or expired token')
    }

    const user = await User.findByPk(userId, { attributes: ['id', 'passwordHash'] })
    if (!user) return sendApiError(res, 401, 'User not found')

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) return sendApiError(res, 400, 'Invalid current password')

    const newHash = await bcrypt.hash(newPassword, 10)
    await user.update({ passwordHash: newHash, updatedAt: new Date() })

    res.json({ ok: true })
  })

  return router
}

function hashResetToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

function buildResetEmail(resetLink: string) {
  return `
  <div style="font-family: 'Inter', Arial, sans-serif; background: #0b1220; color: #e2e8f0; padding: 32px;">
    <div style="max-width: 520px; margin: 0 auto; background: linear-gradient(135deg, rgba(99,102,241,0.16), rgba(236,72,153,0.16)); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.35);">
      <div style="padding: 24px 28px; background: radial-gradient(circle at 20% 20%, rgba(99,102,241,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(236,72,153,0.2), transparent 45%), rgba(15,23,42,0.92);">
        <p style="margin: 0; text-transform: uppercase; letter-spacing: 0.08em; color: #a5b4fc; font-size: 12px;">Style Engine</p>
        <h1 style="margin: 8px 0 6px; color: #f8fafc; font-size: 22px;">Reset your password</h1>
        <p style="margin: 0; color: #cbd5e1; line-height: 1.6;">We received a request to reset your password. Click the button below to choose a new one.</p>
      </div>
      <div style="padding: 24px 28px; background: rgba(15,23,42,0.92); backdrop-filter: blur(8px);">
        <div style="text-align: center; margin: 12px 0 18px;">
          <a href="${resetLink}" style="display: inline-block; padding: 12px 20px; border-radius: 999px; background: linear-gradient(135deg, #6366f1, #ec4899); color: #fff; text-decoration: none; font-weight: 700; box-shadow: 0 10px 30px rgba(99,102,241,0.35);">Reset password</a>
        </div>
        <p style="margin: 0; color: #94a3b8; font-size: 14px; line-height: 1.6;">If the button doesn't work, copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #e2e8f0; font-size: 13px; margin-top: 6px;">${resetLink}</p>
        <p style="margin-top: 14px; color: #64748b; font-size: 12px;">If you didn't request this, you can ignore the email — your password stays the same.</p>
      </div>
    </div>
  </div>
  `
}
