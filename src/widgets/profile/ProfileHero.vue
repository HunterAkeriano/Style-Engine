<template>
  <section class="profile-hero">
    <div class="profile-hero__top">
      <div class="profile-hero__avatar">
        <div :class="['profile-hero__photo', { 'profile-hero__photo_premium': isPremiumUser }]">
          <img
            v-if="displayAvatarUrl"
            :src="displayAvatarUrl"
            alt="Avatar"
            class="profile-hero__image"
          />
          <div v-else class="profile-hero__placeholder">
            <span class="profile-hero__initials">{{ initials }}</span>
          </div>
        </div>
        <Icon
          v-if="isPaidUser"
          :size="20"
          :class="['profile-hero__crown', { 'profile-hero__crown_premium': isPremiumUser }]"
          name="icon-crown"
        />
        <div v-if="isPremiumUser" class="profile-hero__badge">Premium</div>
      </div>

    <div class="profile-hero__meta">
      <p class="profile-hero__label">{{ t('AUTH.EMAIL') }}</p>
      <p class="profile-hero__value">{{ email }}</p>
      <p class="profile-hero__label">{{ t('PROFILE.MEMBER_SINCE') }}</p>
      <p class="profile-hero__value">{{ memberSince }}</p>
      <p v-if="subscriptionUntil" class="profile-hero__label">{{ t('PROFILE.SUBSCRIPTION_UNTIL') }}</p>
      <p v-if="subscriptionUntil" class="profile-hero__value">{{ subscriptionUntil }}</p>
    </div>
    </div>

    <div class="profile-hero__controls">
      <input
        :key="selectedFile ? `${selectedFile.name}-${selectedFile.size}` : 'empty'"
        ref="fileInputRef"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif"
        class="profile-hero__file-input"
        @change="onSelect"
      />
      <div class="profile-hero__buttons">
        <button
          :disabled="isUploading"
          type="button"
          class="profile-hero__btn"
          @click="fileInputRef?.click()"
        >
          {{ t('PROFILE.UPLOAD_AVATAR') }}
        </button>
        <button
          v-if="selectedFile"
          :disabled="isUploading"
          type="button"
          class="profile-hero__btn profile-hero__btn_confirm"
          @click="$emit('upload')"
        >
          {{ isUploading ? t('PROFILE.SAVING') : t('PROFILE.SAVE_CHANGES') }}
        </button>
      </div>
      <p class="profile-hero__hint">{{ t('PROFILE.UPLOAD_HINT') }}</p>
      <p v-if="uploadError" class="profile-hero__error">{{ uploadError }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@/shared/ui'

interface Props {
  displayAvatarUrl: string | null
  initials: string
  isPaidUser: boolean
  isPremiumUser: boolean
  isUploading: boolean
  selectedFile: File | null
  uploadError: string | null
  email: string
  memberSince: string
  subscriptionUntil?: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'file-selected', event: Event): void
  (e: 'upload'): void
}>()

const { t } = useI18n()
const fileInputRef = ref<HTMLInputElement | null>(null)

function onSelect(event: Event) {
  emit('file-selected', event)
}
</script>

<style scoped lang="scss" src="./profile-hero.scss"></style>
