<template>
  <div class="home-page">
    <div class="container">
      <section class="home-page__hero">
        <div class="home-page__title-row">
          <Logo class="home-page__logo" />
          <h1 class="home-page__hero-title">{{ t('HOME.TITLE') }}</h1>
        </div>

        <p class="home-page__hero-subtitle">
          {{ t('HOME.SUBTITLE') }}
        </p>

        <div class="home-page__hero-actions">
          <NavLink to="/gradient" className="button button_primary">
            {{ t('HOME.GRADIENT_BUTTON') }}
          </NavLink>

          <NavLink to="/shadow" className="button button_secondary">
            {{ t('HOME.SHADOW_BUTTON') }}
          </NavLink>

          <NavLink to="/animation" className="button button_secondary">
            {{ t('HOME.ANIMATION_BUTTON') }}
          </NavLink>
        </div>
      </section>
    </div>

    <div class="container">
      <section class="home-page__about">
        <div class="home-page__about-text">
          <p class="home-page__eyebrow">{{ t('HOME.ABOUT_TAG') }}</p>
          <h2 class="home-page__about-title">{{ t('HOME.ABOUT_TITLE') }}</h2>
          <p class="home-page__about-description">
            {{ t('HOME.ABOUT_TEXT') }}
          </p>
          <ul class="home-page__about-points">
            <li>{{ t('HOME.ABOUT_POINT_1') }}</li>
            <li>{{ t('HOME.ABOUT_POINT_2') }}</li>
            <li>{{ t('HOME.ABOUT_POINT_3') }}</li>
          </ul>
        </div>

        <div class="home-page__about-visual" aria-hidden="true">
          <div class="home-page__visual-card">
            <div class="home-page__visual-grid"></div>
            <div class="home-page__visual-planet"></div>
            <div class="home-page__visual-orbit"></div>
            <div class="home-page__visual-core"></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Logo from '@/shared/ui/logo/Logo.vue'
import { NavLink } from '@/shared/ui'

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./HomePage.scss"></style>
