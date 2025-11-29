<template>
  <div class="favicon-page">
    <div class="favicon-page__motion" aria-hidden="true"></div>
    <div class="container">
      <Breadcrumbs />
      <header class="favicon-page__header">
        <div>
          <h1 class="favicon-page__title">{{ t('FAVICON.TITLE') }}</h1>
          <p class="favicon-page__subtitle">{{ t('FAVICON.SUBTITLE') }}</p>
        </div>
        <NavLink to="/" class-name="favicon-page__back-link">← {{ t('FAVICON.BACK_TO_HOME') }}</NavLink>
      </header>

      <div class="favicon-page__content">
        <FaviconGenerationProcess />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NavLink } from '@/shared/ui'
import { Breadcrumbs } from '@/widgets/common'
import { FaviconGenerationProcess } from '@/processes/favicon'

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./favicon-page.scss"></style>
