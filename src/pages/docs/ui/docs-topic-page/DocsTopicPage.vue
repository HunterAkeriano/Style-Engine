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
import { getDocsTopicContent, type DocsTopicKey } from '@/pages/docs/model/content'
import { DocsTopicLayout } from '@/widgets/docs'

const props = defineProps<{ topic: DocsTopicKey }>()
const { locale } = useI18n()

const localized = computed(() => getDocsTopicContent(locale.value as Locale, props.topic))
const topic = computed(() => localized.value.topic)
const otherTopics = computed(() => localized.value.otherTopics)
</script>

<style lang="scss" scoped src="./DocsTopicPage.scss"></style>
