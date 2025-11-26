<template>
  <div class="container">
    <section class="home-showcase">
      <p class="home-showcase__eyebrow">{{ t('HOME.SHOWCASE_TAG') }}</p>
      <h2 class="home-showcase__title">{{ t('HOME.SHOWCASE_TITLE') }}</h2>

      <div class="home-showcase__grid">
        <div class="home-showcase__card">
          <div class="home-showcase__preview home-showcase__preview_animation">
            <div class="holographic-dream">
              <div class="holographic-dream__backdrop"></div>
              <div class="holographic-dream__glow"></div>
              <div class="holographic-dream__core"></div>
              <div class="holographic-dream__ring holographic-dream__ring_1"></div>
              <div class="holographic-dream__ring holographic-dream__ring_2"></div>
              <div class="holographic-dream__ring holographic-dream__ring_3"></div>
              <div class="holographic-dream__particles">
                <div class="holographic-dream__particle" v-for="n in 20" :key="n" :style="{ '--particle-index': n }"></div>
              </div>
              <div class="holographic-dream__orbs">
                <div class="holographic-dream__orb holographic-dream__orb_1"></div>
                <div class="holographic-dream__orb holographic-dream__orb_2"></div>
                <div class="holographic-dream__orb holographic-dream__orb_3"></div>
              </div>
              <div class="holographic-dream__shimmer"></div>
            </div>
          </div>
          <div class="home-showcase__info">
            <h3 class="home-showcase__label">{{ t('HOME.SHOWCASE_ANIMATION_LABEL') }}</h3>
            <p class="home-showcase__description">{{ t('HOME.SHOWCASE_ANIMATION_DESCRIPTION') }}</p>
            <NavLink to="/animation" class-name="home-showcase__link">
              {{ t('HOME.SHOWCASE_TRY') }} →
            </NavLink>
          </div>
        </div>

        <div class="home-showcase__card">
          <div class="home-showcase__preview home-showcase__preview_gradient">
            <div class="aurora-sunset">
              <div class="aurora-sunset__base"></div>
              <div class="aurora-sunset__layer aurora-sunset__layer_1"></div>
              <div class="aurora-sunset__layer aurora-sunset__layer_2"></div>
              <div class="aurora-sunset__layer aurora-sunset__layer_3"></div>
              <div class="aurora-sunset__rays"></div>
              <div class="aurora-sunset__shimmer"></div>
            </div>
          </div>
          <div class="home-showcase__info">
            <h3 class="home-showcase__label">{{ t('HOME.SHOWCASE_GRADIENT_LABEL') }}</h3>
            <p class="home-showcase__description">{{ t('HOME.SHOWCASE_GRADIENT_DESCRIPTION') }}</p>
            <NavLink to="/gradient" class-name="home-showcase__link">
              {{ t('HOME.SHOWCASE_TRY') }} →
            </NavLink>
          </div>
        </div>

        <div class="home-showcase__card">
          <div class="home-showcase__preview home-showcase__preview_shadow">
            <div class="shadow-dance">
              <div class="shadow-dance__stage"></div>
              <div class="shadow-dance__orb shadow-dance__orb_1"></div>
              <div class="shadow-dance__orb shadow-dance__orb_2"></div>
              <div class="shadow-dance__orb shadow-dance__orb_3"></div>
              <div class="shadow-dance__card shadow-dance__card_1"></div>
              <div class="shadow-dance__card shadow-dance__card_2"></div>
              <div class="shadow-dance__rays"></div>
            </div>
          </div>
          <div class="home-showcase__info">
            <h3 class="home-showcase__label">{{ t('HOME.SHOWCASE_SHADOW_LABEL') }}</h3>
            <p class="home-showcase__description">{{ t('HOME.SHOWCASE_SHADOW_DESCRIPTION') }}</p>
            <NavLink to="/shadow" class-name="home-showcase__link">
              {{ t('HOME.SHOWCASE_TRY') }} →
            </NavLink>
          </div>
        </div>

        <div class="home-showcase__card">
          <div class="home-showcase__preview home-showcase__preview_clippath">
            <div class="morph-magic">
              <div class="morph-magic__bg"></div>
              <div class="morph-magic__shape morph-magic__shape_1"></div>
              <div class="morph-magic__shape morph-magic__shape_2"></div>
              <div class="morph-magic__shape morph-magic__shape_3"></div>
              <div class="morph-magic__particles">
                <div class="morph-magic__particle" v-for="n in 12" :key="n"></div>
              </div>
              <div class="morph-magic__glow"></div>
            </div>
          </div>
          <div class="home-showcase__info">
            <h3 class="home-showcase__label">{{ t('HOME.SHOWCASE_CLIPPATH_LABEL') }}</h3>
            <p class="home-showcase__description">{{ t('HOME.SHOWCASE_CLIPPATH_DESCRIPTION') }}</p>
            <NavLink to="/clip-path" class-name="home-showcase__link">
              {{ t('HOME.SHOWCASE_TRY') }} →
            </NavLink>
          </div>
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

<style lang="scss" scoped src="./home-showcase.scss"></style>
