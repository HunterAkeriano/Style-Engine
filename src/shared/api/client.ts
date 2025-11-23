import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type Method
} from 'axios'
import { AUTH_TOKEN_KEY } from './constants'
import { getCookie } from '@/shared/lib/cookies'

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

  constructor(config: ApiClientConfig) {
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
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
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: (error.response?.data as any)?.message || error.message,
          status: error.response?.status,
          data: error.response?.data
        }
        return Promise.reject(apiError)
      }
    )
  }

  setAuthToken(token: string | null) {
    if (token) {
      this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete this.instance.defaults.headers.common['Authorization']
    }
  }

  removeAuthToken() {
    this.setAuthToken(null)
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
