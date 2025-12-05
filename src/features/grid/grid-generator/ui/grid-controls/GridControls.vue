<template>
  <div class="grid-controls">
    <div class="grid-controls__panel">
      <div class="grid-controls__section grid-controls__section_split">
        <div class="grid-controls__field">
          <label class="grid-controls__label">{{ t('GRID.COLUMNS') }}</label>
          <Input
            :model-value="columns"
            type="number"
            :min="1"
            :max="12"
            @update:model-value="(value) => emit('update:columns', Number(value))"
          />
        </div>
        <div class="grid-controls__field">
          <label class="grid-controls__label">{{ t('GRID.ROWS') }}</label>
          <Input
            :model-value="rows"
            type="number"
            :min="1"
            :max="12"
            @update:model-value="(value) => emit('update:rows', Number(value))"
          />
        </div>
        <div class="grid-controls__field">
          <label class="grid-controls__label">{{ t('GRID.COL_GAP') }} (px)</label>
          <Input
            :model-value="columnGap"
            type="number"
            :min="0"
            :max="120"
            @update:model-value="(value) => emit('update:column-gap', Number(value))"
          />
        </div>
        <div class="grid-controls__field">
          <label class="grid-controls__label">{{ t('GRID.ROW_GAP') }} (px)</label>
          <Input
            :model-value="rowGap"
            type="number"
            :min="0"
            :max="120"
            @update:model-value="(value) => emit('update:row-gap', Number(value))"
          />
        </div>
      </div>

      <div class="grid-controls__section grid-controls__section_split">
        <div class="grid-controls__field">
          <label class="grid-controls__label">{{ t('GRID.COLUMN_TEMPLATE') }}</label>
          <Select
            :model-value="columnTemplate"
            :options="templateOptions"
            @change="(value) => emit('update:column-template', value as string)"
          />
          <div v-if="columnTemplate === 'custom'" class="grid-controls__subfield">
            <Input
              :model-value="customColumns"
              type="text"
              placeholder="1fr 2fr 1fr"
              @update:model-value="(value) => emit('update:custom-columns', value as string)"
            />
          </div>
        </div>

        <div class="grid-controls__field">
          <label class="grid-controls__label">{{ t('GRID.ROW_TEMPLATE') }}</label>
          <Select
            :model-value="rowTemplate"
            :options="templateOptions"
            @change="(value) => emit('update:row-template', value as string)"
          />
          <div v-if="rowTemplate === 'custom'" class="grid-controls__subfield">
            <Input
              :model-value="customRows"
              type="text"
              placeholder="160px auto 1fr"
              @update:model-value="(value) => emit('update:custom-rows', value as string)"
            />
          </div>
        </div>

        <div class="grid-controls__field">
          <label class="grid-controls__label">{{ t('GRID.AUTO_FLOW') }}</label>
          <Select
            :model-value="autoFlow"
            :options="autoFlowOptions"
            @change="(value) => emit('update:auto-flow', value as string)"
          />
        </div>
        <div class="grid-controls__field grid-controls__field_hint">
          <p class="grid-controls__hint">{{ t('GRID.DRAG_HINT') }}</p>
        </div>
      </div>

      <div class="grid-controls__section grid-controls__section_split">
        <div class="grid-controls__field">
          <label class="grid-controls__label">{{ t('GRID.JUSTIFY_ITEMS') }}</label>
          <Select
            :model-value="justifyItems"
            :options="alignOptions"
            @change="(value) => emit('update:justify-items', value as string)"
          />
        </div>
        <div class="grid-controls__field">
          <label class="grid-controls__label">{{ t('GRID.ALIGN_ITEMS') }}</label>
          <Select
            :model-value="alignItems"
            :options="alignOptions"
            @change="(value) => emit('update:align-items', value as string)"
          />
        </div>
        <div class="grid-controls__field">
          <label class="grid-controls__label">{{ t('GRID.JUSTIFY_CONTENT') }}</label>
          <Select
            :model-value="justifyContent"
            :options="contentAlignOptions"
            @change="(value) => emit('update:justify-content', value as string)"
          />
        </div>
        <div class="grid-controls__field">
          <label class="grid-controls__label">{{ t('GRID.ALIGN_CONTENT') }}</label>
          <Select
            :model-value="alignContent"
            :options="contentAlignOptions"
            @change="(value) => emit('update:align-content', value as string)"
          />
        </div>
      </div>
    </div>

    <div class="grid-controls__panel">
      <div class="grid-controls__header">
        <div>
          <p class="grid-controls__eyebrow">{{ t('GRID.ITEMS_TAG') }}</p>
          <h3 class="grid-controls__title">{{ t('GRID.GRID_ITEMS') }}</h3>
        </div>
        <div class="grid-controls__actions">
          <Button size="sm" variant="outline" @click="emit('add-item')">
            + {{ t('GRID.ADD_ITEM') }}
          </Button>
        </div>
      </div>
      <div class="grid-controls__items">
        <div
          v-for="(item, index) in items"
          :key="item.id"
          class="grid-controls__item-card"
        >
          <div class="grid-controls__item-header">
            <div class="grid-controls__item-meta">
              <span class="grid-controls__item-name">{{ t('GRID.ITEM') }} {{ index + 1 }}</span>
              <span class="grid-controls__pill">#{{ item.id }}</span>
            </div>
            <div class="grid-controls__item-actions">
              <Button
                size="sm"
                variant="ghost"
                @click="emit('update-item-property', item.id, 'backgroundColor', randomColor())"
              >
                {{ t('GRID.RANDOMIZE') }}
              </Button>
              <Button
                size="sm"
                variant="danger"
                @click="emit('remove-item', item.id)"
              >
                x
              </Button>
            </div>
          </div>

          <div class="grid-controls__item-fields">
            <div class="grid-controls__item-row">
              <label>{{ t('GRID.LABEL') }}</label>
              <Input
                :model-value="item.label"
                type="text"
                placeholder="Item"
                @update:model-value="(value) => emit('update-item-property', item.id, 'label', value as string)"
              />
            </div>
            <div class="grid-controls__item-row grid-controls__item-row_inline">
              <div class="grid-controls__mini-field">
                <label>{{ t('GRID.COLUMN_START') }}</label>
                <Input
                  :model-value="item.columnStart"
                  type="number"
                  :min="1"
                  :max="columns"
                  @update:model-value="(value) => emit('update-item-property', item.id, 'columnStart', Number(value))"
                />
              </div>
              <div class="grid-controls__mini-field">
                <label>{{ t('GRID.COLUMN_END') }}</label>
                <Input
                  :model-value="item.columnEnd"
                  type="number"
                  :min="1"
                  :max="columns + 1"
                  @update:model-value="(value) => emit('update-item-property', item.id, 'columnEnd', Number(value))"
                />
              </div>
              <div class="grid-controls__mini-field">
                <label>{{ t('GRID.ROW_START') }}</label>
                <Input
                  :model-value="item.rowStart"
                  type="number"
                  :min="1"
                  :max="rows"
                  @update:model-value="(value) => emit('update-item-property', item.id, 'rowStart', Number(value))"
                />
              </div>
              <div class="grid-controls__mini-field">
                <label>{{ t('GRID.ROW_END') }}</label>
                <Input
                  :model-value="item.rowEnd"
                  type="number"
                  :min="1"
                  :max="rows + 1"
                  @update:model-value="(value) => emit('update-item-property', item.id, 'rowEnd', Number(value))"
                />
              </div>
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
  columnGap: number
  rowGap: number
  columnTemplate: string
  rowTemplate: string
  customColumns: string
  customRows: string
  autoFlow: string
  justifyItems: string
  alignItems: string
  justifyContent: string
  alignContent: string
  items: GridItem[]
}

interface Emits {
  (e: 'update:columns', value: number): void
  (e: 'update:rows', value: number): void
  (e: 'update:column-gap', value: number): void
  (e: 'update:row-gap', value: number): void
  (e: 'update:column-template', value: string): void
  (e: 'update:row-template', value: string): void
  (e: 'update:custom-columns', value: string): void
  (e: 'update:custom-rows', value: string): void
  (e: 'update:auto-flow', value: string): void
  (e: 'update:justify-items', value: string): void
  (e: 'update:align-items', value: string): void
  (e: 'update:justify-content', value: string): void
  (e: 'update:align-content', value: string): void
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

const autoFlowOptions = computed<SelectOption[]>(() => [
  { label: t('GRID.AUTO_FLOW_ROW'), value: 'row' },
  { label: t('GRID.AUTO_FLOW_COLUMN'), value: 'column' },
  { label: t('GRID.AUTO_FLOW_DENSE'), value: 'row dense' }
])

const alignOptions = computed<SelectOption[]>(() => [
  { label: t('GRID.ALIGN_START'), value: 'start' },
  { label: t('GRID.ALIGN_CENTER'), value: 'center' },
  { label: t('GRID.ALIGN_END'), value: 'end' },
  { label: t('GRID.ALIGN_STRETCH'), value: 'stretch' }
])

const contentAlignOptions = computed<SelectOption[]>(() => [
  { label: t('GRID.ALIGN_START'), value: 'start' },
  { label: t('GRID.ALIGN_CENTER'), value: 'center' },
  { label: t('GRID.ALIGN_END'), value: 'end' },
  { label: t('GRID.ALIGN_STRETCH'), value: 'stretch' },
  { label: t('GRID.ALIGN_SPACE_BETWEEN'), value: 'space-between' },
  { label: t('GRID.ALIGN_SPACE_AROUND'), value: 'space-around' },
  { label: t('GRID.ALIGN_SPACE_EVENLY'), value: 'space-evenly' }
])

function randomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
}
</script>

<style lang="scss" scoped src="./grid-controls.scss"></style>
