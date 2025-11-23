<template>
  <div class="auth-shell">
    <StarfieldAnimation />
    <div class="auth-shell__card">
      <div class="auth-shell__controls">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>

      <div class="auth-shell__header">
        <p class="auth-shell__eyebrow">{{ t('AUTH.RESET_TITLE') }}</p>
        <h1 class="auth-shell__title">{{ t('AUTH.RESET_TITLE') }}</h1>
        <p class="auth-shell__subtitle">{{ t('AUTH.RESET_SUBTITLE') }}</p>
      </div>

      <form class="auth-shell__form" @submit.prevent="submit" novalidate>
        <Input
          v-model="form.password"
          :label="t('AUTH.NEW_PASSWORD')"
          :error="errors.password ? t(`VALIDATION.${errors.password}`) : ''"
          type="password"
          autocomplete="new-password"
          @input="errors.password = ''"
        />
        <Input
          v-model="form.confirmPassword"
          :label="t('AUTH.CONFIRM_PASSWORD')"
          :error="errors.confirmPassword ? t(`VALIDATION.${errors.confirmPassword}`) : ''"
          type="password"
          autocomplete="new-password"
          @input="errors.confirmPassword = ''"
        />

        <button :disabled="loading" type="submit" class="auth-shell__submit">
          <span>{{ loading ? t('AUTH.SIGNING_IN') : t('AUTH.SET_NEW_PASSWORD') }}</span>
        </button>

        <p v-if="serverMessage" class="auth-shell__success">{{ serverMessage }}</p>
        <p v-if="serverError" class="auth-shell__error">{{ serverError }}</p>
      </form>

      <div class="auth-shell__footer">
        <RouterLink :to="`/${locale}/login`" class="auth-shell__link">
          {{ t('AUTH.SIGN_IN') }}
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { authAPI } from '@/shared/api/auth'
import { resetPasswordSchema, type ResetPasswordForm } from '@/shared/lib/validation/auth'
import { Input } from '@/shared/ui'
import { StarfieldAnimation } from '@/shared/ui/StarfieldAnimation'
import ThemeSwitcher from '@/shared/ui/theme-switcher/ThemeSwitcher.vue'
import LanguageSwitcher from '@/features/common/language-switcher/ui/language-switcher/LanguageSwitcher.vue'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const form = reactive<ResetPasswordForm>({
  password: '',
  confirmPassword: ''
})

const errors = reactive<{ password?: string; confirmPassword?: string }>({})
const loading = ref(false)
const serverMessage = ref('')
const serverError = ref('')

const token = (route.query.token as string) || ''

async function submit() {
  errors.password = ''
  errors.confirmPassword = ''
  serverMessage.value = ''
  serverError.value = ''

  if (!token) {
    serverError.value = t('VALIDATION.SERVER_ERROR')
    return
  }

  const result = resetPasswordSchema.safeParse(form)
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof ResetPasswordForm
      errors[field] = issue.message
    })
    return
  }

  loading.value = true
  try {
    await authAPI.resetPassword({ token, password: form.password })
    serverMessage.value = t('AUTH.RESET_SUCCESS')
    setTimeout(() => {
      router.push(`/${locale.value}/login`)
    }, 800)
  } catch (err: any) {
    serverError.value = err?.message || t('VALIDATION.SERVER_ERROR')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss" src="../auth/auth-shell.scss"></style>
