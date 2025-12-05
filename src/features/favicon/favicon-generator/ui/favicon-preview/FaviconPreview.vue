<template>
  <div class="favicon-preview">
    <h3 class="favicon-preview__title">{{ t('FAVICON.PREVIEW_TITLE') }}</h3>

    <div v-if="!hasImage" class="favicon-preview__placeholder">
      <svg class="favicon-preview__placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="favicon-preview__placeholder-text">{{ t('FAVICON.UPLOAD_TO_PREVIEW') }}</p>
    </div>

    <div v-else class="favicon-preview__grid">
      <div
        v-for="faviconSize in faviconSizes"
        :key="faviconSize.size"
        class="favicon-preview__item"
      >
        <div class="favicon-preview__item-header">
          <h4 class="favicon-preview__item-title">{{ faviconSize.name }}</h4>
          <span class="favicon-preview__item-size">{{ faviconSize.size }}×{{ faviconSize.size }}</span>
        </div>
        <div
          class="favicon-preview__item-preview"
          :style="{ width: getPreviewSize(faviconSize.size), height: getPreviewSize(faviconSize.size) }"
        >
          <div
            class="favicon-preview__item-frame"
            :style="getFrameStyle(faviconSize.size)"
          >
            <img
              v-if="generatedFavicons[faviconSize.size]"
              :src="generatedFavicons[faviconSize.size]"
              :alt="`${faviconSize.name} preview`"
              class="favicon-preview__item-image"
              :style="getImageStyle(faviconSize.size)"
            />
          </div>
        </div>
        <p class="favicon-preview__item-purpose">{{ faviconSize.purpose }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { FAVICON_SIZES } from '@/shared/types/favicon'

interface Props {
  hasImage: boolean
  generatedFavicons: Record<number, string>
  backgroundColor: string
  padding: number
  borderRadius: number
}

const props = defineProps<Props>()
const { t } = useI18n()

const faviconSizes = computed(() => FAVICON_SIZES)

function getPreviewSize(size: number): string {
  if (size <= 32) {
    return '64px'
  } else if (size <= 48) {
    return '80px'
  } else if (size <= 144) {
    return '96px'
  } else {
    return '128px'
  }
}

function getPreviewMetrics(size: number) {
  const previewSize = parseInt(getPreviewSize(size))
  const paddingPx = Math.max(0, Math.round((previewSize * props.padding) / 100))
  const innerSize = Math.max(previewSize - paddingPx * 2, 0)
  const radiusPx = Math.max(0, Math.round((innerSize * props.borderRadius) / 100))

  return {
    paddingPx,
    radiusPx,
    previewSize
  }
}

function getFrameStyle(size: number) {
  const { paddingPx, radiusPx, previewSize } = getPreviewMetrics(size)

  return {
    '--live-preview-bg': props.backgroundColor === 'transparent' ? 'transparent' : props.backgroundColor,
    padding: `${paddingPx}px`,
    borderRadius: `${Math.min(previewSize / 2, radiusPx + Math.min(paddingPx, 12))}px`
  }
}

function getImageStyle(size: number) {
  const { radiusPx } = getPreviewMetrics(size)
  return {
    borderRadius: `${radiusPx}px`
  }
}
</script>

<style lang="scss" scoped src="./favicon-preview.scss"></style>
