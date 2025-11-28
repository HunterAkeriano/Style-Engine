import { Router } from 'express'
import { z } from 'zod'
import { getModels } from '../config/db'
import type { Env } from '../config/env'
import { createAuthMiddleware, type AuthRequest } from '../middleware/auth'
import { uploadAvatar } from '../middleware/upload'
import { isSuperAdminEmail } from '../config/super-admin'
import fs from 'fs/promises'
import path from 'path'
import type { User } from '../models'

const updateProfileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  avatarUrl: z.string().url().optional()
})

export function createProfileRouter(env: Env) {
  const router = Router()
  const { User } = getModels()
  const auth = createAuthMiddleware(env)
  function attachSuperFlag(user: any) {
    if (!user) return user
    return { ...user, isSuperAdmin: isSuperAdminEmail(env, user.email) }
  }

  function toSafeUser(user: User | null) {
    if (!user) return null
    const plain = user.get({ plain: true }) as any
    delete plain.passwordHash
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
    if (!safeUser) return res.status(404).json({ message: 'User not found' })
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
    if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues })

    const { name, avatarUrl } = parsed.data
    const user = await User.findByPk(req.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

    await user.update({
      name: name ?? user.name,
      avatarUrl: avatarUrl ?? user.avatarUrl,
      updatedAt: new Date()
    })
    res.json({ user: toSafeUser(user) })
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
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const user = await User.findByPk(req.userId)
    if (!user) return res.status(404).json({ message: 'User not found' })

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

    res.json({ user: toSafeUser(user), avatarUrl })
  })

  return router
}
