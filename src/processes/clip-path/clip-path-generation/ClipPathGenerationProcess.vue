<template>
  <div ref="processRef" class="clip-path-generation-process">
    <div ref="controlsRef" class="clip-path-generation-process__controls">
      <ClipPathControls
        :layers="layers"
        @add-layer="addLayer"
        @remove-layer="removeLayer"
        @toggle-layer="toggleLayer"
        @update-layer-type="updateLayerType"
        @update-point="updatePoint"
        @add-point="addPoint"
        @remove-point="removePoint"
        @update-layer-radius="updateLayerRadius"
        @update-layer-radius-x="updateLayerRadiusX"
        @update-layer-radius-y="updateLayerRadiusY"
        @update-inset="updateInset"
        @load-from-svg="loadFromSvg"
      />
    </div>

    <div
      :style="clipPathPreviewWrapperStyle"
      ref="clipPathPreviewWrapperRef"
      class="clip-path-generation-process__preview"
    >
      <div
        ref="clipPathPreviewRef"
        :class="{ 'clip-path-generation-process__preview-inner_floating': isClipPathPreviewFloating }"
        :style="clipPathFloatingStyle"
        class="clip-path-generation-process__preview-inner"
      >
        <ClipPathPreview
          :layers="layers"
          @update-point="updatePointFromPreview"
        />
      </div>
    </div>

    <div class="clip-path-generation-process__code">
      <CodeExport
        :title="t('CLIP_PATH.EXPORT_TITLE')"
        :get-code="getCode"
        :allow-export="isExportAllowed"
        :copy-label="t('CLIP_PATH.COPY')"
        :copied-label="t('CLIP_PATH.COPIED')"
        @save="handleSaveCurrentClipPath"
        @blocked-export="showExportProModal = true"
      />
    </div>

    <div class="clip-path-generation-process__presets">
      <ClipPathPresets
        :presets="allPresets"
        :saving-id="savingPresetId"
        :is-saved="isPresetSaved"
        @apply="applyPreset"
        @copy="copyPreset"
        @save="handleSavePreset"
      />
    </div>

    <Modal
      :title="t('COMMON.AUTH_REQUIRED_TITLE')"
      :subtitle="t('COMMON.AUTH_REQUIRED_DESCRIPTION')"
      :visible="showAuthModal"
      :confirm-text="t('COMMON.AUTH_REQUIRED_CONFIRM')"
      :cancel-text="t('COMMON.AUTH_REQUIRED_CLOSE')"
      show-actions
      @confirm="handleAuthConfirm"
      @close="showAuthModal = false"
    />
    <Modal
      :title="t('PROFILE.SAVES_TITLE')"
      :subtitle="t('PROFILE.SAVES_SUBTITLE')"
      :visible="showSaveModal"
      @close="closeSaveModal"
    >
      <div :style="currentSavePreviewStyle" class="clip-path-generation-process__save-preview" />
      <Input v-model="saveName" :label="t('COMMON.NAME')" />
      <template #footer>
        <div class="modal__actions">
          <Button size="md" variant="ghost" @click="closeSaveModal">
            {{ t('COMMON.CANCEL') }}
          </Button>
          <Button size="md" variant="primary" @click="confirmSaveClipPath(saveName)">
            {{ t('COMMON.SAVE') }}
          </Button>
        </div>
      </template>
    </Modal>
    <Modal
      :title="t('PROFILE.PRO_LIMIT_TITLE')"
      :subtitle="proLimitSubtitle"
      :visible="showProLimitModal"
      show-actions
      :confirm-text="t('PROFILE.PRO_LIMIT_ACTION')"
      :cancel-text="t('COMMON.CANCEL')"
      @confirm="handleProLimitConfirm"
      @close="showProLimitModal = false"
    />
    <Modal
      :title="t('COMMON.PRO_EXPORT_TITLE')"
      :subtitle="t('COMMON.PRO_EXPORT_MESSAGE')"
      :visible="showExportProModal"
      show-actions
      :confirm-text="t('COMMON.PRO_EXPORT_ACTION')"
      :cancel-text="t('COMMON.CANCEL')"
      @confirm="handleExportUpgrade"
      @close="showExportProModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/shared/lib/toast'
import { useRoute, useRouter } from 'vue-router'
import type { ClipPathLayer, ClipPathType } from '@/shared/types'
import { formatClipPath, type CSSFormat, copyToClipboard, smoothScrollToTop } from '@/shared/lib'
import { ClipPathPreview, ClipPathControls, ClipPathPresets } from '@/features/clip-path'
import { CLIP_PATH_PRESETS, type ClipPathPreset } from './clip-path-presets'
import {
  listPublicSaves,
  type SavedItem,
  createSave,
  type SaveCategory
} from '@/shared/api/saves'
import { useAuthStore } from '@/entities'
import { useFloatingPreview } from '@/shared/composables'
import { Modal, Button, Input } from '@/shared/ui'
import CodeExport from '@/shared/ui/code-export/CodeExport.vue'
import { getUserLimit, SubscriptionTier } from '@/shared/config/pricing'
import { evaluateSaveQuota, type SaveQuotaResult, resolveSubscriptionTier } from '@/shared/lib/save-quota'
import { buildCreatorProfile } from '@/shared/lib/creator'

const layers = ref<ClipPathLayer[]>([
  {
    id: 'layer-1',
    type: 'polygon',
    points: [
      { id: 'point-1', x: 50, y: 0 },
      { id: 'point-2', x: 100, y: 50 },
      { id: 'point-3', x: 50, y: 100 },
      { id: 'point-4', x: 0, y: 50 }
    ],
    visible: true
  }
])

let layerIdCounter = layers.value.length
let pointIdCounter = 4

const communityPresets = ref<ClipPathPreset[]>([])
const clipPathPresets = CLIP_PATH_PRESETS
const allPresets = computed(() => [...communityPresets.value, ...clipPathPresets])
const selectedPresetId = ref<string | null>(null)
const { t, locale } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const processRef = ref<HTMLElement | null>(null)
const controlsRef = ref<HTMLElement | null>(null)
const {
  previewRef: clipPathPreviewRef,
  wrapperRef: clipPathPreviewWrapperRef,
  floatingStyle: clipPathFloatingStyle,
  wrapperStyle: clipPathPreviewWrapperStyle,
  isFloating: isClipPathPreviewFloating
} = useFloatingPreview({
  containerRef: controlsRef,
  boundingRef: processRef,
  topOffset: 88,
  breakpoint: 1024
})
const showAuthModal = ref(false)
const showSaveModal = ref(false)
const showProLimitModal = ref(false)
const showExportProModal = ref(false)
const saveName = ref('')
const savingPresetId = ref<string | null>(null)
const saveContext = ref<{
  preset?: ClipPathPreset
  payload: Record<string, unknown>
  defaultName: string
} | null>(null)
const proQuota = ref<SaveQuotaResult | null>(null)
const proSaveLimit = getUserLimit(SubscriptionTier.PRO, 'savedTemplates')

function getUserTier(): SubscriptionTier | undefined {
  return resolveSubscriptionTier(
    authStore.user?.subscriptionTier ?? (authStore.userPlan as string | undefined)
  )
}

const entityLabel = computed(() => t('PROFILE.SAVED_CLIP_PATHS'))
const proLimitSubtitle = computed(() =>
  t('PROFILE.PRO_LIMIT_MESSAGE', {
    limit: proQuota.value?.limit ?? proSaveLimit,
    entity: entityLabel.value
  })
)
const isExportAllowed = computed(() => {
  const tier = getUserTier()
  return Boolean(tier && tier !== SubscriptionTier.FREE)
})

const currentSavePreviewStyle = computed(() => {
  const context = saveContext.value
  if (!context) return {}
  const payload = context.payload as { layers?: ClipPathLayer[] }
  const clipPathValue = formatClipPath(payload.layers ?? [], 'inline')
  return {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    clipPath: clipPathValue.replace('clip-path:', '').replace(';', '').trim()
  }
})

function addLayer() {
  if (layers.value.length >= 3) return

  layerIdCounter += 1
  layers.value.push({
    id: `layer-${layerIdCounter}`,
    type: 'polygon',
    points: [
      { id: `point-${++pointIdCounter}`, x: 50, y: 0 },
      { id: `point-${++pointIdCounter}`, x: 100, y: 50 },
      { id: `point-${++pointIdCounter}`, x: 50, y: 100 },
      { id: `point-${++pointIdCounter}`, x: 0, y: 50 }
    ],
    visible: true
  })
}

function removeLayer(id: string) {
  if (layers.value.length > 1) {
    layers.value = layers.value.filter(l => l.id !== id)
  }
}

function toggleLayer(id: string) {
  const layer = layers.value.find(l => l.id === id)
  if (layer) {
    layer.visible = !layer.visible
  }
}

function updateLayerType(id: string, type: ClipPathType) {
  const layer = layers.value.find(l => l.id === id)
  if (!layer) return

  layer.type = type

  if (type === 'polygon') {
    layer.points = [
      { id: `point-${++pointIdCounter}`, x: 50, y: 0 },
      { id: `point-${++pointIdCounter}`, x: 100, y: 50 },
      { id: `point-${++pointIdCounter}`, x: 50, y: 100 },
      { id: `point-${++pointIdCounter}`, x: 0, y: 50 }
    ]
    delete layer.radius
    delete layer.radiusX
    delete layer.radiusY
    delete layer.inset
  } else if (type === 'circle') {
    layer.radius = 50
    delete layer.points
    delete layer.radiusX
    delete layer.radiusY
    delete layer.inset
  } else if (type === 'ellipse') {
    layer.radiusX = 50
    layer.radiusY = 50
    delete layer.points
    delete layer.radius
    delete layer.inset
  } else if (type === 'inset') {
    layer.inset = {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10,
      round: 0
    }
    delete layer.points
    delete layer.radius
    delete layer.radiusX
    delete layer.radiusY
  }
}

function updatePoint(layerId: string, pointId: string, axis: 'x' | 'y', value: number) {
  const layer = layers.value.find(l => l.id === layerId)
  if (!layer || !layer.points) return

  const point = layer.points.find(p => p.id === pointId)
  if (point) {
    point[axis] = Math.max(0, Math.min(100, value))
  }
}

function updatePointFromPreview(layerId: string, pointId: string, x: number, y: number) {
  const layer = layers.value.find(l => l.id === layerId)
  if (!layer || !layer.points) return

  const point = layer.points.find(p => p.id === pointId)
  if (point) {
    point.x = x
    point.y = y
  }
}

function addPoint(layerId: string) {
  const layer = layers.value.find(l => l.id === layerId)
  if (!layer || !layer.points || layer.points.length >= 10) return

  layer.points.push({
    id: `point-${++pointIdCounter}`,
    x: 50,
    y: 50
  })
}

function removePoint(layerId: string, pointId: string) {
  const layer = layers.value.find(l => l.id === layerId)
  if (!layer || !layer.points || layer.points.length <= 3) return

  layer.points = layer.points.filter(p => p.id !== pointId)
}

function updateLayerRadius(id: string, radius: number) {
  const layer = layers.value.find(l => l.id === id)
  if (layer) {
    layer.radius = Math.max(0, Math.min(100, radius))
  }
}

function updateLayerRadiusX(id: string, radiusX: number) {
  const layer = layers.value.find(l => l.id === id)
  if (layer) {
    layer.radiusX = Math.max(0, Math.min(100, radiusX))
  }
}

function updateLayerRadiusY(id: string, radiusY: number) {
  const layer = layers.value.find(l => l.id === id)
  if (layer) {
    layer.radiusY = Math.max(0, Math.min(100, radiusY))
  }
}

function updateInset(id: string, side: 'top' | 'right' | 'bottom' | 'left' | 'round', value: number) {
  const layer = layers.value.find(l => l.id === id)
  if (layer && layer.inset) {
    layer.inset[side] = Math.max(0, Math.min(side === 'round' ? 50 : 100, value))
  }
}

function loadFromSvg(newLayers: ClipPathLayer[]) {
  layers.value = [...newLayers.slice(0, 3)]
  layerIdCounter = layers.value.length
  const allPoints = layers.value.flatMap(l => l.points ?? [])
  pointIdCounter = allPoints.length
}

function getCode(format: string | number): string {
  return formatClipPath(layers.value, String(format) as CSSFormat)
}

async function handleSaveCurrentClipPath() {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return
  }

  saveContext.value = {
    payload: {
      layers: layers.value.map(l => ({
        id: l.id,
        type: l.type,
        points: l.points,
        radius: l.radius,
        radiusX: l.radiusX,
        radiusY: l.radiusY,
        inset: l.inset,
        visible: l.visible
      }))
    },
    defaultName: t('CLIP_PATH.CUSTOM_CLIP_PATH')
  }
  saveName.value = t('CLIP_PATH.CUSTOM_CLIP_PATH')
  showSaveModal.value = true
}

function handleExportUpgrade() {
  showExportProModal.value = false
  router.push({
    path: `/${locale.value}/about`,
    query: { plan: 'premium' }
  })
}

async function confirmSaveClipPath(name: string) {
  const context = saveContext.value
  if (!context) return

  const finalName = name || context.defaultName
  showSaveModal.value = false
  const allowed = await ensureProQuota('clip-path')
  if (!allowed) {
    return
  }

  if (context.preset) {
    savingPresetId.value = context.preset.id
  }

  try {
    await createSave('clip-path' as SaveCategory, finalName, context.payload)
    toast.success(t('COMMON.SAVE_SUCCESS', { entity: entityLabel.value }))
  } catch (error: any) {
    if (error?.status === 403) {
      proQuota.value = {
        allowed: false,
        limit: typeof error?.data?.limit === 'number' ? error.data.limit : 3,
        used: proQuota.value?.used ?? 0,
        plan: SubscriptionTier.FREE
      }
      showProLimitModal.value = true
      return
    }
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

function handleAuthConfirm() {
  showAuthModal.value = false
  router.push({
    name: `${locale.value}-login`,
    query: { redirect: route.fullPath }
  })
}

function applyPreset(preset: ClipPathPreset) {
  setPresetState(preset)
  updatePresetQuery(preset.id)
  smoothScrollToTop()
}

function presetHash(preset: ClipPathPreset) {
  return JSON.stringify({ layers: preset.layers })
}

function setPresetState(preset: ClipPathPreset) {
  layers.value = preset.layers.map((layer, layerIndex) => {
    const newLayer: ClipPathLayer = {
      ...layer,
      id: `layer-${layerIndex + 1}`,
      points: layer.points?.map((point, pointIndex) => ({
        ...point,
        id: `point-${pointIndex + 1}`
      }))
    }
    return newLayer
  })

  layerIdCounter = layers.value.length
  const allPoints = layers.value.flatMap(l => l.points ?? [])
  pointIdCounter = allPoints.length
  selectedPresetId.value = preset.id
}

async function copyPreset(preset: ClipPathPreset) {
  const code = formatClipPath(preset.layers, 'css')
  const ok = await copyToClipboard(code)
  toast[ok ? 'success' : 'error'](ok ? t('COMMON.COPIED_TO_CLIPBOARD') : t('COMMON.COPY_FAILED'))
}

async function handleSavePreset(preset: ClipPathPreset) {
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

function isPresetSaved(_preset: ClipPathPreset) {
  return false
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

  setPresetState(preset)
}

function normalizePresetId(value: unknown): string | null {
  if (Array.isArray(value)) {
    return typeof value[0] === 'string' ? value[0] : null
  }
  return typeof value === 'string' ? value : null
}

function mapCommunityPreset(item: SavedItem): ClipPathPreset | null {
  const payload: any = item.payload || {}
  if (!payload || typeof payload !== 'object') return null
  if (!payload.layers || !Array.isArray(payload.layers)) return null

  const layers = payload.layers
    .map((layer: any, index: number) => {
      if (!layer?.type) return null

      const newLayer: ClipPathLayer = {
        id: layer.id ?? `layer-${index + 1}`,
        type: layer.type,
        visible: typeof layer.visible === 'boolean' ? layer.visible : true
      }

      if (layer.type === 'polygon' && Array.isArray(layer.points)) {
        newLayer.points = layer.points
          .map((point: any, pIndex: number) => ({
            id: point.id ?? `point-${pIndex + 1}`,
            x: Number.isFinite(point.x) ? Number(point.x) : 50,
            y: Number.isFinite(point.y) ? Number(point.y) : 50
          }))
          .filter(Boolean)
      } else if (layer.type === 'circle') {
        newLayer.radius = Number.isFinite(layer.radius) ? Number(layer.radius) : 50
      } else if (layer.type === 'ellipse') {
        newLayer.radiusX = Number.isFinite(layer.radiusX) ? Number(layer.radiusX) : 50
        newLayer.radiusY = Number.isFinite(layer.radiusY) ? Number(layer.radiusY) : 50
      } else if (layer.type === 'inset' && layer.inset) {
        newLayer.inset = {
          top: Number.isFinite(layer.inset.top) ? Number(layer.inset.top) : 0,
          right: Number.isFinite(layer.inset.right) ? Number(layer.inset.right) : 0,
          bottom: Number.isFinite(layer.inset.bottom) ? Number(layer.inset.bottom) : 0,
          left: Number.isFinite(layer.inset.left) ? Number(layer.inset.left) : 0,
          round: Number.isFinite(layer.inset.round) ? Number(layer.inset.round) : 0
        }
      }

      return newLayer
    })
    .filter(Boolean)

  if (!layers.length) return null

  return {
    id: `community-${item.id}`,
    name: item.name,
    layers,
    owner: buildCreatorProfile(item)
  }
}

async function loadCommunityPresets() {
  try {
    const items = await listPublicSaves('clip-path')
    communityPresets.value = items
      .map(mapCommunityPreset)
      .filter(Boolean) as ClipPathPreset[]
  } catch (error) {
    console.warn('Failed to load community clip paths', error)
  }
}

onMounted(() => {
  applyPresetFromQuery(route.query.preset)
  loadCommunityPresets()
})

watch(
  () => route.query.preset,
  presetId => {
    applyPresetFromQuery(presetId)
  }
)
</script>

<style lang="scss" scoped src="./clip-path-generation-process.scss"></style>
