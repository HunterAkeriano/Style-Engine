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
import { useHead } from '@unhead/vue'
import { getLocaleFromPath, setLocale, type Locale } from '@/app/providers'
import { getDocsPageContent } from '@/pages/docs/model/content'
import { DocsHero, DocsTopics, DocsPlaybook, DocsPrimer } from '@/widgets/docs'
import { useRoute } from 'vue-router'

const route = useRoute()
const routeLocale = computed(() => getLocaleFromPath(route.fullPath) as Locale)
setLocale(routeLocale.value)

const { t } = useI18n()

const content = computed(() => getDocsPageContent(routeLocale.value))

const topicsLabel = computed(() => t('DOCS.TOPICS_LABEL'))
const topicsTitle = computed(() => t('DOCS.TOPICS_TITLE'))
const topicsSubtitle = computed(() => t('DOCS.TOPICS_SUBTITLE'))
const openLabel = computed(() => t('DOCS.OPEN_TOPIC'))

const playbookLabel = computed(() => t('DOCS.PLAYBOOK_LABEL'))
const playbookTitle = computed(() => t('DOCS.PLAYBOOK_TITLE'))
const playbookSubtitle = computed(() => t('DOCS.PLAYBOOK_SUBTITLE'))

const primerLabel = computed(() => t('DOCS.PRIMER_LABEL'))

useHead(() => {
  const title = t('META.DOCS')
  const description = t('META_DESCRIPTION.DOCS')
  const url = typeof window !== 'undefined' ? window.location.href : ''

  const metaEntries = [
    description ? { name: 'description', content: description } : null,
    { property: 'og:title', content: title },
    description ? { property: 'og:description', content: description } : null,
    { property: 'og:type', content: 'website' },
    url ? { property: 'og:url', content: url } : null
  ].filter(Boolean) as { name?: string; property?: string; content: string }[]

  return {
    title,
    meta: metaEntries,
    link: url ? [{ rel: 'canonical', href: url }] : []
  }
})
</script>

<style lang="scss" scoped src="./docs-page.scss"></style>
