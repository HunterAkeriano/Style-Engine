<template>
  <div class="shadow-page">
    <div class="shadow-page__motion" aria-hidden="true"></div>
    <div class="shadow-page__waves" aria-hidden="true">
      <div class="shadow-page__wave shadow-page__wave_1"></div>
      <div class="shadow-page__wave shadow-page__wave_2"></div>
      <div class="shadow-page__wave shadow-page__wave_3"></div>
    </div>
    <div class="container">
      <header class="shadow-page__header">
        <div>
          <p class="shadow-page__eyebrow">{{ t('SHADOW.EYEBROW') }}</p>
          <h1 class="shadow-page__title">{{ t('SHADOW.TITLE') }}</h1>
          <p class="shadow-page__subtitle">{{ t('SHADOW.SUBTITLE') }}</p>
        </div>
        <NavLink to="/" class-name="shadow-page__back-link">← {{ t('SHADOW.BACK_TO_HOME') }}</NavLink>
      </header>

      <div class="shadow-page__content">
        <ShadowGenerationProcess />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NavLink } from '@/shared/ui'
import { ShadowGenerationProcess } from '@/processes'

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./shadow-page.scss"></style>
