import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
  type RouterScrollBehavior,
} from "vue-router";
import { setupRouterGuards } from "./guards";
import {
  AVAILABLE_LOCALES,
  getLocaleFromPath,
  setLocale,
  type Locale,
} from "../i18n";
import GeneratorLayout from "@/app/layouts/generator-layout/GeneratorLayout.vue";
import DocsLayout from "@/app/layouts/docs-layout/DocsLayout.vue";
import MainLayout from "@/app/layouts/main-layout/MainLayout.vue";
import HomePage from "@/pages/home/HomePage.vue";
import AboutPage from "@/pages/about/AboutPage.vue";
import ForumListPage from "@/pages/forum/forum-list-page/ForumListPage.vue";
import ForumCreatePage from "@/pages/forum/forum-create-page/ForumCreatePage.vue";
import ForumTopicPage from "@/pages/forum/forum-topic-page/ForumTopicPage.vue";
import PrivacyPolicyPage from "@/pages/policy/PrivacyPolicyPage.vue";
import CookiePolicyPage from "@/pages/policy/CookiePolicyPage.vue";
import ProfilePage from "@/pages/profile/ProfilePage.vue";
import ProfileSettingsPage from "@/pages/profile/settings/ProfileSettingsPage.vue";
import SavedGradientsPage from "@/pages/profile/saved/SavedGradientsPage.vue";
import SavedShadowsPage from "@/pages/profile/saved/SavedShadowsPage.vue";
import SavedAnimationsPage from "@/pages/profile/saved/SavedAnimationsPage.vue";
import SavedClipPathsPage from "@/pages/profile/saved/SavedClipPathsPage.vue";
import SavedFaviconsPage from "@/pages/profile/saved/SavedFaviconsPage.vue";
import QuizHistoryPage from "@/pages/quiz/quiz-history-page/QuizHistoryPage.vue";
import QuizStartPage from "@/pages/quiz/quiz-start-page/QuizStartPage.vue";
import QuizTestPage from "@/pages/quiz/quiz-test-page/QuizTestPage.vue";
import QuizLeaderboardPage from "@/pages/quiz/quiz-leaderboard-page/QuizLeaderboardPage.vue";
import QuizManagementPage from "@/pages/quiz/quiz-management-page/QuizManagementPage.vue";
import GradientPage from "@/pages/gradient/GradientPage.vue";
import ShadowPage from "@/pages/shadow/ShadowPage.vue";
import AnimationPage from "@/pages/animation/AnimationPage.vue";
import AnimationDetailPage from "@/pages/animation/detail/AnimationDetailPage.vue";
import ClipPathPage from "@/pages/clip-path/ClipPathPage.vue";
import GridPage from "@/pages/grid/GridPage.vue";
import FaviconPage from "@/pages/favicon/FaviconPage.vue";
import LoginPage from "@/pages/login/LoginPage.vue";
import RegisterPage from "@/pages/register/RegisterPage.vue";
import ForgotPasswordPage from "@/pages/forgot-password/ForgotPasswordPage.vue";
import ResetPasswordPage from "@/pages/reset-password/ResetPasswordPage.vue";
import ModerationPage from "@/pages/moderation/ModerationPage.vue";
import UserManagementPage from "@/pages/moderation/UserManagementPage.vue";
import DocsPage from "@/pages/docs/ui/docs-page/DocsPage.vue";
import DocsTopicPage from "@/pages/docs/ui/docs-topic-page/DocsTopicPage.vue";
import NotFoundPage from "@/pages/not-found/NotFoundPage.vue";

const mainLayoutChildren: RouteRecordRaw[] = [
  {
    path: "",
    name: "home",
    component: HomePage,
    meta: {
      titleKey: "META.HOME",
      descriptionKey: "META_DESCRIPTION.HOME",
      hideBreadcrumbs: true,
    },
  },
  {
    path: "about",
    name: "about",
    component: AboutPage,
    meta: {
      titleKey: "META.ABOUT",
      descriptionKey: "META_DESCRIPTION.ABOUT",
      breadcrumbKey: "BREADCRUMBS.ABOUT",
    },
  },
  {
    path: "forum",
    name: "forum",
    component: ForumListPage,
    meta: {
      titleKey: "META.FORUM",
      descriptionKey: "META_DESCRIPTION.FORUM",
      breadcrumbKey: "BREADCRUMBS.FORUM",
    },
  },
  {
    path: "forum/create",
    name: "forum-create",
    component: ForumCreatePage,
    meta: {
      titleKey: "META.FORUM_CREATE",
      descriptionKey: "META_DESCRIPTION.FORUM_CREATE",
      breadcrumbKey: "BREADCRUMBS.FORUM_CREATE",
      requiresAuth: true,
    },
  },
  {
    path: "forum/status/:status",
    name: "forum-status",
    component: ForumListPage,
    meta: {
      titleKey: "META.FORUM",
      descriptionKey: "META_DESCRIPTION.FORUM",
      breadcrumbKey: "BREADCRUMBS.FORUM",
    },
  },
  {
    path: "forum/:id",
    name: "forum-topic",
    component: ForumTopicPage,
    meta: {
      titleKey: "META.FORUM_TOPIC",
      descriptionKey: "META_DESCRIPTION.FORUM_TOPIC",
      breadcrumbKey: "BREADCRUMBS.FORUM_TOPIC",
    },
  },
  {
    path: "privacy-policy",
    name: "privacy-policy",
    component: PrivacyPolicyPage,
    meta: {
      titleKey: "META.PRIVACY",
      descriptionKey: "META_DESCRIPTION.PRIVACY",
      breadcrumbKey: "BREADCRUMBS.PRIVACY_POLICY",
    },
  },
  {
    path: "cookie-policy",
    name: "cookie-policy",
    component: CookiePolicyPage,
    meta: {
      titleKey: "META.COOKIE",
      descriptionKey: "META_DESCRIPTION.COOKIE",
      breadcrumbKey: "BREADCRUMBS.COOKIE_POLICY",
    },
  },
  {
    path: "profile",
    component: ProfilePage,
    meta: {
      titleKey: "META.PROFILE",
      descriptionKey: "META_DESCRIPTION.PROFILE",
      requiresAuth: true,
      hideBreadcrumbs: true,
    },
    children: [
      {
        path: "",
        name: "profile",
        component: ProfileSettingsPage,
        meta: { requiresAuth: true },
      },
      {
        path: "gradients",
        name: "profile-gradients",
        component: SavedGradientsPage,
        meta: { requiresAuth: true },
      },
      {
        path: "shadows",
        name: "profile-shadows",
        component: SavedShadowsPage,
        meta: { requiresAuth: true },
      },
      {
        path: "animations",
        name: "profile-animations",
        component: SavedAnimationsPage,
        meta: { requiresAuth: true },
      },
      {
        path: "clip-paths",
        name: "profile-clip-paths",
        component: SavedClipPathsPage,
        meta: { requiresAuth: true },
      },
      {
        path: "favicons",
        name: "profile-favicons",
        component: SavedFaviconsPage,
        meta: { requiresAuth: true },
      },
      {
        path: "quiz-history",
        name: "profile-quiz-history",
        component: QuizHistoryPage,
        meta: { requiresAuth: true },
      },
    ],
  },
];

const quizLayoutRoutes: RouteRecordRaw[] = [
  {
    path: "quiz",
    component: DocsLayout,
    meta: {},
    children: [
      {
        path: "",
        name: "quiz-start",
        component: QuizStartPage,
        meta: {
          titleKey: "META.QUIZ",
          descriptionKey: "META_DESCRIPTION.QUIZ",
          breadcrumbKey: "BREADCRUMBS.QUIZ",
        },
      },
      {
        path: "test",
        name: "quiz-test",
        component: QuizTestPage,
        meta: {
          titleKey: "META.QUIZ",
          descriptionKey: "META_DESCRIPTION.QUIZ",
          breadcrumbKey: "BREADCRUMBS.QUIZ_TEST",
        },
      },
      {
        path: "leaderboard",
        name: "quiz-leaderboard",
        component: QuizLeaderboardPage,
        meta: {
          titleKey: "META.QUIZ_LEADERBOARD",
          descriptionKey: "META_DESCRIPTION.QUIZ_LEADERBOARD",
          breadcrumbKey: "BREADCRUMBS.QUIZ_LEADERBOARD",
        },
      },
      {
        path: "manage",
        name: "quiz-manage",
        component: QuizManagementPage,
        meta: {
          titleKey: "META.QUIZ_MANAGE",
          descriptionKey: "META_DESCRIPTION.QUIZ_MANAGE",
          requiresAuth: true,
          requiresAdmin: true,
          breadcrumbKey: "BREADCRUMBS.QUIZ_MANAGE",
        },
      },
    ],
  },
];

const generatorLayoutRoutes: RouteRecordRaw[] = [
  {
    path: "gradient",
    component: GeneratorLayout,
    meta: { breadcrumbKey: "BREADCRUMBS.GRADIENT" },
    children: [
      {
        path: "",
        name: "gradient",
        component: GradientPage,
        meta: {
          titleKey: "META.GRADIENT",
          descriptionKey: "META_DESCRIPTION.GRADIENT",
        },
      },
    ],
  },
  {
    path: "shadow",
    component: GeneratorLayout,
    meta: { breadcrumbKey: "BREADCRUMBS.SHADOW" },
    children: [
      {
        path: "",
        name: "shadow",
        component: ShadowPage,
        meta: {
          titleKey: "META.SHADOW",
          descriptionKey: "META_DESCRIPTION.SHADOW",
        },
      },
    ],
  },
  {
    path: "animation",
    component: GeneratorLayout,
    meta: { breadcrumbKey: "BREADCRUMBS.ANIMATION" },
    children: [
      {
        path: "",
        name: "animation",
        component: AnimationPage,
        meta: {
          titleKey: "META.ANIMATION",
          descriptionKey: "META_DESCRIPTION.ANIMATION",
        },
      },
      {
        path: ":id",
        name: "animation-detail",
        component: AnimationDetailPage,
        meta: {
          titleKey: "META.ANIMATION",
          descriptionKey: "META_DESCRIPTION.ANIMATION",
          breadcrumbKey: "BREADCRUMBS.ANIMATION_DETAIL",
        },
      },
    ],
  },
  {
    path: "clip-path",
    component: GeneratorLayout,
    meta: { breadcrumbKey: "BREADCRUMBS.CLIP_PATH" },
    children: [
      {
        path: "",
        name: "clip-path",
        component: ClipPathPage,
        meta: {
          titleKey: "META.CLIP_PATH",
          descriptionKey: "META_DESCRIPTION.CLIP_PATH",
        },
      },
    ],
  },
  {
    path: "grid",
    component: GeneratorLayout,
    meta: { breadcrumbKey: "BREADCRUMBS.GRID" },
    children: [
      {
        path: "",
        name: "grid",
        component: GridPage,
        meta: {
          titleKey: "META.GRID",
          descriptionKey: "META_DESCRIPTION.GRID",
        },
      },
    ],
  },
  {
    path: "favicon",
    component: GeneratorLayout,
    meta: { breadcrumbKey: "BREADCRUMBS.FAVICON" },
    children: [
      {
        path: "",
        name: "favicon",
        component: FaviconPage,
        meta: {
          titleKey: "META.FAVICON",
          descriptionKey: "META_DESCRIPTION.FAVICON",
        },
      },
    ],
  },
];

const authLayoutRoutes: RouteRecordRaw[] = [
  {
    path: "login",
    name: "login",
    component: LoginPage,
    meta: {
      titleKey: "META.AUTH",
      descriptionKey: "META_DESCRIPTION.AUTH",
      guestOnly: true,
      hideBreadcrumbs: true,
    },
  },
  {
    path: "register",
    name: "register",
    component: RegisterPage,
    meta: {
      titleKey: "META.AUTH",
      descriptionKey: "META_DESCRIPTION.AUTH",
      guestOnly: true,
      hideBreadcrumbs: true,
    },
  },
  {
    path: "forgot-password",
    name: "forgot-password",
    component: ForgotPasswordPage,
    meta: {
      titleKey: "META.AUTH",
      descriptionKey: "META_DESCRIPTION.AUTH",
      guestOnly: true,
      hideBreadcrumbs: true,
    },
  },
  {
    path: "reset-password",
    name: "reset-password",
    component: ResetPasswordPage,
    meta: {
      titleKey: "META.AUTH",
      descriptionKey: "META_DESCRIPTION.AUTH",
      guestOnly: true,
      hideBreadcrumbs: true,
    },
  },
];

const baseRoutes: RouteRecordRaw[] = [
  {
    path: "",
    component: MainLayout,
    children: mainLayoutChildren,
  },
  ...generatorLayoutRoutes,
  ...quizLayoutRoutes,
  ...authLayoutRoutes,
  {
    path: "moderation",
    name: "moderation",
    component: ModerationPage,
    meta: {
      titleKey: "META.MODERATION",
      descriptionKey: "META_DESCRIPTION.MODERATION",
      requiresAuth: true,
      requiresAdmin: true,
      breadcrumbKey: "BREADCRUMBS.MODERATION",
    },
  },
  {
    path: "moderation/users",
    name: "moderation-users",
    component: UserManagementPage,
    meta: {
      titleKey: "MODERATION.USERS_TITLE",
      descriptionKey: "MODERATION.USERS_SUBTITLE",
      requiresAuth: true,
      requiresAdmin: true,
      breadcrumbKey: "BREADCRUMBS.MODERATION_USERS",
    },
  },
  {
    path: "docs",
    component: DocsLayout,
    meta: { breadcrumbKey: "BREADCRUMBS.DOCS" },
    children: [
      {
        path: "",
        name: "docs",
        component: DocsPage,
        meta: {
          titleKey: "META.DOCS",
          descriptionKey: "META_DESCRIPTION.DOCS",
        },
      },
      {
        path: ":topic",
        name: "docs-topic",
        component: DocsTopicPage,
        props: (route) => ({ topic: String(route.params.topic ?? "") }),
        meta: {
          titleKey: "META.DOCS",
          descriptionKey: "META_DESCRIPTION.DOCS",
          breadcrumbKey: "BREADCRUMBS.DOCS_TOPIC",
        },
      },
    ],
  },
];

function localizeChildren(
  children: RouteRecordRaw[] | undefined,
  locale: string,
): RouteRecordRaw[] | undefined {
  return children?.map((child) => {
    const localizedChild: RouteRecordRaw = {
      ...child,
      name: child.name ? `${locale}-${String(child.name)}` : undefined,
    };
    if (child.children) {
      localizedChild.children = localizeChildren(child.children, locale);
    }
    return localizedChild;
  });
}

function applyLocalePrefix(
  locale: string,
  routes: RouteRecordRaw[],
): RouteRecordRaw[] {
  const localizedRoutes = routes.map((route) => {
    const basePath = route.path;
    return {
      ...route,
      path: `/${locale}/${basePath}`.replace(/\/$/, "") || `/${locale}`,
      name: route.name ? `${locale}-${String(route.name)}` : undefined,
      children: localizeChildren(route.children, locale),
    };
  });
  return localizedRoutes as RouteRecordRaw[];
}

export const scrollBehavior: RouterScrollBehavior = (
  _to,
  _from,
  savedPosition,
) => {
  if (savedPosition) {
    return { ...savedPosition, behavior: "smooth" };
  }
  if (_to.path !== _from.path) {
    return { left: 0, top: 0, behavior: "smooth" };
  }
  return false;
};

const localizedRoutes: RouteRecordRaw[] = AVAILABLE_LOCALES.flatMap((locale) =>
  applyLocalePrefix(locale, baseRoutes),
);

const notFoundRoute: RouteRecordRaw = {
  path: "/:pathMatch(.*)*",
  component: MainLayout,
  children: [
    {
      path: "",
      name: "not-found",
      component: NotFoundPage,
      meta: {
        titleKey: "META.NOT_FOUND",
        descriptionKey: "META_DESCRIPTION.NOT_FOUND",
        robots: "noindex, nofollow",
        hideBreadcrumbs: true,
      },
    },
  ],
};

const appRoutes: RouteRecordRaw[] = [...localizedRoutes, notFoundRoute];

export function createRouterInstance(base?: string) {
  const router = createRouter({
    history: createWebHistory(base ?? import.meta.env.BASE_URL),
    routes: appRoutes,
    scrollBehavior,
  });

  router.beforeEach((to, _, next) => {
    const targetLocale = getLocaleFromPath(to.fullPath) as Locale;
    setLocale(targetLocale);
    next();
  });
  setupRouterGuards(router);
  return router;
}

export const routes = appRoutes;
