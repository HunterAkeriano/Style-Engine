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
        v-for="preset in renderedPresets"
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
          <div v-if="preset.owner" class="shadow-presets__author">
            <div class="shadow-presets__avatar" :style="computeCreatorAvatarStyle(preset.owner)">
              <span v-if="!preset.owner.avatarUrl">{{ computeCreatorInitials(preset.owner) }}</span>
            </div>
            <div>
              <span class="shadow-presets__author-name" :title="computeCreatorLabel(preset.owner)">
                {{ computeCreatorLabel(preset.owner) }}
              </span>
              <span v-if="preset.owner.email" class="shadow-presets__author-email">
                {{ preset.owner.email }}
              </span>
            </div>
          </div>
          <div class="shadow-presets__actions" @click.stop>
            <Button size="sm" variant="ghost" @click="emit('copy', preset)">
              {{ t('SHADOW.COPY') }}
            </Button>
            <Button
              size="sm"
              variant="primary"
              @click="emit('save', preset)"
              :disabled="savingId === preset.id || isPresetSaved(preset)"
            >
              {{ t('SHADOW.SAVE') }}
            </Button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ShadowPreset } from '@/shared/types'
import { Button } from '@/shared/ui'
import { hexToRgb } from '@/shared/lib/color'
import {
  getCreatorAvatarStyle as computeCreatorAvatarStyle,
  getCreatorInitials as computeCreatorInitials,
  getCreatorLabel as computeCreatorLabel
} from '@/shared/lib/creator'

interface Props {
  presets: ShadowPreset[]
  activeId?: string | null
  savingId?: string | null
  isSaved?: (preset: ShadowPreset) => boolean
}

interface Emits {
  (e: 'apply', preset: ShadowPreset): void
  (e: 'copy', preset: ShadowPreset): void
  (e: 'save', preset: ShadowPreset): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { presets, savingId, isSaved } = toRefs(props)
const { t } = useI18n()
const isPresetSaved = (preset: ShadowPreset) => (isSaved?.value && isSaved.value(preset)) ?? false

type ShadowPresetWithValue = ShadowPreset & { shadowValue: string }
const shadowCache = new WeakMap<ShadowPreset, string>()
const isLightPresetMode = ref(false)

const handleResize = () => {
  if (typeof window === 'undefined') return
  isLightPresetMode.value = window.innerWidth < 1024
}

onMounted(() => {
  handleResize()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize, { passive: true })
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})

const renderedPresets = computed<ShadowPresetWithValue[]>(() =>
  presets.value.map(preset => {
    let cached = shadowCache.get(preset)
    if (!cached && !isLightPresetMode.value) {
      cached = buildShadow(preset.layers)
      shadowCache.set(preset, cached)
    }
    const shadowValue = isLightPresetMode.value ? 'none' : cached ?? 'none'
    return { ...preset, shadowValue }
  })
)

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

function getStyle(preset: ShadowPresetWithValue) {
  const shadow = isLightPresetMode.value
    ? 'none'
    : preset.shadowValue || buildShadow(preset.layers)
  return {
    boxShadow: shadow,
    '--shadow-value': shadow
  }
}
</script>

<style lang="scss" scoped src="./shadow-presets.scss"></style>
