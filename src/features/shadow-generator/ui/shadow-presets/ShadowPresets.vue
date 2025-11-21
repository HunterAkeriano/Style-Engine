<template>
  <section class="shadow-presets">
    <div class="shadow-presets__header">
      <div>
        <p class="shadow-presets__tag">{{ t('SHADOW.PRESETS_TAG') }}</p>
        <h2 class="shadow-presets__title">{{ t('SHADOW.PRESETS_TITLE') }}</h2>
        <p class="shadow-presets__subtitle">{{ t('SHADOW.PRESETS_SUBTITLE') }}</p>
      </div>
    </div>

    <div class="shadow-presets__grid">
      <article
        v-for="preset in presets"
        :key="preset.id"
        class="shadow-presets__card"
        :class="{ 'shadow-presets__card_active': preset.id === activeId }"
        @click="handleCardClick(preset, $event)"
      >
        <div class="shadow-presets__swatch" :style="getStyle(preset)">
          <div class="shadow-presets__inner">
            <span class="shadow-presets__badge">{{ t('SHADOW.PRESET_BADGE') }}</span>
          </div>
        </div>

        <div class="shadow-presets__content">
          <div>
            <h3 class="shadow-presets__card-title">{{ preset.name }}</h3>
            <p class="shadow-presets__description">{{ preset.description }}</p>
          </div>
          <div class="shadow-presets__actions" @click.stop>
            <Button size="sm" variant="ghost" @click="emit('copy', preset)">
              {{ t('SHADOW.COPY') }}
            </Button>
            <Button size="sm" variant="primary" @click="emit('share', preset)">
              {{ t('SHADOW.SHARE') }}
            </Button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ShadowPreset } from '@/shared/types'
import { Button } from '@/shared/ui'
import { hexToRgb } from '@/shared/lib/color'

interface Props {
  presets: ShadowPreset[]
  activeId?: string | null
}

interface Emits {
  (e: 'apply', preset: ShadowPreset): void
  (e: 'copy', preset: ShadowPreset): void
  (e: 'share', preset: ShadowPreset): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

function handleCardClick(preset: ShadowPreset, event: MouseEvent) {
  const target = event.target as HTMLElement | null
  if (target?.closest('.shadow-presets__actions')) return
  emit('apply', preset)
}

function buildShadow(layers: ShadowPreset['layers']) {
  return layers
    .map(layer => {
      const rgb = hexToRgb(layer.color)
      const color = rgb
        ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Number(layer.opacity).toFixed(2)})`
        : layer.color
      return `${layer.inset ? 'inset ' : ''}${layer.x}px ${layer.y}px 0 ${layer.spread}px ${color}`
    })
    .join(', ')
}

function getStyle(preset: ShadowPreset) {
  const shadow = buildShadow(preset.layers)
  return {
    boxShadow: shadow,
    '--shadow-value': shadow
  }
}
</script>

<style lang="scss" scoped src="./ShadowPresets.scss"></style>
