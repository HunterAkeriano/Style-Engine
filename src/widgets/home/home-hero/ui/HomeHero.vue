<template>
  <div class="container">
    <section class="home-hero">
      <div class="home-hero__title-row">
        <Logo class="home-hero__logo" />
        <h1 class="home-hero__title">{{ t('HOME.TITLE') }}</h1>
      </div>

      <p class="home-hero__subtitle">
        {{ t('HOME.SUBTITLE') }}
      </p>

      <div class="home-hero__actions">
        <NavLink to="/gradient" class-name="home-hero__button home-hero__button_primary">
          {{ t('HOME.GRADIENT_BUTTON') }}
        </NavLink>

        <NavLink to="/shadow" class-name="home-hero__button home-hero__button_secondary">
          {{ t('HOME.SHADOW_BUTTON') }}
        </NavLink>

        <NavLink to="/animation" class-name="home-hero__button home-hero__button_secondary">
          {{ t('HOME.ANIMATION_BUTTON') }}
        </NavLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Logo from '@/shared/ui/Logo/Logo.vue'
import { NavLink } from '@/shared/ui'

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./home-hero.scss"></style>
