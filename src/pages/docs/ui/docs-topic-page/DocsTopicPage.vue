<template>
  <div class="docs-topic-page">
    <div class="container">
      <DocsTopicContent :topic="topic" :other-topics="otherTopics" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import type { Locale } from '@/app/providers/i18n'
import { getDocsTopicContent, type DocsTopicKey } from '@/pages/docs/model/content'
import DocsTopicContent from './components/docs-topic-content/DocsTopicContent.vue'

const props = defineProps<{ topic: DocsTopicKey }>()
const { locale } = useI18n()

const localized = computed(() => getDocsTopicContent(locale.value as Locale, props.topic))
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

<style lang="scss" scoped src="./DocsTopicPage.scss"></style>
