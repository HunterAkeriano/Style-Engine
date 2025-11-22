import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { getDb } from '../config/db'
import type { Env } from '../config/env'
import { isSuperAdminEmail } from '../config/super-admin'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(120).optional()
})

export function createAuthRouter(env: Env) {
  const router = Router()
  const db = getDb()
  function attachSuperFlag(user: any) {
    if (!user) return user
    return { ...user, isSuperAdmin: isSuperAdminEmail(env, user.email) }
  }

  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Регистрация нового пользователя
   *     description: Создает новый аккаунт пользователя и возвращает JWT токен для авторизации
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
       VALUES ($1, $2, $3) RETURNING id, email, name, avatar_url, created_at, is_payment as "isPayment", is_admin as "isAdmin"`,
      [email.toLowerCase(), passwordHash, name ?? null]
    )
    const user = attachSuperFlag(insert.rows[0])
    const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: '7d' })
    res.status(201).json({ token, user })
  })

  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Авторизация пользователя
   *     description: Авторизует пользователя по email и паролю, возвращает JWT токен
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
              created_at as "createdAt", is_payment as "isPayment", is_admin as "isAdmin"
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    )
    const user = attachSuperFlag(result.rows[0])
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ sub: user.id }, env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token, user })
  })

  return router
}
