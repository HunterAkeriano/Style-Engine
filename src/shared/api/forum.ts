import { useApi } from './client'

const api = useApi()

export type ForumStatus = 'open' | 'in_review' | 'closed'
export type ForumAttachment = { type: 'image' | 'youtube'; url: string }

export interface ForumUser {
  id: string
  name: string | null
  email: string | null
  avatarUrl: string | null
  isAdmin?: boolean
  isSuperAdmin?: boolean
  subscriptionTier?: 'free' | 'pro' | 'premium'
}

export interface ForumMute {
  id: string
  expiresAt: string | null
  reason: string | null
  createdAt: string
}

export interface ForumTopic {
  id: string
  title: string
  description: string
  status: ForumStatus
  attachments: ForumAttachment[]
  messagesCount: number
  lastActivityAt: string
  createdAt: string
  updatedAt: string
  isPinned: boolean
  pinnedAt: string | null
  pinnedBy?: string | null
  owner: ForumUser | null
}

export interface ForumMessage {
  id: string
  topicId: string
  userId: string
  parentId: string | null
  content: string
  attachments: ForumAttachment[]
  editedAt: string | null
  editedBy: string | null
  createdAt: string
  updatedAt: string
  author: ForumUser | null
}

export interface ForumPagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export interface ForumListResponse {
  topics: ForumTopic[]
  pagination: ForumPagination
}

export interface ForumTopicResponse {
  topic: ForumTopic
  messages: ForumMessage[]
}

const API_BASE =
  import.meta.env.VITE_API_URL ||
  `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api`

function buildQuery(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value))
    }
  })
  const query = search.toString()
  return query ? `?${query}` : ''
}

export async function getForumTopics(params: { page?: number; limit?: number; status?: ForumStatus } = {}): Promise<ForumListResponse> {
  const query = buildQuery({
    page: params.page ?? 1,
    limit: params.limit ?? 10,
    status: params.status
  })
  const response = await api.get<ForumListResponse>(`/forum/topics${query}`)
  return response.data
}

export async function createForumTopic(payload: {
  title: string
  description: string
  attachments?: ForumAttachment[]
}): Promise<ForumTopic> {
  const response = await api.post<{ topic: ForumTopic }>('/forum/topics', payload)
  return response.data.topic
}

export async function updateForumTopic(
  id: string,
  payload: Partial<Pick<ForumTopic, 'title' | 'description' | 'attachments'>>
): Promise<ForumTopic> {
  const response = await api.patch<{ topic: ForumTopic }>(`/forum/topics/${id}`, payload)
  return response.data.topic
}

export async function changeForumTopicStatus(id: string, status: ForumStatus): Promise<ForumTopic> {
  const response = await api.patch<{ topic: ForumTopic }>(`/forum/topics/${id}/status`, { status })
  return response.data.topic
}

export async function pinForumTopic(id: string): Promise<ForumTopic> {
  const response = await api.post<{ topic: ForumTopic }>(`/forum/topics/${id}/pin`)
  return response.data.topic
}

export async function unpinForumTopic(id: string): Promise<ForumTopic> {
  const response = await api.delete<{ topic: ForumTopic }>(`/forum/topics/${id}/pin`)
  return response.data.topic
}

export async function getForumTopic(id: string): Promise<ForumTopicResponse> {
  const response = await api.get<ForumTopicResponse>(`/forum/topics/${id}`)
  return response.data
}

export async function getPinnedForumTopics(limit = 6): Promise<ForumTopic[]> {
  const query = buildQuery({ limit })
  const response = await api.get<{ topics: ForumTopic[] }>(`/forum/topics/pinned${query}`)
  return response.data.topics
}

export async function postForumMessage(
  topicId: string,
  payload: { content: string; parentId?: string | null; attachments?: ForumAttachment[] }
): Promise<{ topic: ForumTopic; message: ForumMessage }> {
  const response = await api.post<{ topic: ForumTopic; message: ForumMessage }>(`/forum/topics/${topicId}/messages`, payload)
  return response.data
}

export async function editForumMessage(
  topicId: string,
  messageId: string,
  payload: { content: string }
): Promise<ForumMessage> {
  const response = await api.patch<{ message: ForumMessage }>(`/forum/topics/${topicId}/messages/${messageId}`, payload)
  return response.data.message
}

export async function uploadForumAttachment(file: File, topicId?: string): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const query = topicId ? `?topicId=${encodeURIComponent(topicId)}` : ''
  const response = await api.post<{ url: string }>(`/forum/attachments${query}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  return response.data.url
}

export function openForumStream(topicId: string, handlers: {
  onMessage?: (message: ForumMessage) => void
  onStatus?: (topic: ForumTopic) => void
  onTopicUpdate?: (topic: ForumTopic) => void
  onEdit?: (message: ForumMessage) => void
  onError?: (error: any) => void
}) {
  const wsBase = API_BASE.startsWith('https') ? API_BASE.replace('https', 'wss') : API_BASE.replace('http', 'ws')
  const socket = new WebSocket(`${wsBase}/forum/ws?topicId=${encodeURIComponent(topicId)}`)

  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data)
      if (payload.event === 'message') handlers.onMessage?.(payload.data)
      if (payload.event === 'status') handlers.onStatus?.(payload.data)
      if (payload.event === 'topic-updated') handlers.onTopicUpdate?.(payload.data)
      if (payload.event === 'message-edit') handlers.onEdit?.(payload.data)
    } catch (err) {
      handlers.onError?.(err)
    }
  }

  socket.onerror = (err) => handlers.onError?.(err)

  return () => socket.close()
}

export interface TopicNotification {
  topicId: string
  topicTitle: string
  message: string
  author: { name: string | null }
}

export function openNotificationStream(userId: string, handlers: {
  onTopicReply?: (notification: TopicNotification) => void
  onError?: (error: any) => void
}) {
  const wsBase = API_BASE.startsWith('https') ? API_BASE.replace('https', 'wss') : API_BASE.replace('http', 'ws')
  const socket = new WebSocket(`${wsBase}/forum/ws?userId=${encodeURIComponent(userId)}`)

  socket.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data)
      if (payload.event === 'topic-reply') handlers.onTopicReply?.(payload.data)
    } catch (err) {
      handlers.onError?.(err)
    }
  }

  socket.onerror = (err) => handlers.onError?.(err)

  return () => socket.close()
}

export async function getUserOpenTopics(): Promise<{ topics: Array<{ id: string; status: ForumStatus }> }> {
  const response = await api.get<{ topics: Array<{ id: string; status: ForumStatus }> }>('/forum/my-topics/open')
  return response.data
}

export async function getTopicParticipants(topicId: string): Promise<{ participants: ForumUser[] }> {
  const response = await api.get<{ participants: ForumUser[] }>(`/forum/topics/${topicId}/participants`)
  return response.data
}

export async function muteUser(userId: string, payload: {
  durationMinutes: number | null
  reason?: string
}): Promise<{ success: boolean }> {
  const response = await api.post<{ success: boolean }>(`/forum/mute/${userId}`, payload)
  return response.data
}

export async function deleteUserMessages(topicId: string, userId: string): Promise<{ success: boolean; deletedCount: number }> {
  const response = await api.delete<{ success: boolean; deletedCount: number }>(`/forum/topics/${topicId}/messages/${userId}`)
  return response.data
}

export async function getUserActiveMutes(): Promise<{ mutes: ForumMute[] }> {
  const response = await api.get<{ mutes: ForumMute[] }>('/forum/my-mutes')
  return response.data
}

export async function checkUserMuteStatus(topicId: string): Promise<{ muted: boolean; expiresAt?: string | null }> {
  const response = await api.get<{ muted: boolean; expiresAt?: string | null }>(`/forum/topics/${topicId}/mute-status`)
  return response.data
}
