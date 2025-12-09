import { useApi } from './client'

const api = useApi()

export type UserRole = 'user' | 'moderator' | 'super_admin'

export interface PublicUser {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  subscriptionTier: 'free' | 'pro' | 'premium'
  subscriptionExpiresAt?: string | null
  createdAt: string
  isPayment?: boolean
  role?: UserRole
}

export interface UsersResponse {
  users: PublicUser[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
}

export interface UsersParams {
  page?: number
  limit?: number
  tier?: 'all' | 'free' | 'pro' | 'premium'
  sortBy?: 'name' | 'email' | 'createdAt' | 'subscriptionTier'
  sortOrder?: 'asc' | 'desc'
}

function buildQuery(params: UsersParams) {
  const queryParams = new URLSearchParams()

  if (params.page) queryParams.set('page', params.page.toString())
  if (params.limit) queryParams.set('limit', params.limit.toString())
  if (params.tier) queryParams.set('tier', params.tier)
  if (params.sortBy) queryParams.set('sortBy', params.sortBy)
  if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder)

  return queryParams.toString()
}

async function requestUsers(url: string, params: UsersParams = {}) {
  const queryString = buildQuery(params)
  const response = await api.get<UsersResponse>(queryString ? `${url}?${queryString}` : url)
  return response.data
}

export async function getPublicUsers(params: UsersParams = {}): Promise<UsersResponse> {
  return requestUsers('/users/public', params)
}

export async function getModerationUsers(params: UsersParams = {}): Promise<UsersResponse> {
  return requestUsers('/users', params)
}

interface UpdateUserPayload {
  email?: string
  name?: string
  password?: string
  subscriptionTier?: 'free' | 'pro' | 'premium'
  subscriptionDuration?: 'month' | 'forever' | 'free'
  role?: UserRole
}

export async function updateUser(id: string, payload: UpdateUserPayload) {
  const response = await api.put<{ user: PublicUser }>(`/users/${id}`, payload)
  return response.data.user
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`)
}
