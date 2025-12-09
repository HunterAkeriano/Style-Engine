export type SubscriptionTier = 'free' | 'pro' | 'premium'

export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  isPayment: boolean
  subscriptionTier: SubscriptionTier
  createdAt: Date
  updatedAt: Date
  subscriptionExpiresAt?: Date | null
}

export interface SavedGradient {
  id: string
  userId: string
  name: string
  payload: Record<string, unknown>
  status: string
  isFeatured: boolean
  approvedAt: Date | null
  createdAt: Date
}

export interface SavedShadow {
  id: string
  userId: string
  name: string
  payload: Record<string, unknown>
  status: string
  isFeatured: boolean
  approvedAt: Date | null
  createdAt: Date
}

export interface SavedAnimation {
  id: string
  userId: string
  name: string
  payload: Record<string, unknown>
  status: string
  isFeatured: boolean
  approvedAt: Date | null
  createdAt: Date
}
