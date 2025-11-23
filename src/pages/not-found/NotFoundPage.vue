<template>
  <section class="not-found-page">
    <div class="not-found-page__bg" aria-hidden="true"></div>
    <div class="not-found-page__container">
      <div class="not-found-page__visual" aria-hidden="true">
        <div class="not-found-page__glow not-found-page__glow_primary"></div>
        <div class="not-found-page__glow not-found-page__glow_accent"></div>
        <div class="not-found-page__grid"></div>

        <div class="not-found-page__rings">
          <div class="not-found-page__ring not-found-page__ring_outer"></div>
          <div class="not-found-page__ring not-found-page__ring_middle"></div>
          <div class="not-found-page__ring not-found-page__ring_inner"></div>
        </div>

        <div class="not-found-page__orbit not-found-page__orbit_slow">
          <span class="not-found-page__dot not-found-page__dot_primary"></span>
        </div>
        <div class="not-found-page__orbit not-found-page__orbit_fast">
          <span class="not-found-page__dot not-found-page__dot_accent"></span>
        </div>

        <div class="not-found-page__holo">
          <span class="not-found-page__code-line"></span>
          <span class="not-found-page__code-line not-found-page__code-line_short"></span>
          <span class="not-found-page__code-line"></span>
        </div>

        <div class="not-found-page__badge">
          <span class="not-found-page__badge-label">404</span>
          <span class="not-found-page__badge-sub">{{ t('NOT_FOUND.BADGE') }}</span>
        </div>
      </div>

      <div class="not-found-page__content">
        <p class="not-found-page__eyebrow">{{ t('NOT_FOUND.TAG') }}</p>
        <h1 class="not-found-page__title">
          <span class="not-found-page__title-base">{{ t('NOT_FOUND.TITLE') }}</span>
          <span class="not-found-page__title-highlight">{{ t('NOT_FOUND.HIGHLIGHT') }}</span>
        </h1>
        <p class="not-found-page__subtitle">{{ t('NOT_FOUND.DESCRIPTION') }}</p>

        <div class="not-found-page__actions">
          <NavLink to="/" class-name="not-found-page__cta not-found-page__cta_primary">
            {{ t('NOT_FOUND.CTA_HOME') }}
          </NavLink>
          <NavLink to="/docs" class-name="not-found-page__cta not-found-page__cta_ghost">
            {{ t('NOT_FOUND.CTA_DOCS') }}
          </NavLink>
        </div>

        <div class="not-found-page__shortcuts" aria-label="Quick links">
          <span class="not-found-page__shortcut-label">{{ t('NOT_FOUND.SHORTCUTS') }}</span>
          <div class="not-found-page__chips">
            <NavLink to="/gradient" class-name="not-found-page__chip">{{ t('NAV.GRADIENTS') }}</NavLink>
            <NavLink to="/shadow" class-name="not-found-page__chip">{{ t('NAV.SHADOWS') }}</NavLink>
            <NavLink to="/animation" class-name="not-found-page__chip">{{ t('NAV.ANIMATIONS') }}</NavLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { NavLink } from '@/shared/ui'

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./not-found-page.scss"></style>
