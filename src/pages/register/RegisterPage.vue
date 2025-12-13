<template>
  <div class="register-page">
    <StarfieldAnimation />

    <div class="register-page__content">
      <div class="register-page__form-container">
        <div class="register-page__controls">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>

        <div class="register-page__header">
          <h1 class="register-page__title">{{ t("AUTH.REGISTER_TITLE") }}</h1>
          <p class="register-page__subtitle">
            {{ t("AUTH.REGISTER_SUBTITLE") }}
          </p>
        </div>

        <form class="register-form" @submit.prevent="handleSubmit" novalidate>
          <Input
            name="email"
            v-model="emailModel"
            :label="t('AUTH.EMAIL')"
            :error="errors.email ? t(`VALIDATION.${errors.email}`) : ''"
            type="email"
            autocomplete="email"
            @input="clearFieldError('email')"
          />

          <Input
            name="password"
            v-model="passwordModel"
            :label="t('AUTH.PASSWORD')"
            :error="errors.password ? t(`VALIDATION.${errors.password}`) : ''"
            type="password"
            show-password-toggle
            autocomplete="new-password"
            @input="clearFieldError('password')"
          />

          <Input
            name="name"
            v-model="nameModel"
            :label="t('AUTH.NAME')"
            :error="errors.name ? t(`VALIDATION.${errors.name}`) : ''"
            type="text"
            autocomplete="name"
            @input="clearFieldError('name')"
          />

          <button
            :disabled="isSubmitting"
            :class="{ 'register-form__submit_loading': isSubmitting }"
            type="submit"
            class="register-form__submit"
          >
            <span>{{
              isSubmitting
                ? t("AUTH.CREATING_ACCOUNT")
                : t("AUTH.REGISTER_BUTTON")
            }}</span>
          </button>

          <div v-if="serverError" class="register-form__server-error">
            {{ serverError }}
          </div>
        </form>

        <div class="register-page__oauth">
          <div class="register-page__divider">
            <span>{{ t("AUTH.OR_CONTINUE") }}</span>
          </div>

          <div
            ref="googleButtonRef"
            class="register-page__google-hidden"
            aria-hidden="true"
          ></div>

          <div class="register-page__oauth-buttons">
            <Button
              class="register-page__oauth-button"
              variant="outline"
              size="md"
              :disabled="isSubmitting || !isGoogleReady"
              @click="handleGoogleClick"
            >
              <template #icon>
                <Icon
                  name="icon-google"
                  class-name="register-page__oauth-icon"
                  size="18"
                />
              </template>
              {{ t("AUTH.SIGN_UP_WITH_GOOGLE") }}
            </Button>

            <Button
              class="register-page__oauth-button register-page__oauth-button_dark"
              variant="outline"
              size="md"
              :disabled="isSubmitting || !isGithubReady"
              @click="handleGithubClick"
            >
              <template #icon>
                <Icon
                  name="icon-github"
                  class-name="register-page__oauth-icon"
                  size="18"
                />
              </template>
              {{ t("AUTH.SIGN_UP_WITH_GITHUB") }}
            </Button>
          </div>
        </div>

        <div class="register-page__footer">
          <p class="register-page__footer-text">
            {{ t("AUTH.HAS_ACCOUNT") }}
            <RouterLink :to="`/${locale}/login`" class="register-page__link">
              {{ t("AUTH.SIGN_IN") }}
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useGsiScript, type CredentialResponse } from "vue3-google-signin";
import { useAuthStore } from "@/entities";
import { Button, Icon, Input } from "@/shared/ui";
import { StarfieldAnimation } from "@/shared/ui/StarfieldAnimation";
import ThemeSwitcher from "@/shared/ui/theme-switcher/ThemeSwitcher.vue";
import LanguageSwitcher from "@/features/common/language-switcher/ui/language-switcher/LanguageSwitcher.vue";
import {
  registerSchema,
  type RegisterFormData,
} from "@/shared/lib/validation/auth";
import { useZodForm } from "@/shared/lib/form/zodForm";
import { useRecaptchaToken } from "@/shared/lib/recaptcha";

const router = useRouter();
const { t, locale } = useI18n();
const authStore = useAuthStore();

const form = useZodForm(registerSchema, {
  email: "",
  password: "",
  name: "",
});
const { getRecaptchaToken: getRegisterRecaptchaToken } =
  useRecaptchaToken("register");
const emailModel = computed({
  get: () => form.values.email as string,
  set: (val: string) => form.setValue("email", val),
});
const passwordModel = computed({
  get: () => form.values.password as string,
  set: (val: string) => form.setValue("password", val),
});
const nameModel = computed({
  get: () => (form.values.name as string) || "",
  set: (val: string) => form.setValue("name", val),
});
const errors = form.errors;
const isSubmitting = ref(false);
const serverError = ref("");

const { scriptLoaded: isGsiScriptLoaded } = useGsiScript();
const isGoogleReady = ref(false);
const googleButtonRef = ref<HTMLElement | null>(null);
let renderedGoogleBtn: HTMLElement | null = null;
let googleInitialized = false;

const githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
const isGithubReady = computed(() => Boolean(githubClientId));
const githubRedirectUri = computed(() => {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : import.meta.env.VITE_APP_URL || "";
  const path = router.currentRoute.value.path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const withProvider = normalized.includes("?")
    ? `${normalized}&provider=github`
    : `${normalized}?provider=github`;
  return `${origin}${withProvider}`;
});
const githubRedirectPath = computed(() => `/${locale.value}/profile`);

function clearFieldError(field: keyof RegisterFormData) {
  errors[field] = "";
  serverError.value = "";
}

async function handleSubmit() {
  errors.email = "";
  errors.password = "";
  errors.name = "";
  serverError.value = "";

  const result = form.validateAll();
  if (!result) return;

  isSubmitting.value = true;

  try {
    const recaptchaToken = await getRegisterRecaptchaToken();
    await authStore.register(
      result.email,
      result.password,
      result.name || "",
      recaptchaToken || undefined,
    );
    if (authStore.error) {
      serverError.value = authStore.error;
      return;
    }
    router.push(`/${locale.value}/profile`);
  } catch (error: any) {
    if (Array.isArray(error?.issues) && error.issues.length) {
      error.issues.forEach((issue: any) => {
        const field = issue.path?.[0] as keyof RegisterFormData;
        if (field) {
          errors[field] = issue.message;
        }
      });
      return;
    }

    if (error?.message === "User already exists") {
      serverError.value = t("VALIDATION.USER_EXISTS");
    } else {
      serverError.value = t("VALIDATION.SERVER_ERROR");
    }
  } finally {
    isSubmitting.value = false;
  }
}

function handleGoogleClick() {
  serverError.value = "";
  if (!isGoogleReady.value) return;

  if (!isGoogleReady.value || !renderedGoogleBtn) {
    serverError.value = t("VALIDATION.GOOGLE_DISABLED");
    return;
  }

  renderedGoogleBtn.click();
}

async function handleGoogleSuccess(response: CredentialResponse) {
  if (!response.credential) {
    serverError.value = t("VALIDATION.SERVER_ERROR");
    return;
  }

  isSubmitting.value = true;
  serverError.value = "";

  try {
    await authStore.googleAuth(response.credential);

    if (authStore.error) {
      serverError.value = authStore.error;
      return;
    }

    router.push(`/${locale.value}/profile`);
  } catch {
    serverError.value = t("VALIDATION.SERVER_ERROR");
  } finally {
    isSubmitting.value = false;
  }
}

function handleGoogleError() {
  serverError.value = t("VALIDATION.SERVER_ERROR");
}

function handleGithubClick() {
  serverError.value = "";
  if (!isGithubReady.value) {
    serverError.value = t("VALIDATION.GITHUB_DISABLED");
    return;
  }
  const authorizeUrl = new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.searchParams.set("client_id", githubClientId);
  authorizeUrl.searchParams.set("scope", "user:email");
  authorizeUrl.searchParams.set("allow_signup", "true");
  authorizeUrl.searchParams.set("redirect_uri", githubRedirectUri.value);
  authorizeUrl.searchParams.set("state", githubRedirectPath.value);
  window.location.href = authorizeUrl.toString();
}

async function handleGithubCallback() {
  if (router.currentRoute.value.query.provider !== "github") return;
  const code = router.currentRoute.value.query.code;
  if (typeof code !== "string" || !code) return;

  isSubmitting.value = true;
  serverError.value = "";

  try {
    await authStore.githubAuth(code, githubRedirectUri.value);

    if (authStore.error) {
      serverError.value = authStore.error;
      return;
    }

    const { code: _code, provider: _provider, state: _state, ...rest } =
      router.currentRoute.value.query;
    await router.replace({ path: router.currentRoute.value.path, query: rest });
    router.push(githubRedirectPath.value);
  } catch {
    serverError.value = t("VALIDATION.SERVER_ERROR");
  } finally {
    isSubmitting.value = false;
  }
}

watch(
  () => isGsiScriptLoaded.value,
  (loaded) => {
    if (!loaded) return;
    setupGoogleButton();
  },
  { immediate: true },
);

watch(
  () => googleButtonRef.value,
  () => {
    if (!isGsiScriptLoaded.value) return;
    setupGoogleButton();
  },
  { immediate: true },
);

watch(
  () => router.currentRoute.value.query,
  () => {
    handleGithubCallback();
  },
  { immediate: true, deep: true },
);

function setupGoogleButton() {
  const google = (window as any)?.google;
  const target = googleButtonRef.value;
  if (!google?.accounts?.id || !target) return;

  if (!googleInitialized) {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: (response: CredentialResponse) => {
        if (!response.credential) {
          handleGoogleError();
          return;
        }
        handleGoogleSuccess(response);
      },
      ux_mode: "popup",
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: false,
    });
    googleInitialized = true;
  }

  google.accounts.id.renderButton(target, {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "signup_with",
    shape: "rectangular",
    logo_alignment: "left",
  });

  renderedGoogleBtn = target.querySelector("div[role=button]");
  isGoogleReady.value = Boolean(renderedGoogleBtn);
}
</script>

<style lang="scss" scoped src="./register-page.scss"></style>
