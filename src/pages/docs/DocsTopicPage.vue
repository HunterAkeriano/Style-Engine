<template>
  <div class="docs-topic-page">
    <div class="container">
      <DocsTopicLayout :topic="topic" :other-topics="otherTopics" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Locale } from '@/app/providers/i18n'
import { getDocsTopicContent, type DocsTopicKey } from './model/content'
import DocsTopicLayout from '@/widgets/docs/DocsTopicLayout.vue'

const props = defineProps<{ topic: DocsTopicKey }>()
const { locale } = useI18n()

const localized = computed(() => getDocsTopicContent(locale.value as Locale, props.topic))
const topic = computed(() => localized.value.topic)
const otherTopics = computed(() => localized.value.otherTopics)
</script>

<style scoped>
.docs-topic-page {
  padding: 2.5rem 0 3.5rem;
  background: linear-gradient(180deg, color-var-alpha('color-primary', 0.08), transparent 30%),
              $hero-background;
}
</style>
