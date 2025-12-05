<template>
  <div class="grid-preview">
    <div
      ref="containerRef"
      :style="gridContainerStyle"
      class="grid-preview__container"
      @pointerup="handlePointerUp"
      @pointerleave="handlePointerUp"
    >
      <div
        v-for="item in items"
        :key="item.id"
        :style="getItemStyle(item)"
        :class="['grid-preview__item', { 'grid-preview__item_dragging': draggingId === item.id }]"
        draggable="false"
        @pointerdown="(e) => handlePointerDown(e, item)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { GridItem } from '@/shared/types/grid'

interface Props {
  gridStyle: Record<string, string>
  items: GridItem[]
  columns: number
  rows: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'move-item', payload: { id: string; columnStart: number; columnEnd: number; rowStart: number; rowEnd: number }): void
}>()
const containerRef = ref<HTMLElement | null>(null)
const draggingId = ref<string | null>(null)
const dragSpans = ref<{ cols: number; rows: number }>({ cols: 1, rows: 1 })
const lastMove = ref<string | null>(null)
const activePointer = ref<number | null>(null)

function getItemStyle(item: GridItem) {
  return {
    gridColumn: `${item.columnStart} / ${item.columnEnd}`,
    gridRow: `${item.rowStart} / ${item.rowEnd}`,
    backgroundColor: item.backgroundColor,
    cursor: draggingId.value === item.id ? 'grabbing' : 'grab'
  }
}

const gridContainerStyle = computed(() => props.gridStyle)

function parseTrackSizes(template: string): number[] {
  return template
    .split(' ')
    .map(part => Number.parseFloat(part))
    .filter(size => Number.isFinite(size))
}

function findTrackIndex(sizes: number[], position: number, gap: number): number {
  let acc = 0
  for (let i = 0; i < sizes.length; i++) {
    const start = acc
    const end = acc + sizes[i]
    if (position >= start && position <= end) {
      return i
    }
    acc += sizes[i] + gap
  }
  return sizes.length - 1
}

function handlePointerDown(event: PointerEvent, item: GridItem) {
  event.preventDefault()
  activePointer.value = event.pointerId
  draggingId.value = item.id
  dragSpans.value = {
    cols: Math.max(1, item.columnEnd - item.columnStart),
    rows: Math.max(1, item.rowEnd - item.rowStart)
  }
  containerRef.value?.setPointerCapture?.(event.pointerId)
}

function handlePointerUp() {
  if (activePointer.value !== null) {
    containerRef.value?.releasePointerCapture?.(activePointer.value)
  }
  draggingId.value = null
  lastMove.value = null
  activePointer.value = null
}

function handlePointerMoveGlobal(event: PointerEvent) {
  if (!draggingId.value || activePointer.value !== event.pointerId) return
  const item = props.items.find(i => i.id === draggingId.value)
  if (!item) return
  const container = containerRef.value
  if (!container) return

  const rect = container.getBoundingClientRect()
  const x = Math.min(Math.max(0, event.clientX - rect.left), rect.width)
  const y = Math.min(Math.max(0, event.clientY - rect.top), rect.height)

  const style = getComputedStyle(container)
  const colTemplate = style.gridTemplateColumns
  const rowTemplate = style.gridTemplateRows
  const colGap = Number.parseFloat(style.columnGap || '0') || 0
  const rowGap = Number.parseFloat(style.rowGap || '0') || 0

  const colSizes = parseTrackSizes(colTemplate)
  const rowSizes = parseTrackSizes(rowTemplate)
  if (!colSizes.length || !rowSizes.length) return

  const colIdx = findTrackIndex(colSizes, x, colGap)
  const rowIdx = findTrackIndex(rowSizes, y, rowGap)

  const spanCols = dragSpans.value.cols
  const spanRows = dragSpans.value.rows
  const startCol = Math.max(1, Math.min(props.columns - spanCols + 1, colIdx + 1))
  const startRow = Math.max(1, Math.min(props.rows - spanRows + 1, rowIdx + 1))
  const payload = {
    id: item.id,
    columnStart: startCol,
    columnEnd: startCol + spanCols,
    rowStart: startRow,
    rowEnd: startRow + spanRows
  }

  const hash = `${payload.id}-${payload.columnStart}-${payload.rowStart}`
  if (lastMove.value === hash) return
  lastMove.value = hash
  emit('move-item', payload)
}

onMounted(() => {
  window.addEventListener('pointerup', handlePointerUp)
  window.addEventListener('pointermove', handlePointerMoveGlobal)
})

onUnmounted(() => {
  window.removeEventListener('pointerup', handlePointerUp)
  window.removeEventListener('pointermove', handlePointerMoveGlobal)
})
</script>

<style lang="scss" scoped src="./grid-preview.scss"></style>
