<template>
  <div class="user-management-page">
    <Breadcrumbs />
    <header class="user-management-page__header">
      <div class="user-management-page__hero">
        <span class="user-management-page__tag">{{ t('MODERATION.USERS_TAG') }}</span>
        <div>
          <h1>{{ t('MODERATION.USERS_TITLE') }}</h1>
          <p class="user-management-page__subtitle">{{ t('MODERATION.USERS_SUBTITLE') }}</p>
          <p class="user-management-page__intro">{{ t('MODERATION.USERS_INTRO') }}</p>
          <p class="user-management-page__count">{{ t('MODERATION.USERS_COUNT', { count: loadedCount }) }}</p>
        </div>
      </div>
      <div class="user-management-page__filters">
        <Select
          v-model="filters.tier"
          :options="tierOptions"
          :label="t('MODERATION.USERS_FILTER_LABEL')"
          @update:modelValue="loadUsers"
        />
        <Button variant="secondary" size="md" :disabled="loading" @click="loadUsers">
          {{ t('MODERATION.REFRESH') }}
        </Button>
      </div>
    </header>

    <div v-if="error" class="user-management-page__error">{{ error }}</div>

    <div v-if="!loading || users.length" class="user-management-page__table-card">
      <Table
        :columns="columns"
        :rows="users"
        row-key="id"
        size="md"
        hoverable
        sticky-header
      >
        <template #cell-subscriptionTier="{ value }">
          <span class="user-management-page__badge" :class="`user-management-page__badge_${value}`">
            {{ t(`MODERATION.UNIT.${(value as string).toUpperCase()}`) }}
          </span>
        </template>
        <template #cell-role="{ value }">
          <span class="user-management-page__badge user-management-page__badge_role">
            {{ formatRole(value as UserRole) }}
          </span>
        </template>
        <template #cell-createdAt="{ value }">
          {{ formatDate(value as string) }}
        </template>
        <template #cell-actions="{ row }">
          <Button size="sm" variant="ghost" @click="openEdit(row as unknown as PublicUser)">
            {{ t('MODERATION.EDIT') }}
          </Button>
          <Button
            size="sm"
            variant="outline"
            class="user-management-page__delete"
            @click="confirmDelete(row as unknown as PublicUser)"
          >
            {{ t('MODERATION.DELETE') }}
          </Button>
        </template>
      </Table>
    </div>

    <div v-if="loading && !users.length" class="user-management-page__empty">
      {{ t('MODERATION.LOADING') }}
    </div>

    <Modal
      :visible="isModalOpen"
      :title="t('MODERATION.USER_MODAL_TITLE')"
      :subtitle="t('MODERATION.USER_MODAL_SUBTITLE')"
      show-actions
      :closable="true"
      :close-on-backdrop="true"
      :confirm-text="modalLoading ? t('MODERATION.LOADING') : t('MODERATION.USER_MODAL_SAVE')"
      :cancel-text="t('COMMON.CANCEL')"
      :confirm-disabled="modalLoading"
      @confirm="submitEdit"
      @close="closeModal"
    >
      <form class="user-management-page__form" @submit.prevent="submitEdit">
        <Input
          name="email"
          v-model="emailModel"
          :label="t('MODERATION.USERS_TABLE.EMAIL')"
          :error="errors.email || ''"
          required
        />
        <Input
          name="name"
          v-model="nameModel"
          :label="t('MODERATION.USERS_TABLE.NAME')"
          :error="errors.name || ''"
        />
        <Select
          name="subscriptionTier"
          :model-value="formValues.subscriptionTier"
          :options="tierOptions.slice(1)"
          :label="t('MODERATION.USERS_TABLE.PLAN')"
          :error="errors.subscriptionTier || ''"
          @update:modelValue="(val) => handleSubscriptionTierChange(val as TierFilter)"
        />
        <Select
          name="role"
          :model-value="formValues.role"
          :options="roleOptions"
          :label="t('MODERATION.USER_ROLE_LABEL')"
          :error="errors.role || ''"
          @update:modelValue="(val) => form.setValue('role', val as UserRole)"
        />
        <Select
          name="forumMute"
          :model-value="muteOption"
          :options="forumMuteOptions"
          :label="t('MODERATION.USERS_MUTE_LABEL')"
          :hint="activeMute?.muted && activeMute?.expiresAt ? t('MODERATION.USERS_MUTE_UNTIL', { date: formatDate(activeMute.expiresAt) }) : ''"
          :disabled="muteLoading"
          @update:modelValue="onMuteSelect"
        />
        <p v-if="muteOption === 'custom' && activeMute?.expiresAt" class="user-management-page__hint">
          {{ t('MODERATION.USERS_MUTE_UNTIL', { date: formatDate(activeMute.expiresAt) }) }}
        </p>
        <Select
          v-if="formValues.subscriptionTier !== 'free'"
          name="subscriptionDuration"
          :model-value="formValues.subscriptionDuration"
          :options="durationOptions"
          :label="t('MODERATION.USER_MODAL_DURATION')"
          :error="errors.subscriptionDuration || ''"
          @update:modelValue="
            (val) => form.setValue('subscriptionDuration', val as UserEditForm['subscriptionDuration'])
          "
        />
        <Input
          name="password"
          v-model="passwordModel"
          type="password"
          :label="t('MODERATION.USER_MODAL_PASSWORD')"
          :hint="t('MODERATION.USER_MODAL_PASSWORD_HINT')"
          :error="errors.password || ''"
        />
      </form>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { z } from 'zod'
import { Button, Input, Modal, Select, Table, type TableColumn } from '@/shared/ui'
import { useToast } from '@/shared/lib/toast'
import { getModerationUsers, updateUser, deleteUser, type PublicUser, type UserRole } from '@/shared/api/users'
import { getUserMute, muteUser, unmuteUser } from '@/shared/api/forum'
import type { UsersParams } from '@/shared/api/users'
import { Breadcrumbs } from '@/widgets/common'
import { useZodForm } from '@/shared/lib/form/zodForm'

type TierFilter = 'all' | 'free' | 'pro' | 'premium'
type MuteOption = 'none' | '15' | '30' | '60' | '180' | '720' | '1440' | '10080' | '43200' | 'permanent' | 'custom'

const { t } = useI18n()
const toast = useToast()

const users = ref<PublicUser[]>([])
const loading = ref(false)
const error = ref('')
const pagination = ref({
  page: 1,
  limit: 50
})

const filters = reactive({
  tier: 'all' as TierFilter
})

const loadedCount = computed(() => users.value.length)

const selectedUser = ref<PublicUser | null>(null)
const isModalOpen = ref(false)
const modalLoading = ref(false)
const muteLoading = ref(false)
const activeMute = ref<{ muted: boolean; expiresAt?: string | null; reason?: string | null } | null>(null)
const muteOption = ref<MuteOption>('none')
const userEditSchema = computed(() =>
  z.object({
    email: z
      .string()
      .min(1, { message: t('VALIDATION.EMAIL_REQUIRED') })
      .email({ message: t('VALIDATION.EMAIL_INVALID') }),
    name: z
      .string()
      .min(1, { message: t('VALIDATION.NAME_MIN') })
      .max(120, { message: t('VALIDATION.NAME_MAX') })
      .optional(),
    password: z.string().min(8, { message: t('VALIDATION.PASSWORD_MIN') }).optional(),
    subscriptionTier: z.enum(['free', 'pro', 'premium']),
    subscriptionDuration: z.enum(['month', 'forever', 'free']),
    role: z.enum(['user', 'moderator', 'super_admin'])
  })
)

type UserEditForm = {
  name?: string
  email: string
  password?: string
  subscriptionTier: TierFilter
  subscriptionDuration: 'month' | 'forever' | 'free'
  role: UserRole
}

const form = useZodForm(userEditSchema, {
  name: '',
  email: '',
  password: '',
  subscriptionTier: 'free',
  subscriptionDuration: 'month',
  role: 'user'
})
const formValues = form.values as UserEditForm
const errors = form.errors
const onMuteSelect = (val: string | number) => {
  muteOption.value = val as MuteOption
}

const emailModel = computed({
  get: () => formValues.email || '',
  set: (val: string) => form.setValue('email', val)
})
const nameModel = computed({
  get: () => formValues.name || '',
  set: (val: string) => form.setValue('name', val)
})
const passwordModel = computed({
  get: () => formValues.password || '',
  set: (val: string) => form.setValue('password', val)
})

const tierOptions = computed(() => [
  { value: 'all', label: t('MODERATION.USERS_FILTER_ALL') },
  { value: 'free', label: t('MODERATION.UNIT.FREE') },
  { value: 'pro', label: t('MODERATION.UNIT.PRO') },
  { value: 'premium', label: t('MODERATION.UNIT.PREMIUM') }
])

const durationOptions = computed(() => [
  { value: 'month', label: t('MODERATION.USER_MODAL_DURATION_MONTH') },
  { value: 'forever', label: t('MODERATION.USER_MODAL_DURATION_FOREVER') }
])

const roleOptions = computed(() => [
  { value: 'user', label: t('MODERATION.USER_ROLE_USER') },
  { value: 'moderator', label: t('MODERATION.USER_ROLE_MODERATOR') },
  { value: 'super_admin', label: t('MODERATION.USER_ROLE_SUPER_ADMIN') }
])

const forumMuteOptions = computed(() => {
  const base: { value: MuteOption; label: string }[] = [
    { value: 'none', label: t('MODERATION.USERS_MUTE_NONE') },
    { value: '15', label: t('FORUM.DURATION_15_MIN') },
    { value: '30', label: t('FORUM.DURATION_30_MIN') },
    { value: '60', label: t('FORUM.DURATION_1_HOUR') },
    { value: '180', label: t('FORUM.DURATION_3_HOURS') },
    { value: '720', label: t('FORUM.DURATION_12_HOURS') },
    { value: '1440', label: t('FORUM.DURATION_1_DAY') },
    { value: '10080', label: t('FORUM.DURATION_1_WEEK') },
    { value: '43200', label: t('FORUM.DURATION_1_MONTH') },
    { value: 'permanent', label: t('FORUM.DURATION_PERMANENT') }
  ]
  if (muteOption.value === 'custom' && activeMute.value?.expiresAt) {
    base.push({
      value: 'custom',
      label: t('MODERATION.USERS_MUTE_CUSTOM', { date: formatDate(activeMute.value.expiresAt) })
    })
  }
  return base
})

const columns = computed<TableColumn[]>(() => [
  { key: 'email', label: t('MODERATION.USERS_TABLE.EMAIL'), sortable: true },
  { key: 'name', label: t('MODERATION.USERS_TABLE.NAME'), sortable: true },
  { key: 'role', label: t('MODERATION.USER_ROLE_LABEL'), sortable: false },
  { key: 'subscriptionTier', label: t('MODERATION.USERS_TABLE.PLAN'), sortable: true },
  { key: 'createdAt', label: t('MODERATION.USERS_TABLE.CREATED'), sortable: true },
  { key: 'actions', label: t('MODERATION.USERS_TABLE.ACTIONS') }
])

function formatDate(value: string) {
  return new Date(value).toLocaleString()
}

function formatRole(value?: UserRole) {
  const map: Record<UserRole, string> = {
    user: t('MODERATION.USER_ROLE_USER'),
    moderator: t('MODERATION.USER_ROLE_MODERATOR'),
    super_admin: t('MODERATION.USER_ROLE_SUPER_ADMIN')
  }
  return map[(value ?? 'user') as UserRole]
}

function clearFormErrors() {
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })
}

function normalizeFormValues() {
  form.setValue('email', (formValues.email || '').trim())
  const trimmedName = (formValues.name || '').trim()
  form.setValue('name', trimmedName ? trimmedName : undefined)
  const normalizedPassword = (formValues.password || '').trim()
  form.setValue('password', normalizedPassword || undefined)
  if (formValues.subscriptionTier === 'free') {
    form.setValue('subscriptionDuration', 'free')
  }
}

function handleSubscriptionTierChange(value: TierFilter) {
  form.setValue('subscriptionTier', value)
  if (value === 'free') {
    form.setValue('subscriptionDuration', 'free')
  } else if (formValues.subscriptionDuration === 'free') {
    form.setValue('subscriptionDuration', 'month')
  }
}

async function loadUsers() {
  loading.value = true
  error.value = ''
  try {
    const params: UsersParams = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      tier: filters.tier
    }
    const response = await getModerationUsers(params)
    users.value = response.users
  } catch (err: any) {
    error.value = err?.message || t('MODERATION.LOAD_ERROR')
    toast.error(error.value)
  } finally {
    loading.value = false
  }
}

function openEdit(user: PublicUser) {
  clearFormErrors()
  activeMute.value = null
  muteOption.value = 'none'
  selectedUser.value = user
  form.setValue('name', user.name ?? '')
  form.setValue('email', user.email)
  form.setValue('subscriptionTier', user.subscriptionTier as TierFilter)
  form.setValue('subscriptionDuration', user.subscriptionTier === 'free' ? 'free' : 'month')
  form.setValue(
    'role',
    (user.role as UserRole) || 'user'
  )
  form.setValue('password', '')
  isModalOpen.value = true
  void loadUserMute(user.id)
}

function closeModal() {
  clearFormErrors()
  isModalOpen.value = false
  selectedUser.value = null
  form.setValue('password', '')
  activeMute.value = null
  muteOption.value = 'none'
}

async function submitEdit() {
  if (!selectedUser.value) return

  normalizeFormValues()
  const parsed = form.validateAll() as UserEditForm | null
  if (!parsed) {
    const firstError = Object.values(errors).find(Boolean)
    if (firstError) {
      toast.error(firstError)
    }
    return
  }

  modalLoading.value = true

  try {
    const payload: Record<string, unknown> = {
      email: parsed.email,
      subscriptionTier: parsed.subscriptionTier,
      subscriptionDuration: parsed.subscriptionTier === 'free' ? 'free' : parsed.subscriptionDuration,
      role: parsed.role
    }
    if (parsed.name) {
      payload.name = parsed.name
    }
    if (parsed.password) {
      payload.password = parsed.password
    }
    const updated = await updateUser(selectedUser.value.id, payload)
    users.value = users.value.map(user => (user.id === updated.id ? updated : user))

    await applyMuteChange(selectedUser.value.id)

    toast.success(t('MODERATION.USER_UPDATE_SUCCESS'))
    closeModal()
  } catch (err: any) {
    toast.error(err?.message || t('MODERATION.USER_UPDATE_ERROR'))
  } finally {
    modalLoading.value = false
  }
}

function optionToMinutes(option: MuteOption): number | null | undefined {
  if (option === 'none') return undefined
  if (option === 'permanent') return null
  if (option === 'custom') return undefined
  return parseInt(option, 10)
}

function resolveMuteOption(expiresAt?: string | null): MuteOption {
  if (!expiresAt) return 'permanent'
  const diffMinutes = Math.max(
    0,
    Math.round((new Date(expiresAt).getTime() - Date.now()) / 60000)
  )
  const known: Record<number, MuteOption> = {
    15: '15',
    30: '30',
    60: '60',
    180: '180',
    720: '720',
    1440: '1440',
    10080: '10080',
    43200: '43200'
  }
  const match = Object.keys(known)
    .map(Number)
    .find(value => Math.abs(value - diffMinutes) <= 5)
  return match ? known[match] : 'custom'
}

async function loadUserMute(userId: string) {
  muteLoading.value = true
  try {
    const status = await getUserMute(userId)
    activeMute.value = status
    if (!status.muted) {
      muteOption.value = 'none'
    } else {
      muteOption.value = resolveMuteOption(status.expiresAt ?? null)
    }
  } catch (err: any) {
    toast.error(err?.message || t('MODERATION.USER_UPDATE_ERROR'))
    muteOption.value = 'none'
  } finally {
    muteLoading.value = false
  }
}

async function applyMuteChange(userId: string) {
  if (muteOption.value === 'custom') return
  const desired = muteOption.value
  const currentMuted = activeMute.value?.muted

  if (desired === 'none') {
    if (currentMuted) {
      await unmuteUser(userId)
    }
    activeMute.value = { muted: false }
    return
  }

  const duration = optionToMinutes(desired)
  await muteUser(userId, { durationMinutes: duration ?? null })
  activeMute.value = {
    muted: true,
    expiresAt: duration ? new Date(Date.now() + duration * 60 * 1000).toISOString() : null
  }
}

async function confirmDelete(user: PublicUser) {
  if (!confirm(t('MODERATION.DELETE_CONFIRM', { name: user.email }))) return
  try {
    await deleteUser(user.id)
    users.value = users.value.filter(row => row.id !== user.id)
    toast.success(t('MODERATION.USER_DELETE_SUCCESS'))
  } catch (err: any) {
    toast.error(err?.message || t('MODERATION.USER_DELETE_ERROR'))
  }
}

onMounted(loadUsers)
</script>

<style lang="scss" scoped>
@import '@/app/styles/variables';

.user-management-page {
  min-height: 100vh;
  padding: $space-4xl $space-lg $space-3xl;
  background: radial-gradient(circle at 20% -10%, color-var-alpha('color-primary', 0.18), transparent 60%),
    radial-gradient(circle at 80% 0%, color-var-alpha('color-accent', 0.15), transparent 55%),
    $color-bg-primary;
  display: flex;
  flex-direction: column;
  gap: $space-lg;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: $space-lg;
    flex-wrap: wrap;
  }

  &__hero {
    max-width: 540px;
    background: color-var-alpha('surface-panel-3', 0.95);
    border: 1px solid color-var-alpha('panel-border', 0.4);
    padding: $space-xl;
    border-radius: $border-radius-2xl;
    position: relative;
    box-shadow: 0 20px 60px color-var-alpha('color-text-primary', 0.08);
  }

  &__tag {
    display: inline-flex;
    align-items: center;
    padding: 2px 12px;
    border-radius: $border-radius-full;
    background: color-var-alpha('color-primary', 0.12);
    color: $color-primary;
    font-size: $font-size-xs;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: $space-sm;
  }

  &__subtitle {
    margin: 0;
    color: $color-text-secondary;
    line-height: 1.6;
    margin-bottom: $space-xs;
  }

  &__intro {
    margin: 0;
    color: $color-text-secondary;
    font-size: $font-size-sm;
    line-height: 1.6;
    margin-bottom: $space-sm;
  }

  &__count {
    margin: 0;
    font-size: $font-size-sm;
    color: $color-text-primary;
    font-weight: $font-weight-semibold;
  }

  &__filters {
    display: flex;
    gap: $space-sm;
    align-items: flex-end;
    padding: $space-lg;
    border-radius: $border-radius-2xl;
    background: color-var-alpha('surface-panel-2', 0.6);
    border: 1px solid color-var-alpha('panel-border', 0.3);
    box-shadow: 0 14px 40px color-var-alpha('color-text-primary', 0.05);
    flex-wrap: wrap;
  }

  &__filters > * {
    flex: 1;
    min-width: 200px;
  }

  &__table-card {
    background: color-var-alpha('surface-panel-3', 0.95);
    border: 1px solid color-var-alpha('panel-border', 0.35);
    border-radius: $border-radius-2xl;
    padding: $space-lg;
    box-shadow: 0 30px 70px color-var-alpha('color-text-primary', 0.1);
    overflow: hidden;
  }

  &__error,
  &__empty {
    text-align: center;
    color: $color-text-secondary;
    padding: $space-md;
  }

  &__error {
    color: $color-error;
  }

  &__badge {
    padding: 4px 10px;
    border-radius: $border-radius-full;
    font-size: $font-size-xs;
    text-transform: uppercase;
  }

  &__badge_free {
    background: color-var-alpha('color-bg-secondary', 0.6);
    color: $color-text-secondary;
  }

  &__badge_pro {
    background: color-var-alpha('color-primary', 0.12);
    color: $color-primary;
  }

  &__badge_premium {
    background: color-var-alpha('color-accent', 0.16);
    color: $color-accent;
  }

  &__badge_role {
    background: color-var-alpha('surface-panel-1', 0.7);
    color: $color-text-primary;
    border: 1px solid color-var-alpha('panel-border', 0.35);
  }

  &__delete {
    color: $color-error;
  }

  &__hint {
    margin: -$space-xs 0 $space-xs;
    color: $color-text-secondary;
    font-size: $font-size-sm;
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: $space-md;
  }

  &__modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: $space-sm;
  }
}

@media (max-width: 900px) {
  .user-management-page__header {
    flex-direction: column;
    align-items: stretch;
  }

  .user-management-page__filters {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 640px) {
  .user-management-page {
    padding: $space-3xl $space-md $space-2xl;
  }

  .user-management-page__hero {
    padding: $space-md;
  }

  .user-management-page__filters > * {
    min-width: 0;
  }
}
</style>
