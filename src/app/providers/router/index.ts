import { createRouter, createWebHistory, type RouteRecordRaw, type RouterScrollBehavior } from 'vue-router'
import { setupRouterGuards } from './guards'
import { AVAILABLE_LOCALES, getLocaleFromPath, setLocale, type Locale } from '../i18n'
import GeneratorLayout from '@/app/layouts/generator-layout/GeneratorLayout.vue'
import DocsLayout from '@/app/layouts/docs-layout/DocsLayout.vue'

const mainLayoutChildren: RouteRecordRaw[] = [
  {
    path: '',
    name: 'home',
    component: () => import('@/pages/home/HomePage.vue'),
    meta: { titleKey: 'META.HOME', descriptionKey: 'META_DESCRIPTION.HOME', hideBreadcrumbs: true }
  },
  {
    path: 'about',
    name: 'about',
    component: () => import('@/pages/about/AboutPage.vue'),
    meta: { titleKey: 'META.ABOUT', descriptionKey: 'META_DESCRIPTION.ABOUT', breadcrumbKey: 'BREADCRUMBS.ABOUT' }
  },
  {
    path: 'privacy-policy',
    name: 'privacy-policy',
    component: () => import('@/pages/policy/PrivacyPolicyPage.vue'),
    meta: {
      titleKey: 'META.PRIVACY',
      descriptionKey: 'META_DESCRIPTION.PRIVACY',
      breadcrumbKey: 'BREADCRUMBS.PRIVACY_POLICY'
    }
  },
  {
    path: 'cookie-policy',
    name: 'cookie-policy',
    component: () => import('@/pages/policy/CookiePolicyPage.vue'),
    meta: {
      titleKey: 'META.COOKIE',
      descriptionKey: 'META_DESCRIPTION.COOKIE',
      breadcrumbKey: 'BREADCRUMBS.COOKIE_POLICY'
    }
  },
  {
    path: 'profile',
    component: () => import('@/pages/profile/ProfilePage.vue'),
    meta: {
      titleKey: 'META.PROFILE',
      descriptionKey: 'META_DESCRIPTION.PROFILE',
      requiresAuth: true,
      hideBreadcrumbs: true
    },
    children: [
      {
        path: '',
        name: 'profile',
        component: () => import('@/pages/profile/settings/ProfileSettingsPage.vue'),
        meta: { requiresAuth: true }
      },
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
      },
      {
        path: 'clip-paths',
        name: 'profile-clip-paths',
        component: () => import('@/pages/profile/saved/SavedClipPathsPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'favicons',
        name: 'profile-favicons',
        component: () => import('@/pages/profile/saved/SavedFaviconsPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'quiz-history',
        name: 'profile-quiz-history',
        component: () => import('@/pages/quiz/quiz-history-page/QuizHistoryPage.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const quizLayoutRoutes: RouteRecordRaw[] = [
  {
    path: 'quiz',
    component: DocsLayout,
    meta: {},
    children: [
      {
        path: '',
        name: 'quiz-start',
        component: () => import('@/pages/quiz/quiz-start-page/QuizStartPage.vue'),
        meta: {
          titleKey: 'META.QUIZ',
          descriptionKey: 'META_DESCRIPTION.QUIZ',
          breadcrumbKey: 'BREADCRUMBS.QUIZ'
        }
      },
      {
        path: 'test',
        name: 'quiz-test',
        component: () => import('@/pages/quiz/quiz-test-page/QuizTestPage.vue'),
        meta: {
          titleKey: 'META.QUIZ',
          descriptionKey: 'META_DESCRIPTION.QUIZ',
          breadcrumbKey: 'BREADCRUMBS.QUIZ_TEST'
        }
      },
      {
        path: 'leaderboard',
        name: 'quiz-leaderboard',
        component: () => import('@/pages/quiz/quiz-leaderboard-page/QuizLeaderboardPage.vue'),
        meta: {
          titleKey: 'META.QUIZ_LEADERBOARD',
          descriptionKey: 'META_DESCRIPTION.QUIZ_LEADERBOARD',
          breadcrumbKey: 'BREADCRUMBS.QUIZ_LEADERBOARD'
        }
      },
      {
        path: 'manage',
        name: 'quiz-manage',
        component: () => import('@/pages/quiz/quiz-management-page/QuizManagementPage.vue'),
        meta: {
          titleKey: 'META.QUIZ_MANAGE',
          descriptionKey: 'META_DESCRIPTION.QUIZ_MANAGE',
          requiresAuth: true,
          requiresAdmin: true,
          breadcrumbKey: 'BREADCRUMBS.QUIZ_MANAGE'
        }
      }
    ]
  }
]

const generatorLayoutRoutes: RouteRecordRaw[] = [
  {
    path: 'gradient',
    component: GeneratorLayout,
    meta: { breadcrumbKey: 'BREADCRUMBS.GRADIENT' },
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
    meta: { breadcrumbKey: 'BREADCRUMBS.SHADOW' },
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
    meta: { breadcrumbKey: 'BREADCRUMBS.ANIMATION' },
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
        meta: {
          titleKey: 'META.ANIMATION',
          descriptionKey: 'META_DESCRIPTION.ANIMATION',
          breadcrumbKey: 'BREADCRUMBS.ANIMATION_DETAIL'
        }
      }
    ]
  },
  {
    path: 'clip-path',
    component: GeneratorLayout,
    meta: { breadcrumbKey: 'BREADCRUMBS.CLIP_PATH' },
    children: [
      {
        path: '',
        name: 'clip-path',
        component: () => import('@/pages/clip-path/ClipPathPage.vue'),
        meta: { titleKey: 'META.CLIP_PATH', descriptionKey: 'META_DESCRIPTION.CLIP_PATH' }
      }
    ]
  },
  {
    path: 'grid',
    component: GeneratorLayout,
    meta: { breadcrumbKey: 'BREADCRUMBS.GRID' },
    children: [
      {
        path: '',
        name: 'grid',
        component: () => import('@/pages/grid/GridPage.vue'),
        meta: { titleKey: 'META.GRID', descriptionKey: 'META_DESCRIPTION.GRID' }
      }
    ]
  },
  {
    path: 'favicon',
    component: GeneratorLayout,
    meta: { breadcrumbKey: 'BREADCRUMBS.FAVICON' },
    children: [
      {
        path: '',
        name: 'favicon',
        component: () => import('@/pages/favicon/FaviconPage.vue'),
        meta: { titleKey: 'META.FAVICON', descriptionKey: 'META_DESCRIPTION.FAVICON' }
      }
    ]
  }
]

const authLayoutRoutes: RouteRecordRaw[] = [
  {
    path: 'login',
    name: 'login',
    component: () => import('@/pages/login/LoginPage.vue'),
    meta: {
      titleKey: 'META.AUTH',
      descriptionKey: 'META_DESCRIPTION.AUTH',
      guestOnly: true,
      hideBreadcrumbs: true
    }
  },
  {
    path: 'register',
    name: 'register',
    component: () => import('@/pages/register/RegisterPage.vue'),
    meta: {
      titleKey: 'META.AUTH',
      descriptionKey: 'META_DESCRIPTION.AUTH',
      guestOnly: true,
      hideBreadcrumbs: true
    }
  },
  {
    path: 'forgot-password',
    name: 'forgot-password',
    component: () => import('@/pages/forgot-password/ForgotPasswordPage.vue'),
    meta: {
      titleKey: 'META.AUTH',
      descriptionKey: 'META_DESCRIPTION.AUTH',
      guestOnly: true,
      hideBreadcrumbs: true
    }
  },
  {
    path: 'reset-password',
    name: 'reset-password',
    component: () => import('@/pages/reset-password/ResetPasswordPage.vue'),
    meta: {
      titleKey: 'META.AUTH',
      descriptionKey: 'META_DESCRIPTION.AUTH',
      guestOnly: true,
      hideBreadcrumbs: true
    }
  }
]

const baseRoutes: RouteRecordRaw[] = [
  { path: '', component: () => import('@/app/layouts/main-layout/MainLayout.vue'), children: mainLayoutChildren },
  ...generatorLayoutRoutes,
  ...quizLayoutRoutes,
  ...authLayoutRoutes,
  {
    path: 'moderation',
    name: 'moderation',
    component: () => import('@/pages/moderation/ModerationPage.vue'),
    meta: {
      titleKey: 'META.MODERATION',
      descriptionKey: 'META_DESCRIPTION.MODERATION',
      requiresAuth: true,
      requiresAdmin: true,
      breadcrumbKey: 'BREADCRUMBS.MODERATION'
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
      requiresAdmin: true,
      breadcrumbKey: 'BREADCRUMBS.MODERATION_USERS'
    }
  },
  {
    path: 'docs',
    component: DocsLayout,
    meta: { breadcrumbKey: 'BREADCRUMBS.DOCS' },
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
        meta: {
          titleKey: 'META.DOCS',
          descriptionKey: 'META_DESCRIPTION.DOCS',
          breadcrumbKey: 'BREADCRUMBS.DOCS_TOPIC'
        }
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
  component: () => import('@/app/layouts/main-layout/MainLayout.vue'),
  children: [
    {
      path: '',
      name: 'not-found',
      component: () => import('@/pages/not-found/NotFoundPage.vue'),
      meta: {
        titleKey: 'META.NOT_FOUND',
        descriptionKey: 'META_DESCRIPTION.NOT_FOUND',
        robots: 'noindex, nofollow',
        hideBreadcrumbs: true
      }
    }
  ]
}

const appRoutes: RouteRecordRaw[] = [...localizedRoutes, notFoundRoute]

export function createRouterInstance(base?: string) {
  const router = createRouter({
    history: createWebHistory(base ?? import.meta.env.BASE_URL),
    routes: appRoutes,
    scrollBehavior
  })

  router.beforeEach((to, _, next) => {
    const targetLocale = getLocaleFromPath(to.fullPath) as Locale
    setLocale(targetLocale)
    next()
  })
  setupRouterGuards(router)
  return router
}

export const routes = appRoutes
