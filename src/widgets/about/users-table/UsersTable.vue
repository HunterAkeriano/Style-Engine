<template>
  <div class="users-table">
    <header class="users-table__header">
      <div class="users-table__headline">
        <h2 class="users-table__title">{{ t('ABOUT.OUR_COMMUNITY') }}</h2>
        <p class="users-table__subtitle">{{ t('ABOUT.COMMUNITY_DESCRIPTION') }}</p>
      </div>

      <div class="users-table__filters">
        <Select
          v-model="filters.tier"
          :options="tierOptions"
          class="users-table__filter"
          @update:modelValue="handleFilterChange"
        />
        <span class="users-table__count">{{ t('ABOUT.TOTAL_USERS', { count: totalUsers }) }}</span>
      </div>
    </header>

    <div v-if="loading && !users.length" class="users-table__status">
      {{ t('ABOUT.LOADING_USERS') }}
    </div>

    <div v-else-if="error" class="users-table__status users-table__status_error">
      {{ error }}
    </div>

    <div v-else class="users-table__table-wrapper" :class="{ 'users-table__table-wrapper_refreshing': isRefreshing }">
      <Table
        class="users-table__table"
        :columns="columns"
        :rows="users"
        row-key="id"
        :sort-by="sortBy"
        :sort-order="sortOrder"
        sticky-header
        striped
        hoverable
        size="sm"
        @sort-change="handleSortChange"
      >
      <template #cell-avatar="{ row }">
        <div class="user-avatar">
          <img
            v-if="toUser(row).avatarUrl"
            :src="toUser(row).avatarUrl!"
            :alt="toUser(row).name || toUser(row).email"
            class="user-avatar__img"
          />
          <span v-else class="user-avatar__initials">{{ getUserInitials(toUser(row)) }}</span>
        </div>
      </template>

      <template #cell-name="{ row }">
        {{ toUser(row).name || toUser(row).email.split('@')[0] }}
      </template>

      <template #cell-email="{ value }">
        {{ value as string }}
      </template>

      <template #cell-createdAt="{ value }">
        {{ formatDate(value as string) }}
      </template>

      <template #cell-subscriptionTier="{ value }">
        <div class="user-status">
          <Icon
            v-if="(value as string) !== 'free'"
            :size="14"
            :class="['user-status__crown', { 'user-status__crown_premium': (value as string) === 'premium' }]"
            name="icon-crown"
          />
          <span
            :class="['user-status__badge', `user-status__badge_${value as string}`]"
          >
            {{ t(`ABOUT.TIER.${(value as string).toUpperCase()}`) }}
          </span>
        </div>
      </template>

      <template #empty>
        <div class="users-table__status">
          {{ t('ABOUT.NO_USERS') }}
        </div>
      </template>
    </Table>

      <div v-if="isRefreshing" class="users-table__refreshing-overlay">
        <div class="users-table__refreshing-spinner"></div>
      </div>
    </div>

    <div ref="loadMoreTrigger" class="users-table__sentinel" aria-hidden="true"></div>

    <div v-if="hasMore && !loading" class="users-table__load-more">
      <Button
        variant="secondary"
        size="md"
        @click="loadMore"
      >
        {{ t('ABOUT.LOAD_MORE') }}
      </Button>
    </div>

    <div v-if="loading && users.length" class="users-table__loading-more">
      {{ t('ABOUT.LOADING_MORE') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeUnmount, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Button, Select, Icon, Table, type TableColumn, type RowData } from '@/shared/ui'
import type { SelectOption } from '@/shared/ui'
import { getPublicUsers, type PublicUser } from '@/shared/api/users'
import {
  ABOUT_TIER_FILTER_OPTIONS,
  ABOUT_USERS_TABLE_COLUMNS,
  type TierFilter
} from '@/entities/about'

type SortField = 'name' | 'email' | 'createdAt' | 'subscriptionTier'

const allowedSorts: Record<string, SortField> = {
  name: 'name',
  email: 'email',
  createdat: 'createdAt',
  subscriptiontier: 'subscriptionTier'
}

const normalizeTier = (value?: string): TierFilter => {
  const tier = (value || '').toLowerCase()
  if (tier === 'free' || tier === 'pro' || tier === 'premium') {
    return tier
  }
  return 'all'
}

const normalizeSortBy = (value?: string): SortField => {
  if (!value) return 'createdAt'
  const normalized = value.toLowerCase()
  return allowedSorts[normalized] ?? 'createdAt'
}

const normalizeSortOrder = (value?: string): 'asc' | 'desc' => {
  if (!value) return 'desc'
  return value.toLowerCase() === 'asc' ? 'asc' : 'desc'
}

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const users = ref<PublicUser[]>([])
const loading = ref(false)
const isRefreshing = ref(false)
const error = ref('')
const currentPage = ref(1)
const totalUsers = ref(0)
const hasMore = ref(false)
const loadMoreTrigger = ref<HTMLElement | null>(null)
const pageSize = 20
let observer: IntersectionObserver | null = null

const initialTier = normalizeTier(route.query.tier as string | undefined)
const filters = ref({
  tier: initialTier
})
const lastSyncedTier = ref(initialTier)

const sortBy = ref<SortField>('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')

const tierOptions = computed<SelectOption[]>(() =>
  ABOUT_TIER_FILTER_OPTIONS.map((option) => ({
    value: option.value,
    label: t(option.labelKey)
  }))
)

const columns = computed<TableColumn[]>(() =>
  ABOUT_USERS_TABLE_COLUMNS.map((column) => {
    let accessor: ((row: RowData) => unknown) | undefined
    if (column.key === 'name') {
      accessor = (row) => {
        const user = toUser(row)
        return user.name || user.email.split('@')[0]
      }
    } else if (column.key === 'email') {
      accessor = (row) => toUser(row).email
    } else if (column.key === 'createdAt') {
      accessor = (row) => toUser(row).createdAt
    } else if (column.key === 'subscriptionTier') {
      accessor = (row) => toUser(row).subscriptionTier
    }

    return {
      key: column.key,
      label: t(column.labelKey),
      sortable: column.sortable,
      width: column.width,
      align: column.align,
      hideOnMobile: column.hideOnMobile,
      ...(accessor ? { accessor } : {})
    }
  })
)

function toUser(row: RowData): PublicUser {
  return row as unknown as PublicUser
}

function syncTierQuery() {
  if (lastSyncedTier.value === filters.value.tier) {
    return
  }

  lastSyncedTier.value = filters.value.tier

  const nextQuery = { ...route.query }
  nextQuery.tier = filters.value.tier
  delete nextQuery.sortBy
  delete nextQuery.sortOrder

  router.replace({ query: nextQuery }).catch(() => {})
}

function getUserInitials(user: PublicUser): string {
  const name = user.name || user.email
  return name.substring(0, 2).toUpperCase()
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

async function loadUsers(options: { reset?: boolean; page?: number } = {}) {
  if (loading.value) return

  const { reset = false, page = currentPage.value } = options

  // Если это обновление данных (сортировка/фильтр), показываем индикатор обновления
  if (reset && users.value.length > 0) {
    isRefreshing.value = true
  } else {
    loading.value = true
  }

  error.value = ''

  try {
    const response = await getPublicUsers({
      page,
      limit: pageSize,
      tier: filters.value.tier,
      sortBy: sortBy.value,
      sortOrder: sortOrder.value
    })

    if (reset) {
      users.value = response.users
      currentPage.value = 1
    } else {
      users.value.push(...response.users)
      currentPage.value = page
    }

    totalUsers.value = response.pagination.total
    hasMore.value = response.pagination.hasMore
  } catch (err: any) {
    error.value = err?.message || t('ABOUT.ERROR_LOADING')
    hasMore.value = false
  } finally {
    loading.value = false
    isRefreshing.value = false
  }
}

function handleFilterChange() {
  syncTierQuery()
  loadUsers({ reset: true, page: 1 })
}

function handleSortChange(payload: { sortBy: string; sortOrder: 'asc' | 'desc' }) {
  const nextSortBy = normalizeSortBy(payload.sortBy)
  const nextSortOrder = normalizeSortOrder(payload.sortOrder)
  sortBy.value = nextSortBy
  sortOrder.value = nextSortOrder
  loadUsers({ reset: true, page: 1 })
}

function loadMore() {
  if (!hasMore.value || loading.value) return
  const nextPage = currentPage.value + 1
  loadUsers({ page: nextPage })
}

function setupObserver() {
  if (observer) {
    observer.disconnect()
  }

  observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadMore()
        }
      })
    },
    { rootMargin: '160px 0px' }
  )

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }
}

watch(
  () => route.query.tier,
  (tier) => {
    const normalizedTier = normalizeTier(tier as string | undefined)
    if (normalizedTier === filters.value.tier) {
      return
    }

    filters.value.tier = normalizedTier
    lastSyncedTier.value = normalizedTier
    loadUsers({ reset: true, page: 1 })
  }
)

onMounted(() => {
  setupObserver()
  loadUsers({ reset: true, page: 1 })
})

watch(loadMoreTrigger, (newNode, oldNode) => {
  if (oldNode && observer) {
    observer.unobserve(oldNode)
  }
  if (newNode && observer) {
    observer.observe(newNode)
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<style lang="scss" scoped src="./users-table.scss"></style>
