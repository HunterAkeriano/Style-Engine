<template>
  <div class="docs-page">
    <div class="container">
      <DocsHero :content="content.hero" />
    </div>

    <div class="container">
      <DocsTopics
        :eyebrow="topicsLabel"
        :title="topicsTitle"
        :subtitle="topicsSubtitle"
        :topics="content.topics"
        :open-label="openLabel"
      />
    </div>

    <div class="container">
      <DocsPrimer
        :eyebrow="primerLabel"
        :title="content.primer.title"
        :subtitle="content.primer.subtitle"
        :sections="content.primer.sections"
      />
    </div>

    <div class="container">
      <DocsPlaybook
        :eyebrow="playbookLabel"
        :title="playbookTitle"
        :subtitle="playbookSubtitle"
        :snippets="content.playbook"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Locale } from '@/app/providers/i18n'
import { getDocsPageContent } from '@/pages/docs/model/content'
import { DocsHero, DocsTopics, DocsPlaybook, DocsPrimer } from '@/widgets/docs'

const { locale, t } = useI18n()

const content = computed(() => getDocsPageContent(locale.value as Locale))

const topicsLabel = computed(() => t('DOCS.TOPICS_LABEL'))
const topicsTitle = computed(() => t('DOCS.TOPICS_TITLE'))
const topicsSubtitle = computed(() => t('DOCS.TOPICS_SUBTITLE'))
const openLabel = computed(() => t('DOCS.OPEN_TOPIC'))

const playbookLabel = computed(() => t('DOCS.PLAYBOOK_LABEL'))
const playbookTitle = computed(() => t('DOCS.PLAYBOOK_TITLE'))
const playbookSubtitle = computed(() => t('DOCS.PLAYBOOK_SUBTITLE'))

const primerLabel = computed(() => t('DOCS.PRIMER_LABEL'))
</script>

<style lang="scss" scoped src="./DocsPage.scss"></style>
