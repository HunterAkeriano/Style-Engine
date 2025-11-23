<template>
  <section class="docs-hero">
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
        <p class="docs-hero__panel-title">motion.css</p>
        <pre class="docs-hero__code"><code>@keyframes float {
  from { transform: translateY(0); }
  50% { transform: translateY(-8px); }
  to { transform: translateY(0); }
}</code></pre>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { DocsHeroContent } from '@/pages/docs/model/content'
import { NavLink } from '@/shared/ui'

defineProps<{
  content: DocsHeroContent
}>()
</script>

<style lang="scss" scoped src="./docs-hero.scss"></style>
