<template>
  <form class="profile-form" @submit.prevent="$emit('submit')">
    <div class="profile-form__field">
      <Input
        :model-value="name"
        :disabled="isSaving"
        :label="t('AUTH.NAME')"
        @update:modelValue="$emit('update:name', $event as string)"
      />
    </div>

    <div class="profile-form__field">
      <Input
        :model-value="email"
        type="email"
        :label="t('AUTH.EMAIL')"
        disabled
      />
    </div>

    <div class="profile-form__field">
      <label class="profile-form__label">
        {{ t('PROFILE.MEMBER_SINCE') }}
      </label>
      <p class="profile-form__text">{{ memberSince }}</p>
    </div>

    <Button
      :disabled="isSaving || !hasChanges"
      type="submit"
      class="profile-form__submit"
    >
      {{ isSaving ? t('PROFILE.SAVING') : t('PROFILE.SAVE_CHANGES') }}
    </Button>

    <p v-if="saveError" class="profile-form__error">{{ saveError }}</p>
    <p v-if="saveSuccess" class="profile-form__success">{{ t('PROFILE.SAVE_SUCCESS') }}</p>
  </form>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button, Input } from '@/shared/ui'

interface Props {
  name: string
  email: string
  memberSince: string
  isSaving: boolean
  hasChanges: boolean
  saveError: string | null
  saveSuccess: boolean
}

defineProps<Props>()

defineEmits<{
  (e: 'update:name', value: string): void
  (e: 'submit'): void
}>()

const { t } = useI18n()
</script>

<style scoped lang="scss" src="./profile-form.scss"></style>
