<template>
  <div ref="processRef" class="grid-generation-process">
    <div ref="controlsRef" class="grid-generation-process__controls">
      <GridControls
        :columns="columns"
        :rows="rows"
        :gap="gap"
        :column-template="columnTemplate"
        :row-template="rowTemplate"
        :custom-columns="customColumns"
        :custom-rows="customRows"
        :items="gridItems"
        @update:columns="columns = $event"
        @update:rows="rows = $event"
        @update:gap="gap = $event"
        @update:column-template="columnTemplate = $event"
        @update:row-template="rowTemplate = $event"
        @update:custom-columns="customColumns = $event"
        @update:custom-rows="customRows = $event"
        @add-item="addGridItem"
        @remove-item="removeGridItem"
        @update-item-property="updateItemProperty"
      />
    </div>

    <div
      :style="gridPreviewWrapperStyle"
      ref="gridPreviewWrapperRef"
      class="grid-generation-process__preview"
    >
      <div
        ref="gridPreviewRef"
        :class="{ 'grid-generation-process__preview-inner_floating': isGridPreviewFloating }"
        :style="gridFloatingStyle"
        class="grid-generation-process__preview-inner"
      >
        <GridPreview :grid-style="gridContainerStyle" :items="gridItems" />
      </div>
    </div>

    <div class="grid-generation-process__code">
      <CodeExport
        :title="t('GRID.HTML_EXPORT')"
        :get-code="getHTMLCode"
        :allow-export="isExportAllowed"
        :copy-label="t('GRID.COPY')"
        :copied-label="t('GRID.COPIED')"
        :format-options="htmlFormatOptions"
        :extension-map="htmlExtensionMap"
        :show-save-button="false"
        @blocked-export="showExportProModal = true"
      />

      <CodeExport
        :title="t('GRID.CSS_EXPORT')"
        :get-code="getCSSCode"
        :allow-export="isExportAllowed"
        :copy-label="t('GRID.COPY')"
        :copied-label="t('GRID.COPIED')"
        :format-options="cssFormatOptions"
        :extension-map="cssExtensionMap"
        @blocked-export="showExportProModal = true"
      />
    </div>

    <div class="grid-generation-process__presets">
      <GridPresets :presets="GRID_PRESETS" @apply="applyPreset" />
    </div>

    <Modal
      :title="t('COMMON.PRO_EXPORT_TITLE')"
      :subtitle="t('COMMON.PRO_EXPORT_MESSAGE')"
      :visible="showExportProModal"
      show-actions
      :confirm-text="t('COMMON.PRO_EXPORT_ACTION')"
      :cancel-text="t('COMMON.CANCEL')"
      @confirm="handleExportUpgrade"
      @close="showExportProModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/entities'
import { useFloatingPreview } from '@/shared/composables'
import { Modal } from '@/shared/ui'
import CodeExport from '@/shared/ui/code-export/CodeExport.vue'
import { SubscriptionTier } from '@/shared/config/pricing'
import { resolveSubscriptionTier } from '@/shared/lib/save-quota'
import { GridControls, GridPreview, GridPresets } from '@/features/grid'
import type { GridItem } from '@/shared/types/grid'
import type { SelectOption } from '@/shared/ui'
import { GRID_PRESETS, resolveGridTemplate, type GridPreset } from './grid-presets'

const { t, locale } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const columns = ref(3)
const rows = ref(3)
const gap = ref(16)
const columnTemplate = ref('equal')
const rowTemplate = ref('equal')
const customColumns = ref('1fr 1fr 1fr')
const customRows = ref('1fr 1fr 1fr')

const gridItems = ref<GridItem[]>([
  {
    id: '1',
    label: 'Item 1',
    columnStart: 1,
    columnEnd: 2,
    rowStart: 1,
    rowEnd: 2,
    backgroundColor: '#667eea'
  },
  {
    id: '2',
    label: 'Item 2',
    columnStart: 2,
    columnEnd: 4,
    rowStart: 1,
    rowEnd: 3,
    backgroundColor: '#764ba2'
  }
])

let itemIdCounter = gridItems.value.length

const processRef = ref<HTMLElement | null>(null)
const controlsRef = ref<HTMLElement | null>(null)

const {
  previewRef: gridPreviewRef,
  wrapperRef: gridPreviewWrapperRef,
  floatingStyle: gridFloatingStyle,
  wrapperStyle: gridPreviewWrapperStyle,
  isFloating: isGridPreviewFloating
} = useFloatingPreview({
  containerRef: controlsRef,
  boundingRef: processRef,
  topOffset: 88,
  breakpoint: 1024
})

const showExportProModal = ref(false)

const htmlFormatOptions: SelectOption[] = [
  { label: 'HTML', value: 'html' }
]

const htmlExtensionMap: Record<string, string> = {
  html: 'html'
}

const cssFormatOptions: SelectOption[] = [
  { label: 'CSS', value: 'css' },
  { label: 'SCSS', value: 'scss' },
  { label: 'Sass', value: 'sass' },
  { label: 'Stylus', value: 'stylus' },
  { label: 'Inline', value: 'inline' }
]

const cssExtensionMap: Record<string, string> = {
  css: 'css',
  scss: 'scss',
  sass: 'sass',
  stylus: 'styl',
  inline: 'txt'
}

function getUserTier(): SubscriptionTier | undefined {
  return resolveSubscriptionTier(
    authStore.user?.subscriptionTier ?? (authStore.userPlan as string | undefined)
  )
}

const isExportAllowed = computed(() => {
  const tier = getUserTier()
  return Boolean(tier && tier !== SubscriptionTier.FREE)
})

const gridContainerStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: resolveGridTemplate(columnTemplate.value, columns.value, customColumns.value),
  gridTemplateRows: resolveGridTemplate(rowTemplate.value, rows.value, customRows.value),
  gap: `${gap.value}px`
}))

function findFreeCell(): { column: number; row: number } {
  // Создаем карту занятых ячеек
  const occupiedCells = new Set<string>()

  gridItems.value.forEach(item => {
    for (let row = item.rowStart; row < item.rowEnd; row++) {
      for (let col = item.columnStart; col < item.columnEnd; col++) {
        occupiedCells.add(`${row}-${col}`)
      }
    }
  })

  // Ищем первую свободную ячейку
  for (let row = 1; row <= rows.value; row++) {
    for (let col = 1; col <= columns.value; col++) {
      if (!occupiedCells.has(`${row}-${col}`)) {
        return { column: col, row }
      }
    }
  }

  // Если все ячейки заняты, возвращаем первую ячейку
  return { column: 1, row: 1 }
}

function addGridItem() {
  itemIdCounter += 1
  const freeCell = findFreeCell()

  gridItems.value.push({
    id: `${itemIdCounter}`,
    label: `Item ${itemIdCounter}`,
    columnStart: freeCell.column,
    columnEnd: freeCell.column + 1,
    rowStart: freeCell.row,
    rowEnd: freeCell.row + 1,
    backgroundColor: '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
  })
}

function removeGridItem(id: string) {
  gridItems.value = gridItems.value.filter(item => item.id !== id)
}

function updateItemProperty(id: string, property: string, value: any) {
  const item = gridItems.value.find(i => i.id === id)
  if (item) {
    ;(item as any)[property] = value
  }
}

function getHTMLCode(): string {
  return generateHTML()
}

function getCSSCode(format: string | number): string {
  return generateCSS(String(format))
}

function generateCSS(format: string): string {
  const style = gridContainerStyle.value

  if (format === 'inline') {
    return generateInlineCSS()
  }

  // Format-specific settings
  const indent = '  '
  const useBraces = format !== 'sass' && format !== 'stylus'
  const useColon = format !== 'stylus'
  const useSemicolon = format !== 'sass' && format !== 'stylus'

  let css = ''

  // Grid container
  css += `.grid-container${useBraces ? ' {' : ''}\n`
  css += `${indent}display${useColon ? ':' : ''} grid${useSemicolon ? ';' : ''}\n`
  css += `${indent}grid-template-columns${useColon ? ':' : ''} ${style.gridTemplateColumns}${useSemicolon ? ';' : ''}\n`
  css += `${indent}grid-template-rows${useColon ? ':' : ''} ${style.gridTemplateRows}${useSemicolon ? ';' : ''}\n`
  css += `${indent}gap${useColon ? ':' : ''} ${gap.value}px${useSemicolon ? ';' : ''}\n`
  if (useBraces) css += '}\n\n'
  else css += '\n'

  // Grid items
  gridItems.value.forEach((item, index) => {
    css += `.grid-item-${index + 1}${useBraces ? ' {' : ''}\n`
    css += `${indent}grid-column${useColon ? ':' : ''} ${item.columnStart} / ${item.columnEnd}${useSemicolon ? ';' : ''}\n`
    css += `${indent}grid-row${useColon ? ':' : ''} ${item.rowStart} / ${item.rowEnd}${useSemicolon ? ';' : ''}\n`
    css += `${indent}background-color${useColon ? ':' : ''} ${item.backgroundColor}${useSemicolon ? ';' : ''}\n`
    if (useBraces) css += '}\n\n'
    else css += '\n'
  })

  return css.trim()
}

function generateInlineCSS(): string {
  const style = gridContainerStyle.value
  return `display: grid; grid-template-columns: ${style.gridTemplateColumns}; grid-template-rows: ${style.gridTemplateRows}; gap: ${gap.value}px;`
}

function generateHTML(): string {
  let html = '<div class="grid-container">\n'

  gridItems.value.forEach((item, index) => {
    html += `  <div class="grid-item-${index + 1}">${item.label}</div>\n`
  })

  html += '</div>'
  return html
}

function applyPreset(preset: GridPreset) {
  columns.value = preset.columns
  rows.value = preset.rows
  gap.value = preset.gap
  columnTemplate.value = preset.columnTemplate
  rowTemplate.value = preset.rowTemplate
  customColumns.value = preset.customColumns
  customRows.value = preset.customRows

  // Recreate items with proper IDs
  gridItems.value = preset.items.map((item, index) => ({
    id: `${index + 1}`,
    label: item.label,
    columnStart: item.columnStart,
    columnEnd: item.columnEnd,
    rowStart: item.rowStart,
    rowEnd: item.rowEnd,
    backgroundColor: item.backgroundColor
  }))

  itemIdCounter = gridItems.value.length
}

function handleExportUpgrade() {
  showExportProModal.value = false
  router.push({
    path: `/${locale.value}/about`,
    query: { plan: 'premium' }
  })
}
</script>

<style lang="scss" scoped src="./grid-generation-process.scss"></style>
