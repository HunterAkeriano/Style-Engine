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
          <h1 class="register-page__title">{{ t('AUTH.REGISTER_TITLE') }}</h1>
          <p class="register-page__subtitle">{{ t('AUTH.REGISTER_SUBTITLE') }}</p>
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
            <span>{{ isSubmitting ? t('AUTH.CREATING_ACCOUNT') : t('AUTH.REGISTER_BUTTON') }}</span>
          </button>

          <div v-if="serverError" class="register-form__server-error">
            {{ serverError }}
          </div>
        </form>

        <div class="register-page__footer">
          <p class="register-page__footer-text">
            {{ t('AUTH.HAS_ACCOUNT') }}
            <RouterLink :to="`/${locale}/login`" class="register-page__link">
              {{ t('AUTH.SIGN_IN') }}
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/entities'
import { StarfieldAnimation } from '@/shared/ui/StarfieldAnimation'
import { Input } from '@/shared/ui'
import ThemeSwitcher from '@/shared/ui/theme-switcher/ThemeSwitcher.vue'
import LanguageSwitcher from '@/features/common/language-switcher/ui/language-switcher/LanguageSwitcher.vue'
import { registerSchema, type RegisterFormData } from '@/shared/lib/validation/auth'
import { useZodForm } from '@/shared/lib/form/zodForm'

const router = useRouter()
const { t, locale } = useI18n()
const authStore = useAuthStore()

const form = useZodForm(registerSchema, {
  email: '',
  password: '',
  name: ''
})
const emailModel = computed({
  get: () => form.values.email as string,
  set: (val: string) => form.setValue('email', val)
})
const passwordModel = computed({
  get: () => form.values.password as string,
  set: (val: string) => form.setValue('password', val)
})
const nameModel = computed({
  get: () => (form.values.name as string) || '',
  set: (val: string) => form.setValue('name', val)
})
const errors = form.errors
const isSubmitting = ref(false)
const serverError = ref('')

function clearFieldError(field: keyof RegisterFormData) {
  errors[field] = ''
  serverError.value = ''
}

async function handleSubmit() {
  errors.email = ''
  errors.password = ''
  errors.name = ''
  serverError.value = ''

  const result = form.validateAll()
  if (!result) return

  isSubmitting.value = true

  try {
    await authStore.register(result.email, result.password, result.name || '')
    if (authStore.error) {
      serverError.value = authStore.error
      return
    }
    router.push(`/${locale.value}/profile`)
  } catch (error: any) {
    if (Array.isArray(error?.issues) && error.issues.length) {
      error.issues.forEach((issue: any) => {
        const field = issue.path?.[0] as keyof RegisterFormData
        if (field) {
          errors[field] = issue.message
        }
      })
      return
    }

    if (error?.message === 'User already exists') {
      serverError.value = t('VALIDATION.USER_EXISTS')
    } else {
      serverError.value = t('VALIDATION.SERVER_ERROR')
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="scss" scoped src="./register-page.scss"></style>
