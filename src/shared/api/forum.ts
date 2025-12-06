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
  subscriptionTier?: 'free' | 'pro' | 'premium'
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

export async function getForumTopic(id: string): Promise<ForumTopicResponse> {
  const response = await api.get<ForumTopicResponse>(`/forum/topics/${id}`)
  return response.data
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
