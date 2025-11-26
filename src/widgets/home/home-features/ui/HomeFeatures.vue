<template>
  <div class="container">
    <section class="home-features">
      <p class="home-features__eyebrow">{{ t('HOME.FEATURES_TAG') }}</p>
      <h2 class="home-features__title">{{ t('HOME.FEATURES_TITLE') }}</h2>

      <div class="home-features__grid">
        <div class="home-features__card">
          <h3 class="home-features__card-title">{{ t('HOME.FEATURES_GRADIENT_TITLE') }}</h3>
          <p class="home-features__card-description">{{ t('HOME.FEATURES_GRADIENT_DESCRIPTION') }}</p>
          <NavLink to="/gradient" class-name="home-features__card-link">
            {{ t('HOME.GRADIENT_BUTTON') }} →
          </NavLink>
        </div>

        <div class="home-features__card">
          <h3 class="home-features__card-title">{{ t('HOME.FEATURES_SHADOW_TITLE') }}</h3>
          <p class="home-features__card-description">{{ t('HOME.FEATURES_SHADOW_DESCRIPTION') }}</p>
          <NavLink to="/shadow" class-name="home-features__card-link">
            {{ t('HOME.SHADOW_BUTTON') }} →
          </NavLink>
        </div>

        <div class="home-features__card">
          <h3 class="home-features__card-title">{{ t('HOME.FEATURES_ANIMATION_TITLE') }}</h3>
          <p class="home-features__card-description">{{ t('HOME.FEATURES_ANIMATION_DESCRIPTION') }}</p>
          <NavLink to="/animation" class-name="home-features__card-link">
            {{ t('HOME.ANIMATION_BUTTON') }} →
          </NavLink>
        </div>

        <div class="home-features__card">
          <h3 class="home-features__card-title">{{ t('HOME.FEATURES_CLIPPATH_TITLE') }}</h3>
          <p class="home-features__card-description">{{ t('HOME.FEATURES_CLIPPATH_DESCRIPTION') }}</p>
          <NavLink to="/clip-path" class-name="home-features__card-link">
            {{ t('HOME.CLIPPATH_BUTTON') }} →
          </NavLink>
        </div>

        <div class="home-features__card">
          <h3 class="home-features__card-title">{{ t('HOME.FEATURES_GRID_TITLE') }}</h3>
          <p class="home-features__card-description">{{ t('HOME.FEATURES_GRID_DESCRIPTION') }}</p>
          <NavLink to="/grid" class-name="home-features__card-link">
            {{ t('HOME.GRID_BUTTON') }} →
          </NavLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NavLink } from '@/shared/ui'

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./home-features.scss"></style>
