<template>
  <form class="profile-form profile-form_password" @submit.prevent="handleSubmit">
    <div class="profile-form__header">
      <div>
        <h3 class="profile-form__title">{{ t('PROFILE.PASSWORD_SECTION_TITLE') }}</h3>
        <p class="profile-form__subtitle">{{ t('PROFILE.PASSWORD_SECTION_SUBTITLE') }}</p>
      </div>
    </div>

    <div class="profile-form__field">
      <Input
        name="currentPassword"
        v-model="currentPasswordModel"
        :disabled="isChanging"
        type="password"
        :label="t('AUTH.CURRENT_PASSWORD')"
        :error="errors.currentPassword ? t(`VALIDATION.${errors.currentPassword}`) : ''"
        :show-password-toggle="true"
        @input="handleInput"
      />
    </div>

    <div class="profile-form__field">
      <Input
        name="newPassword"
        v-model="newPasswordModel"
        :disabled="isChanging"
        type="password"
        :label="t('AUTH.NEW_PASSWORD')"
        :error="errors.newPassword ? t(`VALIDATION.${errors.newPassword}`) : ''"
        :show-password-toggle="true"
        @input="handleInput"
      />
    </div>

    <div class="profile-form__field">
      <Input
        name="confirmPassword"
        v-model="confirmPasswordModel"
        :disabled="isChanging"
        type="password"
        :label="t('AUTH.CONFIRM_PASSWORD')"
        :error="errors.confirmPassword ? t(`VALIDATION.${errors.confirmPassword}`) : ''"
        :show-password-toggle="true"
        @input="handleInput"
      />
    </div>

    <Button
      :disabled="isChanging"
      type="submit"
      class="profile-form__submit"
    >
      {{ isChanging ? t('PROFILE.SAVING') : t('AUTH.CHANGE_PASSWORD_BUTTON') }}
    </Button>

    <p v-if="success" class="profile-form__success">{{ t('PROFILE.CHANGE_PASSWORD_SUCCESS') }}</p>
    <p v-if="serverError" class="profile-form__error">{{ serverError }}</p>
  </form>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button, Input } from '@/shared/ui'
import type { ChangePasswordForm } from '@/shared/lib/validation/auth'
import { useZodForm } from '@/shared/lib/form/zodForm'
import { changePasswordSchema } from '@/shared/lib/validation/auth'

interface Props {
  isChanging: boolean
  success: boolean
  serverError: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'submit', value: ChangePasswordForm): void
  (e: 'clear-server-error'): void
}>()

const { t } = useI18n()
const form = useZodForm(changePasswordSchema, {
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const errors = form.errors

const currentPasswordModel = computed({
  get: () => form.values.currentPassword as string,
  set: (val: string) => form.setValue('currentPassword', val)
})
const newPasswordModel = computed({
  get: () => form.values.newPassword as string,
  set: (val: string) => form.setValue('newPassword', val)
})
const confirmPasswordModel = computed({
  get: () => form.values.confirmPassword as string,
  set: (val: string) => form.setValue('confirmPassword', val)
})

function handleSubmit() {
  const result = form.validateAll() as ChangePasswordForm | null
  if (!result) return
  emit('submit', result)
}

function handleInput() {
  emit('clear-server-error')
}

watch(
  () => props.success,
  (value) => {
    if (value) {
      form.setValue('currentPassword', '')
      form.setValue('newPassword', '')
      form.setValue('confirmPassword', '')
      Object.keys(errors).forEach((key) => {
        errors[key] = ''
      })
    }
  }
)
</script>

<style scoped lang="scss" src="./profile-form.scss"></style>
