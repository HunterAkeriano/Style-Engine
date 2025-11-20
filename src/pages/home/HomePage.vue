<template>
  <div class="home-page">
    <div class="container">
      <header class="home-page__hero">
        <h1 class="home-page__hero-title">{{ t('HOME.TITLE') }}</h1>
        <p class="home-page__hero-subtitle">
          {{ t('HOME.SUBTITLE') }}
        </p>
        <div class="home-page__hero-actions">
          <router-link to="/gradient" class="button button--primary">
            {{ t('HOME.GRADIENT_BUTTON') }}
          </router-link>
          <router-link to="/shadow" class="button button--secondary">
            {{ t('HOME.SHADOW_BUTTON') }}
          </router-link>
          <router-link to="/animation" class="button button--secondary">
            {{ t('HOME.ANIMATION_BUTTON') }}
          </router-link>
        </div>
      </header>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./HomePage.scss"></style>
