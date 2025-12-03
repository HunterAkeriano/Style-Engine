import { Router } from 'express'
import { z } from 'zod'
import { getModels } from '../config/db'
import type { Env } from '../config/env'
import { createAuthMiddleware, type AuthRequest } from '../middleware/auth'
import { uploadAvatar } from '../middleware/upload'
import { isSuperAdminEmail } from '../config/super-admin'
import fs from 'fs/promises'
import path from 'path'
import { sendApiError } from '../utils/apiError'
import type { User } from '../models'
import type { InferAttributes } from 'sequelize'

const updateProfileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  avatarUrl: z.string().url().optional()
})

export function createProfileRouter(env: Env) {
  const router = Router()
  const { User } = getModels()
  const auth = createAuthMiddleware(env)

  type UserAttributes = InferAttributes<User>
  type SafeUser = ReturnType<typeof attachSuperFlag>

  const profileCache = new Map<string, { user: SafeUser; expiresAt: number }>()
  const PROFILE_TTL_MS = 60_000

  function getCachedProfile(userId: string) {
    const cached = profileCache.get(userId)
    if (!cached) return null
    if (cached.expiresAt < Date.now()) {
      profileCache.delete(userId)
      return null
    }
    return cached.user
  }

  function setCachedProfile(userId: string, user: SafeUser) {
    profileCache.set(userId, { user, expiresAt: Date.now() + PROFILE_TTL_MS })
  }

  function attachSuperFlag(user: Omit<UserAttributes, 'passwordHash'>) {
    return { ...user, isSuperAdmin: isSuperAdminEmail(env, user.email) }
  }

  function toSafeUser(user: User | null) {
    if (!user) return null
    const { passwordHash: _passwordHash, ...plain } = user.get({ plain: true }) as UserAttributes
    void _passwordHash
    return attachSuperFlag(plain)
  }

  /**
   * @swagger
   * /api/profile:
   *   get:
   *     summary: Получить профиль текущего пользователя
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Профиль найден
   *       404:
   *         description: Пользователь не найден
   */
  router.get('/', auth, async (req: AuthRequest, res) => {
    if (req.userId) {
      const cached = getCachedProfile(req.userId)
      if (cached) {
        return res.json({ user: cached })
      }
    }

    const user = await User.findByPk(req.userId, {
      attributes: [
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
      ]
    })
    const safeUser = toSafeUser(user)
    if (!safeUser) return sendApiError(res, 404, 'User not found')
    if (req.userId) setCachedProfile(req.userId, safeUser)
    res.json({ user: safeUser })
  })

  /**
   * @swagger
   * /api/profile:
   *   put:
   *     summary: Обновить профиль пользователя
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               avatarUrl:
   *                 type: string
   *                 format: uri
   *     responses:
   *       200:
   *         description: Профиль обновлен
   *       400:
   *         description: Невалидные данные
   */
  router.put('/', auth, async (req: AuthRequest, res) => {
    const parsed = updateProfileSchema.safeParse(req.body)
    if (!parsed.success) {
      return sendApiError(res, 400, 'Invalid payload', { details: parsed.error.issues })
    }

    const { name, avatarUrl } = parsed.data
    const user = await User.findByPk(req.userId)
    if (!user) return sendApiError(res, 404, 'User not found')

    await user.update({
      name: name ?? user.name,
      avatarUrl: avatarUrl ?? user.avatarUrl,
      updatedAt: new Date()
    })
    const safe = toSafeUser(user)
    if (req.userId && safe) setCachedProfile(req.userId, safe)
    res.json({ user: safe })
  })

  /**
   * @swagger
   * /api/profile/avatar:
   *   post:
   *     summary: Загрузить аватар пользователя
   *     tags: [Profile]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             properties:
   *               avatar:
   *                 type: string
   *                 format: binary
   *     responses:
   *       200:
   *         description: Аватар обновлен
   *       400:
   *         description: Файл не загружен или невалиден
   */
  router.post('/avatar', auth, uploadAvatar.single('avatar'), async (req: AuthRequest, res) => {
    if (!req.file) {
      return sendApiError(res, 400, 'No file uploaded')
    }

    const user = await User.findByPk(req.userId)
    if (!user) return sendApiError(res, 404, 'User not found')

    const oldAvatarUrl = user.avatarUrl || undefined
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`

    await user.update({ avatarUrl, updatedAt: new Date() })

    if (oldAvatarUrl) {
      const fileName = oldAvatarUrl.split('/uploads/avatars/')[1]
      if (fileName) {
        const filePath = path.join(__dirname, '../../uploads/avatars', path.basename(fileName))
        fs.unlink(filePath).catch(() => {
          
        })
      }
    }

    const safe = toSafeUser(user)
    if (req.userId && safe) setCachedProfile(req.userId, safe)
    res.json({ user: safe, avatarUrl })
  })

  return router
}
