import { createRouter, createWebHistory, type RouteRecordRaw, type RouterScrollBehavior } from 'vue-router'
import { setupRouterGuards } from './guards'
import { AVAILABLE_LOCALES } from '../i18n'
import MainLayout from '@/app/layouts/main-layout/MainLayout.vue'
import AuthLayout from '@/app/layouts/auth-layout/AuthLayout.vue'
import GeneratorLayout from '@/app/layouts/generator-layout/GeneratorLayout.vue'
import DocsLayout from '@/app/layouts/docs-layout/DocsLayout.vue'

const mainLayoutChildren: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home',
    component: () => import('@/pages/home/HomePage.vue'),
    meta: { titleKey: 'META.HOME', descriptionKey: 'META_DESCRIPTION.HOME' }
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
  authLayoutRoute,
  {
    path: 'docs',
    component: DocsLayout,
    children: [
      {
        path: '',
        name: 'docs',
        component: () => import('@/pages/docs/ui/docs-page/DocsPage.vue'),
        meta: { titleKey: 'META.DOCS', descriptionKey: 'META_DESCRIPTION.DOCS' }
      },
      {
        path: ':topic',
        name: 'docs-topic',
        component: () => import('@/pages/docs/ui/docs-topic-page/DocsTopicPage.vue'),
        props: route => ({ topic: route.params.topic as any }),
        meta: { titleKey: 'META.DOCS', descriptionKey: 'META_DESCRIPTION.DOCS' }
      }
    ]
  }
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

export const scrollBehavior: RouterScrollBehavior = (_to, _from, savedPosition) => {
  if (savedPosition) {
    return { ...savedPosition, behavior: 'smooth' }
  }
  if (_to.path !== _from.path) {
    return { left: 0, top: 0, behavior: 'smooth' }
  }
  return false
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
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...localizedRoutes, notFoundRoute],
  scrollBehavior
})

setupRouterGuards(router)

export const routes = [...localizedRoutes, notFoundRoute]

export default router
