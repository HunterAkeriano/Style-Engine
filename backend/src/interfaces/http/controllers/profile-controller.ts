import { Router } from 'express'
import { z } from 'zod'
import { createAuthMiddleware, type AuthRequest } from '../../../middleware/auth'
import type { Env } from '../../../config/env'
import type { HttpController } from '../api-router'
import { ProfileService } from '../../../application/services/profile-service'
import { UserRepository } from '../../../infrastructure/repositories/user-repository'
import type { Models } from '../../../models'
import { uploadAvatar } from '../../../middleware/upload'
import { sendApiError } from '../../../utils/apiError'

const updateProfileSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  avatarUrl: z.string().url().optional()
})

export class ProfileController implements HttpController {
  readonly basePath = '/profile'

  private readonly auth = createAuthMiddleware(this.env)
  private readonly service: ProfileService

  constructor(private readonly env: Env, models: Models) {
    this.service = new ProfileService(env, new UserRepository(models))
  }

  register(router: Router) {
    router.get('/', this.auth, async (req: AuthRequest, res) => {
      try {
        const user = await this.service.getProfile(req.userId!)
        res.json({ user })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to load profile')
      }
    })

    router.put('/', this.auth, async (req: AuthRequest, res) => {
      const parsed = updateProfileSchema.safeParse(req.body)
      if (!parsed.success) {
        return sendApiError(res, 400, 'Invalid payload', { details: parsed.error.issues })
      }
      try {
        const user = await this.service.updateProfile(req.userId!, parsed.data)
        res.json({ user })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to update profile')
      }
    })

    router.post('/avatar', this.auth, uploadAvatar.single('avatar'), async (req: AuthRequest, res) => {
      if (!req.file) {
        return sendApiError(res, 400, 'No file uploaded')
      }
      try {
        const result = await this.service.updateAvatar(req.userId!, req.file.filename, req.get('host')!, req.protocol)
        res.json(result)
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to update avatar')
      }
    })
  }
}
