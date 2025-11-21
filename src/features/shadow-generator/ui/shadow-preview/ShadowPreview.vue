<template>
  <div class="shadow-preview" :style="previewStyle">
    <div class="shadow-preview__scene">
      <div class="shadow-preview__grid"></div>
      <div class="shadow-preview__orb shadow-preview__orb_primary" aria-hidden="true"></div>
      <div class="shadow-preview__orb shadow-preview__orb_secondary" aria-hidden="true"></div>
      <div class="shadow-preview__card">
        <div class="shadow-preview__badge">{{ t('SHADOW.LIVE_BADGE') }}</div>
        <h3 class="shadow-preview__title">{{ t('SHADOW.PREVIEW_TITLE') }}</h3>
        <p class="shadow-preview__subtitle">{{ t('SHADOW.PREVIEW_SUBTITLE') }}</p>
        <div class="shadow-preview__cta">
          <span class="shadow-preview__dot"></span>
          <span>{{ t('SHADOW.PREVIEW_HINT') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  boxShadow: string
  accent?: {
    primary: string
    secondary: string
  }
}

const props = defineProps<Props>()
const { t } = useI18n()

const previewStyle = computed(() => ({
  '--shadow-value': props.boxShadow,
  '--accent-primary': props.accent?.primary ?? '#22d3ee',
  '--accent-secondary': props.accent?.secondary ?? '#a855f7'
}))
</script>

<style lang="scss" scoped src="./ShadowPreview.scss"></style>
