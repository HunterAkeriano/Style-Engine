<template>
  <div class="clip-path-controls">
    <div class="clip-path-controls__header">
      <h3 class="clip-path-controls__title">{{ t('CLIP_PATH.LAYERS') }}</h3>
      <Button
        v-if="layers.length < 3"
        size="sm"
        variant="primary"
        @click="emit('add-layer')"
      >
        + {{ t('CLIP_PATH.ADD_LAYER') }}
      </Button>
    </div>

    <div class="clip-path-controls__upload">
      <input
        ref="fileInputRef"
        type="file"
        accept=".svg"
        @change="handleFileUpload"
        class="clip-path-controls__upload-input"
      />
      <Button variant="outline" size="sm" @click="triggerFileUpload">
        {{ t('CLIP_PATH.UPLOAD_SVG') }}
      </Button>
    </div>

    <div class="clip-path-controls__layers">
      <div
        v-for="layer in layers"
        :key="layer.id"
        class="clip-path-controls__layer"
      >
        <div class="clip-path-controls__layer-header">
          <div class="clip-path-controls__layer-info">
            <label class="clip-path-controls__checkbox">
              <input
                type="checkbox"
                :checked="layer.visible"
                @change="emit('toggle-layer', layer.id)"
              />
              <span>{{ t(`CLIP_PATH.TYPE_${layer.type.toUpperCase()}`) }}</span>
            </label>
          </div>
          <Button
            v-if="layers.length > 1"
            size="sm"
            variant="danger"
            @click="emit('remove-layer', layer.id)"
          >
            {{ t('COMMON.DELETE') }}
          </Button>
        </div>

        <div v-if="layer.visible" class="clip-path-controls__layer-body">
          <Select
            :model-value="layer.type"
            :options="typeOptions"
            @update:model-value="(value) => handleLayerTypeChange(layer.id, value)"
          />

          <template v-if="layer.type === 'polygon' && layer.points">
            <div class="clip-path-controls__points">
              <div
                v-for="(point, index) in layer.points"
                :key="point.id"
                class="clip-path-controls__point"
              >
                <div class="clip-path-controls__point-header">
                  <span class="clip-path-controls__point-label">
                    {{ t('CLIP_PATH.POINT') }} {{ index + 1 }}
                  </span>
                  <Button
                    v-if="layer.points.length > 3"
                    size="sm"
                    variant="ghost"
                    @click="emit('remove-point', layer.id, point.id)"
                    class="clip-path-controls__remove-point"
                  >
                    ×
                  </Button>
                </div>
                <div class="clip-path-controls__point-inputs">
                  <Input
                    type="number"
                    :model-value="point.x"
                    :label="`X (%)`"
                    min="0"
                    max="100"
                    @update:model-value="(value) => emit('update-point', layer.id, point.id, 'x', Number(value))"
                  />
                  <Input
                    type="number"
                    :model-value="point.y"
                    :label="`Y (%)`"
                    min="0"
                    max="100"
                    @update:model-value="(value) => emit('update-point', layer.id, point.id, 'y', Number(value))"
                  />
                </div>
              </div>
              <Button
                v-if="layer.points.length < 10"
                size="sm"
                variant="ghost"
                @click="emit('add-point', layer.id)"
              >
                + {{ t('CLIP_PATH.ADD_POINT') }}
              </Button>
            </div>
          </template>

          <template v-else-if="layer.type === 'circle'">
            <Input
              type="number"
              :model-value="layer.radius ?? 50"
              :label="t('CLIP_PATH.RADIUS')"
              min="0"
              max="100"
              @update:model-value="(value) => emit('update-layer-radius', layer.id, Number(value))"
            />
          </template>

          <template v-else-if="layer.type === 'ellipse'">
            <Input
              type="number"
              :model-value="layer.radiusX ?? 50"
              :label="t('CLIP_PATH.RADIUS_X')"
              min="0"
              max="100"
              @update:model-value="(value) => emit('update-layer-radius-x', layer.id, Number(value))"
            />
            <Input
              type="number"
              :model-value="layer.radiusY ?? 50"
              :label="t('CLIP_PATH.RADIUS_Y')"
              min="0"
              max="100"
              @update:model-value="(value) => emit('update-layer-radius-y', layer.id, Number(value))"
            />
          </template>

          <template v-else-if="layer.type === 'inset' && layer.inset">
            <Input
              type="number"
              :model-value="layer.inset.top"
              :label="t('CLIP_PATH.TOP')"
              min="0"
              max="100"
              @update:model-value="(value) => emit('update-inset', layer.id, 'top', Number(value))"
            />
            <Input
              type="number"
              :model-value="layer.inset.right"
              :label="t('CLIP_PATH.RIGHT')"
              min="0"
              max="100"
              @update:model-value="(value) => emit('update-inset', layer.id, 'right', Number(value))"
            />
            <Input
              type="number"
              :model-value="layer.inset.bottom"
              :label="t('CLIP_PATH.BOTTOM')"
              min="0"
              max="100"
              @update:model-value="(value) => emit('update-inset', layer.id, 'bottom', Number(value))"
            />
            <Input
              type="number"
              :model-value="layer.inset.left"
              :label="t('CLIP_PATH.LEFT')"
              min="0"
              max="100"
              @update:model-value="(value) => emit('update-inset', layer.id, 'left', Number(value))"
            />
            <Input
              type="number"
              :model-value="layer.inset.round ?? 0"
              :label="t('CLIP_PATH.ROUND')"
              min="0"
              max="50"
              @update:model-value="(value) => emit('update-inset', layer.id, 'round', Number(value))"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/shared/lib/toast'
import type { ClipPathLayer, ClipPathType } from '@/shared/types'
import { Button, Input, Select } from '@/shared/ui'
import { parseClipPathFromSVG } from '@/shared/lib/clip-path'

interface Props {
  layers: ClipPathLayer[]
}

defineProps<Props>()

const emit = defineEmits<{
  'add-layer': []
  'remove-layer': [id: string]
  'toggle-layer': [id: string]
  'update-layer-type': [id: string, type: ClipPathType]
  'update-point': [layerId: string, pointId: string, axis: 'x' | 'y', value: number]
  'add-point': [layerId: string]
  'remove-point': [layerId: string, pointId: string]
  'update-layer-radius': [id: string, radius: number]
  'update-layer-radius-x': [id: string, radiusX: number]
  'update-layer-radius-y': [id: string, radiusY: number]
  'update-inset': [id: string, side: 'top' | 'right' | 'bottom' | 'left' | 'round', value: number]
  'load-from-svg': [layers: ClipPathLayer[]]
}>()

const { t } = useI18n()
const toast = useToast()
const fileInputRef = ref<HTMLInputElement | null>(null)

function triggerFileUpload() {
  fileInputRef.value?.click()
}

const isClipPathType = (value: string | number): value is ClipPathType => typeof value === 'string'

const handleLayerTypeChange = (layerId: string, value: string | number) => {
  if (isClipPathType(value)) {
    emit('update-layer-type', layerId, value)
  }
}

const typeOptions = computed(() => [
  { label: t('CLIP_PATH.TYPE_POLYGON'), value: 'polygon' },
  { label: t('CLIP_PATH.TYPE_CIRCLE'), value: 'circle' },
  { label: t('CLIP_PATH.TYPE_ELLIPSE'), value: 'ellipse' },
  { label: t('CLIP_PATH.TYPE_INSET'), value: 'inset' }
])

async function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  if (!file.name.endsWith('.svg')) {
    toast.error(t('CLIP_PATH.INVALID_FILE'))
    return
  }

  try {
    const text = await file.text()
    const layers = parseClipPathFromSVG(text)

    if (layers.length === 0) {
      toast.error(t('CLIP_PATH.NO_CLIP_PATHS_FOUND'))
      return
    }

    emit('load-from-svg', layers)
    toast.success(t('CLIP_PATH.SVG_LOADED'))
  } catch (error) {
    console.error('Error parsing SVG:', error)
    toast.error(t('CLIP_PATH.SVG_PARSE_ERROR'))
  } finally {
    target.value = ''
  }
}
</script>

<style lang="scss" scoped src="./clip-path-controls.scss"></style>
