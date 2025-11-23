import { AUTH_TOKEN_KEY } from './constants'
import { useApi } from './client'
import { getCookie } from '@/shared/lib/cookies'

const api = useApi()

export type SaveCategory = 'gradient' | 'shadow' | 'animation'

export interface SavedItem {
  id: string
  name: string
  payload: Record<string, unknown>
  status?: 'private' | 'pending' | 'approved'
  isFeatured?: boolean
  approvedAt?: string | null
  createdAt: string
  category?: SaveCategory
  userId?: string
  ownerName?: string | null
  ownerEmail?: string | null
  ownerAvatar?: string | null
}

function authHeaders(): Record<string, string> {
  const token = getCookie(AUTH_TOKEN_KEY)
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  return headers
}

export async function listSaves(category: SaveCategory): Promise<SavedItem[]> {
  const response = await api.get<{ items: SavedItem[] }>(`/saves/${category}s`, {
    headers: authHeaders()
  })
  return response.data.items
}

export async function requestPublish(category: SaveCategory, id: string): Promise<SavedItem> {
  const response = await api.post<{ item: SavedItem }>(`/saves/${category}s/${id}/publish`, undefined, {
    headers: authHeaders()
  })
  return response.data.item
}

export async function listPublicSaves(category: SaveCategory): Promise<SavedItem[]> {
  const response = await api.get<{ items: SavedItem[] }>(`/saves/public/${category}s`)
  return response.data.items
}

export async function listPendingModeration(): Promise<SavedItem[]> {
  const response = await api.get<{ items: SavedItem[] }>('/moderation/pending', {
    headers: authHeaders()
  })
  return response.data.items
}

export async function approveSubmission(category: SaveCategory, id: string): Promise<SavedItem> {
  const response = await api.post<{ item: SavedItem }>(`/moderation/${category}/${id}/approve`, undefined, {
    headers: authHeaders()
  })
  return response.data.item
}

export async function createSave(category: SaveCategory, name: string, payload: Record<string, unknown>): Promise<SavedItem> {
  const response = await api.post<{ item: SavedItem }>(
    `/saves/${category}s`,
    { name, payload },
    { headers: authHeaders() }
  )
  return response.data.item
}

export async function deleteSave(category: SaveCategory, id: string): Promise<void> {
  await api.delete(`/saves/${category}s/${id}`, {
    headers: authHeaders()
  })
}
