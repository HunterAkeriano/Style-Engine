<template>
  <section class="docs-topics">
    <div class="docs-topics__head">
      <p class="docs-topics__eyebrow">{{ eyebrow }}</p>
      <h2 class="docs-topics__title">{{ title }}</h2>
      <p class="docs-topics__subtitle">{{ subtitle }}</p>
    </div>

    <div class="docs-topics__cards">
      <article
        v-for="topic in topics"
        :key="topic.slug"
        class="docs-card"
      >
        <div class="docs-card__head">
          <span class="docs-card__badge">{{ topic.badge }}</span>
          <h3 class="docs-card__title">{{ topic.title }}</h3>
          <p class="docs-card__description">{{ topic.description }}</p>
        </div>

        <div :class="['docs-card__preview', topic.previewClass]">
          <p class="docs-card__label">{{ topic.previewLabel }}</p>
          <div class="docs-card__visual">
            <span v-for="n in topic.previewDots" :key="n" class="docs-card__dot"></span>
          </div>
        </div>

        <ul class="docs-card__list">
          <li v-for="point in topic.points" :key="point">{{ point }}</li>
        </ul>

        <div class="docs-card__footer">
          <NavLink :to="topic.link" className="button button_primary button_sm">
            {{ openLabel }}
          </NavLink>
          <span class="docs-card__hint">{{ topic.hint }}</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DocsTopicCard } from '@/pages/docs/model/content'
import { NavLink } from '@/shared/ui'

defineProps<{
  eyebrow: string
  title: string
  subtitle: string
  topics: DocsTopicCard[]
  openLabel: string
}>()
</script>

<style lang="scss" scoped src="./docs-topics.scss"></style>
