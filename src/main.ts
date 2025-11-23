import { createPinia } from 'pinia'
import { ViteSSG } from 'vite-ssg'
import { createHead } from '@unhead/vue/server'
import Toast, { POSITION } from 'vue-toastification'
import { App } from '@/app'
import { clickOutside } from '@/shared/directives'
import { i18n, routes, AVAILABLE_LOCALES, scrollBehavior } from '@/app/providers'
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
  '/gradient',
  '/shadow',
  '/animation',
  '/privacy-policy',
  '/cookie-policy'
]

const localizedSsgRoutes = AVAILABLE_LOCALES.flatMap((locale) =>
  SSG_PUBLIC_ROUTES.map((route) => `/${locale}${route === '/' ? '' : route}`)
)

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    scrollBehavior
  },
  ({ app, router, head: existingHead }) => {
    const pinia = createPinia()
    const head = existingHead ?? createHead()

    app.use(pinia)
    app.use(i18n)
    if (!existingHead) {
      app.use(head)
    }
    app.use(Toast, {
      position: POSITION.BOTTOM_RIGHT,
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
