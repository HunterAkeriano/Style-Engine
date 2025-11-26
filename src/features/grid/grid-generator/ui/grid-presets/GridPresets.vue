<template>
  <section class="grid-presets">
    <div class="grid-presets__header">
      <div>
        <p class="grid-presets__tag">{{ t('GRID.PRESETS_TAG') }}</p>
        <h2 class="grid-presets__title">{{ t('GRID.PRESETS_TITLE') }}</h2>
        <p class="grid-presets__subtitle">{{ t('GRID.PRESETS_SUBTITLE') }}</p>
      </div>
    </div>

    <div class="grid-presets__grid">
      <article
        v-for="preset in presets"
        :key="preset.id"
        class="grid-presets__card"
        @click="emit('apply', preset)"
      >
        <div class="grid-presets__preview" :style="getPreviewContainerStyle(preset)">
          <div
            v-for="(item, index) in preset.items"
            :key="index"
            :style="getPreviewItemStyle(preset, item)"
            class="grid-presets__preview-item"
          />
        </div>

        <div class="grid-presets__card-bottom">
          <h3 class="grid-presets__card-title">{{ preset.name }}</h3>
          <span class="grid-presets__badge">
            {{ preset.columns }}×{{ preset.rows }}
          </span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { resolveGridTemplate, type GridPreset } from '@/processes/grid/grid-generation/grid-presets'
import type { GridItem } from '@/shared/types/grid'

interface Props {
  presets: GridPreset[]
}

interface Emits {
  (e: 'apply', preset: GridPreset): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

function getPreviewContainerStyle(preset: GridPreset) {
  return {
    display: 'grid',
    gridTemplateColumns: resolveGridTemplate(preset.columnTemplate, preset.columns, preset.customColumns),
    gridTemplateRows: resolveGridTemplate(preset.rowTemplate, preset.rows, preset.customRows),
    gap: `${preset.gap}px`
  }
}

function getPreviewItemStyle(_preset: GridPreset, item: Omit<GridItem, 'id'>) {
  return {
    gridColumn: `${item.columnStart} / ${item.columnEnd}`,
    gridRow: `${item.rowStart} / ${item.rowEnd}`,
    backgroundColor: item.backgroundColor
  }
}
</script>

<style lang="scss" scoped src="./grid-presets.scss"></style>
