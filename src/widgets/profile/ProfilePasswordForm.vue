<template>
  <form class="profile-form profile-form_password" @submit.prevent="$emit('submit')">
    <div class="profile-form__header">
      <div>
        <h3 class="profile-form__title">{{ t('PROFILE.PASSWORD_SECTION_TITLE') }}</h3>
        <p class="profile-form__subtitle">{{ t('PROFILE.PASSWORD_SECTION_SUBTITLE') }}</p>
      </div>
    </div>

    <div class="profile-form__field">
      <Input
        :model-value="currentPassword"
        :disabled="isChanging"
        type="password"
        :label="t('AUTH.CURRENT_PASSWORD')"
        :error="errors.currentPassword ? t(`VALIDATION.${errors.currentPassword}`) : ''"
        :show-password-toggle="true"
        @update:modelValue="onUpdate('currentPassword', $event as string)"
      />
    </div>

    <div class="profile-form__field">
      <Input
        :model-value="newPassword"
        :disabled="isChanging"
        type="password"
        :label="t('AUTH.NEW_PASSWORD')"
        :error="errors.newPassword ? t(`VALIDATION.${errors.newPassword}`) : ''"
        :show-password-toggle="true"
        @update:modelValue="onUpdate('newPassword', $event as string)"
      />
    </div>

    <div class="profile-form__field">
      <Input
        :model-value="confirmPassword"
        :disabled="isChanging"
        type="password"
        :label="t('AUTH.CONFIRM_PASSWORD')"
        :error="errors.confirmPassword ? t(`VALIDATION.${errors.confirmPassword}`) : ''"
        :show-password-toggle="true"
        @update:modelValue="onUpdate('confirmPassword', $event as string)"
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
import { useI18n } from 'vue-i18n'
import { Button, Input } from '@/shared/ui'
import type { ChangePasswordForm } from '@/shared/lib/validation/auth'

interface Props {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  errors: Partial<Record<keyof ChangePasswordForm, string>>
  isChanging: boolean
  success: boolean
  serverError: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:currentPassword', value: string): void
  (e: 'update:newPassword', value: string): void
  (e: 'update:confirmPassword', value: string): void
  (e: 'submit'): void
  (e: 'reset-errors'): void
}>()

const { t } = useI18n()

function onUpdate(field: 'currentPassword' | 'newPassword' | 'confirmPassword', value: string) {
  emit('reset-errors')
  if (field === 'currentPassword') emit('update:currentPassword', value)
  if (field === 'newPassword') emit('update:newPassword', value)
  if (field === 'confirmPassword') emit('update:confirmPassword', value)
}
</script>

<style scoped lang="scss" src="./profile-form.scss"></style>
