import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { z } from 'zod'
import { getDb } from '../config/db'
import type { Env } from '../config/env'
import { isSuperAdminEmail } from '../config/super-admin'
import { sendMail } from '../services/mailer'
import { parseCookies, serializeCookie } from '../utils/cookies'
import { generateRefreshToken, hashToken, signAccessToken } from '../utils/tokens'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(120).optional()
})

const forgotSchema = z.object({
  email: z.string().email()
})

const resetSchema = z.object({
  token: z.string().min(10),
  password: z.string().min(8)
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8)
})

export function createAuthRouter(env: Env) {
  const router = Router()
  const db = getDb()

  // Ensure password reset table exists (in case migrations were not run)
  db.query(`CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  )`).catch((err) => console.error('Failed to ensure password_resets table', err))

  function attachSuperFlag(user: any) {
    if (!user) return user
    return { ...user, isSuperAdmin: isSuperAdminEmail(env, user.email) }
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
    if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues })
    const { email, password, name } = parsed.data
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()])
    if (existing.rowCount) return res.status(409).json({ message: 'User already exists' })

    const passwordHash = await bcrypt.hash(password, 10)
    const insert = await db.query(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, avatar_url as "avatarUrl", created_at as "createdAt",
                 is_payment as "isPayment", is_admin as "isAdmin",
                 subscription_tier as "subscriptionTier", subscription_expires_at as "subscriptionExpiresAt"`,
      [email.toLowerCase(), passwordHash, name ?? null]
    )
    const user = attachSuperFlag(insert.rows[0])
    const accessToken = signAccessToken(env, user.id)
    const refreshToken = generateRefreshToken()
    const refreshHash = hashToken(refreshToken)
    const refreshExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, revoked)
       VALUES ($1, $2, $3, FALSE)`,
      [user.id, refreshHash, refreshExpires.toISOString()]
    )

    const cookie = serializeCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 30 * 24 * 60 * 60
    })
    res.setHeader('Set-Cookie', cookie)

    res.status(201).json({ token: accessToken, user })
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
    if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues })
    const { email, password } = parsed.data
    const result = await db.query(
      `SELECT id, email, password_hash as "passwordHash", name, avatar_url as "avatarUrl",
              created_at as "createdAt", is_payment as "isPayment", is_admin as "isAdmin",
              subscription_tier as "subscriptionTier", subscription_expires_at as "subscriptionExpiresAt"
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    )
    const user = attachSuperFlag(result.rows[0])
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const accessToken = signAccessToken(env, user.id)
    const refreshToken = generateRefreshToken()
    const refreshHash = hashToken(refreshToken)
    const refreshExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

    await db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, revoked)
       VALUES ($1, $2, $3, FALSE)`,
      [user.id, refreshHash, refreshExpires.toISOString()]
    )

    const cookie = serializeCookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/api/auth/refresh',
      maxAge: 30 * 24 * 60 * 60
    })
    res.setHeader('Set-Cookie', cookie)

    const { passwordHash: _unusedPasswordHash, ...safeUser } = user
    void _unusedPasswordHash
    res.json({ token: accessToken, user: safeUser })
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
    if (!token) return res.status(401).json({ message: 'Missing refresh token' })

    const tokenHash = hashToken(token)
    const result = await db.query(
      `SELECT rt.id, rt.user_id as "userId", u.email, u.name, u.avatar_url as "avatarUrl",
              u.subscription_tier as "subscriptionTier", u.subscription_expires_at as "subscriptionExpiresAt",
              u.is_payment as "isPayment", u.is_admin as "isAdmin", u.created_at as "createdAt"
       FROM refresh_tokens rt
       JOIN users u ON u.id = rt.user_id
       WHERE rt.token_hash = $1 AND rt.revoked = FALSE AND rt.expires_at > NOW()
       LIMIT 1`,
      [tokenHash]
    )
    const record = result.rows[0]
    if (!record) return res.status(401).json({ message: 'Invalid refresh token' })

    const accessToken = signAccessToken(env, record.userId)
    const { userId, ...rest } = record
    const safeUser = attachSuperFlag({ id: userId, ...rest })
    res.json({ token: accessToken, user: safeUser })
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
      await db.query('UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1', [tokenHash])
    }
    res.setHeader(
      'Set-Cookie',
      serializeCookie('refreshToken', '', { path: '/api/auth/refresh', httpOnly: true, maxAge: 0 })
    )
    res.json({ ok: true })
  })

  router.post('/refresh', async (req, res) => {
    const cookies = parseCookies(req.headers.cookie)
    const token = cookies['refreshToken']
    if (!token) return res.status(401).json({ message: 'Missing refresh token' })

    const tokenHash = hashToken(token)
    const result = await db.query(
      `SELECT rt.id, rt.user_id as "userId", u.email, u.name, u.avatar_url as "avatarUrl",
              u.subscription_tier as "subscriptionTier", u.subscription_expires_at as "subscriptionExpiresAt",
              u.is_payment as "isPayment", u.is_admin as "isAdmin", u.created_at as "createdAt"
       FROM refresh_tokens rt
       JOIN users u ON u.id = rt.user_id
       WHERE rt.token_hash = $1 AND rt.revoked = FALSE AND rt.expires_at > NOW()
       LIMIT 1`,
      [tokenHash]
    )
    const record = result.rows[0]
    if (!record) return res.status(401).json({ message: 'Invalid refresh token' })

    const accessToken = signAccessToken(env, record.userId)
    const { userId, ...rest } = record
    const safeUser = attachSuperFlag({ id: userId, ...rest })
    res.json({ token: accessToken, user: safeUser })
  })

  router.post('/logout', async (req, res) => {
    const cookies = parseCookies(req.headers.cookie)
    const token = cookies['refreshToken']
    if (token) {
      const tokenHash = hashToken(token)
      await db.query('UPDATE refresh_tokens SET revoked = TRUE WHERE token_hash = $1', [tokenHash])
    }
    res.setHeader(
      'Set-Cookie',
      serializeCookie('refreshToken', '', { path: '/api/auth/refresh', httpOnly: true, maxAge: 0 })
    )
    res.json({ ok: true })
  })

  router.post('/forgot-password', async (req, res) => {
    const parsed = forgotSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues })
    const { email } = parsed.data
    const userResult = await db.query('SELECT id, email FROM users WHERE email = $1', [email.toLowerCase()])
    const user = userResult.rows[0]
    if (!user) {
      return res.status(404).json({ message: 'Email not found' })
    }

    const token = crypto.randomBytes(24).toString('hex')
    const tokenHash = await bcrypt.hash(token, 10)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await db.query(
      `INSERT INTO password_resets (user_id, token_hash, expires_at, used)
       VALUES ($1, $2, $3, FALSE)`,
      [user.id, tokenHash, expiresAt.toISOString()]
    )

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
    if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues })
    const { token, password } = parsed.data

    const resetResult = await db.query(
      `SELECT pr.id, pr.user_id as "userId", pr.token_hash as "tokenHash", pr.expires_at as "expiresAt", pr.used,
              u.email
       FROM password_resets pr
       JOIN users u ON u.id = pr.user_id
       WHERE pr.used = FALSE AND pr.expires_at > NOW()
       ORDER BY pr.created_at DESC`
    )

    let matched: any = null
    for (const row of resetResult.rows) {
      if (await bcrypt.compare(token, row.tokenHash)) {
        matched = row
        break
      }
    }

    if (!matched) {
      return res.status(400).json({ message: 'Invalid or expired token' })
    }

    const newHash = await bcrypt.hash(password, 10)
    await db.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
      newHash,
      matched.userId
    ])
    await db.query('UPDATE password_resets SET used = TRUE WHERE id = $1', [matched.id])

    res.json({ ok: true })
  })

  router.post('/change-password', async (req, res) => {
    const parsed = changePasswordSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues })
    const { currentPassword, newPassword } = parsed.data

    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ message: 'Missing authorization header' })
    const [, token] = authHeader.split(' ')
    if (!token) return res.status(401).json({ message: 'Invalid authorization header' })

    let userId: string | null = null
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string }
      userId = payload.sub
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    const result = await db.query(
      'SELECT id, password_hash as "passwordHash" FROM users WHERE id = $1',
      [userId]
    )
    const user = result.rows[0]
    if (!user) return res.status(401).json({ message: 'User not found' })

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) return res.status(400).json({ message: 'Invalid current password' })

    const newHash = await bcrypt.hash(newPassword, 10)
    await db.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, userId])

    res.json({ ok: true })
  })

  return router
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
