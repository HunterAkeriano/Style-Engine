<template>
  <div class="grid-controls">
    <div class="grid-controls__group">
      <label class="grid-controls__label">{{ t('GRID.COLUMNS') }}</label>
      <Input
        :model-value="columns"
        type="number"
        :min="1"
        :max="12"
        @update:model-value="(value) => emit('update:columns', Number(value))"
      />
    </div>

    <div class="grid-controls__group">
      <label class="grid-controls__label">{{ t('GRID.ROWS') }}</label>
      <Input
        :model-value="rows"
        type="number"
        :min="1"
        :max="12"
        @update:model-value="(value) => emit('update:rows', Number(value))"
      />
    </div>

    <div class="grid-controls__group">
      <label class="grid-controls__label">{{ t('GRID.GAP') }} (px)</label>
      <Input
        :model-value="gap"
        type="number"
        :min="0"
        :max="100"
        @update:model-value="(value) => emit('update:gap', Number(value))"
      />
    </div>

    <div class="grid-controls__group">
      <label class="grid-controls__label">{{ t('GRID.COLUMN_TEMPLATE') }}</label>
      <Select
        :model-value="columnTemplate"
        :options="templateOptions"
        @change="(value) => emit('update:column-template', value as string)"
      />
    </div>

    <div v-if="columnTemplate === 'custom'" class="grid-controls__group">
      <label class="grid-controls__label">{{ t('GRID.CUSTOM_COLUMNS') }}</label>
      <Input
        :model-value="customColumns"
        type="text"
        placeholder="1fr 2fr 1fr"
        @update:model-value="(value) => emit('update:custom-columns', value as string)"
      />
    </div>

    <div class="grid-controls__group">
      <label class="grid-controls__label">{{ t('GRID.ROW_TEMPLATE') }}</label>
      <Select
        :model-value="rowTemplate"
        :options="templateOptions"
        @change="(value) => emit('update:row-template', value as string)"
      />
    </div>

    <div v-if="rowTemplate === 'custom'" class="grid-controls__group">
      <label class="grid-controls__label">{{ t('GRID.CUSTOM_ROWS') }}</label>
      <Input
        :model-value="customRows"
        type="text"
        placeholder="100px auto 100px"
        @update:model-value="(value) => emit('update:custom-rows', value as string)"
      />
    </div>

    <div class="grid-controls__group">
      <label class="grid-controls__label">{{ t('GRID.GRID_ITEMS') }}</label>
      <div class="grid-controls__items">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="grid-controls__item-card"
        >
          <div class="grid-controls__item-header">
            <span>{{ t('GRID.ITEM') }} {{ index + 1 }}</span>
            <Button
              size="sm"
              variant="danger"
              @click="emit('remove-item', item.id)"
            >
              ✕
            </Button>
          </div>

          <div class="grid-controls__item-fields">
            <div class="grid-controls__item-row">
              <label>{{ t('GRID.COLUMN_START') }}</label>
              <Input
                :model-value="item.columnStart"
                type="number"
                :min="1"
                :max="columns"
                @update:model-value="(value) => emit('update-item-property', item.id, 'columnStart', Number(value))"
              />
            </div>

            <div class="grid-controls__item-row">
              <label>{{ t('GRID.COLUMN_END') }}</label>
              <Input
                :model-value="item.columnEnd"
                type="number"
                :min="1"
                :max="columns + 1"
                @update:model-value="(value) => emit('update-item-property', item.id, 'columnEnd', Number(value))"
              />
            </div>

            <div class="grid-controls__item-row">
              <label>{{ t('GRID.ROW_START') }}</label>
              <Input
                :model-value="item.rowStart"
                type="number"
                :min="1"
                :max="rows"
                @update:model-value="(value) => emit('update-item-property', item.id, 'rowStart', Number(value))"
              />
            </div>

            <div class="grid-controls__item-row">
              <label>{{ t('GRID.ROW_END') }}</label>
              <Input
                :model-value="item.rowEnd"
                type="number"
                :min="1"
                :max="rows + 1"
                @update:model-value="(value) => emit('update-item-property', item.id, 'rowEnd', Number(value))"
              />
            </div>

            <div class="grid-controls__item-row grid-controls__item-row_color">
              <label>{{ t('GRID.BACKGROUND_COLOR') }}</label>
              <div class="grid-controls__color-group">
                <input
                  :value="item.backgroundColor"
                  type="color"
                  class="grid-controls__color-picker"
                  @input="(e) => emit('update-item-property', item.id, 'backgroundColor', (e.target as HTMLInputElement).value)"
                />
                <Input
                  :model-value="item.backgroundColor"
                  type="text"
                  placeholder="#000000"
                  @update:model-value="(value) => emit('update-item-property', item.id, 'backgroundColor', value as string)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button size="sm" variant="outline" @click="emit('add-item')">
        + {{ t('GRID.ADD_ITEM') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { GridItem } from '@/shared/types/grid'
import { Button, Input, Select, type SelectOption } from '@/shared/ui'

interface Props {
  columns: number
  rows: number
  gap: number
  columnTemplate: string
  rowTemplate: string
  customColumns: string
  customRows: string
  items: GridItem[]
}

interface Emits {
  (e: 'update:columns', value: number): void
  (e: 'update:rows', value: number): void
  (e: 'update:gap', value: number): void
  (e: 'update:column-template', value: string): void
  (e: 'update:row-template', value: string): void
  (e: 'update:custom-columns', value: string): void
  (e: 'update:custom-rows', value: string): void
  (e: 'add-item'): void
  (e: 'remove-item', id: string): void
  (e: 'update-item-property', id: string, property: keyof GridItem, value: GridItem[keyof GridItem]): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

const templateOptions = computed<SelectOption[]>(() => [
  { label: t('GRID.EQUAL'), value: 'equal' },
  { label: t('GRID.AUTO'), value: 'auto' },
  { label: t('GRID.CUSTOM'), value: 'custom' }
])
</script>

<style lang="scss" scoped src="./grid-controls.scss"></style>
