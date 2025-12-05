<template>
  <div ref="processRef" class="gradient-generation-process">
    <div ref="controlsRef" class="gradient-generation-process__controls">
      <GradientControls
        :type="type"
        :angle="angle"
        :colors="colors"
        :shape="shape"
        :extent="extent"
        :center="center"
        :repeating="isRepeating"
        @update:type="setType"
        @update:angle="setAngle"
        @add-color="addColor"
        @remove-color="removeColor"
        @update-color="updateColor"
        @update-color-position="updateColorPosition"
        @update:shape="setShape"
        @update:extent="setExtent"
        @update:center="setCenter"
        @update:repeating="setRepeating"
        @reverse-colors="reverseColors"
        @distribute-colors="distributeColors"
      />
    </div>

    <div
      :style="gradientPreviewWrapperStyle"
      ref="gradientPreviewWrapperRef"
      class="gradient-generation-process__preview"
    >
      <div
        ref="gradientPreviewRef"
        :class="{ 'gradient-generation-process__preview-inner_floating': isGradientPreviewFloating }"
        :style="gradientFloatingStyle"
        class="gradient-generation-process__preview-inner"
      >
        <GradientPreview :gradient-style="gradientStyle" />
      </div>
    </div>

    <div class="gradient-generation-process__code">
      <CodeExport
        :title="t('GRADIENT.EXPORT_TITLE')"
        :get-code="getCode"
        :allow-export="isExportAllowed"
        :copy-label="t('GRADIENT.COPY')"
        :copied-label="t('GRADIENT.COPIED')"
        @save="handleSaveCurrentGradient"
        @blocked-export="showExportProModal = true"
      />
    </div>

    <div class="gradient-generation-process__presets">
      <GradientPresets
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
      <div :style="currentSavePreviewStyle" class="gradient-generation-process__save-preview" />
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
      :title="t('COMMON.EXPORT')"
      :visible="showExportModal"
      @close="showExportModal = false"
    >
      <CodeExport
        :title="t('COMMON.EXPORT')"
        :get-code="getCode"
        :filename="exportFilename"
        :allow-export="isExportAllowed"
        :copy-label="t('GRADIENT.COPY')"
        :copied-label="t('GRADIENT.COPIED')"
        @save="handleSaveCurrentGradient"
        @blocked-export="showExportProModal = true"
      />
    </Modal>
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
import type { GradientPreset } from './gradient-presets'
import type { GradientCenter, GradientColor, GradientExtent, GradientType } from '@/shared/types'
import {
  buildGradientValue,
  formatGradient,
  type CSSFormat,
  copyToClipboard,
  smoothScrollToTop,
  normalizePayload
} from '@/shared/lib'
import { GradientPreview, GradientControls, GradientPresets } from '@/features/gradient'
import { GRADIENT_PRESETS } from './gradient-presets'
import {
  listPublicSaves,
  type SavedItem,
  createSave,
  listSaves,
  type SaveCategory
} from '@/shared/api/saves'
import { useAuthStore } from '@/entities'
import { useFloatingPreview } from '@/shared/composables'
import { Modal, Button, Input } from '@/shared/ui'
import CodeExport from '@/shared/ui/code-export/CodeExport.vue'
import { getUserLimit, SubscriptionTier } from '@/shared/config/pricing'
import { evaluateSaveQuota, type SaveQuotaResult, resolveSubscriptionTier } from '@/shared/lib/save-quota'
import { buildCreatorProfile } from '@/shared/lib/creator'

const type = ref<GradientType>('linear')
const angle = ref(90)
const colors = ref<GradientColor[]>([
  { id: '1', color: '#667eea', position: 0 },
  { id: '2', color: '#764ba2', position: 100 }
])
const shape = ref<'circle' | 'ellipse'>('circle')
const extent = ref<GradientExtent>('farthest-corner')
const center = ref<GradientCenter>({ x: 50, y: 50 })
const isRepeating = ref(false)
let colorIdCounter = colors.value.length
const communityPresets = ref<GradientPreset[]>([])
const gradientPresets = GRADIENT_PRESETS
const allPresets = computed(() => [...communityPresets.value, ...gradientPresets])
const selectedPresetId = ref<string | null>(null)
const { t, locale } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const processRef = ref<HTMLElement | null>(null)
const controlsRef = ref<HTMLElement | null>(null)
const {
  previewRef: gradientPreviewRef,
  wrapperRef: gradientPreviewWrapperRef,
  floatingStyle: gradientFloatingStyle,
  wrapperStyle: gradientPreviewWrapperStyle,
  isFloating: isGradientPreviewFloating
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
  preset: GradientPreset
  payload: Record<string, unknown>
  defaultName: string
} | null>(null)
const proQuota = ref<SaveQuotaResult | null>(null)
const savedGradientHashes = ref<Set<string>>(new Set())
const proSaveLimit = getUserLimit(SubscriptionTier.PRO, 'savedTemplates')

type NormalizedGradientPayload = {
  type?: GradientType
  angle?: number
  colors?: GradientColor[]
  shape?: 'circle' | 'ellipse'
  extent?: GradientExtent
  center?: GradientCenter
  repeating?: boolean
  layers?: Array<{
    colors?: GradientColor[]
    angle?: number
  }>
}

function getUserTier(): SubscriptionTier | undefined {
  return resolveSubscriptionTier(
    authStore.user?.subscriptionTier ?? (authStore.userPlan as string | undefined)
  )
}

const entityLabel = computed(() => t('PROFILE.SAVED_GRADIENTS'))
const proLimitSubtitle = computed(() =>
  t('PROFILE.PRO_LIMIT_MESSAGE', {
    limit: proQuota.value?.limit ?? proSaveLimit,
    entity: entityLabel.value
  })
)
const exportFilename = computed(() => selectedPresetId.value ?? 'custom-gradient')
const isExportAllowed = computed(() => {
  const tier = getUserTier()
  return Boolean(tier && tier !== SubscriptionTier.FREE)
})

const currentSavePreviewStyle = computed(() => {
  const context = saveContext.value
  if (!context) return {}
  const payload = context.payload as {
    type?: GradientType
    angle?: number
    colors?: GradientColor[]
    shape?: 'circle' | 'ellipse'
    extent?: GradientExtent
    center?: GradientCenter
    repeating?: boolean
  }
  const payloadColors = Array.isArray(payload.colors) ? payload.colors : []
  if (!payload.type) return {}
  return {
    background: buildGradient(payload.type, payload.angle ?? 90, payloadColors, {
      shape: payload.shape,
      extent: payload.extent,
      center: payload.center,
      repeating: payload.repeating
    })
  }
})

const gradientStyle = computed(() => {
  const gradient = buildGradientValue(type.value, angle.value, colors.value, {
    shape: shape.value,
    extent: extent.value,
    center: center.value,
    repeating: isRepeating.value
  })

  return { background: gradient }
})

function setType(newType: GradientType) {
  type.value = newType
}

function setAngle(newAngle: number) {
  angle.value = newAngle
}

function setShape(newShape: 'circle' | 'ellipse') {
  shape.value = newShape
}

function setExtent(newExtent: GradientExtent) {
  extent.value = newExtent
}

function setCenter(newCenter: GradientCenter) {
  center.value = clampCenter(newCenter)
}

function setRepeating(value: boolean) {
  isRepeating.value = value
}

function addColor() {
  const newId = getNextColorId()
  const newPosition = colors.value.length > 0
    ? Math.round((colors.value[colors.value.length - 1].position + 100) / 2)
    : 50

  colors.value.push({
    id: newId,
    color: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'),
    position: newPosition
  })
}

function removeColor(id: string) {
  if (colors.value.length > 2) {
    colors.value = colors.value.filter(c => c.id !== id)
  }
}

function updateColor(id: string, color: string) {
  const colorItem = colors.value.find(c => c.id === id)
  if (colorItem) {
    colorItem.color = color
  }
}

function updateColorPosition(id: string, position: number) {
  const colorItem = colors.value.find(c => c.id === id)
  if (colorItem) {
    colorItem.position = Math.max(0, Math.min(100, position))
  }
}

function reverseColors() {
  const mirrored = [...colors.value].reverse().map(color => ({
    ...color,
    position: clampPercent(100 - color.position)
  }))
  colors.value = mirrored.sort((a, b) => a.position - b.position)
}

function distributeColors() {
  if (colors.value.length < 2) return
  const sorted = [...colors.value].sort((a, b) => a.position - b.position)
  const step = 100 / Math.max(1, sorted.length - 1)
  colors.value = sorted.map((color, index) => ({
    ...color,
    position: Math.round(index * step)
  }))
}

function getCode(format: string | number): string {
  return formatGradient(
    type.value,
    angle.value,
    colors.value,
    String(format) as CSSFormat,
    {
      shape: shape.value,
      extent: extent.value,
      center: center.value,
      repeating: isRepeating.value
    }
  )
}

function applyPreset(preset: GradientPreset) {
  setPresetState(preset)
  updatePresetQuery(preset.id)
  smoothScrollToTop()
}

function buildGradient(
  type: GradientType,
  angle: number,
  gradientColors: GradientColor[],
  options?: { shape?: 'circle' | 'ellipse'; extent?: GradientExtent; center?: GradientCenter; repeating?: boolean }
) {
  return buildGradientValue(type, angle, gradientColors, {
    shape: options?.shape,
    extent: options?.extent ? normalizeExtent(options.extent) : undefined,
    center: options?.center,
    repeating: options?.repeating
  })
}

function presetHash(preset: GradientPreset) {
  const normalized = normalizePayload('gradient', {
    type: preset.type,
    angle: preset.angle,
    colors: preset.colors,
    shape: preset.shape ?? 'circle',
    extent: preset.extent ?? 'farthest-corner',
    center: preset.center ?? { x: 50, y: 50 },
    repeating: Boolean(preset.repeating)
  })
  return JSON.stringify(normalized)
}

function setPresetState(preset: GradientPreset) {
  type.value = normalizeGradientType(preset.type)
  angle.value = Number.isFinite(preset.angle) ? preset.angle : 90
  shape.value = preset.shape ?? 'circle'
  extent.value = preset.extent ?? 'farthest-corner'
  center.value = clampCenter(preset.center)
  isRepeating.value = Boolean(preset.repeating)

  const sortedColors = [...preset.colors].sort((a, b) => a.position - b.position)
  colorIdCounter = sortedColors.length

  colors.value = sortedColors.map((color, index) => ({
    id: `${index + 1}`,
    color: color.color,
    position: color.position
  }))

  selectedPresetId.value = preset.id
}

async function copyPreset(preset: GradientPreset) {
  const code = formatGradient(preset.type, preset.angle, preset.colors, 'css', {
    shape: preset.shape,
    extent: preset.extent,
    center: clampCenter(preset.center),
    repeating: preset.repeating
  })
  const ok = await copyToClipboard(code)
  toast[ok ? 'success' : 'error'](ok ? t('COMMON.COPIED_TO_CLIPBOARD') : t('COMMON.COPY_FAILED'))
}

async function handleSaveCurrentGradient() {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return
  }

  const currentColors = colors.value.map(c => ({
    color: c.color,
    position: c.position
  }))

  saveContext.value = {
    preset: {
      id: 'custom',
      name: t('GRADIENT.CUSTOM_GRADIENT'),
      type: type.value,
      angle: angle.value,
      colors: currentColors,
      shape: shape.value,
      extent: extent.value,
      center: center.value,
      repeating: isRepeating.value
    } as GradientPreset,
    payload: {
      type: type.value,
      angle: angle.value,
      colors: currentColors,
      shape: shape.value,
      extent: extent.value,
      center: center.value,
      repeating: isRepeating.value
    },
    defaultName: t('GRADIENT.CUSTOM_GRADIENT')
  }
  saveName.value = t('GRADIENT.CUSTOM_GRADIENT')
  showSaveModal.value = true
}

async function handleSavePreset(preset: GradientPreset) {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return
  }

  saveContext.value = {
    preset,
    payload: {
      type: preset.type,
      angle: preset.angle,
      colors: preset.colors,
      shape: preset.shape ?? 'circle',
      extent: preset.extent ?? 'farthest-corner',
      center: clampCenter(preset.center),
      repeating: Boolean(preset.repeating)
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
  const allowed = await ensureProQuota('gradient')
  if (!allowed) {
    return
  }
  savingPresetId.value = context.preset.id
  try {
    await createSave('gradient', finalName, context.payload)
    toast.success(t('COMMON.SAVE_SUCCESS', { entity: entityLabel.value }))
    savedGradientHashes.value.add(JSON.stringify(normalizePayload('gradient', context.payload)))
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

function isPresetSaved(preset: GradientPreset) {
  return savedGradientHashes.value.has(presetHash(preset))
}

function handleAuthConfirm() {
  showAuthModal.value = false
  router.push({
    name: `${locale.value}-login`,
    query: { redirect: route.fullPath }
  })
}

function getNextColorId() {
  colorIdCounter += 1
  return `${colorIdCounter}`
}

function clampPercent(value: number | undefined) {
  const numeric = typeof value === 'number' && Number.isFinite(value) ? value : 50
  return Math.min(100, Math.max(0, numeric))
}

function clampCenter(value?: GradientCenter | null): GradientCenter {
  const base = value ?? { x: 50, y: 50 }
  return {
    x: clampPercent(base.x),
    y: clampPercent(base.y)
  }
}

const allowedGradientTypes: GradientType[] = ['linear', 'radial', 'conic']
function normalizeGradientType(value: unknown): GradientType {
  return allowedGradientTypes.includes(value as GradientType) ? (value as GradientType) : 'linear'
}

function normalizeExtent(value: unknown): GradientExtent {
  const extents: GradientExtent[] = ['closest-side', 'farthest-side', 'closest-corner', 'farthest-corner']
  return extents.includes(value as GradientExtent) ? (value as GradientExtent) : 'farthest-corner'
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

function mapCommunityPreset(item: SavedItem): GradientPreset | null {
  const normalized = normalizePayload('gradient', item.payload ?? {}) as NormalizedGradientPayload
  const colors = Array.isArray(normalized.colors)
    ? normalized.colors.map((color, index) => ({
        id: color.id ?? `${index + 1}`,
        color: color.color,
        position: color.position
      }))
    : []
  if (!colors.length) return null

  return {
    id: `community-${item.id}`,
    name: item.name,
    type: normalizeGradientType(normalized.type),
    angle: Number.isFinite(normalized.angle) ? Number(normalized.angle) : 90,
    colors,
    shape: normalized.shape === 'ellipse' ? 'ellipse' : 'circle',
    extent: normalizeExtent(normalized.extent),
    center: clampCenter(normalized.center),
    repeating: Boolean(normalized.repeating),
    owner: buildCreatorProfile(item)
  }
}

async function loadCommunityPresets() {
  try {
    const items = await listPublicSaves('gradient')
    communityPresets.value = items
      .map(mapCommunityPreset)
      .filter(Boolean) as GradientPreset[]
    applyPresetFromQuery(route.query.preset)
  } catch (error) {
    console.warn('Failed to load community gradients', error)
  }
}

async function loadSavedGradients() {
  if (!authStore.isAuthenticated) {
    savedGradientHashes.value = new Set()
    return
  }

  try {
    const saved = await listSaves('gradient')
    savedGradientHashes.value = new Set(
      saved.map(item => JSON.stringify(normalizePayload('gradient', item.payload ?? {})))
    )
  } catch (error) {
    console.warn('Failed to load saved gradients', error)
  }
}

onMounted(() => {
  applyPresetFromQuery(route.query.preset)
  loadCommunityPresets()
  loadSavedGradients()
})

watch(
  () => route.query.preset,
  presetId => {
    applyPresetFromQuery(presetId)
  }
)
</script>

<style lang="scss" scoped src="./gradient-generation-process.scss"></style>
