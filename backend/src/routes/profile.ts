import { Router } from 'express'
import { z } from 'zod'
import { getDb } from '../config/db'
import type { Env } from '../config/env'
import { createAuthMiddleware, type AuthRequest } from '../middleware/auth'
import { uploadAvatar } from '../middleware/upload'
import { isSuperAdminEmail } from '../config/super-admin'

const updateProfileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  avatarUrl: z.string().url().optional()
})

export function createProfileRouter(env: Env) {
  const router = Router()
  const db = getDb()
  const auth = createAuthMiddleware(env)
  function attachSuperFlag(user: any) {
    if (!user) return user
    return { ...user, isSuperAdmin: isSuperAdminEmail(env, user.email) }
  }

  /**
   * @swagger
   * /api/profile:
   *   get:
   *     summary: Получить профиль текущего пользователя
   *     description: Возвращает данные профиля авторизованного пользователя
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Профиль успешно получен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       401:
   *         description: Не авторизован или токен недействителен
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Пользователь не найден
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.get('/', auth, async (req: AuthRequest, res) => {
    const result = await db.query(
      `SELECT id, email, name, avatar_url as "avatarUrl", created_at as "createdAt", updated_at as "updatedAt",
              is_payment as "isPayment", subscription_tier as "subscriptionTier", is_admin as "isAdmin"
       FROM users WHERE id = $1`,
      [req.userId]
    )
    const user = attachSuperFlag(result.rows[0])
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  })

  /**
   * @swagger
   * /api/profile:
   *   put:
   *     summary: Обновить профиль пользователя
   *     description: Обновляет имя и/или URL аватара пользователя
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 minLength: 1
   *                 maxLength: 120
   *                 description: Новое имя пользователя
   *                 example: Jane Smith
   *               avatarUrl:
   *                 type: string
   *                 format: uri
   *                 description: URL нового аватара
   *                 example: https://example.com/avatar.jpg
   *     responses:
   *       200:
   *         description: Профиль успешно обновлен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Неверный формат данных
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Не авторизован или токен недействителен
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.put('/', auth, async (req: AuthRequest, res) => {
    const parsed = updateProfileSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues })

    const { name, avatarUrl } = parsed.data
    const result = await db.query(
      `UPDATE users SET name = COALESCE($2, name), avatar_url = COALESCE($3, avatar_url), updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, name, avatar_url as "avatarUrl", created_at as "createdAt", updated_at as "updatedAt",
                 is_payment as "isPayment", subscription_tier as "subscriptionTier", is_admin as "isAdmin"`,
      [req.userId, name ?? null, avatarUrl ?? null]
    )
    const user = attachSuperFlag(result.rows[0])
    res.json({ user })
  })

  /**
   * @swagger
   * /api/profile/avatar:
   *   post:
   *     summary: Загрузить аватар пользователя
   *     description: Загружает изображение аватара и обновляет профиль пользователя
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - avatar
   *             properties:
   *               avatar:
   *                 type: string
   *                 format: binary
   *                 description: Файл изображения (JPEG, PNG, GIF, макс. 2MB)
   *     responses:
   *       200:
   *         description: Аватар успешно загружен
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 user:
   *                   $ref: '#/components/schemas/User'
   *                 avatarUrl:
   *                   type: string
   *                   description: URL загруженного аватара
   *                   example: http://localhost:4000/uploads/avatars/avatar-1234567890-123456789.jpg
   *       400:
   *         description: Неверный файл или размер превышает лимит
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Не авторизован
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  router.post('/avatar', auth, uploadAvatar.single('avatar'), async (req: AuthRequest, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`

    const result = await db.query(
      `UPDATE users SET avatar_url = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, name, avatar_url as "avatarUrl", created_at as "createdAt", updated_at as "updatedAt",
                 is_payment as "isPayment", subscription_tier as "subscriptionTier", is_admin as "isAdmin"`,
      [req.userId, avatarUrl]
    )

    const user = attachSuperFlag(result.rows[0])
    res.json({ user, avatarUrl })
  })

  return router
}
