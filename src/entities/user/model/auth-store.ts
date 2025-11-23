import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apiClient } from '@/shared/api'
import { AUTH_TOKEN_KEY } from '@/shared/api/constants'
import { getCookie, removeCookie, setCookie } from '@/shared/lib/cookies'
import type { User } from './types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const token = ref<string | null>(null)
  const hydrated = ref(false)

  const isAuthenticated = computed(() => user.value !== null)
  const userPlan = computed(() => (user.value?.isPayment ? 'pro' : user.value?.plan || 'free'))
  const isAdmin = computed(() => Boolean(user.value?.isAdmin))
  const isPaid = computed(() => {
    const tier = user.value?.subscriptionTier
    const plan = user.value?.plan
    return (
      tier === 'pro' ||
      tier === 'premium' ||
      plan === 'pro' ||
      plan === 'premium' ||
      Boolean(user.value?.isPayment)
    )
  })

  function setToken(next: string | null) {
    token.value = next
    if (next) {
      setCookie(AUTH_TOKEN_KEY, next, { days: 1, path: '/' })
      apiClient.setAuthToken(next)
    } else {
      removeCookie(AUTH_TOKEN_KEY)
      apiClient.removeAuthToken()
    }
  }

  function setUser(newUser: User | null) {
    user.value = newUser
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function setError(errorMessage: string | null) {
    error.value = errorMessage
  }

  async function fetchProfile() {
    const response = await apiClient.get<{ user: User }>('/profile')
    setUser(response.data.user)
    return response.data.user
  }

  async function ensureSession() {
    if (hydrated.value) return
    hydrated.value = true
    const stored = getCookie(AUTH_TOKEN_KEY)
    if (!stored) return
    setToken(stored)
    try {
      await fetchProfile()
    } catch {
      setToken(null)
      setUser(null)
    }
  }

  async function login(email: string, password: string) {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.post<{ token: string; user: User }>('/auth/login', {
        email,
        password
      })
      setToken(response.data.token)
      setUser(response.data.user)
      try {
        const freshUser = await fetchProfile()
        setUser(freshUser)
      } catch (err) {
        console.error('Failed to refresh profile after login', err)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  async function register(email: string, password: string, name: string) {
    setLoading(true)
    setError(null)

    try {
      const response = await apiClient.post<{ token: string; user: User }>('/auth/register', {
        email,
        password,
        name
      })
      setToken(response.data.token)
      setUser(response.data.user)
      try {
        const freshUser = await fetchProfile()
        setUser(freshUser)
      } catch (err) {
        console.error('Failed to refresh profile after register', err)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  async function logout() {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // ignore
    } finally {
      setUser(null)
      setError(null)
      setToken(null)
    }
  }

  return {
    user,
    isLoading,
    error,
    token,
    hydrated,
    isAuthenticated,
    userPlan,
    isAdmin,
    isPaid,
    setUser,
    setError,
    setToken,
    ensureSession,
    fetchProfile,
    login,
    register,
    logout
  }
})
