<template>
  <div class="profile-page" @mousemove="handleMouseMove">
    <div class="profile-page__sky">
      <span v-if="isDark" class="profile-page__stars profile-page__stars-1"></span>
      <span v-if="isDark" class="profile-page__stars profile-page__stars-2"></span>
      <span
        class="profile-page__celestial"
        :class="`profile-page__celestial_${isDark ? 'moon' : 'sun'}`"
        :style="celestialStyle"
      ></span>
      <span v-if="!isDark" class="profile-page__cloud profile-page__cloud-1"></span>
      <span v-if="!isDark" class="profile-page__cloud profile-page__cloud-2"></span>
      <span v-if="!isDark" class="profile-page__cloud profile-page__cloud-3"></span>
    </div>
    <div class="profile-page__container">
      <div class="profile-page__header">
        <h1 class="profile-page__title">{{ t('PROFILE.TITLE') }}</h1>
        <p class="profile-page__subtitle">{{ t('PROFILE.SUBTITLE') }}</p>
      </div>

      <div class="profile-page__content">
        <div class="profile-page__avatar-section">
          <div class="profile-avatar-wrapper">
            <div :class="['profile-avatar', { 'profile-avatar_premium': isPremiumUser }]">
              <img
                v-if="displayAvatarUrl"
                :src="displayAvatarUrl"
                alt="Avatar"
                class="profile-avatar__image"
              />
              <div v-else class="profile-avatar__placeholder">
                <span class="profile-avatar__initials">{{ userInitials }}</span>
              </div>
            </div>
            <Icon
              v-if="isPaidUser"
              :size="24"
              :class="['profile-avatar__crown', { 'profile-avatar__crown_premium': isPremiumUser }]"
              name="icon-crown"
            />
            <div v-if="isPremiumUser" class="profile-avatar__badge">
              Premium
            </div>
          </div>

          <div class="profile-avatar__controls">
            <input
              ref="fileInputRef"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              class="profile-avatar__file-input"
              @change="handleFileSelect"
            />
            <button
              :disabled="isUploading"
              type="button"
              class="profile-avatar__upload-btn"
              @click="fileInputRef?.click()"
            >
              {{ t('PROFILE.UPLOAD_AVATAR') }}
            </button>
            <button
              v-if="selectedFile"
              :disabled="isUploading"
              type="button"
              class="profile-avatar__confirm-btn"
              @click="handleUpload"
            >
              {{ isUploading ? t('PROFILE.SAVING') : t('PROFILE.SAVE_CHANGES') }}
            </button>
            <p class="profile-avatar__hint">{{ t('PROFILE.UPLOAD_HINT') }}</p>
            <p v-if="uploadError" class="profile-avatar__error">{{ uploadError }}</p>
          </div>
        </div>

        <form class="profile-form" @submit.prevent="handleProfileUpdate">
          <div class="profile-form__field">
            <label class="profile-form__label" for="name">
              {{ t('AUTH.NAME') }}
            </label>
            <input
              v-model="formData.name"
              :disabled="isSaving"
              id="name"
              type="text"
              class="profile-form__input"
            />
          </div>

          <div class="profile-form__field">
            <label class="profile-form__label" for="email">
              {{ t('AUTH.EMAIL') }}
            </label>
            <input
              v-model="formData.email"
              id="email"
              type="email"
              disabled
              class="profile-form__input"
            />
          </div>

          <div class="profile-form__field">
            <label class="profile-form__label">
              {{ t('PROFILE.MEMBER_SINCE') }}
            </label>
            <p class="profile-form__text">{{ memberSince }}</p>
          </div>

          <button
            :disabled="isSaving || !hasChanges"
            type="submit"
            class="profile-form__submit"
          >
            {{ isSaving ? t('PROFILE.SAVING') : t('PROFILE.SAVE_CHANGES') }}
          </button>

          <p v-if="saveError" class="profile-form__error">{{ saveError }}</p>
          <p v-if="saveSuccess" class="profile-form__success">{{ t('PROFILE.SAVE_SUCCESS') }}</p>
        </form>

        <nav class="profile-page__navigation">
          <RouterLink
            :to="{ name: `${locale}-profile-gradients` }"
            active-class="profile-page__nav-link_active"
            class="profile-page__nav-link"
          >
            {{ t('PROFILE.NAV_GRADIENTS') }}
          </RouterLink>

          <RouterLink
            :to="{ name: `${locale}-profile-shadows` }"
            active-class="profile-page__nav-link_active"
            class="profile-page__nav-link"
          >
            {{ t('PROFILE.NAV_SHADOWS') }}
          </RouterLink>

          <RouterLink
            :to="{ name: `${locale}-profile-animations` }"
            active-class="profile-page__nav-link_active"
            class="profile-page__nav-link"
          >
            {{ t('PROFILE.NAV_ANIMATIONS') }}
          </RouterLink>

        <RouterLink
          v-if="isAdmin"
          :to="{ name: `${locale}-moderation` }"
          class="profile-page__nav-link profile-page__nav-link_admin"
        >
          {{ t('PROFILE.MODERATION_LINK') }}
        </RouterLink>
        <RouterLink
          v-if="isSuperAdmin"
          :to="{ name: `${locale}-moderation-users` }"
          class="profile-page__nav-link profile-page__nav-link_admin"
        >
          {{ t('PROFILE.USER_MANAGEMENT_LINK') }}
        </RouterLink>
        </nav>

        <div class="profile-page__router">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authAPI, type User } from '@/shared/api/auth'
import { useTheme } from '@/shared/composables/use-theme'
import { Icon } from '@/shared/ui'
import './profile-page.scss'

const { t, locale } = useI18n()
const { isDark } = useTheme()

const mouseX = ref(0)
const mouseY = ref(0)

const celestialStyle = computed(() => ({
  transform: `translate(${mouseX.value * 0.03}px, ${mouseY.value * 0.03}px)`
}))

function handleMouseMove(event: MouseEvent) {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  mouseX.value = event.clientX - rect.left - rect.width / 2
  mouseY.value = event.clientY - rect.top - rect.height / 2
}

const fileInputRef = ref<HTMLInputElement | null>(null)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isUploading = ref(false)
const isSaving = ref(false)
const uploadError = ref<string | null>(null)
const saveError = ref<string | null>(null)
const saveSuccess = ref(false)

const user = ref<User | null>(null)
const formData = reactive({
  name: '',
  email: ''
})

const originalName = ref('')

const userInitials = computed(() => {
  if (user.value?.name) {
    return user.value.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  if (user.value?.email) {
    return user.value.email[0].toUpperCase()
  }
  return '?'
})

const displayAvatarUrl = computed(() => {
  return previewUrl.value || user.value?.avatarUrl || null
})

const memberSince = computed(() => {
  if (!user.value?.createdAt) return ''
  const date = new Date(user.value.createdAt)
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
})

const hasChanges = computed(() => {
  return formData.name !== originalName.value
})

const isAdmin = computed(() => Boolean(user.value?.isAdmin))
const isSuperAdmin = computed(() => Boolean(user.value?.isSuperAdmin))

const isPaidUser = computed(() => {
  return user.value?.subscriptionTier === 'pro' || user.value?.subscriptionTier === 'premium'
})

const isPremiumUser = computed(() => {
  return user.value?.subscriptionTier === 'premium'
})

async function loadProfile() {
  try {
    const response = await authAPI.getProfile()
    user.value = response.user
    formData.name = response.user.name || ''
    formData.email = response.user.email
    originalName.value = response.user.name || ''
  } catch (error) {
    console.error('Failed to load profile', error)
  }
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  uploadError.value = null
  saveSuccess.value = false

  if (!file) {
    selectedFile.value = null
    previewUrl.value = null
    return
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    uploadError.value = t('PROFILE.UPLOAD_FORMAT_ERROR')
    selectedFile.value = null
    previewUrl.value = null
    return
  }

  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    uploadError.value = t('PROFILE.UPLOAD_SIZE_ERROR')
    selectedFile.value = null
    previewUrl.value = null
    return
  }

  selectedFile.value = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

async function handleUpload() {
  if (!selectedFile.value) return

  isUploading.value = true
  uploadError.value = null
  saveSuccess.value = false

  try {
    const response = await authAPI.uploadAvatar(selectedFile.value)
    user.value = response.user
    selectedFile.value = null
    previewUrl.value = null

    // Reset file input
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
  } catch (error: any) {
    uploadError.value = error?.message || t('PROFILE.UPLOAD_ERROR')
  } finally {
    isUploading.value = false
  }
}

async function handleProfileUpdate() {
  if (!hasChanges.value) return

  isSaving.value = true
  saveError.value = null
  saveSuccess.value = false

  try {
    const response = await authAPI.updateProfile({
      name: formData.name || undefined
    })
    user.value = response.user
    originalName.value = response.user.name || ''
    saveSuccess.value = true

    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)
  } catch (error: any) {
    saveError.value = error?.message || t('VALIDATION.SERVER_ERROR')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>
