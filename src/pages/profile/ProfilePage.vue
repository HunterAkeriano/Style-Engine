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
        <ProfileHero
          :display-avatar-url="displayAvatarUrl"
          :initials="userInitials"
          :is-paid-user="isPaidUser"
          :is-premium-user="isPremiumUser"
          :is-uploading="isUploading"
          :selected-file="selectedFile"
          :upload-error="uploadError"
          :email="formData.email"
          :member-since="memberSince"
          @file-selected="handleFileSelect"
          @upload="handleUpload"
        />

        <ProfileInfoForm
          :name="formData.name"
          :email="formData.email"
          :member-since="memberSince"
          :is-saving="isSaving"
          :has-changes="hasChanges"
          :save-error="saveError"
          :save-success="saveSuccess"
          @update:name="updateName"
          @submit="handleProfileUpdate"
        />

        <ProfilePasswordForm
          :current-password="passwordForm.currentPassword"
          :new-password="passwordForm.newPassword"
          :confirm-password="passwordForm.confirmPassword"
          :errors="passwordErrors"
          :is-changing="isChangingPassword"
          :success="passwordSuccess"
          :server-error="passwordServerError"
          @update:currentPassword="(value) => (passwordForm.currentPassword = value)"
          @update:newPassword="(value) => (passwordForm.newPassword = value)"
          @update:confirmPassword="(value) => (passwordForm.confirmPassword = value)"
          @reset-errors="resetPasswordErrors"
          @submit="handlePasswordChange"
        />

        <ProfileNavigation :is-admin="isAdmin" :is-super-admin="isSuperAdmin" />

        <div class="profile-page__router">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { authAPI, type User } from '@/shared/api/auth'
import { useTheme } from '@/shared/composables/use-theme'
import { changePasswordSchema, type ChangePasswordForm } from '@/shared/lib/validation/auth'
import ProfileHero from '@/widgets/profile/ProfileHero.vue'
import ProfileInfoForm from '@/widgets/profile/ProfileInfoForm.vue'
import ProfilePasswordForm from '@/widgets/profile/ProfilePasswordForm.vue'
import ProfileNavigation from '@/widgets/profile/ProfileNavigation.vue'
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

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const isUploading = ref(false)
const isSaving = ref(false)
const uploadError = ref<string | null>(null)
const saveError = ref<string | null>(null)
const saveSuccess = ref(false)
const passwordForm = reactive<ChangePasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})
const passwordErrors = reactive<Partial<Record<keyof ChangePasswordForm, string>>>({})
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

const hasChanges = computed(() => formData.name !== originalName.value)

const isAdmin = computed(() => Boolean(user.value?.isAdmin))
const isSuperAdmin = computed(() => Boolean(user.value?.isSuperAdmin))

const isPaidUser = computed(() => user.value?.subscriptionTier === 'pro' || user.value?.subscriptionTier === 'premium')

const isPremiumUser = computed(() => user.value?.subscriptionTier === 'premium')

function resetPasswordErrors() {
  passwordErrors.currentPassword = ''
  passwordErrors.newPassword = ''
  passwordErrors.confirmPassword = ''
}

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

async function handlePasswordChange() {
  resetPasswordErrors()
  passwordSuccess.value = false
  passwordServerError.value = ''

  const result = changePasswordSchema.safeParse(passwordForm)
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as keyof ChangePasswordForm
      passwordErrors[field] = issue.message
    })
    return
  }

  isChangingPassword.value = true
  try {
    await authAPI.changePassword(passwordForm.currentPassword, passwordForm.newPassword)
    passwordSuccess.value = true
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (err: any) {
    passwordServerError.value = err?.message || t('PROFILE.CHANGE_PASSWORD_ERROR')
  } finally {
    isChangingPassword.value = false
  }
}

onMounted(() => {
  loadProfile()
})
</script>
