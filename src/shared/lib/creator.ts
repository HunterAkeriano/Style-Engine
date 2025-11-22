import type { SavedItem } from '@/shared/api/saves'
import type { CreatorProfile } from '@/shared/types'

const placeholderColors = ['#667eea', '#f97316', '#a855f7', '#14b8a6', '#0ea5e9']

function normalizeString(value?: string | null) {
  return value ? String(value).trim() : ''
}

export function buildCreatorProfile(item: SavedItem): CreatorProfile {
  if (!item) return {}
  return {
    id: item.userId,
    name: normalizeString(item.ownerName) || normalizeString(item.ownerEmail) || undefined,
    email: normalizeString(item.ownerEmail) || undefined,
    avatarUrl: normalizeString(item.ownerAvatar) || undefined
  }
}

export function getCreatorLabel(creator?: CreatorProfile) {
  return normalizeString(creator?.name) || normalizeString(creator?.email) || 'Creator'
}

export function getCreatorInitials(creator?: CreatorProfile) {
  const label = normalizeString(creator?.name) || normalizeString(creator?.email)
  if (!label) return 'CR'
  return label
    .split(/\s+/)
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function getCreatorAvatarStyle(creator?: CreatorProfile) {
  if (creator?.avatarUrl) {
    return {
      backgroundImage: `url(${creator.avatarUrl})`
    }
  }

  const seed = ((creator?.name ?? creator?.email ?? 'default').charCodeAt(0) || 0) % placeholderColors.length
  return {
    backgroundColor: placeholderColors[seed]
  }
}
