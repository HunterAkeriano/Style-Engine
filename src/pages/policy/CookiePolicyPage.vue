<template>
  <section class="policy-page policy-page--cookie">
    <div class="policy-page__bg" aria-hidden="true"></div>
    <div class="policy-page__container">
      <div class="policy-page__header">
        <p class="policy-page__tag">{{ t('COOKIE.TAG') }}</p>
        <h1 class="policy-page__title">
          <span class="policy-page__title-base">{{ t('COOKIE.TITLE') }}</span>
          <span class="policy-page__title-highlight">{{ t('COOKIE.HIGHLIGHT') }}</span>
        </h1>
        <p class="policy-page__subtitle">{{ t('COOKIE.SUBTITLE') }}</p>
      </div>

      <div class="policy-page__content">
        <div class="policy-page__section" v-for="section in sections" :key="section.title">
          <div class="policy-page__section-head">
            <span class="policy-page__pill">{{ section.pill }}</span>
            <h2 class="policy-page__section-title">{{ section.title }}</h2>
          </div>
          <p class="policy-page__section-text">{{ section.body }}</p>
          <ul v-if="section.items?.length" class="policy-page__list">
            <li v-for="item in section.items" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const sections = computed(() => [
  {
    pill: t('COOKIE.PILL_TYPES'),
    title: t('COOKIE.SECTIONS.TYPES_TITLE'),
    body: t('COOKIE.SECTIONS.TYPES_BODY'),
    items: [
      t('COOKIE.SECTIONS.TYPES_POINTS.0'),
      t('COOKIE.SECTIONS.TYPES_POINTS.1'),
      t('COOKIE.SECTIONS.TYPES_POINTS.2')
    ]
  },
  {
    pill: t('COOKIE.PILL_CONTROL'),
    title: t('COOKIE.SECTIONS.CONTROL_TITLE'),
    body: t('COOKIE.SECTIONS.CONTROL_BODY'),
    items: [
      t('COOKIE.SECTIONS.CONTROL_POINTS.0'),
      t('COOKIE.SECTIONS.CONTROL_POINTS.1'),
      t('COOKIE.SECTIONS.CONTROL_POINTS.2')
    ]
  },
  {
    pill: t('COOKIE.PILL_USAGE'),
    title: t('COOKIE.SECTIONS.USE_TITLE'),
    body: t('COOKIE.SECTIONS.USE_BODY'),
    items: [
      t('COOKIE.SECTIONS.USE_POINTS.0'),
      t('COOKIE.SECTIONS.USE_POINTS.1')
    ]
  },
  {
    pill: t('COOKIE.PILL_CONTACT'),
    title: t('COOKIE.SECTIONS.CONTACT_TITLE'),
    body: t('COOKIE.SECTIONS.CONTACT_BODY')
  }
])
</script>

<style lang="scss" scoped src="./policy-page.scss"></style>
