<template>
  <section
    ref="sectionRef"
    class="policy-page"
    :class="{ 'is-visible': isVisible }"
  >
    <div class="policy-page__bg" aria-hidden="true"></div>
    <div class="policy-page__container">
      <Breadcrumbs />
      <div class="policy-page__header">
        <p class="policy-page__tag">{{ t('PRIVACY.TAG') }}</p>
        <h1 class="policy-page__title">
          <span class="policy-page__title-base">{{ t('PRIVACY.TITLE') }}</span>
          <span class="policy-page__title-highlight">{{ t('PRIVACY.HIGHLIGHT') }}</span>
        </h1>
        <p class="policy-page__subtitle">{{ t('PRIVACY.SUBTITLE') }}</p>
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
import { Breadcrumbs } from '@/widgets/common'
import { useSectionVisibility } from '@/shared/composables'

const { t } = useI18n()
const { sectionRef, isVisible } = useSectionVisibility()

const sections = computed(() => [
  {
    pill: t('PRIVACY.PILL_CORE'),
    title: t('PRIVACY.SECTIONS.DATA_TITLE'),
    body: t('PRIVACY.SECTIONS.DATA_BODY'),
    items: [
      t('PRIVACY.SECTIONS.DATA_POINTS.0'),
      t('PRIVACY.SECTIONS.DATA_POINTS.1'),
      t('PRIVACY.SECTIONS.DATA_POINTS.2')
    ]
  },
  {
    pill: t('PRIVACY.PILL_USE'),
    title: t('PRIVACY.SECTIONS.USE_TITLE'),
    body: t('PRIVACY.SECTIONS.USE_BODY'),
    items: [
      t('PRIVACY.SECTIONS.USE_POINTS.0'),
      t('PRIVACY.SECTIONS.USE_POINTS.1'),
      t('PRIVACY.SECTIONS.USE_POINTS.2')
    ]
  },
  {
    pill: t('PRIVACY.PILL_RIGHTS'),
    title: t('PRIVACY.SECTIONS.RIGHTS_TITLE'),
    body: t('PRIVACY.SECTIONS.RIGHTS_BODY'),
    items: [
      t('PRIVACY.SECTIONS.RIGHTS_POINTS.0'),
      t('PRIVACY.SECTIONS.RIGHTS_POINTS.1'),
      t('PRIVACY.SECTIONS.RIGHTS_POINTS.2')
    ]
  },
  {
    pill: t('PRIVACY.PILL_SECURITY'),
    title: t('PRIVACY.SECTIONS.SECURITY_TITLE'),
    body: t('PRIVACY.SECTIONS.SECURITY_BODY'),
    items: [
      t('PRIVACY.SECTIONS.SECURITY_POINTS.0'),
      t('PRIVACY.SECTIONS.SECURITY_POINTS.1')
    ]
  },
  {
    pill: t('PRIVACY.PILL_CONTACT'),
    title: t('PRIVACY.SECTIONS.CONTACT_TITLE'),
    body: t('PRIVACY.SECTIONS.CONTACT_BODY')
  }
])
</script>

<style lang="scss" scoped src="./policy-page.scss"></style>
