export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl?: string | null
  subscriptionTier?: 'free' | 'pro' | 'premium'
  plan?: 'free' | 'pro' | 'premium'
  isPayment?: boolean
  isAdmin?: boolean
  isSuperAdmin?: boolean
  createdAt: string
  updatedAt?: string
}

export interface SavedItem {
  id: string
  name: string
  payload: Record<string, unknown>
  status?: 'private' | 'pending' | 'approved'
  isFeatured?: boolean
  approvedAt?: string | null
  category?: 'gradient' | 'shadow' | 'animation'
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
