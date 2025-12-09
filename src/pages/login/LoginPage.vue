<template>
  <div class="login-page">
    <StarfieldAnimation />

    <div class="login-page__content">
      <div class="login-page__form-container">
        <div class="login-page__controls">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>

        <div class="login-page__header">
          <h1 class="login-page__title">{{ t('AUTH.LOGIN_TITLE') }}</h1>
          <p class="login-page__subtitle">{{ t('AUTH.LOGIN_SUBTITLE') }}</p>
        </div>

        <div class="login-page__google">
          <GoogleSignInButton
            @success="handleGoogleSuccess"
            @error="handleGoogleError"
            :button-configs="{ theme: 'outline', size: 'large', width: 400, text: 'signin_with' }"
          />
        </div>

        <div class="login-page__divider">
          <span>{{ t('AUTH.OR') }}</span>
        </div>

        <form class="login-form" @submit.prevent="handleSubmit" novalidate>
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
          autocomplete="current-password"
          @input="clearFieldError('password')"
        />

        <div class="login-form__forgot">
          <RouterLink :to="`/${locale}/forgot-password`" class="login-page__link">
            {{ t('AUTH.FORGOT_PASSWORD') }}
          </RouterLink>
        </div>

        <button
          :disabled="isSubmitting"
          :class="{ 'login-form__submit_loading': isSubmitting }"
          type="submit"
          class="login-form__submit"
          >
            <span>{{ isSubmitting ? t('AUTH.SIGNING_IN') : t('AUTH.LOGIN_BUTTON') }}</span>
          </button>

          <div v-if="serverError" class="login-form__server-error">
            {{ serverError }}
          </div>
        </form>

        <div class="login-page__footer">
          <p class="login-page__footer-text">
            {{ t('AUTH.NO_ACCOUNT') }}
            <RouterLink :to="`/${locale}/register`" class="login-page__link">
              {{ t('AUTH.SIGN_UP') }}
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { GoogleSignInButton, type CredentialResponse } from 'vue3-google-signin'
import { useAuthStore } from '@/entities'
import { StarfieldAnimation } from '@/shared/ui/StarfieldAnimation'
import { Input } from '@/shared/ui'
import ThemeSwitcher from '@/shared/ui/theme-switcher/ThemeSwitcher.vue'
import LanguageSwitcher from '@/features/common/language-switcher/ui/language-switcher/LanguageSwitcher.vue'
import { loginSchema, type LoginFormData } from '@/shared/lib/validation/auth'
import { useZodForm } from '@/shared/lib/form/zodForm'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { t, locale } = useI18n()

const form = useZodForm(loginSchema, {
  email: '',
  password: ''
})
const emailModel = computed({
  get: () => form.values.email as string,
  set: (val: string) => form.setValue('email', val)
})
const passwordModel = computed({
  get: () => form.values.password as string,
  set: (val: string) => form.setValue('password', val)
})
const errors = form.errors
const isSubmitting = ref(false)
const serverError = ref('')

function clearFieldError(field: keyof LoginFormData) {
  errors[field] = ''
  serverError.value = ''
}

async function handleSubmit() {
  errors.email = ''
  errors.password = ''
  serverError.value = ''

  const result = form.validateAll()
  if (!result) return

  isSubmitting.value = true

  try {
    await authStore.login(result.email, result.password)

    if (authStore.error) {
      serverError.value =
        authStore.error === 'Invalid credentials'
          ? t('VALIDATION.INVALID_CREDENTIALS')
          : authStore.error
      return
    }

    const redirectPath =
      typeof route.query.redirect === 'string' ? route.query.redirect : `/${locale.value}/profile`
    router.push(redirectPath)
  } catch (error: any) {
    if (Array.isArray(error?.issues) && error.issues.length) {
      error.issues.forEach((issue: any) => {
        const field = issue.path?.[0] as keyof LoginFormData
        if (field) {
          errors[field] = issue.message
        }
      })
      return
    }

    if (error?.message === 'Invalid credentials') {
      serverError.value = t('VALIDATION.INVALID_CREDENTIALS')
    } else {
      serverError.value = t('VALIDATION.SERVER_ERROR')
    }
  } finally {
    isSubmitting.value = false
  }
}

async function handleGoogleSuccess(response: CredentialResponse) {
  if (!response.credential) {
    serverError.value = t('VALIDATION.SERVER_ERROR')
    return
  }

  isSubmitting.value = true
  serverError.value = ''

  try {
    await authStore.googleAuth(response.credential)

    if (authStore.error) {
      serverError.value = authStore.error
      return
    }

    const redirectPath =
      typeof route.query.redirect === 'string' ? route.query.redirect : `/${locale.value}/profile`
    router.push(redirectPath)
  } catch {
    serverError.value = t('VALIDATION.SERVER_ERROR')
  } finally {
    isSubmitting.value = false
  }
}

function handleGoogleError() {
  serverError.value = t('VALIDATION.SERVER_ERROR')
}
</script>

<style lang="scss" scoped src="./login-page.scss"></style>
