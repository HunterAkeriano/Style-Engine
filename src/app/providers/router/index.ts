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
      layout: 'MainLayout'
    }
  },
  {
    path: 'gradient',
    name: 'gradient',
    component: () => import('@/pages/gradient/GradientPage.vue'),
    meta: {
      titleKey: 'META.GRADIENT',
      layout: 'GeneratorLayout'
    }
  },
  {
    path: 'shadow',
    name: 'shadow',
    component: () => import('@/pages/shadow/ShadowPage.vue'),
    meta: {
      titleKey: 'META.SHADOW',
      layout: 'GeneratorLayout'
    }
  },
  {
    path: 'animation',
    name: 'animation',
    component: () => import('@/pages/animation/AnimationPage.vue'),
    meta: {
      titleKey: 'META.ANIMATION',
      layout: 'GeneratorLayout'
    }
  },
  {
    path: 'profile',
    name: 'profile',
    component: () => import('@/pages/profile/ProfilePage.vue'),
    meta: {
      titleKey: 'META.PROFILE',
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
      layout: 'MainLayout'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

setupRouterGuards(router)

export default router
