import type { Router } from 'vue-router'
import { setLocale, AVAILABLE_LOCALES, getCurrentLocale, type Locale } from '@/app/providers'
import { useAuthStore } from '@/entities'

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, _, next) => {
    const authStore = useAuthStore()
    if (!authStore.hydrated) {
      await authStore.ensureSession()
    }

    const pathParts = to.path.split('/').filter(Boolean)
    const localeIndex = pathParts.findIndex(part => AVAILABLE_LOCALES.includes(part as Locale))
    const localeFromPath = localeIndex >= 0 ? pathParts[localeIndex] : null

    if (!localeFromPath) {
      const defaultLocale = getCurrentLocale()
      const newPath = `/${defaultLocale}${to.path === '/' ? '' : to.path}`

      next({
        path: newPath,
        query: to.query,
        hash: to.hash,
        replace: true
      })
      return
    }

    const locale = localeFromPath as Locale
    if (getCurrentLocale() !== locale) {
      setLocale(locale)
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      const currentLocale = getCurrentLocale()
      next({ name: `${currentLocale}-login`, query: { redirect: to.fullPath } })
      return
    }

    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      const currentLocale = getCurrentLocale()
      next({ name: `${currentLocale}-home` })
      return
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
      const currentLocale = getCurrentLocale()
      next({ name: `${currentLocale}-home` })
      return
    }

    next()
  })
}
