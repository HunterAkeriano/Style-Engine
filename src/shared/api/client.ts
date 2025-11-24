import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type Method,
  type AxiosRequestHeaders
} from 'axios'
import { AUTH_TOKEN_KEY } from './constants'
import { getCookie, setCookie, removeCookie } from '@/shared/lib/cookies'

export interface ApiClientConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
}

export interface ApiResponse<T = unknown> {
  data: T
  status: number
  statusText: string
  headers: Record<string, string>
}

export interface ApiError {
  message: string
  status?: number
  data?: unknown
}

export class ApiClient {
  private instance: AxiosInstance
  private refreshPromise: Promise<string | null> | null = null

  constructor(config: ApiClientConfig) {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      }
    })

    const stored = getCookie(AUTH_TOKEN_KEY)
    if (stored) {
      this.setAuthToken(stored)
    }

    this.instance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const status = error.response?.status
        const originalRequest = error.config

        if (status === 401 && originalRequest && !(originalRequest as any)._retry) {
          ;(originalRequest as any)._retry = true
          const refreshed = await this.tryRefreshToken()
          if (refreshed) {
            const headers = (originalRequest.headers || {}) as AxiosRequestHeaders
            headers.Authorization = `Bearer ${refreshed}`
            originalRequest.headers = headers
            return this.instance(originalRequest)
          }
        }

        const apiError: ApiError = {
          message: (error.response?.data as any)?.message || error.message,
          status,
          data: error.response?.data
        }
        return Promise.reject(apiError)
      }
    )
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setCookie(AUTH_TOKEN_KEY, token, { days: 1, path: '/' })
    } else {
      delete this.instance.defaults.headers.common['Authorization']
      removeCookie(AUTH_TOKEN_KEY)
    }
  }

  removeAuthToken() {
    this.setAuthToken(null)
  }

  private async tryRefreshToken(): Promise<string | null> {
    if (this.refreshPromise) return this.refreshPromise
    this.refreshPromise = this.instance
      .post<{ token: string }>('/auth/refresh', undefined, { withCredentials: true })
      .then((res) => {
        const token = res.data.token
        if (token) {
          this.setAuthToken(token)
          return token
        }
        return null
      })
      .catch(() => null)
      .finally(() => {
        this.refreshPromise = null
      })

    return this.refreshPromise
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url, undefined, config)
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data, config)
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data, config)
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', url, data, config)
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url, undefined, config)
  }

  private async request<T>(
    method: Method,
    url: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const response: AxiosResponse<T> = await this.instance.request<T>({
      method,
      url,
      data,
      ...config
    })

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>
    }
  }
}

const apiClient = new ApiClient({
  baseURL:
    import.meta.env.VITE_API_URL ||
    `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api`
})

export const useApi = () => apiClient

export default apiClient
