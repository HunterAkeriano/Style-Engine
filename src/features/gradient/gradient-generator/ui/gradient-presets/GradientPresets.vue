<template>
  <section class="gradient-presets">
    <div class="gradient-presets__header">
      <div>
        <p class="gradient-presets__tag">{{ t('GRADIENT.PRESETS_TAG') }}</p>
        <h2 class="gradient-presets__title">{{ t('GRADIENT.PRESETS_TITLE') }}</h2>
        <p class="gradient-presets__subtitle">{{ t('GRADIENT.PRESETS_SUBTITLE') }}</p>
      </div>
    </div>

    <div class="gradient-presets__grid">
      <article
        v-for="preset in presets"
        :key="preset.id"
        class="gradient-presets__card"
        :style="getStyle(preset)"
        @click="emit('apply', preset)"
      >
        <div class="gradient-presets__card-top">
          <h3 class="gradient-presets__card-title">{{ preset.name }}</h3>
          <span class="gradient-presets__badge">{{ preset.type }}</span>
        </div>

        <div v-if="preset.owner" class="gradient-presets__author">
          <div class="gradient-presets__avatar" :style="computeCreatorAvatarStyle(preset.owner)">
            <span v-if="!preset.owner.avatarUrl">{{ computeCreatorInitials(preset.owner) }}</span>
          </div>
          <div>
            <span class="gradient-presets__author-name" :title="computeCreatorLabel(preset.owner)">
              {{ computeCreatorLabel(preset.owner) }}
            </span>
            <span v-if="preset.owner.email" class="gradient-presets__author-email">
              {{ preset.owner.email }}
            </span>
          </div>
        </div>

        <div class="gradient-presets__colors">
          <span
            v-for="color in preset.colors"
            :key="color.id"
            class="gradient-presets__swatch"
            :style="{ background: color.color }"
            :aria-label="color.color"
          />
        </div>

        <div class="gradient-presets__actions">
          <Button size="sm" variant="ghost" @click.stop="emit('copy', preset)">
            {{ t('GRADIENT.COPY') }}
          </Button>
          <Button
            size="sm"
            variant="primary"
            @click.stop="emit('save', preset)"
            :disabled="savingId === preset.id || isPresetSaved(preset)"
          >
            {{ t('GRADIENT.SAVE') }}
          </Button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import type { GradientPreset } from '@/processes/gradient/gradient-generation/gradient-presets'
import type { GradientType } from '@/shared/types'
import { Button } from '@/shared/ui'
import {
  getCreatorAvatarStyle as computeCreatorAvatarStyle,
  getCreatorInitials as computeCreatorInitials,
  getCreatorLabel as computeCreatorLabel
} from '@/shared/lib/creator'

interface Props {
  presets: GradientPreset[]
  savingId?: string | null
  isSaved?: (preset: GradientPreset) => boolean
}

interface Emits {
  (e: 'apply', preset: GradientPreset): void
  (e: 'copy', preset: GradientPreset): void
  (e: 'save', preset: GradientPreset): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { presets, savingId, isSaved } = toRefs(props)
const { t } = useI18n()
const isPresetSaved = (preset: GradientPreset) => (isSaved?.value && isSaved.value(preset)) ?? false

function getStyle(preset: GradientPreset) {
  return {
    background: buildGradient(preset.type, preset.angle, preset.colors)
  }
}

function buildGradient(type: GradientType, angle: number, colors: Array<{ color: string; position: number }>) {
  const colorStops = colors.map(c => `${c.color} ${c.position}%`).join(', ')

  switch (type) {
    case 'linear':
      return `linear-gradient(${angle}deg, ${colorStops})`
    case 'radial':
      return `radial-gradient(circle, ${colorStops})`
    case 'conic':
      return `conic-gradient(from ${angle}deg, ${colorStops})`
    default:
      return `linear-gradient(90deg, ${colorStops})`
  }
}

</script>

<style lang="scss" scoped src="./gradient-presets.scss"></style>
