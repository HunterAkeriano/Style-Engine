<template>
  <div class="favicon-generation-process">
    <div class="favicon-generation-process__export">
      <FaviconExport
        :html-code="exportData.htmlCode"
        :manifest-json="exportData.manifestJson"
        :has-content="hasGeneratedFavicons"
        @download-all="handleDownloadAll"
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
        :presets="FAVICON_PRESETS"
        @apply="handleApplyPreset"
        @download="handleDownloadPreset"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/shared/lib/toast'
import { FaviconControls, FaviconPreview, FaviconExport, FaviconPresets } from '@/features/favicon/favicon-generator'
import type { FaviconConfig, GeneratedFavicon, FaviconPreset } from '@/shared/types/favicon'
import { FAVICON_SIZES } from '@/shared/types/favicon'
import { FAVICON_PRESETS } from './favicon-presets'
import {
  generateFaviconHTML,
  generateManifestJSON,
  generateFaviconFromImage,
  loadImageFromFile,
  createFaviconZip,
  downloadBlob,
} from '@/shared/lib/favicon'

const { t } = useI18n()
const toast = useToast()

// State
const config = reactive<FaviconConfig>({
  sourceImage: null,
  sourceImageUrl: null,
  backgroundColor: '#ffffff',
  padding: 10,
  borderRadius: 0,
})

const generatedFavicons = ref<GeneratedFavicon[]>([])
const sourceImageElement = ref<HTMLImageElement | null>(null)

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
    const img = await loadImageFromSVG(preset.svg, preset.backgroundColor)
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
