<template>
  <div class="gradient-controls">
    <div class="gradient-controls__group">
      <label class="gradient-controls__label">Тип градиента</label>
      <Select
        v-model="gradientStore.type"
        :options="typeOptions"
        @change="handleTypeChange"
      />
    </div>

    <div v-if="gradientStore.type === 'linear' || gradientStore.type === 'conic'" class="gradient-controls__group">
      <label class="gradient-controls__label">
        Угол: {{ gradientStore.angle }}°
      </label>
      <input
        v-model.number="gradientStore.angle"
        type="range"
        min="0"
        max="360"
        class="gradient-controls__range"
      />
    </div>

    <div class="gradient-controls__group">
      <label class="gradient-controls__label">Цвета</label>
      <div class="gradient-controls__colors">
        <div
          v-for="color in gradientStore.colors"
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
            v-if="gradientStore.colors.length > 2"
            variant="danger"
            size="sm"
            @click="gradientStore.removeColor(color.id)"
          >
            ✕
          </Button>
        </div>
      </div>
      <Button variant="outline" size="sm" @click="gradientStore.addColor">
        + Добавить цвет
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGradientStore } from '@/features'
import { Button, Input, Select, type SelectOption } from '@/shared/ui'

const gradientStore = useGradientStore()

const typeOptions: SelectOption[] = [
  { label: 'Линейный', value: 'linear' },
  { label: 'Радиальный', value: 'radial' },
  { label: 'Конический', value: 'conic' }
]

function handleTypeChange(value: string | number) {
  gradientStore.setType(value as 'linear' | 'radial' | 'conic')
}

function handleColorChange(id: string, color: string) {
  gradientStore.updateColor(id, color)
}

function handlePositionChange(id: string, position: number) {
  gradientStore.updateColorPosition(id, position)
}
</script>

<style lang="scss" scoped>
.gradient-controls {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
  padding: $space-lg;
  background: $color-bg-secondary;
  border-radius: $border-radius-xl;
}

.gradient-controls__group {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}

.gradient-controls__label {
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.gradient-controls__range {
  width: 100%;
  height: 8px;
  border-radius: $border-radius-full;
  background: $color-bg-tertiary;
  outline: none;
  appearance: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: $color-primary;
    cursor: pointer;
    transition: all $transition-base;

    &:hover {
      transform: scale(1.2);
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: $color-primary;
    cursor: pointer;
    border: none;
    transition: all $transition-base;

    &:hover {
      transform: scale(1.2);
    }
  }
}

.gradient-controls__colors {
  display: flex;
  flex-direction: column;
  gap: $space-sm;
}

.gradient-controls__color-item {
  display: grid;
  grid-template-columns: 50px 1fr 80px 30px auto;
  gap: $space-sm;
  align-items: center;
}

.gradient-controls__color-picker {
  width: 50px;
  height: 40px;
  border: 2px solid $color-border;
  border-radius: $border-radius-md;
  cursor: pointer;
  background: none;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: calc($border-radius-md - 2px);
  }
}

.gradient-controls__color-input {
  font-family: $font-family-mono;
  font-size: $font-size-sm;
}

.gradient-controls__position-input {
  width: 80px;
  padding: $space-sm;
  border: 1px solid $color-border;
  border-radius: $border-radius-md;
  font-size: $font-size-sm;
  text-align: center;

  &:focus {
    outline: none;
    border-color: $color-primary;
  }
}

.gradient-controls__position-label {
  font-size: $font-size-sm;
  color: $color-text-secondary;
}
</style>
