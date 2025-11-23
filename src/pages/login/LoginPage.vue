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

        <form class="login-form" @submit.prevent="handleSubmit" novalidate>
          <Input
            v-model="formData.email"
            :label="t('AUTH.EMAIL')"
            :error="errors.email ? t(`VALIDATION.${errors.email}`) : ''"
            type="email"
            autocomplete="email"
            @input="clearFieldError('email')"
          />

        <Input
          v-model="formData.password"
          :label="t('AUTH.PASSWORD')"
          :error="errors.password ? t(`VALIDATION.${errors.password}`) : ''"
          type="password"
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
import { ref, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/entities'
import { StarfieldAnimation } from '@/shared/ui/StarfieldAnimation'
import { Input } from '@/shared/ui'
import ThemeSwitcher from '@/shared/ui/theme-switcher/ThemeSwitcher.vue'
import LanguageSwitcher from '@/features/common/language-switcher/ui/language-switcher/LanguageSwitcher.vue'
import { loginSchema, type LoginFormData } from '@/shared/lib/validation/auth'
import { authAPI } from '@/shared/api/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { t, locale } = useI18n()

const formData = reactive<LoginFormData>({
  email: '',
  password: ''
})

const errors = reactive<Partial<Record<keyof LoginFormData, string>>>({})
const isSubmitting = ref(false)
const serverError = ref('')

function clearFieldError(field: keyof LoginFormData) {
  errors[field] = undefined
  serverError.value = ''
}

async function handleSubmit() {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof LoginFormData] = undefined
  })
  serverError.value = ''

  const result = loginSchema.safeParse(formData)

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof LoginFormData
      errors[field] = issue.message
    })
    return
  }

  isSubmitting.value = true

  try {
    const response = await authAPI.login(formData)
    authStore.setToken(response.token)
    authStore.setUser(response.user)
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
</script>

<style lang="scss" scoped src="./login-page.scss"></style>
