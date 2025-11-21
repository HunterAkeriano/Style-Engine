import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { setupRouterGuards } from './guards'
import { AVAILABLE_LOCALES } from '../i18n'
import MainLayout from '@/app/layouts/main-layout/MainLayout.vue'
import AuthLayout from '@/app/layouts/auth-layout/AuthLayout.vue'
import GeneratorLayout from '@/app/layouts/generator-layout/GeneratorLayout.vue'

const mainLayoutChildren: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home',
    component: () => import('@/pages/home/HomePage.vue'),
    meta: { titleKey: 'META.HOME', descriptionKey: 'META_DESCRIPTION.HOME' }
  },
  {
    path: 'docs',
    name: 'docs',
    component: () => import('@/pages/docs/ui/docs-page/DocsPage.vue'),
    meta: { titleKey: 'META.DOCS', descriptionKey: 'META_DESCRIPTION.DOCS' }
  },
  {
    path: 'docs/gradients',
    name: 'docs-gradients',
    component: () => import('@/pages/docs/ui/docs-topic-page/DocsTopicPage.vue'),
    props: () => ({ topic: 'gradients' as const }),
    meta: { titleKey: 'META.DOCS_GRADIENTS', descriptionKey: 'META_DESCRIPTION.DOCS_GRADIENTS' }
  },
  {
    path: 'docs/shadows',
    name: 'docs-shadows',
    component: () => import('@/pages/docs/ui/docs-topic-page/DocsTopicPage.vue'),
    props: () => ({ topic: 'shadows' as const }),
    meta: { titleKey: 'META.DOCS_SHADOWS', descriptionKey: 'META_DESCRIPTION.DOCS_SHADOWS' }
  },
  {
    path: 'docs/animations',
    name: 'docs-animations',
    component: () => import('@/pages/docs/ui/docs-topic-page/DocsTopicPage.vue'),
    props: () => ({ topic: 'animations' as const }),
    meta: { titleKey: 'META.DOCS_ANIMATIONS', descriptionKey: 'META_DESCRIPTION.DOCS_ANIMATIONS' }
  },
  {
    path: 'profile',
    name: 'profile',
    component: () => import('@/pages/profile/ProfilePage.vue'),
    meta: { titleKey: 'META.PROFILE', descriptionKey: 'META_DESCRIPTION.PROFILE', requiresAuth: true }
  }
]

const generatorLayoutRoutes: RouteRecordRaw[] = [
  {
    path: 'gradient',
    component: GeneratorLayout,
    children: [
      {
        path: '',
        name: 'gradient',
        component: () => import('@/pages/gradient/GradientPage.vue'),
        meta: { titleKey: 'META.GRADIENT', descriptionKey: 'META_DESCRIPTION.GRADIENT' }
      }
    ]
  },
  {
    path: 'shadow',
    component: GeneratorLayout,
    children: [
      {
        path: '',
        name: 'shadow',
        component: () => import('@/pages/shadow/ShadowPage.vue'),
        meta: { titleKey: 'META.SHADOW', descriptionKey: 'META_DESCRIPTION.SHADOW' }
      }
    ]
  },
  {
    path: 'animation',
    component: GeneratorLayout,
    children: [
      {
        path: '',
        name: 'animation',
        component: () => import('@/pages/animation/AnimationPage.vue'),
        meta: { titleKey: 'META.ANIMATION', descriptionKey: 'META_DESCRIPTION.ANIMATION' }
      },
      {
        path: ':id',
        name: 'animation-detail',
        component: () => import('@/pages/animation/detail/AnimationDetailPage.vue'),
        meta: { titleKey: 'META.ANIMATION', descriptionKey: 'META_DESCRIPTION.ANIMATION' }
      }
    ]
  }
]

const authLayoutRoute: RouteRecordRaw = {
  path: 'auth',
  component: AuthLayout,
  children: [
    {
      path: '',
      name: 'auth',
      component: () => import('@/pages/auth/AuthPage.vue'),
      meta: { titleKey: 'META.AUTH', descriptionKey: 'META_DESCRIPTION.AUTH', guestOnly: true }
    }
  ]
}

const baseRoutes: RouteRecordRaw[] = [
  { path: '', component: MainLayout, children: mainLayoutChildren },
  ...generatorLayoutRoutes,
  authLayoutRoute
]

function applyLocalePrefix(locale: string, routes: RouteRecordRaw[]): RouteRecordRaw[] {
  return routes.map<RouteRecordRaw>(route => ({
    ...route,
    path: `/${locale}/${route.path}`.replace(/\/$/, '') || `/${locale}`,
    children:
      route.children?.map(child => ({
        ...child,
        name: child.name ? `${locale}-${String(child.name)}` : undefined
      })) ?? []
  }))
}

const localizedRoutes: RouteRecordRaw[] = AVAILABLE_LOCALES.flatMap(locale => applyLocalePrefix(locale, baseRoutes))

const notFoundRoute: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  component: MainLayout,
  children: [
    {
      path: '',
      name: 'not-found',
      component: () => import('@/pages/not-found/NotFoundPage.vue'),
      meta: {
        titleKey: 'META.NOT_FOUND',
        descriptionKey: 'META_DESCRIPTION.NOT_FOUND',
        robots: 'noindex, nofollow'
      }
    }
  ]
}

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [...localizedRoutes, notFoundRoute],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return { ...savedPosition, behavior: 'smooth' }
    }
    if (_to.path !== _from.path) {
      return { left: 0, top: 0, behavior: 'smooth' }
    }
    return false
  }
})

setupRouterGuards(router)

export default router
