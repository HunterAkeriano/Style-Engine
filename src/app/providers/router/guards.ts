import type { Router } from 'vue-router'
import { i18n, setLocale, AVAILABLE_LOCALES, type Locale } from '@/app/providers'
import { useAuthStore } from '@/entities'

export function setupRouterGuards(router: Router) {
  router.beforeEach(async (to, _, next) => {
    const authStore = useAuthStore()
    if (!authStore.hydrated) {
      await authStore.ensureSession()
    }

    const pathParts = to.path.split('/').filter(Boolean)
    const localeFromPath = pathParts[0]

    if (!AVAILABLE_LOCALES.includes(localeFromPath as any)) {
      const defaultLocale = i18n.global.locale.value || 'en'
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
    if (i18n.global.locale.value !== locale) {
      setLocale(locale)
    }

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      const currentLocale = i18n.global.locale.value
      next({ name: `${currentLocale}-login`, query: { redirect: to.fullPath } })
      return
    }

    if (to.meta.requiresAdmin && !authStore.user?.isAdmin) {
      const currentLocale = i18n.global.locale.value
      next({ name: `${currentLocale}-home` })
      return
    }

    if (to.meta.guestOnly && authStore.isAuthenticated) {
      const currentLocale = i18n.global.locale.value
      next({ name: `${currentLocale}-home` })
      return
    }

    next()
  })
}
