<template>
  <div class="profile-settings">
    <header class="profile-settings__header">
      <p class="profile-settings__tag">{{ t('PROFILE.SETTINGS_TAG') }}</p>
      <h2 class="profile-settings__title">{{ t('PROFILE.SETTINGS_TITLE') }}</h2>
      <p class="profile-settings__subtitle">{{ t('PROFILE.SETTINGS_SUBTITLE') }}</p>
    </header>

    <div class="profile-settings__content">
      <ProfileInfoForm
        :name="name"
        :email="email"
        :member-since="memberSince"
        :is-saving="isSaving"
        :has-changes="hasChanges"
        :save-error="saveError"
        :save-success="saveSuccess"
        @update:name="$emit('update:name', $event)"
        @submit="$emit('submit')"
      />

      <ProfilePasswordForm
        :current-password="currentPassword"
        :new-password="newPassword"
        :confirm-password="confirmPassword"
        :errors="errors"
        :is-changing="isChanging"
        :success="success"
        :server-error="serverError"
        @update:currentPassword="$emit('update:currentPassword', $event)"
        @update:newPassword="$emit('update:newPassword', $event)"
        @update:confirmPassword="$emit('update:confirmPassword', $event)"
        @reset-errors="$emit('reset-errors')"
        @submit="$emit('submit-password')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ProfileInfoForm from '@/widgets/profile/ProfileInfoForm.vue'
import ProfilePasswordForm from '@/widgets/profile/ProfilePasswordForm.vue'

interface Props {
  name: string
  email: string
  memberSince: string
  isSaving: boolean
  hasChanges: boolean
  saveError: string | null
  saveSuccess: boolean
  currentPassword: string
  newPassword: string
  confirmPassword: string
  errors: Record<string, string>
  isChanging: boolean
  success: boolean
  serverError: string
}

defineProps<Props>()

defineEmits<{
  'update:name': [value: string]
  submit: []
  'update:currentPassword': [value: string]
  'update:newPassword': [value: string]
  'update:confirmPassword': [value: string]
  'reset-errors': []
  'submit-password': []
}>()

const { t } = useI18n()
</script>

<style scoped lang="scss">
@import '@/app/styles/variables';

.profile-settings {
  &__header {
    margin-bottom: $space-2xl;
  }

  &__tag {
    margin: 0;
    color: $color-text-secondary;
    text-transform: uppercase;
    font-size: $font-size-sm;
    letter-spacing: 0.08em;
  }

  &__title {
    margin: $space-xs 0;
    font-size: $font-size-2xl;
    color: $color-text-primary;
  }

  &__subtitle {
    margin: 0;
    color: $color-text-secondary;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: $space-2xl;
  }
}

@media (max-width: 768px) {
  .profile-settings {
    &__header {
      margin-bottom: $space-xl;
    }

    &__title {
      font-size: $font-size-xl;
    }

    &__content {
      gap: $space-xl;
    }
  }
}
</style>
