<template>
  <div class="gradient-generation-process">
    <div class="gradient-generation-process__preview">
      <GradientPreview :gradient-style="gradientStyle" />
    </div>

    <div class="gradient-generation-process__controls">
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

    <div class="gradient-generation-process__code">
      <GradientCodeExport :get-code="getCode" />
    </div>

    <div class="gradient-generation-process__presets">
      <GradientPresets
        :presets="gradientPresets"
        @apply="applyPreset"
        @copy="copyPreset"
        @share="sharePreset"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import type { GradientPreset } from './gradientPresets'
import type { GradientType, GradientColor } from '@/shared/types'
import { formatGradient, type CSSFormat, copyToClipboard, smoothScrollToTop } from '@/shared/lib'
import { GradientPreview, GradientControls, GradientCodeExport, GradientPresets } from '@/features/gradient-generator/ui'
import { GRADIENT_PRESETS } from './gradientPresets'

const type = ref<GradientType>('linear')
const angle = ref(90)
const colors = ref<GradientColor[]>([
  { id: '1', color: '#667eea', position: 0 },
  { id: '2', color: '#764ba2', position: 100 }
])
let colorIdCounter = colors.value.length
const gradientPresets = GRADIENT_PRESETS
const { t } = useI18n()
const toast = useToast()

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
  type.value = preset.type
  angle.value = preset.angle

  const sortedColors = [...preset.colors].sort((a, b) => a.position - b.position)
  colorIdCounter = sortedColors.length

  colors.value = sortedColors.map((color, index) => ({
    id: `${index + 1}`,
    color: color.color,
    position: color.position
  }))

  smoothScrollToTop()
}

async function copyPreset(preset: GradientPreset) {
  const code = formatGradient(preset.type, preset.angle, preset.colors, 'css')
  const ok = await copyToClipboard(code)
  toast[ok ? 'success' : 'error'](ok ? t('COMMON.COPIED_TO_CLIPBOARD') : t('COMMON.COPY_FAILED'))
}

async function sharePreset(preset: GradientPreset) {
  const code = formatGradient(preset.type, preset.angle, preset.colors, 'inline')
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

function getNextColorId() {
  colorIdCounter += 1
  return `${colorIdCounter}`
}
</script>

<style lang="scss" scoped src="./GradientGenerationProcess.scss"></style>
