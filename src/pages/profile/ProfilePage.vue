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
        <div class="profile-page__main">
          <aside class="profile-page__sidebar">
            <ProfileHero
              :display-avatar-url="displayAvatarUrl"
              :initials="userInitials"
              :is-paid-user="isPaidUser"
              :is-premium-user="isPremiumUser"
              :is-uploading="isUploading"
              :selected-file="selectedFile"
              :upload-error="uploadError"
              :email="formData.email"
              :user-name="formData.name"
              :member-since="memberSince"
              :subscription-until="subscriptionUntil"
              @file-selected="handleFileSelect"
              @upload="handleUpload"
            />

            <div class="profile-page__sidebar-divider"></div>

            <ProfileNavigation :is-admin="isAdmin" :is-super-admin="isSuperAdmin" />

            <div class="profile-page__sidebar-divider"></div>
          </aside>

          <main class="profile-page__main-content">
            <RouterView v-slot="{ Component }">
              <component
                :is="Component"
                v-bind="settingsProps"
                @update:name="updateName"
                @submit="handleProfileUpdate"
                @submit-password="handlePasswordChange"
                @clear-password-error="passwordServerError = ''"
              />
            </RouterView>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authAPI, type User } from '@/shared/api/auth'
import { useAuthStore } from '@/entities'
import { useTheme } from '@/shared/composables/use-theme'
import { type ChangePasswordForm } from '@/shared/lib/validation/auth'
import ProfileHero from '@/widgets/profile/ProfileHero.vue'
import ProfileNavigation from '@/widgets/profile/ProfileNavigation.vue'
import './profile-page.scss'

const { t, locale } = useI18n()
const { isDark } = useTheme()
const authStore = useAuthStore()

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

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isUploading = ref(false)
const isSaving = ref(false)
const uploadError = ref<string | null>(null)
const saveError = ref<string | null>(null)
const saveSuccess = ref(false)
const passwordSuccess = ref(false)
const passwordServerError = ref('')
const isChangingPassword = ref(false)

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

const displayAvatarUrl = computed(() => previewUrl.value || user.value?.avatarUrl || null)

const memberSince = computed(() => {
  if (!user.value?.createdAt) return ''
  const date = new Date(user.value.createdAt)
  return date.toLocaleDateString(locale.value || undefined, { year: 'numeric', month: 'long' })
})

const subscriptionUntil = computed(() => {
  if (!user.value) return ''
  if (!user.value.subscriptionExpiresAt) return ''
  const expires = new Date(user.value.subscriptionExpiresAt)
  if (expires.getFullYear() >= 2100) return t('PROFILE.SUBSCRIPTION_FOREVER')
  return expires.toLocaleDateString(locale.value || undefined, { year: 'numeric', month: 'long', day: 'numeric' })
})

const hasChanges = computed(() => formData.name !== originalName.value)

const isAdmin = computed(() => user.value?.role === 'moderator' || user.value?.role === 'super_admin' || Boolean(user.value?.isAdmin))
const isSuperAdmin = computed(() => user.value?.role === 'super_admin' || Boolean(user.value?.isSuperAdmin))

const isPaidUser = computed(() => user.value?.subscriptionTier === 'pro' || user.value?.subscriptionTier === 'premium')

const isPremiumUser = computed(() => user.value?.subscriptionTier === 'premium')

const settingsProps = computed(() => ({
  name: formData.name,
  email: formData.email,
  memberSince: memberSince.value,
  isSaving: isSaving.value,
  hasChanges: hasChanges.value,
  saveError: saveError.value,
  saveSuccess: saveSuccess.value,
  isChanging: isChangingPassword.value,
  success: passwordSuccess.value,
  serverError: passwordServerError.value
}))

function applyUser(nextUser: User | null) {
  user.value = nextUser
  if (!nextUser) return
  formData.name = nextUser.name || ''
  formData.email = nextUser.email
  originalName.value = nextUser.name || ''
}

async function loadProfile() {
  try {
    const response = await authAPI.getProfile()
    applyUser(response.user)
    authStore.setUser(response.user)
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

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    uploadError.value = t('PROFILE.UPLOAD_FORMAT_ERROR')
    selectedFile.value = null
    previewUrl.value = null
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    uploadError.value = t('PROFILE.UPLOAD_SIZE_ERROR')
    selectedFile.value = null
    previewUrl.value = null
    return
  }

  selectedFile.value = file

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
  } catch (error: any) {
    uploadError.value = error?.message || t('PROFILE.UPLOAD_ERROR')
  } finally {
    isUploading.value = false
  }
}

function updateName(value: string) {
  formData.name = value
  saveSuccess.value = false
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
    applyUser(response.user)
    authStore.setUser(response.user)
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

async function handlePasswordChange(values: ChangePasswordForm) {
  passwordSuccess.value = false
  passwordServerError.value = ''

  isChangingPassword.value = true
  try {
    await authAPI.changePassword(values.currentPassword, values.newPassword)
    passwordSuccess.value = true
  } catch (err: any) {
    passwordServerError.value = err?.message || t('PROFILE.CHANGE_PASSWORD_ERROR')
  } finally {
    isChangingPassword.value = false
  }
}

onMounted(() => {
  loadProfile()
})

watch(
  () => authStore.user,
  (next) => {
    if (next?.id !== user.value?.id || next?.subscriptionTier !== user.value?.subscriptionTier || next?.subscriptionExpiresAt !== user.value?.subscriptionExpiresAt) {
      applyUser(next as User | null)
    }
  },
  { immediate: true }
)
</script>
