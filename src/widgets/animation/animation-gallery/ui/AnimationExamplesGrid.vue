<template>
  <div class="animation-examples">
    <div class="animation-page__gallery-header">
      <div>
        <p class="animation-page__gallery-tag">{{ t('ANIMATION.SNIPPETS_TAG') }}</p>
        <h2 class="animation-page__gallery-title">{{ t('ANIMATION.SNIPPETS_TITLE') }}</h2>
        <p class="animation-page__gallery-subtitle">
          {{ t('ANIMATION.SNIPPETS_SUBTITLE') }}
        </p>
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
          type="text"
          :placeholder="t('ANIMATION.SEARCH_PLACEHOLDER')"
          :label="t('ANIMATION.SEARCH_LABEL')"
        >
          <template #prefix>
            <Icon name="icon-search" :size="16" />
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
      <Icon name="icon-search" :size="48" class="animation-page__empty-icon" />
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
            <h3 class="animation-card__title">{{ t(example.titleKey) }}</h3>
            <p class="animation-card__description">{{ t(example.descriptionKey) }}</p>
          </div>
        </div>

        <div class="animation-card__preview">
          <component :is="example.component" />
        </div>

        <NavLink
          className="animation-card__link"
          :to="`/animation/${example.id}`"
        >
          {{ t('ANIMATION.OPEN') }}
        </NavLink>
      </article>
    </div>

    <div v-if="totalPages > 1" class="animation-page__pagination">
      <button
        class="animation-page__pagination-button"
        :disabled="currentPage === 1"
        @click="goToPage(currentPage - 1)"
      >
        {{ t('ANIMATION.PREVIOUS') }}
      </button>

      <div class="animation-page__pagination-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          class="animation-page__pagination-number"
          :class="{ active: currentPage === page }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="animation-page__pagination-button"
        :disabled="currentPage === totalPages"
        @click="goToPage(currentPage + 1)"
      >
        {{ t('ANIMATION.NEXT') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, type ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NavLink, Select, Input, Icon } from '@/shared/ui'
import type { SelectOption } from '@/shared/ui'
import type { AnimationCategory } from '@/entities/animation/model/examplesData'

interface ExampleItem {
  id: string
  titleKey: string
  descriptionKey: string
  category: AnimationCategory
  component: any
}

const props = defineProps<{
  examples: ExampleItem[] | ComputedRef<ExampleItem[]>
}>()

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const searchQuery = ref<string>((route.query.search as string) ?? '')
const debouncedSearchQuery = ref<string>(searchQuery.value)
const isSearching = ref<boolean>(false)
const selectedCategory = ref<string>((route.query.category as string) ?? 'all')
const currentPage = ref(Number(route.query.page) > 0 ? Number(route.query.page) : 1)
const itemsPerPage = 12
let debounceTimeout: ReturnType<typeof setTimeout> | null = null

const allowedCategories = computed(() => [
  'all',
  'loaders',
  'marquee',
  'effects',
  'transitions',
  'orbital',
  'interactive'
])

const categoryOptions = computed<SelectOption[]>(() => [
  { label: t('ANIMATION.ALL_TYPES'), value: 'all' },
  { label: t('ANIMATION.CATEGORY.LOADERS'), value: 'loaders' },
  { label: t('ANIMATION.CATEGORY.MARQUEE'), value: 'marquee' },
  { label: t('ANIMATION.CATEGORY.EFFECTS'), value: 'effects' },
  { label: t('ANIMATION.CATEGORY.TRANSITIONS'), value: 'transitions' },
  { label: t('ANIMATION.CATEGORY.ORBITAL'), value: 'orbital' },
  { label: t('ANIMATION.CATEGORY.INTERACTIVE'), value: 'interactive' }
])

const normalizedExamples = computed<ExampleItem[]>(() =>
  Array.isArray((props.examples as any).value) ? (props.examples as any).value : (props.examples as ExampleItem[])
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
      const title = t(example.titleKey).toLowerCase()
      const description = t(example.descriptionKey).toLowerCase()
      return title.includes(query) || description.includes(query)
    })
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredExamples.value.length / itemsPerPage))

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

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

watch(searchQuery, (newQuery) => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }

  if (newQuery.trim()) {
    isSearching.value = true
  }

  debounceTimeout = setTimeout(() => {
    debouncedSearchQuery.value = newQuery
    isSearching.value = false
    currentPage.value = 1
  }, 500)
})

watch(selectedCategory, () => {
  currentPage.value = 1
})

function updateQueryParams() {
  const query = { ...route.query }

  if (searchQuery.value.trim()) {
    query.search = searchQuery.value.trim()
  } else {
    delete query.search
  }

  if (selectedCategory.value !== 'all') {
    query.category = selectedCategory.value
  } else {
    delete query.category
  }

  if (currentPage.value > 1) {
    query.page = String(currentPage.value)
  } else {
    delete query.page
  }

  router.replace({ query })
}

watch([searchQuery, selectedCategory, currentPage], updateQueryParams)

watch(
  () => route.query,
  (query) => {
    const incomingSearch = (query.search as string) ?? ''
    const incomingCategory = (query.category as string) ?? 'all'
    const incomingPage = Number(query.page) > 0 ? Number(query.page) : 1

    if (incomingSearch !== searchQuery.value) {
      searchQuery.value = incomingSearch
      debouncedSearchQuery.value = incomingSearch
    }

    if (allowedCategories.value.includes(incomingCategory) && incomingCategory !== selectedCategory.value) {
      selectedCategory.value = incomingCategory
    } else if (!allowedCategories.value.includes(incomingCategory) && selectedCategory.value !== 'all') {
      selectedCategory.value = 'all'
    }

    if (incomingPage !== currentPage.value) {
      currentPage.value = incomingPage
    }
  }
)

watch(filteredExamples, () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = Math.max(1, totalPages.value)
  }
})
</script>

<style lang="scss" scoped src="./animation-examples-grid.scss"></style>
