<template>
  <div class="gradient-controls">
    <div class="gradient-controls__group gradient-controls__row">
      <div class="gradient-controls__stack">
        <label class="gradient-controls__label">{{ t('GRADIENT.TYPE') }}</label>
        <Select
          :model-value="type"
          :options="typeOptions"
          @change="handleTypeChange"
        />
      </div>

      <label class="gradient-controls__toggle">
        <input
          :checked="repeating"
          type="checkbox"
          class="gradient-controls__toggle-input"
          @change="handleRepeatingChange"
        />
        <span class="gradient-controls__toggle-label">
          {{ t('GRADIENT.REPEATING') }}
        </span>
      </label>
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
      <div class="gradient-controls__angle-presets">
        <span class="gradient-controls__label gradient-controls__label_muted">
          {{ t('GRADIENT.ANGLE_PRESETS') }}
        </span>
        <div class="gradient-controls__chips">
          <Button
            v-for="preset in anglePresets"
            :key="preset"
            size="sm"
            variant="ghost"
            class="gradient-controls__chip"
            @click="emit('update:angle', preset)"
          >
            {{ preset }}°
          </Button>
        </div>
      </div>
    </div>

    <div v-if="type === 'radial'" class="gradient-controls__group gradient-controls__row">
      <div class="gradient-controls__stack">
        <label class="gradient-controls__label">{{ t('GRADIENT.SHAPE') }}</label>
        <Select
          :model-value="shape"
          :options="shapeOptions"
          @change="handleShapeChange"
        />
      </div>
      <div class="gradient-controls__stack">
        <label class="gradient-controls__label">{{ t('GRADIENT.EXTENT') }}</label>
        <Select
          :model-value="extent"
          :options="extentOptions"
          @change="handleExtentChange"
        />
      </div>
    </div>

    <div v-if="type === 'radial' || type === 'conic'" class="gradient-controls__group gradient-controls__grid">
      <div class="gradient-controls__stack">
        <label class="gradient-controls__label">{{ t('GRADIENT.CENTER_X') }}: {{ center.x }}%</label>
        <input
          :value="center.x"
          type="range"
          min="0"
          max="100"
          class="gradient-controls__range"
          @input="(e) => handleCenterChange('x', parseInt((e.target as HTMLInputElement).value))"
        />
      </div>
      <div class="gradient-controls__stack">
        <label class="gradient-controls__label">{{ t('GRADIENT.CENTER_Y') }}: {{ center.y }}%</label>
        <input
          :value="center.y"
          type="range"
          min="0"
          max="100"
          class="gradient-controls__range"
          @input="(e) => handleCenterChange('y', parseInt((e.target as HTMLInputElement).value))"
        />
      </div>
      <p class="gradient-controls__hint">{{ t('GRADIENT.CENTER_HINT') }}</p>
    </div>

    <div class="gradient-controls__group">
      <div class="gradient-controls__label-row">
        <label class="gradient-controls__label">{{ t('GRADIENT.COLORS') }}</label>
        <div class="gradient-controls__actions">
          <Button size="sm" variant="ghost" @click="emit('reverse-colors')">
            {{ t('GRADIENT.REVERSE_COLORS') }}
          </Button>
          <Button size="sm" variant="ghost" @click="emit('distribute-colors')">
            {{ t('GRADIENT.DISTRIBUTE_COLORS') }}
          </Button>
        </div>
      </div>
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
            pattern="#?[0-9a-fA-F]{6}"
            class="gradient-controls__color-input"
            @update:model-value="(value) => handleColorChange(color.id, value as string)"
          />
          <div class="gradient-controls__position-group">
            <input
              :value="color.position"
              type="number"
              min="0"
              max="100"
              class="gradient-controls__position-input"
              @input="(e) => handlePositionChange(color.id, parseInt((e.target as HTMLInputElement).value))"
            />
            <span class="gradient-controls__position-label">%</span>
          </div>
          <Button
            :disabled="colors.length <= 2"
            size="sm"
            variant="danger"
            class="gradient-controls__remove"
            @click="emit('remove-color', color.id)"
          >
            x
          </Button>
        </div>
      </div>
      <Button size="sm" variant="outline" @click="emit('add-color')">
        + {{ t('GRADIENT.ADD_COLOR') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import type { GradientCenter, GradientExtent, GradientType, GradientColor } from '@/shared/types'
import { Button, Input, Select, type SelectOption } from '@/shared/ui'

interface Props {
  type: GradientType
  angle: number
  colors: GradientColor[]
  shape: 'circle' | 'ellipse'
  extent: GradientExtent
  center: GradientCenter
  repeating: boolean
}

interface Emits {
  (e: 'update:type', value: GradientType): void
  (e: 'update:angle', value: number): void
  (e: 'add-color'): void
  (e: 'remove-color', id: string): void
  (e: 'update-color', id: string, color: string): void
  (e: 'update-color-position', id: string, position: number): void
  (e: 'update:shape', value: 'circle' | 'ellipse'): void
  (e: 'update:extent', value: GradientExtent): void
  (e: 'update:center', value: GradientCenter): void
  (e: 'update:repeating', value: boolean): void
  (e: 'reverse-colors'): void
  (e: 'distribute-colors'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { type, angle, colors, shape, extent, center, repeating } = toRefs(props)
const { t } = useI18n()
const anglePresets = [0, 30, 45, 60, 90, 120, 180, 225, 270, 315]

const typeOptions = computed<SelectOption[]>(() => [
  { label: t('GRADIENT.TYPE_LINEAR'), value: 'linear' },
  { label: t('GRADIENT.TYPE_RADIAL'), value: 'radial' },
  { label: t('GRADIENT.TYPE_CONIC'), value: 'conic' }
])

const shapeOptions = computed<SelectOption[]>(() => [
  { label: t('GRADIENT.SHAPE_CIRCLE'), value: 'circle' },
  { label: t('GRADIENT.SHAPE_ELLIPSE'), value: 'ellipse' }
])

const extentOptions = computed<SelectOption[]>(() => [
  { label: t('GRADIENT.EXTENT_CLOSEST_SIDE'), value: 'closest-side' },
  { label: t('GRADIENT.EXTENT_FARTHEST_SIDE'), value: 'farthest-side' },
  { label: t('GRADIENT.EXTENT_CLOSEST_CORNER'), value: 'closest-corner' },
  { label: t('GRADIENT.EXTENT_FARTHEST_CORNER'), value: 'farthest-corner' }
])

function handleTypeChange(value: string | number) {
  emit('update:type', value as GradientType)
}

function handleAngleChange(e: Event) {
  emit('update:angle', parseInt((e.target as HTMLInputElement).value))
}

function handleColorChange(id: string, color: string) {
  const normalized = normalizeHex(color)
  if (normalized) {
    emit('update-color', id, normalized)
  }
}

function handlePositionChange(id: string, position: number) {
  const safePosition = Number.isFinite(position) ? Math.min(100, Math.max(0, position)) : 0
  emit('update-color-position', id, safePosition)
}

function handleShapeChange(value: string | number) {
  emit('update:shape', value as 'circle' | 'ellipse')
}

function handleExtentChange(value: string | number) {
  emit('update:extent', value as GradientExtent)
}

function handleCenterChange(axis: 'x' | 'y', value: number) {
  const normalized = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 50
  const nextCenter = { ...center.value, [axis]: normalized } as GradientCenter
  emit('update:center', nextCenter)
}

function handleRepeatingChange(e: Event) {
  emit('update:repeating', (e.target as HTMLInputElement).checked)
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

<style lang="scss" scoped src="./gradient-controls.scss"></style>
