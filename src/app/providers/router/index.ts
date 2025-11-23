import { createRouter, createWebHistory, type RouteRecordRaw, type RouterScrollBehavior } from 'vue-router'
import { setupRouterGuards } from './guards'
import { AVAILABLE_LOCALES } from '../i18n'
import MainLayout from '@/app/layouts/main-layout/MainLayout.vue'
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
    path: 'about',
    name: 'about',
    component: () => import('@/pages/about/AboutPage.vue'),
    meta: { titleKey: 'META.ABOUT', descriptionKey: 'META_DESCRIPTION.ABOUT' }
  },
  {
    path: 'privacy-policy',
    name: 'privacy-policy',
    component: () => import('@/pages/policy/PrivacyPolicyPage.vue'),
    meta: { titleKey: 'META.PRIVACY', descriptionKey: 'META_DESCRIPTION.PRIVACY' }
  },
  {
    path: 'cookie-policy',
    name: 'cookie-policy',
    component: () => import('@/pages/policy/CookiePolicyPage.vue'),
    meta: { titleKey: 'META.COOKIE', descriptionKey: 'META_DESCRIPTION.COOKIE' }
  },
  {
    path: 'profile',
    name: 'profile',
    component: () => import('@/pages/profile/ProfilePage.vue'),
    meta: { titleKey: 'META.PROFILE', descriptionKey: 'META_DESCRIPTION.PROFILE', requiresAuth: true },
    children: [
      {
        path: 'gradients',
        name: 'profile-gradients',
        component: () => import('@/pages/profile/saved/SavedGradientsPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'shadows',
        name: 'profile-shadows',
        component: () => import('@/pages/profile/saved/SavedShadowsPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'animations',
        name: 'profile-animations',
        component: () => import('@/pages/profile/saved/SavedAnimationsPage.vue'),
        meta: { requiresAuth: true }
      }
    ]
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

const authLayoutRoutes: RouteRecordRaw[] = [
  {
    path: 'login',
    name: 'login',
    component: () => import('@/pages/login/LoginPage.vue'),
    meta: { titleKey: 'META.AUTH', descriptionKey: 'META_DESCRIPTION.AUTH', guestOnly: true }
  },
  {
    path: 'register',
    name: 'register',
    component: () => import('@/pages/register/RegisterPage.vue'),
    meta: { titleKey: 'META.AUTH', descriptionKey: 'META_DESCRIPTION.AUTH', guestOnly: true }
  },
  {
    path: 'forgot-password',
    name: 'forgot-password',
    component: () => import('@/pages/forgot-password/ForgotPasswordPage.vue'),
    meta: { titleKey: 'META.AUTH', descriptionKey: 'META_DESCRIPTION.AUTH', guestOnly: true }
  },
  {
    path: 'reset-password',
    name: 'reset-password',
    component: () => import('@/pages/reset-password/ResetPasswordPage.vue'),
    meta: { titleKey: 'META.AUTH', descriptionKey: 'META_DESCRIPTION.AUTH', guestOnly: true }
  }
]

const baseRoutes: RouteRecordRaw[] = [
  { path: '', component: MainLayout, children: mainLayoutChildren },
  ...generatorLayoutRoutes,
  ...authLayoutRoutes,
  {
    path: 'moderation',
    name: 'moderation',
    component: () => import('@/pages/moderation/ModerationPage.vue'),
    meta: {
      titleKey: 'META.MODERATION',
      descriptionKey: 'META_DESCRIPTION.MODERATION',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: 'moderation/users',
    name: 'moderation-users',
    component: () => import('@/pages/moderation/UserManagementPage.vue'),
    meta: {
      titleKey: 'MODERATION.USERS_TITLE',
      descriptionKey: 'MODERATION.USERS_SUBTITLE',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
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

function localizeChildren(children: RouteRecordRaw[] | undefined, locale: string): RouteRecordRaw[] | undefined {
  return children?.map(child => {
    const localizedChild: RouteRecordRaw = {
      ...child,
      name: child.name ? `${locale}-${String(child.name)}` : undefined
    }
    if (child.children) {
      localizedChild.children = localizeChildren(child.children, locale)
    }
    return localizedChild
  })
}

function applyLocalePrefix(locale: string, routes: RouteRecordRaw[]): RouteRecordRaw[] {
  const localizedRoutes = routes.map(route => {
    const basePath = typeof route.path === 'string' ? route.path : ''
    return {
      ...route,
      path: `/${locale}/${basePath}`.replace(/\/$/, '') || `/${locale}`,
      name: route.name ? `${locale}-${String(route.name)}` : undefined,
      children: localizeChildren(route.children, locale)
    }
  })
  return localizedRoutes as RouteRecordRaw[]
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
