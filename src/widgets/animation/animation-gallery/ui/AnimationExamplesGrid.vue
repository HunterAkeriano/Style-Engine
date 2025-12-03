<template>
  <div class="animation-examples">
    <div class="animation-page__gallery-header">
      <div>
        <p class="animation-page__gallery-tag">{{ t('ANIMATION.SNIPPETS_TAG') }}</p>
        <h2 class="animation-page__gallery-title">{{ t('ANIMATION.SNIPPETS_TITLE') }}</h2>
        <p class="animation-page__gallery-subtitle">{{ t('ANIMATION.SNIPPETS_SUBTITLE') }}</p>
      </div>
      <div class="animation-page__legend">
        <span class="animation-page__dot animation-page__dot_primary"></span>
        <span>{{ t('ANIMATION.HTML_CSS') }}</span>
      </div>
    </div>

    <div class="animation-page__controls">
      <div class="animation-page__search">
        <Input
          v-model="searchQuery"
          :placeholder="t('ANIMATION.SEARCH_PLACEHOLDER')"
          :label="t('ANIMATION.SEARCH_LABEL')"
          type="text"
        >
          <template #prefix>
            <Icon :size="16" name="icon-search" />
          </template>
        </Input>
      </div>

      <div class="animation-page__filter">
        <Select
          v-model="selectedCategory"
          :options="categoryOptions"
          :label="t('ANIMATION.FILTER_BY_TYPE')"
        />
      </div>

      <div class="animation-page__results">
        {{ t('ANIMATION.SHOWING_RESULTS', { count: filteredExamples.length, total: totalCount }) }}
      </div>
    </div>

    <div v-if="isSearching" class="animation-page__loading">
      <div class="animation-page__loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <p class="animation-page__loading-text">{{ t('ANIMATION.SEARCHING') }}</p>
    </div>

    <div v-else-if="filteredExamples.length === 0" class="animation-page__empty">
      <Icon :size="48" class="animation-page__empty-icon" name="icon-search" />
      <h3 class="animation-page__empty-title">{{ t('ANIMATION.NO_RESULTS') }}</h3>
      <p class="animation-page__empty-text">{{ t('ANIMATION.NO_RESULTS_HINT') }}</p>
    </div>

    <div v-else class="animation-page__cards">
      <article
        v-for="example in paginatedExamples"
        :key="example.id"
        class="animation-card"
      >
        <div class="animation-card__head">
          <div>
            <p class="animation-card__tag">{{ t('ANIMATION.PREVIEW') }}</p>
            <h3 class="animation-card__title">{{ displayTitle(example) }}</h3>
            <p class="animation-card__description">{{ displayDescription(example) }}</p>
          </div>
        </div>

        <div v-if="example.owner" class="animation-card__author">
          <div class="animation-card__avatar" :style="computeCreatorAvatarStyle(example.owner)">
            <span v-if="!example.owner.avatarUrl">{{ computeCreatorInitials(example.owner) }}</span>
          </div>
          <div>
            <span class="animation-card__author-name" :title="computeCreatorLabel(example.owner)">
              {{ computeCreatorLabel(example.owner) }}
            </span>
            <span class="animation-card__author-badge" v-if="example.isCommunity">
              {{ t('ANIMATION.COMMUNITY_BADGE') }}
            </span>
          </div>
        </div>

        <div v-if="example.component" class="animation-card__preview">
          <component :is="example.component" />
        </div>
        <div v-else class="animation-card__preview animation-card__preview_placeholder">
          <pre class="animation-card__preview-text">{{ example.previewText || t('ANIMATION.COMMUNITY_PREVIEW_PLACEHOLDER') }}</pre>
        </div>

        <NavLink
          v-if="!example.isCommunity"
          :to="`/animation/${example.id}`"
          class-name="animation-card__link"
        >
          {{ t('ANIMATION.OPEN') }}
        </NavLink>
      </article>
    </div>

    <div v-if="totalPages > 1" class="animation-page__pagination">
      <button
        :disabled="currentPage === 1"
        class="animation-page__pagination-button"
        @click="goToPage(currentPage - 1)"
      >
        {{ t('ANIMATION.PREVIOUS') }}
      </button>

      <div class="animation-page__pagination-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="{ active: currentPage === page }"
          class="animation-page__pagination-number"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        :disabled="currentPage === totalPages"
        class="animation-page__pagination-button"
        @click="goToPage(currentPage + 1)"
      >
        {{ t('ANIMATION.NEXT') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onBeforeUnmount, isRef, type ComputedRef, type Component } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NavLink, Select, Input, Icon } from '@/shared/ui'
import type { SelectOption } from '@/shared/ui'
import type { AnimationCategory } from '@/entities/animation/model/examples-data'
import type { CreatorProfile } from '@/shared/types'
import {
  getCreatorAvatarStyle as computeCreatorAvatarStyle,
  getCreatorInitials as computeCreatorInitials,
  getCreatorLabel as computeCreatorLabel
} from '@/shared/lib/creator'

interface ExampleItem {
  id: string
  titleKey: string
  descriptionKey: string
  category: AnimationCategory
  component?: Component
  titleText?: string
  descriptionText?: string
  html?: string
  css?: string
  owner?: CreatorProfile
  previewText?: string
  isCommunity?: boolean
}

const props = defineProps<{
  examples: ExampleItem[] | ComputedRef<ExampleItem[]>
}>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const searchQuery = ref<string>(typeof route.query.search === 'string' ? route.query.search : '')
const debouncedSearchQuery = ref<string>(searchQuery.value)
const isSearching = ref<boolean>(false)
const selectedCategory = ref<string>(typeof route.query.category === 'string' ? route.query.category : 'all')
const currentPage = ref(
  typeof route.query.page === 'string' && Number(route.query.page) > 0 ? Number(route.query.page) : 1
)
const itemsPerPage = 12
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

const categoryOptions = computed<SelectOption[]>(() => [
  { label: t('ANIMATION.ALL_TYPES'), value: 'all' },
  { label: t('ANIMATION.CATEGORY.LOADERS'), value: 'loaders' },
  { label: t('ANIMATION.CATEGORY.MARQUEE'), value: 'marquee' },
  { label: t('ANIMATION.CATEGORY.EFFECTS'), value: 'effects' },
  { label: t('ANIMATION.CATEGORY.TRANSITIONS'), value: 'transitions' },
  { label: t('ANIMATION.CATEGORY.ORBITAL'), value: 'orbital' },
  { label: t('ANIMATION.CATEGORY.INTERACTIVE'), value: 'interactive' },
  { label: t('ANIMATION.CATEGORY.COMMUNITY'), value: 'community' }
])

const normalizedExamples = computed<ExampleItem[]>(() =>
  isRef(props.examples) ? props.examples.value : props.examples
)

const totalCount = computed(() => normalizedExamples.value.length)

const filteredExamples = computed(() => {
  let filtered = normalizedExamples.value

  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(example => example.category === selectedCategory.value)
  }

  if (debouncedSearchQuery.value.trim()) {
    const query = debouncedSearchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(example => {
      const title = displayTitle(example).toLowerCase()
      const description = displayDescription(example).toLowerCase()
      return title.includes(query) || description.includes(query)
    })
  }

  return filtered
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredExamples.value.length / itemsPerPage)))

const paginatedExamples = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredExamples.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5

  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const endPage = Math.min(totalPages.value, startPage + maxVisible - 1)

  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

function displayTitle(example: ExampleItem) {
  return example.titleText || t(example.titleKey)
}

function displayDescription(example: ExampleItem) {
  return example.descriptionText || t(example.descriptionKey)
}

function goToPage(page: number) {
  currentPage.value = page
  updateRoute()
}

function updateRoute() {
  const nextQuery = {
    ...route.query,
    page: currentPage.value,
    category: selectedCategory.value !== 'all' ? selectedCategory.value : undefined,
    search: debouncedSearchQuery.value || undefined
  }
  router.replace({ query: nextQuery })
}

watch(searchQuery, (next) => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  isSearching.value = true
  debounceTimeout = setTimeout(() => {
    debouncedSearchQuery.value = next
    currentPage.value = 1
    updateRoute()
    isSearching.value = false
  }, 250)
})

watch([selectedCategory, () => currentPage.value], () => {
  updateRoute()
})

watch(
  () => route.query.category,
  (category) => {
    selectedCategory.value = (category as string) ?? 'all'
  }
)

watch(
  () => route.query.page,
  (page) => {
    currentPage.value = Number(page) > 0 ? Number(page) : 1
  }
)

watch(
  () => route.query.search,
  (value) => {
    searchQuery.value = (value as string) ?? ''
  }
)

onBeforeUnmount(() => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
})
</script>

<style lang="scss" scoped src="./animation-examples-grid.scss"></style>
