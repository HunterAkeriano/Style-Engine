import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { setupRouterGuards } from './guards'
import { AVAILABLE_LOCALES } from '../i18n'

const baseRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home',
    component: () => import('@/pages/home/HomePage.vue'),
    meta: {
      titleKey: 'META.HOME',
      descriptionKey: 'META_DESCRIPTION.HOME',
      layout: 'MainLayout'
    }
  },
  {
    path: 'docs',
    name: 'docs',
    component: () => import('@/pages/docs/ui/docs-page/DocsPage.vue'),
    meta: {
      titleKey: 'META.DOCS',
      descriptionKey: 'META_DESCRIPTION.DOCS',
      layout: 'MainLayout'
    }
  },
  {
    path: 'docs/gradients',
    name: 'docs-gradients',
    component: () => import('@/pages/docs/ui/docs-topic-page/DocsTopicPage.vue'),
    props: () => ({ topic: 'gradients' as const }),
    meta: {
      titleKey: 'META.DOCS_GRADIENTS',
      descriptionKey: 'META_DESCRIPTION.DOCS_GRADIENTS',
      layout: 'MainLayout'
    }
  },
  {
    path: 'docs/shadows',
    name: 'docs-shadows',
    component: () => import('@/pages/docs/ui/docs-topic-page/DocsTopicPage.vue'),
    props: () => ({ topic: 'shadows' as const }),
    meta: {
      titleKey: 'META.DOCS_SHADOWS',
      descriptionKey: 'META_DESCRIPTION.DOCS_SHADOWS',
      layout: 'MainLayout'
    }
  },
  {
    path: 'docs/animations',
    name: 'docs-animations',
    component: () => import('@/pages/docs/ui/docs-topic-page/DocsTopicPage.vue'),
    props: () => ({ topic: 'animations' as const }),
    meta: {
      titleKey: 'META.DOCS_ANIMATIONS',
      descriptionKey: 'META_DESCRIPTION.DOCS_ANIMATIONS',
      layout: 'MainLayout'
    }
  },
  {
    path: 'gradient',
    name: 'gradient',
    component: () => import('@/pages/gradient/GradientPage.vue'),
    meta: {
      titleKey: 'META.GRADIENT',
      descriptionKey: 'META_DESCRIPTION.GRADIENT',
      layout: 'GeneratorLayout'
    }
  },
  {
    path: 'shadow',
    name: 'shadow',
    component: () => import('@/pages/shadow/ShadowPage.vue'),
    meta: {
      titleKey: 'META.SHADOW',
      descriptionKey: 'META_DESCRIPTION.SHADOW',
      layout: 'GeneratorLayout'
    }
  },
  {
    path: 'animation',
    name: 'animation',
    component: () => import('@/pages/animation/AnimationPage.vue'),
    meta: {
      titleKey: 'META.ANIMATION',
      descriptionKey: 'META_DESCRIPTION.ANIMATION',
      layout: 'GeneratorLayout'
    }
  },
  {
    path: 'animation/:id',
    name: 'animation-detail',
    component: () => import('@/pages/animation/detail/AnimationDetailPage.vue'),
    meta: {
      titleKey: 'META.ANIMATION',
      descriptionKey: 'META_DESCRIPTION.ANIMATION',
      layout: 'GeneratorLayout'
    }
  },
  {
    path: 'profile',
    name: 'profile',
    component: () => import('@/pages/profile/ProfilePage.vue'),
    meta: {
      titleKey: 'META.PROFILE',
      descriptionKey: 'META_DESCRIPTION.PROFILE',
      requiresAuth: true,
      layout: 'MainLayout'
    }
  },
  {
    path: 'auth',
    name: 'auth',
    component: () => import('@/pages/auth/AuthPage.vue'),
    meta: {
      titleKey: 'META.AUTH',
      descriptionKey: 'META_DESCRIPTION.AUTH',
      guestOnly: true,
      layout: 'AuthLayout'
    }
  }
]

const localizedRoutes: RouteRecordRaw[] = AVAILABLE_LOCALES.flatMap(locale =>
  baseRoutes.map(route => ({
    ...route,
    path: `/${locale}/${route.path}`.replace(/\/$/, '') || `/${locale}`,
    name: `${locale}-${String(route.name)}`,
    meta: {
      ...route.meta,
      locale
    }
  }))
)

const routes: RouteRecordRaw[] = [
  ...localizedRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/not-found/NotFoundPage.vue'),
    meta: {
      titleKey: 'META.NOT_FOUND',
      descriptionKey: 'META_DESCRIPTION.NOT_FOUND',
      robots: 'noindex, nofollow',
      layout: 'MainLayout'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return { ...savedPosition, behavior: 'smooth' }
    }
    return { left: 0, top: 0, behavior: 'smooth' }
  }
})

setupRouterGuards(router)

export default router
