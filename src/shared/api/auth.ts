import type { LoginFormData, RegisterFormData } from '@/shared/lib/validation/auth'
import { AUTH_TOKEN_KEY } from './constants'
import { useApi } from './client'

const api = useApi()

export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  createdAt: string
  isPayment?: boolean
  isAdmin?: boolean
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ApiError {
  message: string
  issues?: Array<{ path: string[]; message: string }>
}

class AuthAPI {
  async login(data: LoginFormData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data)
    localStorage.setItem(AUTH_TOKEN_KEY, response.data.token)
    api.setAuthToken(response.data.token)
    return response.data
  }

  async register(data: RegisterFormData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data)
    localStorage.setItem(AUTH_TOKEN_KEY, response.data.token)
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
    localStorage.removeItem(AUTH_TOKEN_KEY)
    api.removeAuthToken()
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN_KEY)
  }
}

export const authAPI = new AuthAPI()
