<template>
  <section class="about-hero">
    <p class="about-hero__eyebrow">{{ t('ABOUT.PAGE_TAG') }}</p>

    <div class="about-hero__headline">
      <h1 class="about-hero__title">
        <span class="about-hero__title-base">{{ t('ABOUT.PAGE_TITLE') }}</span>
        <span class="about-hero__title-highlight">{{ t('ABOUT.PAGE_TITLE_HIGHLIGHT') }}</span>
      </h1>
      <div class="about-hero__glow" aria-hidden="true"></div>
      <div class="about-hero__orb about-hero__orb_left" aria-hidden="true"></div>
      <div class="about-hero__orb about-hero__orb_right" aria-hidden="true"></div>
    </div>

    <p class="about-hero__subtitle">{{ t('ABOUT.PAGE_SUBTITLE') }}</p>

    <div class="about-hero__grid" aria-hidden="true"></div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./about-hero.scss"></style>
