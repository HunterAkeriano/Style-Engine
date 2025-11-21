<template>
  <div class="shadow-generation">
    <div class="shadow-generation__preview">
      <ShadowPreview
        :box-shadow="boxShadowValue"
        :accent="{ primary: '#22d3ee', secondary: '#a855f7' }"
      />
    </div>

    <div class="shadow-generation__code">
      <ShadowCodeExport :get-code="getCode" />
    </div>

    <div class="shadow-generation__controls">
      <ShadowControls
        :layers="layers"
        @update-layer="updateLayer"
        @remove-layer="removeLayer"
        @add-layer="addLayer"
      />
    </div>

    <div class="shadow-generation__presets">
      <ShadowPresets
        :presets="shadowPresets"
        :active-id="selectedPresetId"
        @apply="applyPreset"
        @copy="copyPreset"
        @share="sharePreset"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import type { ShadowLayer, ShadowPreset } from '@/shared/types'
import { randomHexColor, hexToRgb } from '@/shared/lib/color'
import { copyToClipboard, formatBoxShadow, type CSSFormat, smoothScrollToTop } from '@/shared/lib'
import { ShadowControls, ShadowPreview, ShadowCodeExport, ShadowPresets } from '@/features/shadow-generator'
import { SHADOW_PRESETS } from './shadowPresets'

const shadowPresets = SHADOW_PRESETS
const defaultLayers: ShadowLayer[] = [
  { id: '1', x: 0, y: 12, spread: 16, color: '#0b1220', opacity: 0.36, inset: false },
  { id: '2', x: 0, y: 0, spread: 3, color: '#a855f7', opacity: 0.2, inset: true }
]
const layers = ref<ShadowLayer[]>(normalizeLayers(defaultLayers))
let layerIdCounter = layers.value.length
const selectedPresetId = ref<string | null>(null)

const route = useRoute()
const router = useRouter()
const { t } = useI18n()
const toast = useToast()

const boxShadowValue = computed(() => {
  return layers.value.map(layerToCss).join(', ')
})

function layerToCss(layer: ShadowLayer) {
  return `${layer.inset ? 'inset ' : ''}${layer.x}px ${layer.y}px 0 ${layer.spread}px ${resolveColor(layer)}`
}

function resolveColor(layer: ShadowLayer) {
  const rgb = hexToRgb(layer.color)
  const safeOpacity = Math.min(1, Math.max(0, layer.opacity))
  if (!rgb) return layer.color
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Number(safeOpacity).toFixed(2)})`
}

function addLayer() {
  const fallback = layers.value[layers.value.length - 1] || {
    x: 0,
    y: 8,
    spread: 10,
    color: '#0b1220',
    opacity: 0.32,
    inset: false
  }

  layers.value.push({
    id: getNextLayerId(),
    x: fallback.x,
    y: fallback.y + 2,
    spread: fallback.spread,
    color: randomHexColor(),
    opacity: Math.min(1, Math.max(0.12, fallback.opacity)),
    inset: false
  })
}

function removeLayer(id: string) {
  if (layers.value.length <= 1) return
  layers.value = layers.value.filter(layer => layer.id !== id)
  if (selectedPresetId.value) {
    updatePresetQuery(null)
    selectedPresetId.value = null
  }
}

function updateLayer(id: string, patch: Partial<ShadowLayer>) {
  const layer = layers.value.find(item => item.id === id)
  if (!layer) return

  Object.assign(layer, sanitizePatch(patch))
  selectedPresetId.value = null
  updatePresetQuery(null)
}

function sanitizePatch(patch: Partial<ShadowLayer>): Partial<ShadowLayer> {
  const next: Partial<ShadowLayer> = {}

  if (typeof patch.x === 'number' && Number.isFinite(patch.x)) {
    next.x = clamp(patch.x, -120, 120)
  }
  if (typeof patch.y === 'number' && Number.isFinite(patch.y)) {
    next.y = clamp(patch.y, -120, 120)
  }
  if (typeof patch.spread === 'number' && Number.isFinite(patch.spread)) {
    next.spread = clamp(patch.spread, -40, 80)
  }
  if (typeof patch.opacity === 'number' && Number.isFinite(patch.opacity)) {
    next.opacity = clamp(patch.opacity, 0, 1)
  }
  if (typeof patch.color === 'string') {
    const normalized = normalizeHex(patch.color)
    if (normalized) {
      next.color = normalized
    }
  }
  if (typeof patch.inset === 'boolean') {
    next.inset = patch.inset
  }

  return next
}

function getNextLayerId() {
  layerIdCounter += 1
  return `${layerIdCounter}`
}

function getCode(format: CSSFormat) {
  const exportLayers = layers.value.map(layer => ({
    x: layer.x,
    y: layer.y,
    blur: 0,
    spread: layer.spread,
    color: resolveColor(layer),
    inset: layer.inset
  }))

  return formatBoxShadow(exportLayers, format)
}

function applyPreset(preset: ShadowPreset) {
  layers.value = normalizeLayers(preset.layers)
  layerIdCounter = layers.value.length
  selectedPresetId.value = preset.id
  updatePresetQuery(preset.id)
  smoothScrollToTop()
}

async function copyPreset(preset: ShadowPreset) {
  const code = formatBoxShadow(
    preset.layers.map(layer => ({
      ...layer,
      blur: 0,
      color: resolveColor(layer)
    })),
    'css'
  )
  const ok = await copyToClipboard(code)
  toast[ok ? 'success' : 'error'](ok ? t('COMMON.COPIED_TO_CLIPBOARD') : t('COMMON.COPY_FAILED'))
}

async function sharePreset(preset: ShadowPreset) {
  const code = formatBoxShadow(
    preset.layers.map(layer => ({
      ...layer,
      blur: 0,
      color: resolveColor(layer)
    })),
    'inline'
  )
  const url = window.location.href

  if (navigator.share) {
    try {
      await navigator.share({
        title: preset.name,
        text: code,
        url
      })
      toast.success(t('COMMON.SHARED_SUCCESS'))
      return
    } catch (error) {
      console.warn('Share dialog was closed or not available', error)
    }
  }

  const ok = await copyToClipboard(`${code}\n${url}`)
  toast[ok ? 'success' : 'error'](
    ok ? t('COMMON.COPIED_TO_CLIPBOARD') : t('COMMON.SHARE_UNAVAILABLE')
  )
}

function normalizeLayers(layers: ShadowLayer[]): ShadowLayer[] {
  return layers.map((layer, index) => ({
    ...layer,
    id: `${index + 1}`
  }))
}

function normalizeHex(input: string): string | null {
  let value = input.trim()
  if (!value.startsWith('#')) {
    value = `#${value}`
  }
  const isValid = /^#([0-9a-fA-F]{6})$/.test(value)
  return isValid ? value.toLowerCase() : null
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function updatePresetQuery(presetId: string | null) {
  const nextQuery = { ...route.query }

  if (presetId) {
    nextQuery.preset = presetId
  } else {
    delete nextQuery.preset
  }

  router.replace({ query: nextQuery })
}

function applyPresetFromQuery(presetParam: unknown) {
  const presetId = normalizePresetId(presetParam)
  if (!presetId || presetId === selectedPresetId.value) return

  const preset = shadowPresets.find(item => item.id === presetId)
  if (!preset) return

  applyPreset(preset)
}

function normalizePresetId(value: unknown): string | null {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : null
  }
  return typeof value === 'string' ? value : null
}

onMounted(() => {
  applyPresetFromQuery(route.query.preset)
})

watch(
  () => route.query.preset,
  presetId => {
    applyPresetFromQuery(presetId)
  }
)
</script>

<style lang="scss" scoped src="./ShadowGenerationProcess.scss"></style>
