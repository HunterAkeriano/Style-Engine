<template>
<section
  ref="sectionRef"
  class="docs-hero"
  :class="{ 'is-visible': isVisible }"
>
    <div class="docs-hero__text">
      <p class="docs-hero__eyebrow">{{ content.eyebrow }}</p>
      <h1 class="docs-hero__title">{{ content.title }}</h1>
      <p class="docs-hero__subtitle">{{ content.subtitle }}</p>

      <div class="docs-hero__cta">
        <NavLink
          v-for="action in content.cta"
          :key="action.to"
          :to="action.to"
          :class-name="`button ${action.variant === 'primary' ? 'button_primary' : 'button_secondary'}`"
        >
          {{ action.label }}
        </NavLink>
      </div>

      <div class="docs-hero__meta">
        <span v-for="label in content.meta" :key="label">{{ label }}</span>
      </div>
    </div>

    <div class="docs-hero__visual" aria-hidden="true">
      <div class="docs-hero__gradient"></div>
      <div class="docs-hero__rings">
        <span class="docs-hero__ring docs-hero__ring_accent"></span>
        <span class="docs-hero__ring docs-hero__ring_soft"></span>
        <span class="docs-hero__ring docs-hero__ring_glow"></span>
      </div>
      <div class="docs-hero__orbit">
        <span class="docs-hero__dot"></span>
        <span class="docs-hero__dot docs-hero__dot_lag"></span>
        <span class="docs-hero__dot docs-hero__dot_tiny"></span>
      </div>
      <div class="docs-hero__panel">
        <p class="docs-hero__panel-title">pattern.css</p>
        <pre class="docs-hero__code"><code>{{ defaultCode }}</code></pre>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DocsHeroContent } from '@/entities/docs'
import { NavLink } from '@/shared/ui'
import { useSectionVisibility } from '@/shared/composables'

const defaultCode = `@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}`

defineProps<{
  content: DocsHeroContent
}>()

const { sectionRef, isVisible } = useSectionVisibility()
</script>

<style lang="scss" scoped src="./docs-hero.scss"></style>
