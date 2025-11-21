<template>
  <div class="register-page">
    <StarfieldAnimation />

    <div class="register-page__content">
      <div class="register-page__form-container">
        <div class="register-page__header">
          <h1 class="register-page__title">{{ t('AUTH.REGISTER_TITLE') }}</h1>
          <p class="register-page__subtitle">{{ t('AUTH.REGISTER_SUBTITLE') }}</p>
        </div>

        <form class="register-form" @submit.prevent="handleSubmit" novalidate>
          <div class="register-form__field">
            <label class="register-form__label" for="email">
              {{ t('AUTH.EMAIL') }}
            </label>
            <input
              id="email"
              v-model="formData.email"
              type="email"
              class="register-form__input"
              :class="{ 'register-form__input_error': errors.email }"
              autocomplete="email"
              @input="clearFieldError('email')"
            />
            <span v-if="errors.email" class="register-form__error">
              {{ t(`VALIDATION.${errors.email}`) }}
            </span>
          </div>

          <div class="register-form__field">
            <label class="register-form__label" for="password">
              {{ t('AUTH.PASSWORD') }}
            </label>
            <input
              id="password"
              v-model="formData.password"
              type="password"
              class="register-form__input"
              :class="{ 'register-form__input_error': errors.password }"
              autocomplete="new-password"
              @input="clearFieldError('password')"
            />
            <span v-if="errors.password" class="register-form__error">
              {{ t(`VALIDATION.${errors.password}`) }}
            </span>
          </div>

          <div class="register-form__field">
            <label class="register-form__label" for="name">
              {{ t('AUTH.NAME') }}
            </label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              class="register-form__input"
              :class="{ 'register-form__input_error': errors.name }"
              autocomplete="name"
              @input="clearFieldError('name')"
            />
            <span v-if="errors.name" class="register-form__error">
              {{ t(`VALIDATION.${errors.name}`) }}
            </span>
          </div>

          <button
            type="submit"
            class="register-form__submit"
            :disabled="isSubmitting"
            :class="{ 'register-form__submit_loading': isSubmitting }"
          >
            {{ isSubmitting ? t('AUTH.CREATING_ACCOUNT') : t('AUTH.REGISTER_BUTTON') }}
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/entities'
import { StarfieldAnimation } from '@/shared/ui/StarfieldAnimation'
import { registerSchema, type RegisterFormData } from '@/shared/lib/validation/auth'
import { authAPI } from '@/shared/api/auth'

const router = useRouter()
const { t, locale } = useI18n()
const authStore = useAuthStore()

const formData = reactive<RegisterFormData>({
  email: '',
  password: '',
  name: ''
})

const errors = reactive<Partial<Record<keyof RegisterFormData, string>>>({})
const isSubmitting = ref(false)
const serverError = ref('')

function clearFieldError(field: keyof RegisterFormData) {
  errors[field] = undefined
  serverError.value = ''
}

async function handleSubmit() {
  Object.keys(errors).forEach((key) => {
    errors[key as keyof RegisterFormData] = undefined
  })
  serverError.value = ''

  const result = registerSchema.safeParse(formData)

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof RegisterFormData
      errors[field] = issue.message
    })
    return
  }

  isSubmitting.value = true

  try {
    const response = await authAPI.register(formData)
    authStore.setToken(response.token)
    authStore.setUser(response.user)
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
