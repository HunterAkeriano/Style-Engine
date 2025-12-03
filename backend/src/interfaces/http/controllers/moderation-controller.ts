import { Router } from 'express'
import { createAuthMiddleware, requireAdmin, type AuthRequest } from '../../../middleware/auth'
import type { Env } from '../../../config/env'
import type { HttpController } from '../api-router'
import type { Models } from '../../../models'
import { SavedItemRepository } from '../../../infrastructure/repositories/saved-item-repository'
import { ModerationService } from '../../../application/services/moderation-service'
import { sendApiError } from '../../../utils/apiError'
import type { Category } from '../../../domain/saves/types'

export class ModerationController implements HttpController {
  readonly basePath = '/moderation'

  private readonly auth = createAuthMiddleware(this.env)
  private readonly service: ModerationService

  constructor(private readonly env: Env, models: Models) {
    this.service = new ModerationService(new SavedItemRepository(models, env))
  }

  register(router: Router) {
    router.get('/pending', this.auth, requireAdmin, async (_req, res) => {
      try {
        const items = await this.service.listByStatus('pending')
        res.json({ items })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to fetch pending items')
      }
    })

    router.get('/approved', this.auth, requireAdmin, async (_req, res) => {
      try {
        const items = await this.service.listByStatus('approved')
        res.json({ items })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to fetch approved items')
      }
    })

    router.post('/:category/:id/approve', this.auth, requireAdmin, async (req: AuthRequest, res) => {
      const category = req.params.category as Category
      try {
        const item = await this.service.approve(category, req.params.id)
        res.json({ item })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to approve item')
      }
    })

    router.put('/:category/:id', this.auth, requireAdmin, async (req: AuthRequest, res) => {
      const category = req.params.category as Category
      const { name } = req.body
      if (!name || typeof name !== 'string') {
        return sendApiError(res, 400, 'Name is required')
      }
      try {
        const item = await this.service.rename(category, req.params.id, name)
        res.json({ item })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to update item')
      }
    })

    router.delete('/:category/:id', this.auth, requireAdmin, async (req: AuthRequest, res) => {
      const category = req.params.category as Category
      try {
        await this.service.remove(category, req.params.id)
        res.json({ success: true })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to delete item')
      }
    })
  }
}
