<template>
  <div class="docs-topic-page">
    <div class="container">
      <Breadcrumbs :current-label="topic.title" />
      <DocsTopicContent :topic="topic" :other-topics="otherTopics" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { type Locale, getLocaleFromPath, persistLocale } from '@/shared/config/locales'
import { getDocsTopicContent, type DocsTopicKey } from '@/entities/docs'
import DocsTopicContent from './components/docs-topic-content/DocsTopicContent.vue'
import { Breadcrumbs } from '@/widgets/common'

const props = defineProps<{ topic: DocsTopicKey }>()
const route = useRoute()
const routeLocale = computed(() => getLocaleFromPath(route.fullPath) as Locale)
const { locale } = useI18n()

watch(
  routeLocale,
  (value) => {
    locale.value = value
    persistLocale(value)
  },
  { immediate: true }
)

const localized = computed(() => getDocsTopicContent(routeLocale.value, props.topic))
const topic = computed(() => localized.value.topic)
const otherTopics = computed(() => localized.value.otherTopics)

useHead(() => {
  const title = topic.value?.title ?? 'Docs'
  const description = topic.value?.subtitle ?? ''
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const metaEntries = [
    description ? { name: 'description', content: description } : null,
    { property: 'og:title', content: title },
    description ? { property: 'og:description', content: description } : null,
    { property: 'og:type', content: 'article' },
    url ? { property: 'og:url', content: url } : null
  ].filter(Boolean) as { name?: string; property?: string; content: string }[]

  return {
    title,
    meta: metaEntries,
    link: url ? [{ rel: 'canonical', href: url }] : []
  }
})
</script>

<style lang="scss" scoped src="./docs-topic-page.scss"></style>
