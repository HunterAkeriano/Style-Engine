import type { LoginFormData, RegisterFormData } from '@/shared/lib/validation/auth'
import { AUTH_TOKEN_KEY } from './constants'
import { useApi } from './client'
import { setCookie, removeCookie, getCookie } from '@/shared/lib/cookies'

const api = useApi()

export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  createdAt: string
  subscriptionExpiresAt?: string | null
  subscriptionTier?: 'free' | 'pro' | 'premium'
  isPayment?: boolean
  isAdmin?: boolean
  isSuperAdmin?: boolean
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  message: string
  issues?: Array<{ path: string[]; message: string }>
}

export interface ResetPasswordPayload {
  token: string
  password: string
}

class AuthAPI {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data, { withCredentials: true })
    setCookie(AUTH_TOKEN_KEY, response.data.token, { days: 1, path: '/' })
    api.setAuthToken(response.data.token)
    return response.data
  }

  async register(data: RegisterFormData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data, { withCredentials: true })
    setCookie(AUTH_TOKEN_KEY, response.data.token, { days: 1, path: '/' })
    api.setAuthToken(response.data.token)
    return response.data
  }

  async refresh(): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/refresh', undefined, { withCredentials: true })
    setCookie(AUTH_TOKEN_KEY, response.data.token, { days: 1, path: '/' })
    api.setAuthToken(response.data.token)
    return response.data
  }

  async getProfile(): Promise<{ user: User }> {
    const response = await api.get<{ user: User }>('/profile')
    return response.data
  }

  async updateProfile(data: { name?: string; avatarUrl?: string }): Promise<{ user: User }> {
    const response = await api.put<{ user: User }>('/profile', data)
    return response.data
  }

  async uploadAvatar(file: File): Promise<{ user: User; avatarUrl: string }> {
    const formData = new FormData()
    formData.append('avatar', file)

    const response = await api.post<{ user: User; avatarUrl: string }>('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    return response.data
  }

  logout() {
    api.post('/auth/logout').catch(() => {})
    removeCookie(AUTH_TOKEN_KEY)
    api.removeAuthToken()
  }

  isAuthenticated(): boolean {
    return !!getCookie(AUTH_TOKEN_KEY)
  }

  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email })
  }

  async resetPassword(payload: ResetPasswordPayload): Promise<void> {
    await api.post('/auth/reset-password', payload)
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', { currentPassword, newPassword })
  }
}

export const authAPI = new AuthAPI()
