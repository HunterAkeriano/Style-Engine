import { Router } from 'express'
import { z } from 'zod'
import { createAuthMiddleware, type AuthRequest } from '../../../middleware/auth'
import type { Env } from '../../../config/env'
import type { HttpController } from '../api-router'
import type { Models } from '../../../models'
import { SavedItemRepository } from '../../../infrastructure/repositories/saved-item-repository'
import { SavedItemService } from '../../../application/services/saved-item-service'
import { sendApiError } from '../../../utils/apiError'
import type { Category } from '../../../domain/saves/types'

const saveSchema = z.object({
  name: z.string().min(1).max(120),
  payload: z.record(z.any())
})

export class SavesController implements HttpController {
  readonly basePath = '/saves'

  private readonly authMiddleware
  private readonly service: SavedItemService

  constructor(private readonly env: Env, models: Models) {
    this.authMiddleware = createAuthMiddleware(env)
    this.service = new SavedItemService(new SavedItemRepository(models, env))
  }

  register(router: Router) {
    router.get('/gradients', this.authMiddleware, (req, res) => this.list('gradient', req as AuthRequest, res))
    router.get('/public/gradients', (req, res) => this.listPublic('gradient', req, res))
    router.post('/gradients', this.authMiddleware, (req, res) => this.create('gradient', req as AuthRequest, res))
    router.post('/gradients/:id/publish', this.authMiddleware, (req, res) => this.publish('gradient', req as AuthRequest, res))
    router.delete('/gradients/:id', this.authMiddleware, (req, res) => this.remove('gradient', req as AuthRequest, res))

    router.get('/shadows', this.authMiddleware, (req, res) => this.list('shadow', req as AuthRequest, res))
    router.get('/public/shadows', (req, res) => this.listPublic('shadow', req, res))
    router.post('/shadows', this.authMiddleware, (req, res) => this.create('shadow', req as AuthRequest, res))
    router.post('/shadows/:id/publish', this.authMiddleware, (req, res) => this.publish('shadow', req as AuthRequest, res))
    router.delete('/shadows/:id', this.authMiddleware, (req, res) => this.remove('shadow', req as AuthRequest, res))

    router.get('/animations', this.authMiddleware, (req, res) => this.list('animation', req as AuthRequest, res))
    router.get('/public/animations', (req, res) => this.listPublic('animation', req, res))
    router.post('/animations', this.authMiddleware, (req, res) => this.create('animation', req as AuthRequest, res))
    router.post('/animations/:id/publish', this.authMiddleware, (req, res) => this.publish('animation', req as AuthRequest, res))
    router.delete('/animations/:id', this.authMiddleware, (req, res) => this.remove('animation', req as AuthRequest, res))

    router.get('/clip-paths', this.authMiddleware, (req, res) => this.list('clip-path', req as AuthRequest, res))
    router.get('/public/clip-paths', (req, res) => this.listPublic('clip-path', req, res))
    router.post('/clip-paths', this.authMiddleware, (req, res) => this.create('clip-path', req as AuthRequest, res))
    router.post('/clip-paths/:id/publish', this.authMiddleware, (req, res) => this.publish('clip-path', req as AuthRequest, res))
    router.delete('/clip-paths/:id', this.authMiddleware, (req, res) => this.remove('clip-path', req as AuthRequest, res))

    router.get('/favicons', this.authMiddleware, (req, res) => this.list('favicon', req as AuthRequest, res))
    router.get('/public/favicons', (req, res) => this.listPublic('favicon', req, res))
    router.post('/favicons', this.authMiddleware, (req, res) => this.create('favicon', req as AuthRequest, res))
    router.post('/favicons/:id/publish', this.authMiddleware, (req, res) => this.publish('favicon', req as AuthRequest, res))
    router.delete('/favicons/:id', this.authMiddleware, (req, res) => this.remove('favicon', req as AuthRequest, res))
  }

  private async list(category: Category, req: AuthRequest, res: any) {
    try {
      const items = await this.service.list(category, req.userId!)
      res.json({ items })
    } catch (err: any) {
      if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
      return sendApiError(res, 500, 'Failed to load items')
    }
  }

  private async listPublic(category: Category, _req: any, res: any) {
    try {
      const items = await this.service.listPublic(category)
      res.json({ items })
    } catch (err: any) {
      if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
      return sendApiError(res, 500, 'Failed to load items')
    }
  }

  private async create(category: Category, req: AuthRequest, res: any) {
    const parsed = saveSchema.safeParse(req.body)
    if (!parsed.success) {
      return sendApiError(res, 400, 'Invalid payload', { details: parsed.error.issues })
    }
    try {
      const item = await this.service.create(category, req, {
        name: parsed.data.name,
        data: parsed.data.payload
      })
      res.status(201).json({ item })
    } catch (err: any) {
      if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
      return sendApiError(res, 500, 'Failed to save item')
    }
  }

  private async publish(category: Category, req: AuthRequest, res: any) {
    try {
      const item = await this.service.requestPublish(category, req, req.params.id)
      res.json({ item })
    } catch (err: any) {
      if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
      return sendApiError(res, 500, 'Failed to publish item')
    }
  }

  private async remove(category: Category, req: AuthRequest, res: any) {
    try {
      await this.service.remove(category, req, req.params.id)
      res.status(204).send()
    } catch (err: any) {
      if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
      return sendApiError(res, 500, 'Failed to delete item')
    }
  }
}
