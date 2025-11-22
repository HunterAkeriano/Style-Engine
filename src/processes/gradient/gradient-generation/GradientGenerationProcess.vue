<template>
  <div class="gradient-generation-process" ref="processRef">
    <div class="gradient-generation-process__controls" ref="controlsRef">
      <GradientControls
        :type="type"
        :angle="angle"
        :colors="colors"
        @update:type="setType"
        @update:angle="setAngle"
        @add-color="addColor"
        @remove-color="removeColor"
        @update-color="updateColor"
        @update-color-position="updateColorPosition"
      />
    </div>

    <div
      class="gradient-generation-process__preview"
      ref="gradientPreviewWrapperRef"
      :style="gradientPreviewWrapperStyle"
    >
      <div
        class="gradient-generation-process__preview-inner"
        :class="{ 'gradient-generation-process__preview-inner--floating': isGradientPreviewFloating }"
        ref="gradientPreviewRef"
        :style="gradientFloatingStyle"
      >
        <GradientPreview :gradient-style="gradientStyle" />
      </div>
    </div>

    <div class="gradient-generation-process__code">
      <GradientCodeExport
        :get-code="getCode"
        @save="handleSaveCurrentGradient"
        :allow-export="isExportAllowed"
        @blocked-export="showExportProModal = true"
      />
    </div>

    <div class="gradient-generation-process__presets">
      <GradientPresets
        :presets="gradientPresets"
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
      <div class="gradient-generation-process__save-preview" :style="currentSavePreviewStyle" />
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
      <GradientCodeExport
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
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import type { GradientPreset } from './gradient-presets'
import type { GradientType, GradientColor } from '@/shared/types'
import { formatGradient, type CSSFormat, copyToClipboard, smoothScrollToTop } from '@/shared/lib'
import { GradientPreview, GradientControls, GradientCodeExport, GradientPresets } from '@/features/gradient'
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
import { getUserLimit, SubscriptionTier } from '@/shared/config/pricing'
import { evaluateSaveQuota, type SaveQuotaResult, resolveSubscriptionTier } from '@/shared/lib/save-quota'

const type = ref<GradientType>('linear')
const angle = ref(90)
const colors = ref<GradientColor[]>([
  { id: '1', color: '#667eea', position: 0 },
  { id: '2', color: '#764ba2', position: 100 }
])
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
  const payload = context.payload as { type?: GradientType; angle?: number; colors?: GradientColor[] }
  const colors = Array.isArray(payload.colors) ? payload.colors : []
  if (!payload.type) return {}
  return {
    background: buildGradient(payload.type, payload.angle ?? 90, colors)
  }
})

const gradientStyle = computed(() => {
  let gradient = ''

  switch (type.value) {
    case 'linear':
      gradient = `linear-gradient(${angle.value}deg, ${colors.value
        .map(c => `${c.color} ${c.position}%`)
        .join(', ')})`
      break
    case 'radial':
      gradient = `radial-gradient(circle, ${colors.value
        .map(c => `${c.color} ${c.position}%`)
        .join(', ')})`
      break
    case 'conic':
      gradient = `conic-gradient(from ${angle.value}deg, ${colors.value
        .map(c => `${c.color} ${c.position}%`)
        .join(', ')})`
      break
  }

  return { background: gradient }
})

function setType(newType: GradientType) {
  type.value = newType
}

function setAngle(newAngle: number) {
  angle.value = newAngle
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

function getCode(format: CSSFormat): string {
  return formatGradient(type.value, angle.value, colors.value, format)
}

function applyPreset(preset: GradientPreset) {
  setPresetState(preset)
  updatePresetQuery(preset.id)
  smoothScrollToTop()
}

function buildGradient(type: GradientType, angle: number, colors: GradientColor[]) {
  const colorStops = colors.map(c => `${c.color} ${c.position}%`).join(', ')
  switch (type) {
    case 'radial':
      return `radial-gradient(circle, ${colorStops})`
    case 'conic':
      return `conic-gradient(from ${angle}deg, ${colorStops})`
    default:
      return `linear-gradient(${angle}deg, ${colorStops})`
  }
}

function presetHash(preset: GradientPreset) {
  return JSON.stringify({
    type: preset.type,
    angle: preset.angle,
    colors: preset.colors
  })
}

function setPresetState(preset: GradientPreset) {
  type.value = preset.type
  angle.value = preset.angle

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
  const code = formatGradient(preset.type, preset.angle, preset.colors, 'css')
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
      colors: currentColors
    } as GradientPreset,
    payload: {
      type: type.value,
      angle: angle.value,
      colors: currentColors
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
      colors: preset.colors
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
    savedGradientHashes.value.add(JSON.stringify(context.payload))
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
  const payload: any = item.payload || {}
  if (!payload || typeof payload !== 'object') return null
  if (!payload.type || !payload.colors) return null

  const colors = Array.isArray(payload.colors)
    ? payload.colors
        .map((color: any, index: number) => {
          if (!color?.color) return null
          return {
            id: color.id ?? `${index + 1}`,
            color: color.color,
            position: Number.isFinite(color.position) ? Number(color.position) : index * (100 / Math.max(1, payload.colors.length - 1))
          } as GradientColor
        })
        .filter(Boolean)
    : []

  if (!colors.length) return null

  return {
    id: `community-${item.id}`,
    name: item.name,
    type: payload.type as GradientType,
    angle: Number.isFinite(payload.angle) ? Number(payload.angle) : 90,
    colors
  }
}

async function loadCommunityPresets() {
  try {
    const items = await listPublicSaves('gradient')
    communityPresets.value = items
      .map(mapCommunityPreset)
      .filter(Boolean) as GradientPreset[]
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
    savedGradientHashes.value = new Set(saved.map(item => JSON.stringify(item.payload)))
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
