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
          v-model="form.email"
          :label="t('MODERATION.USERS_TABLE.EMAIL')"
          :error="formErrors.email"
          required
        />
        <Input
          v-model="form.name"
          :label="t('MODERATION.USERS_TABLE.NAME')"
          :error="formErrors.name"
        />
        <Select
          v-model="form.subscriptionTier"
          :options="tierOptions.slice(1)"
          :label="t('MODERATION.USERS_TABLE.PLAN')"
        />
        <Select
          v-if="form.subscriptionTier !== 'free'"
          v-model="form.subscriptionDuration"
          :options="durationOptions"
          :label="t('MODERATION.USER_MODAL_DURATION')"
        />
        <Input
          v-model="form.password"
          type="password"
          :label="t('MODERATION.USER_MODAL_PASSWORD')"
          :hint="t('MODERATION.USER_MODAL_PASSWORD_HINT')"
          :error="formErrors.password"
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
import { getModerationUsers, updateUser, deleteUser, type PublicUser } from '@/shared/api/users'
import type { UsersParams } from '@/shared/api/users'
import { Breadcrumbs } from '@/widgets/common'

type TierFilter = 'all' | 'free' | 'pro' | 'premium'

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
const form = reactive({
  name: '',
  email: '',
  password: '',
  subscriptionTier: 'free' as TierFilter,
  subscriptionDuration: 'month' as 'month' | 'forever' | 'free'
})
const formErrors = ref<Record<string, string>>({})

const userEditSchema = z.object({
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
  subscriptionDuration: z.enum(['month', 'forever', 'free'])
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

const columns = computed<TableColumn[]>(() => [
  { key: 'email', label: t('MODERATION.USERS_TABLE.EMAIL'), sortable: true },
  { key: 'name', label: t('MODERATION.USERS_TABLE.NAME'), sortable: true },
  { key: 'subscriptionTier', label: t('MODERATION.USERS_TABLE.PLAN'), sortable: true },
  { key: 'createdAt', label: t('MODERATION.USERS_TABLE.CREATED'), sortable: true },
  { key: 'actions', label: t('MODERATION.USERS_TABLE.ACTIONS') }
])

function formatDate(value: string) {
  return new Date(value).toLocaleString()
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
  selectedUser.value = user
  form.name = user.name ?? ''
  form.email = user.email
  form.subscriptionTier = user.subscriptionTier
  form.subscriptionDuration = user.subscriptionTier === 'free' ? 'free' : 'month'
  form.password = ''
  isModalOpen.value = true
}

function closeModal() {
  clearFormErrors()
  isModalOpen.value = false
  selectedUser.value = null
  form.password = ''
}

function clearFormErrors() {
  formErrors.value = {}
}

async function submitEdit() {
  if (!selectedUser.value) return

  const trimmedName = form.name.trim()
  const trimmedEmail = form.email.trim()

  const parsed = userEditSchema.safeParse({
    email: trimmedEmail,
    name: trimmedName || undefined,
    password: form.password || undefined,
    subscriptionTier: form.subscriptionTier,
    subscriptionDuration: form.subscriptionTier === 'free' ? 'free' : form.subscriptionDuration
  })

  if (!parsed.success) {
    formErrors.value = parsed.error.issues.reduce<Record<string, string>>((acc, issue) => {
      const key = String(issue.path[0] ?? 'form')
      acc[key] = issue.message
      return acc
    }, {})
    toast.error(parsed.error.issues[0]?.message || t('VALIDATION.SERVER_ERROR'))
    return
  }

  formErrors.value = {}
  modalLoading.value = true

  try {
    const payload: Record<string, unknown> = {
      email: parsed.data.email,
      subscriptionTier: parsed.data.subscriptionTier,
      subscriptionDuration: parsed.data.subscriptionDuration
    }
    if (parsed.data.name) {
      payload.name = parsed.data.name
    }
    if (parsed.data.password) {
      payload.password = parsed.data.password
    }
    const updated = await updateUser(selectedUser.value.id, payload)
    users.value = users.value.map(user => (user.id === updated.id ? updated : user))
    toast.success(t('MODERATION.USER_UPDATE_SUCCESS'))
    closeModal()
  } catch (err: any) {
    toast.error(err?.message || t('MODERATION.USER_UPDATE_ERROR'))
  } finally {
    modalLoading.value = false
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

  &__delete {
    color: $color-error;
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
