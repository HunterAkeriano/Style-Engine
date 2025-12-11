<template>
  <div class="auth-shell">
    <StarfieldAnimation />
    <div class="auth-shell__card">
      <div class="auth-shell__controls">
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>

      <div class="auth-shell__header">
        <p class="auth-shell__eyebrow">{{ t('AUTH.FORGOT_PASSWORD') }}</p>
        <h1 class="auth-shell__title">{{ t('AUTH.FORGOT_TITLE') }}</h1>
        <p class="auth-shell__subtitle">{{ t('AUTH.FORGOT_SUBTITLE') }}</p>
      </div>

      <form class="auth-shell__form" @submit.prevent="submit" novalidate>
        <Input
          name="email"
          v-model="emailModel"
          :label="t('AUTH.EMAIL')"
          :error="errors.email ? t(`VALIDATION.${errors.email}`) : ''"
          type="email"
          autocomplete="email"
          @input="errors.email = ''"
        />

        <button :disabled="loading" type="submit" class="auth-shell__submit">
          <span>{{ loading ? t('AUTH.SIGNING_IN') : t('AUTH.SEND_RESET') }}</span>
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/shared/lib/toast'
import { authAPI } from '@/shared/api/auth'
import { forgotPasswordSchema } from '@/shared/lib/validation/auth'
import { Input } from '@/shared/ui'
import { StarfieldAnimation } from '@/shared/ui/StarfieldAnimation'
import ThemeSwitcher from '@/shared/ui/theme-switcher/ThemeSwitcher.vue'
import LanguageSwitcher from '@/features/common/language-switcher/ui/language-switcher/LanguageSwitcher.vue'
import { useZodForm } from '@/shared/lib/form/zodForm'
import { useRecaptchaToken } from '@/shared/lib/recaptcha'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const { getRecaptchaToken: getForgotRecaptchaToken } = useRecaptchaToken('forgot_password')
const form = useZodForm(forgotPasswordSchema, { email: '' })
const emailModel = computed({
  get: () => form.values.email as string,
  set: (val: string) => form.setValue('email', val)
})
const errors = form.errors
const loading = ref(false)
const serverMessage = ref('')
const serverError = ref('')

const prefillEmail = typeof route.query.email === 'string' ? route.query.email : ''
if (prefillEmail) form.setValue('email', prefillEmail)

async function submit() {
  errors.email = ''
  serverMessage.value = ''
  serverError.value = ''

  const result = form.validateAll()
  if (!result) return

  loading.value = true
  try {
    const recaptchaToken = await getForgotRecaptchaToken()
    await authAPI.requestPasswordReset(result.email, recaptchaToken || undefined)
    serverMessage.value = t('AUTH.RESET_EMAIL_SENT')
    toast.success(serverMessage.value)
    setTimeout(() => {
      router.push(`/${locale.value}/login`)
    }, 300)
  } catch (err: any) {
    if (err?.message === 'Email not found') {
      serverError.value = t('AUTH.EMAIL_NOT_FOUND')
      toast.error(serverError.value)
    } else {
      serverError.value = err?.message || t('VALIDATION.SERVER_ERROR')
      toast.error(serverError.value)
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss" src="../auth/auth-shell.scss"></style>
