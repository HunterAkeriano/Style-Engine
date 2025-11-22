<template>
  <div class="shadow-generation" ref="processRef">
    <div class="shadow-generation__code">
      <ShadowCodeExport
        :get-code="getCode"
        @save="handleSaveCurrentShadow"
        :allow-export="isExportAllowed"
        @blocked-export="showExportProModal = true"
      />
    </div>

    <div class="shadow-generation__controls" ref="controlsRef">
      <ShadowControls
        :layers="layers"
        @update-layer="updateLayer"
        @remove-layer="removeLayer"
        @add-layer="addLayer"
      />
    </div>

    <div
      class="shadow-generation__preview"
      ref="shadowPreviewWrapperRef"
      :style="shadowPreviewWrapperStyle"
    >
      <div
        class="shadow-generation__preview-inner"
        :class="{ 'shadow-generation__preview-inner--floating': isShadowPreviewFloating }"
        ref="shadowPreviewRef"
        :style="shadowFloatingStyle"
      >
        <ShadowPreview
          :box-shadow="boxShadowValue"
          :accent="{ primary: '#22d3ee', secondary: '#a855f7' }"
        />
      </div>
    </div>

    <div class="shadow-generation__presets">
      <ShadowPresets
        :presets="allPresets"
        :active-id="selectedPresetId"
        :saving-id="savingPresetId"
        :is-saved="isPresetSaved"
        @apply="applyPreset"
        @copy="copyPreset"
        @save="handleSavePreset"
      />
    </div>
    <Modal
      :visible="showAuthModal"
      :title="t('COMMON.AUTH_REQUIRED_TITLE')"
      :subtitle="t('COMMON.AUTH_REQUIRED_DESCRIPTION')"
      :confirm-text="t('COMMON.AUTH_REQUIRED_CONFIRM')"
      :cancel-text="t('COMMON.AUTH_REQUIRED_CLOSE')"
      show-actions
      @confirm="handleAuthConfirm"
      @close="showAuthModal = false"
    />
    <Modal
      :visible="showSaveModal"
      :title="t('PROFILE.SAVES_TITLE')"
      :subtitle="t('PROFILE.SAVES_SUBTITLE')"
      @close="closeSaveModal"
    >
      <div class="shadow-generation__save-preview" :style="currentSavePreviewStyle" />
      <Input v-model="saveName" :label="t('COMMON.NAME')" />
      <template #footer>
        <div class="modal__actions">
          <Button size="md" variant="ghost" @click="closeSaveModal">
            {{ t('COMMON.CANCEL') }}
          </Button>
          <Button size="md" variant="primary" @click="confirmSavePreset(saveName)">
            {{ t('COMMON.SAVE') }}
          </Button>
        </div>
      </template>
    </Modal>
    <Modal
      :visible="showProLimitModal"
      :title="t('PROFILE.PRO_LIMIT_TITLE')"
      :subtitle="proLimitSubtitle"
      show-actions
      :confirm-text="t('PROFILE.PRO_LIMIT_ACTION')"
      :cancel-text="t('COMMON.CANCEL')"
      @confirm="handleProLimitConfirm"
      @close="showProLimitModal = false"
    />
    <Modal
      :visible="showExportModal"
      :title="t('COMMON.EXPORT')"
      @close="showExportModal = false"
    >
      <ShadowCodeExport
        :get-code="getCode"
        :filename="exportFilename"
        :show-save-button="false"
        :allow-export="isExportAllowed"
        @blocked-export="showExportProModal = true"
      />
    </Modal>
    <Modal
      :visible="showExportProModal"
      :title="t('COMMON.PRO_EXPORT_TITLE')"
      :subtitle="t('COMMON.PRO_EXPORT_MESSAGE')"
      show-actions
      :confirm-text="t('COMMON.PRO_EXPORT_ACTION')"
      :cancel-text="t('COMMON.CANCEL')"
      @confirm="handleExportUpgrade"
      @close="showExportProModal = false"
    />
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
import { ShadowControls, ShadowPreview, ShadowCodeExport, ShadowPresets } from '@/features/shadow'
import { SHADOW_PRESETS } from './shadow-presets'
import {
  listPublicSaves,
  listSaves,
  type SavedItem,
  createSave,
  type SaveCategory
} from '@/shared/api/saves'
import { useAuthStore } from '@/entities'
import { useFloatingPreview } from '@/shared/composables'
import { Modal, Button, Input } from '@/shared/ui'
import { getUserLimit, SubscriptionTier } from '@/shared/config/pricing'
import { evaluateSaveQuota, type SaveQuotaResult, resolveSubscriptionTier } from '@/shared/lib/save-quota'

const shadowPresets = SHADOW_PRESETS
const communityPresets = ref<ShadowPreset[]>([])
const allPresets = computed(() => [...communityPresets.value, ...shadowPresets])
const defaultLayers: ShadowLayer[] = [
  { id: '1', x: 0, y: 12, spread: 16, color: '#0b1220', opacity: 0.36, inset: false },
  { id: '2', x: 0, y: 0, spread: 3, color: '#a855f7', opacity: 0.2, inset: true }
]
const layers = ref<ShadowLayer[]>(normalizeLayers(defaultLayers))
let layerIdCounter = layers.value.length
const selectedPresetId = ref<string | null>(null)

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const toast = useToast()
const authStore = useAuthStore()
const processRef = ref<HTMLElement | null>(null)
const controlsRef = ref<HTMLElement | null>(null)
const {
  previewRef: shadowPreviewRef,
  wrapperRef: shadowPreviewWrapperRef,
  floatingStyle: shadowFloatingStyle,
  wrapperStyle: shadowPreviewWrapperStyle,
  isFloating: isShadowPreviewFloating
} = useFloatingPreview({
  containerRef: controlsRef,
  boundingRef: processRef,
  topOffset: 88,
  breakpoint: 1024
})
const showAuthModal = ref(false)
const showSaveModal = ref(false)
const showProLimitModal = ref(false)
const showExportModal = ref(false)
const showExportProModal = ref(false)
const saveName = ref('')
const savingPresetId = ref<string | null>(null)
const saveContext = ref<{
  preset: ShadowPreset
  payload: Record<string, unknown>
  defaultName: string
} | null>(null)
const proQuota = ref<SaveQuotaResult | null>(null)
const savedShadowHashes = ref<Set<string>>(new Set())
const entityLabel = computed(() => t('PROFILE.SAVED_SHADOWS'))
const proSaveLimit = getUserLimit(SubscriptionTier.PRO, 'savedTemplates')
const proLimitSubtitle = computed(() =>
  t('PROFILE.PRO_LIMIT_MESSAGE', {
    limit: proQuota.value?.limit ?? proSaveLimit,
    entity: entityLabel.value
  })
)
const exportFilename = computed(() => selectedPresetId.value ?? 'custom-shadow')

function getUserTier(): SubscriptionTier | undefined {
  return resolveSubscriptionTier(
    authStore.user?.subscriptionTier ?? (authStore.userPlan as string | undefined)
  )
}
const isExportAllowed = computed(() => {
  const tier = getUserTier()
  return Boolean(tier && tier !== SubscriptionTier.FREE)
})
const currentSavePreviewStyle = computed(() => {
  const context = saveContext.value
  if (!context) return {}
  const payload = context.payload as { layers?: ShadowLayer[] }
  const layers = Array.isArray(payload.layers) ? payload.layers : []
  if (!layers.length) return {}
  return {
    boxShadow: buildShadow(layers)
  }
})

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

async function handleSaveCurrentShadow() {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return
  }

  const currentLayers = layers.value.map(layer => ({
    id: layer.id,
    x: layer.x,
    y: layer.y,
    spread: layer.spread,
    color: layer.color,
    opacity: layer.opacity,
    inset: layer.inset
  }))

  saveContext.value = {
    preset: {
      id: 'custom',
      name: t('SHADOW.CUSTOM_SHADOW'),
      description: t('SHADOW.CUSTOM_SHADOW'),
      layers: currentLayers
    },
    payload: {
      layers: currentLayers
    },
    defaultName: t('SHADOW.CUSTOM_SHADOW')
  }
  saveName.value = t('SHADOW.CUSTOM_SHADOW')
  showSaveModal.value = true
}

async function handleSavePreset(preset: ShadowPreset) {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return
  }

  saveContext.value = {
    preset,
    payload: {
      layers: preset.layers
    },
    defaultName: preset.name
  }
  saveName.value = preset.name
  showSaveModal.value = true
}

function handleExportUpgrade() {
  showExportProModal.value = false
  router.push({
    path: `/${locale.value}/about`,
    query: { plan: 'premium' }
  })
}

async function confirmSavePreset(name: string) {
  const context = saveContext.value
  if (!context) return

  const finalName = name || context.defaultName
  showSaveModal.value = false
  const allowed = await ensureProQuota('shadow')
  if (!allowed) {
    return
  }
  savingPresetId.value = context.preset.id
  try {
    await createSave('shadow', finalName, context.payload)
    toast.success(t('COMMON.SAVE_SUCCESS', { entity: entityLabel.value }))
    savedShadowHashes.value.add(JSON.stringify(context.payload))
  } catch (error: any) {
    if (error?.status === 409) {
      toast.error(t('COMMON.ALREADY_SAVED', { entity: entityLabel.value }))
    } else {
      toast.error(
        error?.message || t('COMMON.SAVE_ERROR', { entity: entityLabel.value })
      )
    }
  } finally {
    savingPresetId.value = null
    saveContext.value = null
  }
}

function closeSaveModal() {
  showSaveModal.value = false
  saveContext.value = null
}

async function ensureProQuota(category: SaveCategory) {
  const quota = await evaluateSaveQuota(category)
  proQuota.value = quota
  if (!quota.allowed) {
    showProLimitModal.value = true
    return false
  }
  return true
}

function handleProLimitConfirm() {
  showProLimitModal.value = false
  router.push({
    path: `/${locale.value}/about`,
    query: { plan: 'premium' }
  })
}

function isPresetSaved(preset: ShadowPreset) {
  return savedShadowHashes.value.has(shadowPresetHash(preset))
}

function handleAuthConfirm() {
  showAuthModal.value = false
  router.push({
    name: `${locale.value}-login`,
    query: { redirect: route.fullPath }
  })
}

function buildShadow(layers: ShadowLayer[]) {
  return layers
    .map(layer => {
      return `${layer.inset ? 'inset ' : ''}${layer.x}px ${layer.y}px 0 ${layer.spread}px ${layer.color}`
    })
    .join(', ')

}

function shadowPresetHash(preset: ShadowPreset) {
  return JSON.stringify({
    layers: preset.layers
  })
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

  const preset = allPresets.value.find(item => item.id === presetId)
  if (!preset) return

  applyPreset(preset)
}

function normalizePresetId(value: unknown): string | null {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : null
  }
  return typeof value === 'string' ? value : null
}

function mapCommunityPreset(item: SavedItem): ShadowPreset | null {
  const payload: any = item.payload || {}
  const layers = Array.isArray(payload.layers)
    ? payload.layers
        .map((layer: any, index: number) => {
          if (!layer) return null
          return {
            id: `${index + 1}`,
            x: Number.isFinite(layer.x) ? Number(layer.x) : 0,
            y: Number.isFinite(layer.y) ? Number(layer.y) : 0,
            spread: Number.isFinite(layer.spread) ? Number(layer.spread) : 0,
            color: typeof layer.color === 'string' ? layer.color : '#000000',
            opacity: Number.isFinite(layer.opacity) ? Number(layer.opacity) : 0.35,
            inset: Boolean(layer.inset)
          }
        })
        .filter(Boolean)
    : []

  if (!layers.length) return null

  return {
    id: `community-${item.id}`,
    name: item.name,
    description: payload.description || 'Community shadow',
    layers
  }
}

async function loadSavedShadows() {
  if (!authStore.isAuthenticated) {
    savedShadowHashes.value = new Set()
    return
  }

  try {
    const saved = await listSaves('shadow')
    savedShadowHashes.value = new Set(saved.map((item: SavedItem) => JSON.stringify(item.payload)))
  } catch (error) {
    console.warn('Failed to load saved shadows', error)
  }
}

async function loadCommunityPresets() {
  try {
    const items = await listPublicSaves('shadow')
    communityPresets.value = items.map(mapCommunityPreset).filter(Boolean) as ShadowPreset[]
  } catch (error) {
    console.warn('Failed to load community shadows', error)
  }
}

onMounted(() => {
  applyPresetFromQuery(route.query.preset)
  loadCommunityPresets()
  loadSavedShadows()
})

watch(
  () => route.query.preset,
  presetId => {
    applyPresetFromQuery(presetId)
  }
)
</script>

<style lang="scss" scoped src="./shadow-generation-process.scss"></style>
