<template>
  <div class="grid-preview">
    <div :style="gridContainerStyle" class="grid-preview__container">
      <div
        v-for="item in items"
        :key="item.id"
        :style="getItemStyle(item)"
        class="grid-preview__item"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GridItem } from '@/shared/types/grid'

interface Props {
  gridStyle: Record<string, string>
  items: GridItem[]
}

const props = defineProps<Props>()

function getItemStyle(item: GridItem) {
  return {
    gridColumn: `${item.columnStart} / ${item.columnEnd}`,
    gridRow: `${item.rowStart} / ${item.rowEnd}`,
    backgroundColor: item.backgroundColor
  }
}

const gridContainerStyle = props.gridStyle
</script>

<style lang="scss" scoped src="./grid-preview.scss"></style>
