<template>
  <section class="animation-hero">
    <div class="animation-hero__orbits" aria-hidden="true">
      <span class="animation-hero__ring animation-hero__ring_outer"></span>
      <span class="animation-hero__ring animation-hero__ring_inner"></span>
      <span class="animation-hero__planet animation-hero__planet_primary"></span>
      <span class="animation-hero__planet animation-hero__planet_secondary"></span>
      <span class="animation-hero__planet animation-hero__planet_tertiary"></span>
    </div>
    <p class="animation-hero__eyebrow">{{ eyebrow }}</p>
    <h1 class="animation-hero__title">{{ title }}</h1>
    <p class="animation-hero__subtitle">
      {{ subtitle }}
    </p>
    <div class="animation-hero__meta">
      <span class="animation-hero__chip">{{ t('ANIMATION.HTML_CSS') }}</span>
      <span class="animation-hero__chip">{{ t('ANIMATION.LIVE_PREVIEW') }}</span>
      <span class="animation-hero__chip">{{ t('ANIMATION.KEYFRAMES_READY') }}</span>
    </div>
    <div class="animation-hero__actions">
      <NavLink to="/" className="button button_primary">
        {{ backText }}
      </NavLink>
      <a
        class="animation-hero__link"
        :href="docsLink"
        target="_blank"
        rel="noreferrer"
      >
        {{ docsText }}
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NavLink } from '@/shared/ui'
import { useI18n } from 'vue-i18n'

interface Props {
  eyebrow: string
  title: string
  subtitle: string
  backText: string
  docsText: string
  docsLink: string
}

defineProps<Props>()

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./AnimationHero.scss"></style>