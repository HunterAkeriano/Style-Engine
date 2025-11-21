<template>
  <div class="container">
    <section class="home-about">
      <div class="home-about__text">
        <p class="home-about__eyebrow">{{ t('HOME.ABOUT_TAG') }}</p>
        <h2 class="home-about__title">{{ t('HOME.ABOUT_TITLE') }}</h2>
        <p class="home-about__description">
          {{ t('HOME.ABOUT_TEXT') }}
        </p>
        <ul class="home-about__points">
          <li>{{ t('HOME.ABOUT_POINT_1') }}</li>
          <li>{{ t('HOME.ABOUT_POINT_2') }}</li>
          <li>{{ t('HOME.ABOUT_POINT_3') }}</li>
        </ul>
      </div>

      <div class="home-about__visual" aria-hidden="true">
        <div class="home-about__visual-card">
          <div class="home-about__visual-grid"></div>
          <div class="home-about__visual-planet"></div>
          <div class="home-about__visual-orbit"></div>
          <div class="home-about__visual-core"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./home-about.scss"></style>
