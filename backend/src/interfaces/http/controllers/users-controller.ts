import { Router, type Request, type Response } from 'express'
import { createAuthMiddleware, requireAdmin, type AuthRequest } from '../../../middleware/auth'
import type { Env } from '../../../config/env'
import type { HttpController } from '../api-router'
import type { Models } from '../../../models'
import { UserRepository } from '../../../infrastructure/repositories/user-repository'
import { UserService, type UsersQueryOptions } from '../../../application/services/user-service'
import { sendApiError } from '../../../utils/apiError'

type Tier = 'all' | 'free' | 'pro' | 'premium'
type SortField = 'name' | 'email' | 'createdat' | 'subscriptiontier'

interface UsersQuery {
  page?: string
  limit?: string
  tier?: string
  sortBy?: string
  sortOrder?: string
}

export class UsersController implements HttpController {
  readonly basePath = '/users'

  private readonly auth = createAuthMiddleware(this.env)
  private readonly service: UserService

  constructor(private readonly env: Env, models: Models) {
    this.service = new UserService(env, new UserRepository(models), models)
  }

  register(router: Router) {
    router.get('/public', (req: Request<Record<string, string | undefined>, unknown, unknown, UsersQuery>, res: Response) =>
      this.handleList(req, res, true)
    )

    router.get(
      '/',
      this.auth,
      requireAdmin,
      (req: Request<Record<string, string | undefined>, unknown, unknown, UsersQuery>, res: Response) =>
        this.handleList(req, res, false)
    )

    router.put('/:id', this.auth, requireAdmin, async (req: AuthRequest, res) => {
      const { id } = req.params
      if (!id) return sendApiError(res, 400, 'User id is required')
      try {
        const user = await this.service.updateUser(id, req.body || {})
        res.json({ user })
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        if (err?.code === '23505') return sendApiError(res, 400, 'Email already in use')
        return sendApiError(res, 500, 'Failed to update user')
      }
    })

    router.delete('/:id', this.auth, requireAdmin, async (req, res) => {
      const { id } = req.params
      if (!id) return sendApiError(res, 400, 'User id is required')
      try {
        await this.service.deleteUser(id)
        res.status(204).send()
      } catch (err: any) {
        if (err?.status) return sendApiError(res, err.status, err.message, { details: err.details })
        return sendApiError(res, 500, 'Failed to delete user')
      }
    })
  }

  private normalizeQuery(req: Request<Record<string, string | undefined>, unknown, unknown, UsersQuery>): UsersQueryOptions {
    const allowedTiers: readonly Tier[] = ['all', 'free', 'pro', 'premium']
    const allowedSortFields: readonly SortField[] = ['name', 'email', 'createdat', 'subscriptiontier']
    const page = Math.max(1, parseInt(req.query.page ?? '') || 1)
    const limitParam = parseInt(req.query.limit ?? '')
    const limit = Math.min(100, Math.max(1, isNaN(limitParam) ? 20 : limitParam))
    const tier = (req.query.tier ?? 'all').toLowerCase()
    const sortBy = (req.query.sortBy ?? 'createdAt').toLowerCase()
    const sortOrder = (req.query.sortOrder ?? 'desc').toLowerCase()

    const sanitizedTier: Tier = (allowedTiers as readonly string[]).includes(tier) ? (tier as Tier) : 'all'
    const sanitizedSortBy: SortField = (allowedSortFields as readonly string[]).includes(sortBy) ? (sortBy as SortField) : 'createdat'
    const sanitizedSortOrder = sortOrder === 'asc' ? 'asc' : 'desc'

    return { page, limit, tier: sanitizedTier, sortBy: sanitizedSortBy, sortOrder: sanitizedSortOrder }
  }

  private async handleList(
    req: Request<Record<string, string | undefined>, unknown, unknown, UsersQuery>,
    res: Response,
    hideSuperAdmin = false
  ) {
    try {
      const payload = await this.service.fetchUsers(this.normalizeQuery(req), { hideSuperAdmin })
      res.json(payload)
    } catch (err: any) {
      console.error('Failed to load users:', err)
      return sendApiError(res, 500, 'Failed to load users')
    }
  }
}
