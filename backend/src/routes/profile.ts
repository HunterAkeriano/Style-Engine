import { Router } from 'express'
import { z } from 'zod'
import { getDb } from '../config/db'
import type { Env } from '../config/env'
import { createAuthMiddleware, type AuthRequest } from '../middleware/auth'
import { uploadAvatar } from '../middleware/upload'
import { isSuperAdminEmail } from '../config/super-admin'
import fs from 'fs/promises'
import path from 'path'

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

  
  router.get('/', auth, async (req: AuthRequest, res) => {
    const result = await db.query(
      `SELECT id, email, name, avatar_url as "avatarUrl", created_at as "createdAt", updated_at as "updatedAt",
              is_payment as "isPayment", subscription_tier as "subscriptionTier", is_admin as "isAdmin",
              subscription_expires_at as "subscriptionExpiresAt"
       FROM users WHERE id = $1`,
      [req.userId]
    )
    const user = attachSuperFlag(result.rows[0])
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  })

  
  router.put('/', auth, async (req: AuthRequest, res) => {
    const parsed = updateProfileSchema.safeParse(req.body)
    if (!parsed.success) return res.status(400).json({ message: 'Invalid payload', issues: parsed.error.issues })

    const { name, avatarUrl } = parsed.data
    const result = await db.query(
      `UPDATE users SET name = COALESCE($2, name), avatar_url = COALESCE($3, avatar_url), updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, name, avatar_url as "avatarUrl", created_at as "createdAt", updated_at as "updatedAt",
                 is_payment as "isPayment", subscription_tier as "subscriptionTier", is_admin as "isAdmin",
                 subscription_expires_at as "subscriptionExpiresAt"`,
      [req.userId, name ?? null, avatarUrl ?? null]
    )
    const user = attachSuperFlag(result.rows[0])
    res.json({ user })
  })

  
  router.post('/avatar', auth, uploadAvatar.single('avatar'), async (req: AuthRequest, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const currentAvatar = await db.query('SELECT avatar_url as "avatarUrl" FROM users WHERE id = $1', [req.userId])
    const oldAvatarUrl = currentAvatar.rows[0]?.avatarUrl as string | undefined
    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/avatars/${req.file.filename}`

    const result = await db.query(
      `UPDATE users SET avatar_url = $2, updated_at = NOW()
       WHERE id = $1
       RETURNING id, email, name, avatar_url as "avatarUrl", created_at as "createdAt", updated_at as "updatedAt",
                 is_payment as "isPayment", subscription_tier as "subscriptionTier", is_admin as "isAdmin"`,
      [req.userId, avatarUrl]
    )

    if (oldAvatarUrl) {
      const fileName = oldAvatarUrl.split('/uploads/avatars/')[1]
      if (fileName) {
        const filePath = path.join(__dirname, '../../uploads/avatars', path.basename(fileName))
        fs.unlink(filePath).catch(() => {
          
        })
      }
    }

    const user = attachSuperFlag(result.rows[0])
    res.json({ user, avatarUrl })
  })

  return router
}
