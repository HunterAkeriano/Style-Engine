<template>
  <div class="docs-topic">
    <header class="docs-topic__header">
      <div class="docs-topic__breadcrumb">
        <NavLink to="/docs" class-name="docs-topic__back">{{ backLabel }}</NavLink>
        <span class="docs-topic__pill">{{ topic.eyebrow }}</span>
      </div>
      <h1 class="docs-topic__title">{{ topic.title }}</h1>
      <p class="docs-topic__subtitle">{{ topic.subtitle }}</p>
    </header>

    <section class="docs-topic__grid">
      <article class="docs-topic__panel">
        <div class="docs-topic__panel-head">
          <p class="docs-topic__pill docs-topic__pill_ghost">{{ checklistLabel }}</p>
          <h2>{{ topic.checklist.title }}</h2>
          <p class="docs-topic__muted">{{ topic.checklist.subtitle }}</p>
        </div>
        <ul class="docs-topic__list">
          <li v-for="point in topic.checklist.points" :key="point">
            {{ point }}
          </li>
        </ul>
      </article>

      <article class="docs-topic__panel">
        <div class="docs-topic__panel-head">
          <p class="docs-topic__pill docs-topic__pill_ghost">{{ demoLabel }}</p>
          <h2>{{ topic.preview.title }}</h2>
          <p class="docs-topic__muted">{{ topic.preview.subtitle }}</p>
        </div>

        <div :class="['docs-topic__preview', topic.preview.className]">
          <div v-for="layer in topic.preview.layers" :key="layer" class="docs-topic__layer"></div>
          <div v-if="topic.preview.dots" class="docs-topic__chips">
            <span
              v-for="idx in topic.preview.dots"
              :key="idx"
              class="docs-topic__chip"
              :style="{ animationDelay: `${idx * 0.12}s` }"
            />
          </div>
        </div>

        <div class="docs-topic__code-wrap">
          <pre class="docs-topic__code"><code>{{ topic.preview.code }}</code></pre>
          <Button size="sm" variant="ghost" @click="copy(topic.preview.code)">
            {{ copyLabel }}
          </Button>
        </div>
      </article>

      <article class="docs-topic__panel docs-topic__panel_wide">
        <div class="docs-topic__panel-head">
          <p class="docs-topic__pill docs-topic__pill_ghost">{{ patternsLabel }}</p>
          <h2>{{ topic.patterns.title }}</h2>
          <p class="docs-topic__muted">{{ topic.patterns.subtitle }}</p>
        </div>

        <div class="docs-topic__pattern-grid">
          <div
            v-for="pattern in topic.patterns.items"
            :key="pattern.title"
            class="docs-topic__pattern-card"
          >
            <div :class="['docs-topic__mini-preview', pattern.className]"></div>
            <div class="docs-topic__pattern-body">
              <h3>{{ pattern.title }}</h3>
              <p class="docs-topic__muted">{{ pattern.description }}</p>
              <div class="docs-topic__code-wrap">
                <pre class="docs-topic__code"><code>{{ pattern.code }}</code></pre>
                <Button size="sm" variant="ghost" @click="copy(pattern.code)">
                  {{ copyLabel }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <aside class="docs-topic__panel docs-topic__panel_aside">
        <div class="docs-topic__panel-head">
          <p class="docs-topic__pill docs-topic__pill_ghost">{{ linksLabel }}</p>
          <h2>{{ otherLabel }}</h2>
        </div>
        <div class="docs-topic__links">
          <NavLink
            v-for="other in otherTopics"
            :key="other.slug"
            :to="other.link"
            class-name="docs-topic__link"
          >
            <span class="docs-topic__link-dot"></span>
            {{ other.title }}
          </NavLink>
        </div>
      </aside>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useI18n } from 'vue-i18n'
import type { DocsTopicContent } from '@/pages/docs/model/content'
import { Button, NavLink } from '@/shared/ui'
import { copyToClipboard } from '@/shared/lib'

defineProps<{
  topic: DocsTopicContent
  otherTopics: DocsTopicContent[]
}>()

const { t } = useI18n()
const toast = useToast()

const checklistLabel = computed(() => t('DOCS.CHECKLIST'))
const demoLabel = computed(() => t('DOCS.DEMO'))
const patternsLabel = computed(() => t('DOCS.PATTERNS'))
const linksLabel = computed(() => t('DOCS.LINKS'))
const otherLabel = computed(() => t('DOCS.OTHER_TOPICS'))
const backLabel = computed(() => t('DOCS.BACK'))
const copyLabel = computed(() => t('DOCS.COPY'))

async function copy(code: string) {
  const ok = await copyToClipboard(code)
  toast[ok ? 'success' : 'error'](t(ok ? 'COMMON.COPIED_TO_CLIPBOARD' : 'COMMON.COPY_FAILED'))
}
</script>

<style lang="scss" scoped src="./docs-topic-content.scss"></style>
