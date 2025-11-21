<template>
  <div class="gradient-page">
    <div class="gradient-page__motion" aria-hidden="true"></div>
    <div class="container">
      <header class="gradient-page__header">
        <div>
          <h1 class="gradient-page__title">{{ t('GRADIENT.TITLE') }}</h1>
          <p class="gradient-page__subtitle">{{ t('GRADIENT.SUBTITLE') }}</p>
        </div>
        <NavLink to="/" className="gradient-page__back-link">← {{ t('GRADIENT.BACK_TO_HOME') }}</NavLink>
      </header>

      <div class="gradient-page__content">
        <GradientGenerationProcess />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NavLink } from '@/shared/ui'
import { GradientGenerationProcess } from '@/processes'

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./gradient-page.scss"></style>
