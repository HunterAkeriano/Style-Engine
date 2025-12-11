<template>
  <div class="app">
    <RouterView />
    <CookieConsent />
    <ContactWidget />
    <Sprite />
  </div>
</template>

<script setup lang="ts">
import { provide, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { useHead } from "@unhead/vue";
import { Sprite } from "@/shared/ui";
import { useTheme, useViewportHeight } from "@/shared/composables";
import { useForumNotifications } from "@/shared/lib/useForumNotifications";
import { useAuthStore } from "@/entities";
import CookieConsent from "@/widgets/common/cookie-consent/CookieConsent.vue";
import ContactWidget from "@/widgets/common/contact-widget/ContactWidget.vue";
import { AVAILABLE_LOCALES } from "@/shared/config/locales";

const route = useRoute();
const { t, locale } = useI18n();
const authStore = useAuthStore();

useTheme();
useViewportHeight();

const { checkAndConnect } = useForumNotifications();

provide("checkForumNotifications", checkAndConnect);

watch(
  () => authStore.isAuthenticated,
  () => {
    checkAndConnect();
  },
);

const DEFAULT_ROBOTS = "noindex, nofollow";
const defaultSiteUrl =
  import.meta.env.VITE_APP_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "https://qa.css-zone.com";

function buildUrl(origin: string, relativePath: string) {
  const trimmedOrigin = origin.replace(/\/$/, "");
  const normalizedPath = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return `${trimmedOrigin}${normalizedPath}`;
}

const manifestByLocale: Record<string, string> = {
  uk: "/site.uk.webmanifest",
  en: "/site.en.webmanifest",
};

useHead(() => {
  const titleKey = route.meta.titleKey as string | undefined;
  const descriptionKey = route.meta.descriptionKey as string | undefined;

  const title =
    (titleKey && t(titleKey)) ||
    (route.meta.title as string | undefined) ||
    t("TITLE");
  const description =
    (descriptionKey && t(descriptionKey)) ||
    (route.meta.description as string | undefined) ||
    t("META_DESCRIPTION.SITE") ||
    "CSS-Zone — a creative lab for gradients, shadows, and animations.";
  const robots = (route.meta.robots as string | undefined) || DEFAULT_ROBOTS;

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : defaultSiteUrl.replace(/\/$/, "");

  const pathWithoutLocale = route.fullPath.replace(
    new RegExp(`^/(${AVAILABLE_LOCALES.join("|")})`),
    "",
  );
  const normalizedPath = pathWithoutLocale || "/";
  const canonicalUrl = buildUrl(origin, route.fullPath);
  const shareImage = buildUrl(origin, "/logo.png");
  const siteName = t("TITLE");

  const meta = [
    { name: "description", content: description },
    { name: "robots", content: robots },
    {
      name: "keywords",
      content: "CSS gradients, CSS shadows, CSS animations, design tools, generators",
    },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: canonicalUrl },
    { property: "og:site_name", content: siteName },
    { property: "og:locale", content: locale.value },
    { property: "og:image", content: shareImage },
    { property: "og:image:secure_url", content: shareImage },
    { property: "og:image:alt", content: "CSS-Zone logo" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: shareImage },
    { name: "theme-color", content: "#111827" },
  ];

  const altLinks: { rel: string; hreflang: string; href: string }[] =
    AVAILABLE_LOCALES.map((lng) => ({
      rel: "alternate",
      hreflang: lng,
    href: buildUrl(
      origin,
      `/${lng}${normalizedPath === "/" ? "" : normalizedPath}`,
    ),
  }));
  altLinks.push({
    rel: "alternate",
    hreflang: "x-default",
    href: buildUrl(
      origin,
      `/en${normalizedPath === "/" ? "" : normalizedPath}`,
    ),
  });

  const manifestHref =
    manifestByLocale[locale.value] || manifestByLocale.en;

  const link = [
    { rel: "canonical", href: canonicalUrl },
    { rel: "manifest", href: manifestHref },
    { rel: "icon", href: "/logo.png", type: "image/png", sizes: "32x32" },
    { rel: "icon", href: "/logo.png", type: "image/png", sizes: "16x16" },
    { rel: "apple-touch-icon", href: "/logo.png", sizes: "180x180" },
    ...altLinks,
  ];

  return {
    title,
    meta,
    link,
    htmlAttrs: { lang: locale.value },
  };
});
</script>

<style lang="scss" src="./app.scss"></style>
