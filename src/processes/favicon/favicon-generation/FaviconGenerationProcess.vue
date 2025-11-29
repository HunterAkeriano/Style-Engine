<template>
  <div class="favicon-generation-process">
    <div class="favicon-generation-process__export">
      <FaviconExport
        :html-code="exportData.htmlCode"
        :manifest-json="exportData.manifestJson"
        :has-content="hasGeneratedFavicons"
        @download-all="handleDownloadAll"
        @save="handleSave"
      />
    </div>

    <div class="favicon-generation-process__preview">
      <FaviconPreview
        :has-image="!!config.sourceImage"
        :generated-favicons="generatedFaviconsDataUrls"
      />
    </div>

    <div class="favicon-generation-process__controls">
      <FaviconControls
        :source-image-url="config.sourceImageUrl"
        :background-color="config.backgroundColor"
        :padding="config.padding"
        :border-radius="config.borderRadius"
        @update:source-image="handleSourceImageUpdate"
        @update:background-color="config.backgroundColor = $event"
        @update:padding="config.padding = $event"
        @update:border-radius="config.borderRadius = $event"
        @remove-image="handleRemoveImage"
      />
    </div>

    <div class="favicon-generation-process__presets">
      <FaviconPresets
        :presets="allPresets"
        :saving-id="savingPresetId"
        :is-saved="isPresetSaved"
        @apply="handleApplyPreset"
        @download="handleDownloadPreset"
        @save="handleSavePreset"
        @upgrade-required="showUpgradeModal = true"
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
      :title="t('COMMON.PRO_EXPORT_TITLE')"
      :subtitle="t('COMMON.PRO_DOWNLOAD_MESSAGE')"
      :visible="showUpgradeModal"
      show-actions
      :confirm-text="t('COMMON.PRO_EXPORT_ACTION')"
      :cancel-text="t('COMMON.CANCEL')"
      @confirm="handleUpgradeConfirm"
      @close="showUpgradeModal = false"
    />

    <Modal
      :title="t('PROFILE.SAVES_TITLE')"
      :subtitle="t('PROFILE.SAVES_SUBTITLE')"
      :visible="showSaveModal"
      @close="closeSaveModal"
    >
      <div class="favicon-generation-process__save-preview">
        <img
          v-if="saveThumbnail"
          :src="saveThumbnail"
          alt="Favicon preview"
          class="favicon-generation-process__save-thumbnail"
        />
      </div>
      <Input v-model="saveName" :label="t('COMMON.NAME')" />
      <template #footer>
        <div class="modal__actions">
          <Button size="md" variant="ghost" @click="closeSaveModal">
            {{ t('COMMON.CANCEL') }}
          </Button>
          <Button size="md" variant="primary" @click="confirmSave(saveName)">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/shared/lib/toast'
import { useAuthStore } from '@/entities'
import { FaviconControls, FaviconPreview, FaviconExport, FaviconPresets } from '@/features/favicon/favicon-generator'
import type { FaviconConfig, GeneratedFavicon, FaviconPreset } from '@/shared/types/favicon'
import { FAVICON_SIZES } from '@/shared/types/favicon'
import { FAVICON_PRESETS } from './favicon-presets'
import { Modal, Button, Input } from '@/shared/ui'
import {
  generateFaviconHTML,
  generateManifestJSON,
  generateFaviconFromImage,
  loadImageFromFile,
  createFaviconZip,
  downloadBlob,
} from '@/shared/lib/favicon'
import { createSave, listPublicSaves, listSaves, type SavedItem, type SaveCategory } from '@/shared/api/saves'
import { evaluateSaveQuota, type SaveQuotaResult } from '@/shared/lib/save-quota'
import { SubscriptionTier } from '@/shared/config/pricing'
import { buildCreatorProfile } from '@/shared/lib/creator'
import { onMounted } from 'vue'

const { t, locale } = useI18n()
const toast = useToast()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const config = reactive<FaviconConfig>({
  sourceImage: null,
  sourceImageUrl: null,
  backgroundColor: '#ffffff',
  padding: 10,
  borderRadius: 0,
})

const generatedFavicons = ref<GeneratedFavicon[]>([])
const sourceImageElement = ref<HTMLImageElement | null>(null)

const showAuthModal = ref(false)
const showSaveModal = ref(false)
const showProLimitModal = ref(false)
const showUpgradeModal = ref(false)
const saveName = ref('')
const saveThumbnail = ref<string | null>(null)
const proQuota = ref<SaveQuotaResult | null>(null)
const publicFavicons = ref<FaviconPreset[]>([])
const savingPresetId = ref<string | null>(null)
const savedFaviconHashes = ref<Set<string>>(new Set())

const generatedFaviconsDataUrls = computed(() => {
  const result: Record<number, string> = {}
  for (const favicon of generatedFavicons.value) {
    result[favicon.size] = favicon.dataUrl
  }
  return result
})

const hasGeneratedFavicons = computed(() => generatedFavicons.value.length > 0)

const exportData = computed(() => {
  return {
    htmlCode: generateFaviconHTML(generatedFavicons.value),
    manifestJson: generateManifestJSON(generatedFavicons.value),
  }
})

const entityLabel = computed(() => t('MODERATION.CATEGORY_FAVICON').toLowerCase())

const proLimitSubtitle = computed(() =>
  t('PROFILE.PRO_LIMIT_MESSAGE', {
    limit: proQuota.value?.limit ?? 5,
    entity: entityLabel.value
  })
)

const allPresets = computed(() => {
  return [...FAVICON_PRESETS, ...publicFavicons.value]
})

async function handleSourceImageUpdate(file: File) {
  try {
    config.sourceImage = file
    config.sourceImageUrl = URL.createObjectURL(file)

    const img = await loadImageFromFile(file)
    sourceImageElement.value = img

    await generateAllFavicons()

    toast.success(t('FAVICON.IMAGE_LOADED'))
  } catch (error) {
    console.error('Failed to load image:', error)
    toast.error(t('FAVICON.IMAGE_LOAD_FAILED'))
  }
}

function handleRemoveImage() {
  if (config.sourceImageUrl) {
    URL.revokeObjectURL(config.sourceImageUrl)
  }
  config.sourceImage = null
  config.sourceImageUrl = null
  sourceImageElement.value = null
  generatedFavicons.value = []
}

async function generateAllFavicons() {
  if (!sourceImageElement.value) return

  try {
    const favicons: GeneratedFavicon[] = []

    for (const faviconSize of FAVICON_SIZES) {
      const favicon = await generateFaviconFromImage(
        sourceImageElement.value,
        faviconSize.size,
        config
      )
      favicons.push(favicon)
    }

    generatedFavicons.value = favicons
  } catch (error) {
    console.error('Failed to generate favicons:', error)
    toast.error(t('FAVICON.GENERATION_FAILED'))
  }
}

async function handleDownloadAll() {
  if (!hasGeneratedFavicons.value) return

  try {
    const zipBlob = await createFaviconZip(generatedFavicons.value, exportData.value.manifestJson)
    downloadBlob(zipBlob, 'favicons.zip')
    toast.success(t('FAVICON.DOWNLOAD_SUCCESS'))
  } catch (error) {
    console.error('Failed to create ZIP:', error)
    toast.error(t('FAVICON.DOWNLOAD_FAILED'))
  }
}

async function handleApplyPreset(preset: FaviconPreset) {
  try {
    let img: HTMLImageElement

    if (preset.savedImages && preset.savedImages[512]) {
      img = new Image()
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = preset.savedImages![512]
      })
    } else {
      img = await loadImageFromSVG(preset.svg, preset.backgroundColor)
    }

    sourceImageElement.value = img

    const canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0)

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        blob => blob ? resolve(blob) : reject(new Error('Failed to create blob')),
        'image/png'
      )
    })

    const file = new File([blob], `${preset.id}.png`, { type: 'image/png' })

    if (config.sourceImageUrl) {
      URL.revokeObjectURL(config.sourceImageUrl)
    }

    config.sourceImage = file
    config.sourceImageUrl = URL.createObjectURL(blob)
    config.backgroundColor = preset.backgroundColor
    config.padding = preset.padding
    config.borderRadius = preset.borderRadius

    await generateAllFavicons()

    toast.success(t('FAVICON.PRESET_APPLIED'))
  } catch (error) {
    console.error('Failed to apply preset:', error)
    toast.error(t('FAVICON.PRESET_APPLY_FAILED'))
  }
}

async function handleDownloadPreset(preset: FaviconPreset) {
  try {
    if (preset.savedImages) {
      const favicons: GeneratedFavicon[] = []
      const sizeMap: Record<number, string> = {
        16: 'favicon-16x16.png',
        32: 'favicon-32x32.png',
        48: 'favicon-48x48.png',
        144: 'mstile-144x144.png',
        180: 'apple-touch-icon.png',
        192: 'android-chrome-192x192.png',
        512: 'android-chrome-512x512.png'
      }

      for (const [sizeStr, dataUrl] of Object.entries(preset.savedImages)) {
        const size = parseInt(sizeStr)
        const filename = sizeMap[size] || `favicon-${size}x${size}.png`

        const response = await fetch(dataUrl)
        const blob = await response.blob()

        favicons.push({
          size,
          dataUrl,
          blob,
          filename
        })
      }

      const manifestJson = generateManifestJSON(favicons)
      const zipBlob = await createFaviconZip(favicons, manifestJson)
      downloadBlob(zipBlob, `${preset.name.toLowerCase().replace(/\s+/g, '-')}-favicons.zip`)
    } else {
      const img = await loadImageFromSVG(preset.svg, preset.backgroundColor)

      const presetConfig: FaviconConfig = {
        sourceImage: null,
        sourceImageUrl: null,
        backgroundColor: preset.backgroundColor,
        padding: preset.padding,
        borderRadius: preset.borderRadius,
      }

      const favicons: GeneratedFavicon[] = []
      for (const faviconSize of FAVICON_SIZES) {
        const favicon = await generateFaviconFromImage(img, faviconSize.size, presetConfig)
        favicons.push(favicon)
      }

      const manifestJson = generateManifestJSON(favicons)
      const zipBlob = await createFaviconZip(favicons, manifestJson)
      downloadBlob(zipBlob, `${preset.id}-favicons.zip`)
    }

    toast.success(t('FAVICON.DOWNLOAD_SUCCESS'))
  } catch (error) {
    console.error('Failed to download preset:', error)
    toast.error(t('FAVICON.DOWNLOAD_FAILED'))
  }
}

function loadImageFromSVG(svgString: string, backgroundColor: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const size = 512

    canvas.width = size
    canvas.height = size

    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, size, size)

    const img = new Image()
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)

    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size)
      URL.revokeObjectURL(url)

      const finalImg = new Image()
      finalImg.onload = () => resolve(finalImg)
      finalImg.onerror = () => reject(new Error('Failed to load image from canvas'))
      finalImg.src = canvas.toDataURL('image/png')
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load SVG'))
    }

    img.src = url
  })
}

async function handleSave() {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return
  }

  if (!hasGeneratedFavicons.value) {
    return
  }

  const payload = {
    backgroundColor: config.backgroundColor,
    padding: config.padding,
    borderRadius: config.borderRadius
  }

  const favicon32 = generatedFavicons.value.find(f => f.size === 32)
  if (favicon32) {
    saveThumbnail.value = favicon32.dataUrl
  }

  saveName.value = 'My Favicon'
  showSaveModal.value = true
}

async function confirmSave(name: string) {
  showSaveModal.value = false

  const allowed = await ensureProQuota('favicon')
  if (!allowed) {
    return
  }

  const faviconImages: Record<number, string> = {}
  generatedFavicons.value.forEach(favicon => {
    faviconImages[favicon.size] = favicon.dataUrl
  })

  const payload = {
    backgroundColor: config.backgroundColor,
    padding: config.padding,
    borderRadius: config.borderRadius,
    images: faviconImages,
    htmlCode: exportData.value.htmlCode,
    manifestJson: exportData.value.manifestJson
  }

  try {
    await createSave('favicon', name || 'My Favicon', payload)
    toast.success(t('COMMON.SAVE_SUCCESS', { entity: entityLabel.value }))
  } catch (error: any) {
    if (error?.status === 403) {
      proQuota.value = {
        allowed: false,
        limit: typeof error?.data?.limit === 'number' ? error.data.limit : 5,
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
    saveThumbnail.value = null
  }
}

function closeSaveModal() {
  showSaveModal.value = false
  saveThumbnail.value = null
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

function handleUpgradeConfirm() {
  showUpgradeModal.value = false
  router.push({
    path: `/${locale.value}/about`,
    query: { plan: 'pro' }
  })
}

async function handleSavePreset(preset: FaviconPreset) {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return
  }

  const allowed = await ensureProQuota('favicon')
  if (!allowed) {
    return
  }

  savingPresetId.value = preset.id

  try {
    const img = await loadImageFromSVG(preset.svg, preset.backgroundColor)

    const presetConfig: FaviconConfig = {
      sourceImage: null,
      sourceImageUrl: null,
      backgroundColor: preset.backgroundColor,
      padding: preset.padding,
      borderRadius: preset.borderRadius,
    }

    const favicons: GeneratedFavicon[] = []
    for (const faviconSize of FAVICON_SIZES) {
      const favicon = await generateFaviconFromImage(img, faviconSize.size, presetConfig)
      favicons.push(favicon)
    }

    const faviconImages: Record<number, string> = {}
    favicons.forEach(favicon => {
      faviconImages[favicon.size] = favicon.dataUrl
    })

    const htmlCode = generateFaviconHTML(favicons)
    const manifestJson = generateManifestJSON(favicons)

    const payload = {
      backgroundColor: preset.backgroundColor,
      padding: preset.padding,
      borderRadius: preset.borderRadius,
      images: faviconImages,
      htmlCode,
      manifestJson
    }

    await createSave('favicon', preset.name, payload)
    toast.success(t('COMMON.SAVE_SUCCESS', { entity: entityLabel.value }))
    savedFaviconHashes.value.add(JSON.stringify(payload))
  } catch (error: any) {
    if (error?.status === 403) {
      proQuota.value = {
        allowed: false,
        limit: typeof error?.data?.limit === 'number' ? error.data.limit : 5,
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
  }
}

function isPresetSaved(preset: FaviconPreset) {
  if (preset.savedImages) {
    const payload = {
      images: preset.savedImages,
      backgroundColor: preset.backgroundColor,
      padding: preset.padding,
      borderRadius: preset.borderRadius
    }
    return savedFaviconHashes.value.has(JSON.stringify(payload))
  }
  return false
}

async function loadPublicFavicons() {
  try {
    const items = await listPublicSaves('favicon')
    publicFavicons.value = items.map(savedToPreset)
  } catch (error) {
    console.error('Failed to load public favicons:', error)
  }
}

async function loadUserSavedFavicons() {
  if (!authStore.isAuthenticated) {
    return
  }

  try {
    const items = await listSaves('favicon')
    items.forEach(item => {
      const payload = item.payload as {
        images?: Record<number, string>
        backgroundColor?: string
        padding?: number
        borderRadius?: number
      }
      if (payload.images) {
        const hash = JSON.stringify({
          images: payload.images,
          backgroundColor: payload.backgroundColor,
          padding: payload.padding,
          borderRadius: payload.borderRadius
        })
        savedFaviconHashes.value.add(hash)
      }
    })
  } catch (error) {
    console.error('Failed to load user saved favicons:', error)
  }
}

function savedToPreset(item: SavedItem): FaviconPreset {
  const payload = item.payload as {
    backgroundColor?: string
    padding?: number
    borderRadius?: number
    images?: Record<number, string>
  }

  let svg = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="currentColor"/></svg>'

  if (payload.images && payload.images[512]) {
    const imageUrl = payload.images[512]
    svg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <image href="${imageUrl}" x="0" y="0" width="100" height="100" preserveAspectRatio="xMidYMid meet"/>
    </svg>`
  }

  return {
    id: item.id,
    name: item.name,
    backgroundColor: payload.backgroundColor ?? '#ffffff',
    padding: payload.padding ?? 10,
    borderRadius: payload.borderRadius ?? 0,
    svg,
    owner: buildCreatorProfile(item.ownerName, item.ownerEmail, item.ownerAvatar),
    savedImages: payload.images
  }
}

onMounted(() => {
  loadPublicFavicons()
  loadUserSavedFavicons()
})

watch(
  () => [config.backgroundColor, config.padding, config.borderRadius],
  async () => {
    if (sourceImageElement.value) {
      await generateAllFavicons()
    }
  },
  { deep: true }
)
</script>

<style lang="scss" scoped src="./favicon-generation-process.scss"></style>
