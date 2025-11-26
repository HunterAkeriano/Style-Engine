<template>
  <div class="grid-page">
    <div class="grid-page__motion" aria-hidden="true"></div>
    <div class="container">
      <Breadcrumbs />
      <header class="grid-page__header">
        <div>
          <h1 class="grid-page__title">{{ t('GRID.TITLE') }}</h1>
          <p class="grid-page__subtitle">{{ t('GRID.SUBTITLE') }}</p>
        </div>
        <NavLink to="/" class-name="grid-page__back-link">← {{ t('GRID.BACK_TO_HOME') }}</NavLink>
      </header>

      <div class="grid-page__content">
        <GridGenerationProcess />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NavLink } from '@/shared/ui'
import { Breadcrumbs } from '@/widgets/common'
import { GridGenerationProcess } from '@/processes'

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./grid-page.scss"></style>
