<template>
  <div class="gradient-controls">
    <div class="gradient-controls__group">
      <label class="gradient-controls__label">{{ t('GRADIENT.TYPE') }}</label>
      <Select
        :model-value="type"
        :options="typeOptions"
        @change="handleTypeChange"
      />
    </div>

    <div v-if="type === 'linear' || type === 'conic'" class="gradient-controls__group">
      <label class="gradient-controls__label">
        {{ t('GRADIENT.ANGLE') }}: {{ angle }}°
      </label>
      <input
        :value="angle"
        type="range"
        min="0"
        max="360"
        class="gradient-controls__range"
        @input="handleAngleChange"
      />
    </div>

    <div class="gradient-controls__group">
      <label class="gradient-controls__label">{{ t('GRADIENT.COLORS') }}</label>
      <div class="gradient-controls__colors">
        <div
          v-for="color in colors"
          :key="color.id"
          class="gradient-controls__color-item"
        >
          <input
            :value="color.color"
            type="color"
            class="gradient-controls__color-picker"
            @input="(e) => handleColorChange(color.id, (e.target as HTMLInputElement).value)"
          />
          <Input
            :model-value="color.color"
            type="text"
            placeholder="#000000"
            class="gradient-controls__color-input"
            @update:model-value="(value) => handleColorChange(color.id, value as string)"
          />
          <input
            :value="color.position"
            type="number"
            min="0"
            max="100"
            class="gradient-controls__position-input"
            @input="(e) => handlePositionChange(color.id, parseInt((e.target as HTMLInputElement).value))"
          />
          <span class="gradient-controls__position-label">%</span>
          <Button
            v-if="colors.length > 2"
            variant="danger"
            size="sm"
            @click="emit('remove-color', color.id)"
          >
            ✕
          </Button>
        </div>
      </div>
      <Button variant="outline" size="sm" @click="emit('add-color')">
        + {{ t('GRADIENT.ADD_COLOR') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { GradientType, GradientColor } from '@/shared/types'
import { Button, Input, Select, type SelectOption } from '@/shared/ui'

interface Props {
  type: GradientType
  angle: number
  colors: GradientColor[]
}

interface Emits {
  (e: 'update:type', value: GradientType): void
  (e: 'update:angle', value: number): void
  (e: 'add-color'): void
  (e: 'remove-color', id: string): void
  (e: 'update-color', id: string, color: string): void
  (e: 'update-color-position', id: string, position: number): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const typeOptions = computed<SelectOption[]>(() => [
  { label: t('GRADIENT.TYPE_LINEAR'), value: 'linear' },
  { label: t('GRADIENT.TYPE_RADIAL'), value: 'radial' },
  { label: t('GRADIENT.TYPE_CONIC'), value: 'conic' }
])

function handleTypeChange(value: string | number) {
  emit('update:type', value as GradientType)
}

function handleAngleChange(e: Event) {
  emit('update:angle', parseInt((e.target as HTMLInputElement).value))
}

function handleColorChange(id: string, color: string) {
  emit('update-color', id, color)
}

function handlePositionChange(id: string, position: number) {
  emit('update-color-position', id, position)
}
</script>

<style lang="scss" scoped src="./GradientControls.scss"></style>
