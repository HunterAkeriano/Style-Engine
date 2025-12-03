import crypto from 'crypto'
import type { AuthRequest } from '../../middleware/auth'
import type { Category } from '../../domain/saves/types'
import { normalizePayload, stableStringify } from '../../utils/payloadNormalization'
import { toApiError } from '../../utils/apiError'
import { SavedItemRepository } from '../../infrastructure/repositories/saved-item-repository'
import type { SavedAnimation, SavedClipPath, SavedFavicon, SavedGradient, SavedShadow, User } from '../../models'
import { Op } from 'sequelize'

type SavedInstance = SavedGradient | SavedShadow | SavedAnimation | SavedClipPath | SavedFavicon

export class SavedItemService {
  constructor(private readonly repo: SavedItemRepository) {}

  private toPlain(item: SavedInstance) {
    const { user: _user, payloadHash: _hash, ...plain } = item.get({ plain: true }) as any
    void _user
    void _hash
    return plain
  }

  private computePayloadHash(category: Category, payload: Record<string, unknown>) {
    const normalized = normalizePayload(category, payload)
    const serialized = stableStringify(normalized)
    return crypto.createHash('md5').update(serialized).digest('hex')
  }

  async enforceLimit(req: AuthRequest) {
    const total = await this.repo.countByUser(req.userId!)
    const tier = req.authUser?.subscriptionTier || (req.authUser?.isPayment ? 'pro' : 'free')
    const limit = tier === 'premium' ? Infinity : tier === 'pro' ? 50 : 5
    if (total >= limit) {
      throw toApiError(403, 'Storage limit reached', { details: { limit } })
    }
  }

  async list(category: Category, userId: string) {
    const items = await this.repo.findAllByUser(category, userId)
    return items.map((i) => this.toPlain(i))
  }

  async listPublic(category: Category) {
    const items = await this.repo.findPublic(category)
    return items.map((item) => {
      const { user, ...plain } = item.get({ plain: true }) as any
      const owner = user as User | undefined
      return {
        ...plain,
        ownerName: owner?.name ?? null,
        ownerEmail: owner?.email ?? null,
        ownerAvatar: owner?.avatarUrl ?? null
      }
    })
  }

  async create(category: Category, req: AuthRequest, payload: { name: string; data: Record<string, unknown> }) {
    await this.enforceLimit(req)
    const payloadHash = this.computePayloadHash(category, payload.data)
    const existing = await this.repo.findOne(category, { userId: req.userId, payloadHash })
    if (existing) {
      throw toApiError(409, 'Already saved')
    }
    const created = await this.repo.create(category, {
      userId: req.userId,
      name: payload.name,
      payload: payload.data,
      payloadHash,
      status: 'private'
    })
    return this.toPlain(created)
  }

  async requestPublish(category: Category, req: AuthRequest, id: string) {
    const item = await this.repo.findOne(category, { id, userId: req.userId, status: 'private' })
    if (!item) {
      throw toApiError(404, 'Item not found or already published')
    }

    const payloadHash = (item as any).payloadHash || this.computePayloadHash(category, (item as any).payload)
    if (!(item as any).payloadHash) {
      await (item as any).update({ payloadHash })
    }

    const duplicate = await this.repo.findOne(category, {
      status: { [Op.in]: ['approved', 'pending'] },
      payloadHash
    })
    if (duplicate) {
      throw toApiError(409, 'This item already exists in public collection')
    }

    await (item as any).update({ status: 'pending', payloadHash })
    return this.toPlain(item)
  }

  async remove(category: Category, req: AuthRequest, id: string) {
    await this.repo.destroy(category, { id, userId: req.userId })
  }
}
