<template>
<section
  ref="sectionRef"
  class="about-mission"
  :class="{ 'is-visible': isVisible }"
>
    <div class="about-mission__visual" aria-hidden="true">
      <div class="about-mission__grid"></div>
      <div class="about-mission__glow about-mission__glow_primary"></div>
      <div class="about-mission__glow about-mission__glow_accent"></div>

      <div class="about-mission__rings">
        <div class="about-mission__ring about-mission__ring_outer"></div>
        <div class="about-mission__ring about-mission__ring_middle"></div>
        <div class="about-mission__ring about-mission__ring_inner"></div>
      </div>

      <div class="about-mission__orbit about-mission__orbit_slow">
        <span class="about-mission__particle about-mission__particle_primary"></span>
      </div>
      <div class="about-mission__orbit about-mission__orbit_fast">
        <span class="about-mission__particle about-mission__particle_accent"></span>
      </div>

      <div class="about-mission__pulse"></div>
      <div class="about-mission__beam about-mission__beam_top"></div>
      <div class="about-mission__beam about-mission__beam_bottom"></div>
    </div>

    <div class="about-mission__content">
      <p class="about-mission__tag">{{ t('ABOUT.MISSION_TAG') }}</p>
      <h2 class="about-mission__title">{{ t('ABOUT.MISSION_TITLE') }}</h2>
      <p class="about-mission__text">{{ t('ABOUT.MISSION_TEXT') }}</p>

      <div class="about-mission__points">
        <div class="about-mission__point">
          <span class="about-mission__point-label">{{ t('ABOUT.MISSION_POINT_1_TITLE') }}</span>
          <p class="about-mission__point-text">{{ t('ABOUT.MISSION_POINT_1_TEXT') }}</p>
        </div>
        <div class="about-mission__point">
          <span class="about-mission__point-label">{{ t('ABOUT.MISSION_POINT_2_TITLE') }}</span>
          <p class="about-mission__point-text">{{ t('ABOUT.MISSION_POINT_2_TEXT') }}</p>
        </div>
        <div class="about-mission__point">
          <span class="about-mission__point-label">{{ t('ABOUT.MISSION_POINT_3_TITLE') }}</span>
          <p class="about-mission__point-text">{{ t('ABOUT.MISSION_POINT_3_TEXT') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useSectionVisibility } from '@/shared/composables'

const { t } = useI18n()
const { sectionRef, isVisible } = useSectionVisibility()
</script>

<style lang="scss" scoped src="./about-mission.scss"></style>
