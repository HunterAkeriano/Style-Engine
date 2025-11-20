import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { setupRouterGuards } from './guards'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/home/HomePage.vue'),
    meta: {
      title: 'CSS Lab - Главная',
      layout: 'MainLayout'
    }
  },
  {
    path: '/gradient',
    name: 'gradient',
    component: () => import('@/pages/gradient/GradientPage.vue'),
    meta: {
      title: 'Генератор градиентов',
      layout: 'GeneratorLayout'
    }
  },
  {
    path: '/shadow',
    name: 'shadow',
    component: () => import('@/pages/shadow/ShadowPage.vue'),
    meta: {
      title: 'Генератор теней',
      layout: 'GeneratorLayout'
    }
  },
  {
    path: '/animation',
    name: 'animation',
    component: () => import('@/pages/animation/AnimationPage.vue'),
    meta: {
      title: 'Генератор анимаций',
      layout: 'GeneratorLayout'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/pages/profile/ProfilePage.vue'),
    meta: {
      title: 'Личный кабинет',
      requiresAuth: true,
      layout: 'MainLayout'
    }
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/pages/auth/AuthPage.vue'),
    meta: {
      title: 'Авторизация',
      guestOnly: true,
      layout: 'AuthLayout'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/not-found/NotFoundPage.vue'),
    meta: {
      title: 'Страница не найдена',
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
