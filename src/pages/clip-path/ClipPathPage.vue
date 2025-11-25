<template>
  <div class="clip-path-page">
    <div class="clip-path-page__motion" aria-hidden="true"></div>
    <div class="container">
      <Breadcrumbs />
      <header class="clip-path-page__header">
        <div>
          <h1 class="clip-path-page__title">{{ t('CLIP_PATH.TITLE') }}</h1>
          <p class="clip-path-page__subtitle">{{ t('CLIP_PATH.SUBTITLE') }}</p>
        </div>
        <NavLink to="/" class-name="clip-path-page__back-link">← {{ t('CLIP_PATH.BACK_TO_HOME') }}</NavLink>
      </header>

      <div class="clip-path-page__content">
        <ClipPathGenerationProcess />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NavLink } from '@/shared/ui'
import { Breadcrumbs } from '@/widgets/common'
import { ClipPathGenerationProcess } from '@/processes'

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./clip-path-page.scss"></style>
