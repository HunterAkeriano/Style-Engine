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
          v-model="form.email"
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
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/shared/lib/toast'
import { authAPI } from '@/shared/api/auth'
import { forgotPasswordSchema, type ForgotPasswordForm } from '@/shared/lib/validation/auth'
import { Input } from '@/shared/ui'
import { StarfieldAnimation } from '@/shared/ui/StarfieldAnimation'
import ThemeSwitcher from '@/shared/ui/theme-switcher/ThemeSwitcher.vue'
import LanguageSwitcher from '@/features/common/language-switcher/ui/language-switcher/LanguageSwitcher.vue'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const form = reactive<ForgotPasswordForm>({ email: '' })
const errors = reactive<{ email?: string }>({})
const loading = ref(false)
const serverMessage = ref('')
const serverError = ref('')

const prefillEmail = typeof route.query.email === 'string' ? route.query.email : ''
if (prefillEmail) form.email = prefillEmail

async function submit() {
  errors.email = ''
  serverMessage.value = ''
  serverError.value = ''

  const result = forgotPasswordSchema.safeParse(form)
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      errors[issue.path[0] as 'email'] = issue.message
    })
    return
  }

  loading.value = true
  try {
    await authAPI.requestPasswordReset(form.email)
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
