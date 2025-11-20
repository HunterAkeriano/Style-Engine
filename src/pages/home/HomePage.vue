<template>
  <div class="home-page">
    <div class="container">
      <header class="home-page__hero">
        <h1 class="home-page__hero-title">{{ t('home.title') }}</h1>
        <p class="home-page__hero-subtitle">
          {{ t('home.subtitle') }}
        </p>
        <div class="home-page__hero-actions">
          <router-link to="/gradient" class="button button--primary">
            {{ t('home.gradientButton') }}
          </router-link>
          <router-link to="/shadow" class="button button--secondary">
            {{ t('home.shadowButton') }}
          </router-link>
          <router-link to="/animation" class="button button--secondary">
            {{ t('home.animationButton') }}
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

<style lang="scss" scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.home-page__hero {
  text-align: center;
  padding: $space-2xl $space-md;

  @media (min-width: $breakpoint-md) {
    padding: $space-3xl 0;
  }
}

.home-page__hero-title {
  font-size: $font-size-3xl;
  font-weight: $font-weight-bold;
  margin-bottom: $space-md;
  background: linear-gradient(135deg, $color-primary, $color-secondary, $color-accent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;

  @media (min-width: $breakpoint-md) {
    font-size: $font-size-4xl;
  }

  @media (min-width: $breakpoint-lg) {
    font-size: 4rem;
  }
}

.home-page__hero-subtitle {
  font-size: $font-size-base;
  color: $color-text-secondary;
  margin-bottom: $space-xl;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  padding: 0 $space-sm;

  @media (min-width: $breakpoint-md) {
    font-size: $font-size-lg;
    margin-bottom: $space-2xl;
    padding: 0;
  }

  @media (min-width: $breakpoint-lg) {
    font-size: $font-size-xl;
  }
}

.home-page__hero-actions {
  display: flex;
  gap: $space-sm;
  justify-content: center;
  flex-direction: column;
  padding: 0 $space-md;

  @media (min-width: $breakpoint-sm) {
    flex-direction: row;
    flex-wrap: wrap;
    gap: $space-md;
  }
}

.button {
  display: inline-block;
  padding: $space-sm $space-lg;
  border-radius: $border-radius-lg;
  font-weight: $font-weight-semibold;
  transition: all $transition-base;
  text-decoration: none;
  text-align: center;
  font-size: $font-size-sm;

  @media (min-width: $breakpoint-md) {
    padding: $space-md $space-xl;
    font-size: $font-size-base;
  }

  &--primary {
    background: $color-primary;
    color: white;

    &:hover {
      background: $color-primary-hover;
      transform: translateY(-2px);
      box-shadow: $shadow-lg;
    }
  }

  &--secondary {
    background: $color-bg-tertiary;
    color: $color-text-primary;

    &:hover {
      background: $color-border-hover;
      transform: translateY(-2px);
      box-shadow: $shadow-md;
    }
  }
}
</style>
