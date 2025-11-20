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
import { computed, ref, type ComputedRef } from 'vue'
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

const searchQuery = ref<string>('')
const debouncedSearchQuery = ref<string>('')
const isSearching = ref<boolean>(false)
const selectedCategory = ref<string>('all')
const currentPage = ref(1)
const itemsPerPage = 12
let debounceTimeout: number | null = null

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

  // Filter by category
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(example => example.category === selectedCategory.value)
  }

  // Filter by search query
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
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Debounce search query
import { watch } from 'vue'
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

// Reset to page 1 when category changes
watch(selectedCategory, () => {
  currentPage.value = 1
})
</script>

<style lang="scss" scoped src="./AnimationExamplesGrid.scss"></style>