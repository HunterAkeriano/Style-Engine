<template>
  <div class="favicon-controls">
    <div class="favicon-controls__group">
      <label class="favicon-controls__label">{{ t('FAVICON.SOURCE_IMAGE') }}</label>
      <div
        class="favicon-controls__upload-area"
        :class="{ 'favicon-controls__upload-area--dragging': isDragging }"
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
        @click="triggerFileInput"
      >
        <input
          ref="fileInputRef"
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/svg+xml"
          class="favicon-controls__file-input"
          @change="handleFileChange"
        />

        <div v-if="!sourceImageUrl" class="favicon-controls__upload-placeholder">
          <svg class="favicon-controls__upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="favicon-controls__upload-text">{{ t('FAVICON.DRAG_DROP') }}</p>
          <p class="favicon-controls__upload-hint">{{ t('FAVICON.OR_CLICK') }}</p>
        </div>

        <div v-else class="favicon-controls__image-preview">
          <img :src="sourceImageUrl" :alt="t('FAVICON.SOURCE_IMAGE')" />
          <Button
            size="sm"
            variant="danger"
            class="favicon-controls__remove-image"
            @click.stop="handleRemoveImage"
          >
            ✕
          </Button>
        </div>
      </div>
    </div>

    <div class="favicon-controls__group">
      <label class="favicon-controls__label">{{ t('FAVICON.BACKGROUND_COLOR') }}</label>
      <div class="favicon-controls__color-row">
        <input
          :value="backgroundColor"
          type="color"
          class="favicon-controls__color-picker"
          @input="handleBackgroundColorChange"
        />
        <Input
          :model-value="backgroundColor"
          type="text"
          placeholder="#ffffff"
          pattern="#?[0-9a-fA-F]{6}"
          class="favicon-controls__color-input"
          @update:model-value="handleBackgroundColorInput"
        />
        <Button
          size="sm"
          variant="outline"
          @click="emit('update:background-color', 'transparent')"
        >
          {{ t('FAVICON.TRANSPARENT') }}
        </Button>
      </div>
    </div>

    <div class="favicon-controls__group">
      <label class="favicon-controls__label">
        {{ t('FAVICON.PADDING') }}: {{ padding }}%
      </label>
      <input
        :value="padding"
        type="range"
        min="0"
        max="30"
        class="favicon-controls__range"
        @input="handlePaddingChange"
      />
    </div>

    <div class="favicon-controls__group">
      <label class="favicon-controls__label">
        {{ t('FAVICON.BORDER_RADIUS') }}: {{ borderRadius }}%
      </label>
      <input
        :value="borderRadius"
        type="range"
        min="0"
        max="50"
        class="favicon-controls__range"
        @input="handleBorderRadiusChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button, Input } from '@/shared/ui'

interface Props {
  sourceImageUrl: string | null
  backgroundColor: string
  padding: number
  borderRadius: number
}

interface Emits {
  (e: 'update:source-image', file: File): void
  (e: 'update:background-color', value: string): void
  (e: 'update:padding', value: number): void
  (e: 'update:border-radius', value: number): void
  (e: 'remove-image'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    emit('update:source-image', file)
  }
}

function handleDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    emit('update:source-image', file)
  }
}

function handleRemoveImage() {
  emit('remove-image')
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

function handleBackgroundColorChange(e: Event) {
  const value = (e.target as HTMLInputElement).value
  emit('update:background-color', value)
}

function handleBackgroundColorInput(value: string | number) {
  const normalized = normalizeHex(value as string)
  if (normalized) {
    emit('update:background-color', normalized)
  }
}

function handlePaddingChange(e: Event) {
  emit('update:padding', parseInt((e.target as HTMLInputElement).value))
}

function handleBorderRadiusChange(e: Event) {
  emit('update:border-radius', parseInt((e.target as HTMLInputElement).value))
}

function normalizeHex(input: string): string | null {
  let value = input.trim()
  if (!value) return null
  if (!value.startsWith('#')) {
    value = `#${value}`
  }
  const isValid = /^#([0-9a-fA-F]{6})$/.test(value)
  return isValid ? value.toLowerCase() : null
}
</script>

<style lang="scss" scoped src="./favicon-controls.scss"></style>
