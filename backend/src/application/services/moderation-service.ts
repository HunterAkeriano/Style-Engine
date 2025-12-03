import type { Category } from '../../domain/saves/types'
import { SavedItemRepository } from '../../infrastructure/repositories/saved-item-repository'
import type {
  SavedAnimation,
  SavedClipPath,
  SavedFavicon,
  SavedGradient,
  SavedShadow
} from '../../models'
import { toApiError } from '../../utils/apiError'

type SavedInstance = SavedGradient | SavedShadow | SavedAnimation | SavedClipPath | SavedFavicon

export class ModerationService {
  constructor(private readonly repo: SavedItemRepository) {}

  private toItem(item: SavedInstance, category: Category) {
    return { ...(item.get({ plain: true }) as any), category }
  }

  async listByStatus(status: 'pending' | 'approved') {
    const [gradients, shadows, animations, clipPaths, favicons] = await Promise.all([
      this.repo.findAllByStatus('gradient', status),
      this.repo.findAllByStatus('shadow', status),
      this.repo.findAllByStatus('animation', status),
      this.repo.findAllByStatus('clip-path', status),
      this.repo.findAllByStatus('favicon', status)
    ])

    const mapCategory = (cat: Category, list: SavedInstance[]) => list.map((item) => this.toItem(item, cat))

    const items = [
      ...mapCategory('gradient', gradients as any),
      ...mapCategory('shadow', shadows as any),
      ...mapCategory('animation', animations as any),
      ...mapCategory('clip-path', clipPaths as any),
      ...mapCategory('favicon', favicons as any)
    ]

    const sortField = status === 'pending' ? 'createdAt' : 'approvedAt'
    items.sort((a, b) => new Date(b[sortField] ?? 0).getTime() - new Date(a[sortField] ?? 0).getTime())
    return items
  }

  private async findItem(category: Category, id: string) {
    const item = await this.repo.findOne(category, { id })
    if (!item) throw toApiError(404, 'Item not found')
    return item as SavedInstance
  }

  async approve(category: Category, id: string) {
    const item = await this.findItem(category, id)
    await (item as any).update({ status: 'approved', isFeatured: true, approvedAt: new Date() })
    return this.toItem(item, category)
  }

  async rename(category: Category, id: string, name: string) {
    const item = await this.repo.findOne(category, { id, status: 'approved' })
    if (!item) throw toApiError(404, 'Item not found or not approved')
    await (item as any).update({ name })
    return this.toItem(item as any, category)
  }

  async remove(category: Category, id: string) {
    const deleted = await this.repo.destroy(category, { id, status: 'approved' })
    if (!deleted) throw toApiError(404, 'Item not found or not approved')
  }
}
