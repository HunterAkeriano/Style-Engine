import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'
import { createHead } from '@unhead/vue/server'
import GoogleSignInPlugin from 'vue3-google-signin'
import { VueReCaptcha } from 'vue-recaptcha-v3'
import { toastPlugin } from '@/shared/lib/toast'
import { App } from '@/app'
import { clickOutside } from '@/shared/directives'
import { applyZodErrorMap } from '@/shared/lib/zod-config'
import { initI18n, routes, AVAILABLE_LOCALES, scrollBehavior, getLocaleFromPath, setLocale } from '@/app/providers'
import { setupRouterGuards } from '@/app/providers/router/guards'

import '@/app/styles/index.scss'
import 'vue-toastification/dist/index.css'

const SSG_PUBLIC_ROUTES = [
  '/',
  '/about',
  '/docs',
  '/docs/gradients',
  '/docs/shadows',
  '/docs/animations',
  '/quiz',
  '/quiz/leaderboard',
  '/gradient',
  '/shadow',
  '/animation',
  '/clip-path',
  '/grid',
  '/favicon',
  '/privacy-policy',
  '/cookie-policy',
  '/forum',
  '/forum/status/open',
  '/forum/status/in_review',
  '/forum/status/closed'
]

const localizedSsgRoutes = AVAILABLE_LOCALES.flatMap((locale) =>
  SSG_PUBLIC_ROUTES.map((route) => `/${locale}${route === '/' ? '' : route}`)
)

const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    scrollBehavior
  },
  ({ app, router, head: existingHead, routePath }) => {
    const pinia = createPinia()
    const head = existingHead ?? createHead()

    const resolvedRoutePath = routePath ?? router.currentRoute.value.fullPath
    const initialLocale = getLocaleFromPath(resolvedRoutePath)
    const i18nInstance = initI18n(initialLocale)
    applyZodErrorMap(i18nInstance.global.t)
    setLocale(initialLocale)

    app.use(pinia)
    app.use(i18nInstance)
    if (!existingHead) {
      app.use(head)
    }
    if (typeof window !== 'undefined') {
      if (recaptchaSiteKey) {
        app.use(VueReCaptcha, {
          siteKey: recaptchaSiteKey,
          loaderOptions: {
            autoHideBadge: true
          }
        })
      } else {
        console.warn('VITE_RECAPTCHA_SITE_KEY is not set; reCAPTCHA is disabled')
      }
      app.use(GoogleSignInPlugin, {
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
      })
    }
    app.use(toastPlugin, {
      position: 'bottom-right',
      timeout: 2200,
      hideProgressBar: true,
      closeButton: false,
      transition: 'Vue-Toastification__fade',
      maxToasts: 4,
      toastClassName: 'se-toast',
      bodyClassName: 'se-toast__body'
    })

    setupRouterGuards(router)
    app.directive('click-outside', clickOutside)
  }
)

export { localizedSsgRoutes }
