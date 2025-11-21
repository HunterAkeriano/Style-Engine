<template>
  <section class="docs-primer">
    <div class="docs-primer__head">
      <p class="docs-primer__eyebrow">{{ eyebrow }}</p>
      <h2 class="docs-primer__title">{{ title }}</h2>
      <p class="docs-primer__subtitle">{{ subtitle }}</p>
    </div>

    <div class="docs-primer__grid">
      <article v-for="section in sections" :key="section.title" class="docs-primer__card">
        <div class="docs-primer__header">
          <h3>{{ section.title }}</h3>
          <p class="docs-primer__description">{{ section.description }}</p>
        </div>
        <ul class="docs-primer__list">
          <li v-for="item in section.items" :key="item">{{ item }}</li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DocsPrimerSection } from '@/pages/docs/model/content'

defineProps<{
  eyebrow: string
  title: string
  subtitle: string
  sections: DocsPrimerSection[]
}>()
</script>

<style lang="scss" scoped src="./docs-primer.scss"></style>
