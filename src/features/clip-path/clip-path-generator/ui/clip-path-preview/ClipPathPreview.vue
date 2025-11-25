<template>
  <div class="clip-path-preview">
    <div class="clip-path-preview__container" ref="containerRef">
      <div
        v-for="(layer, index) in visibleLayers"
        :key="layer.id"
        :style="getLayerStyle(layer, index, visibleLayers.length)"
        class="clip-path-preview__layer"
      ></div>

      <!-- Draggable points for polygon layers -->
      <template v-for="layer in visiblePolygonLayers" :key="layer.id">
        <div
          v-for="point in layer.points"
          :key="point.id"
          class="clip-path-preview__point"
          :style="{
            left: `${point.x}%`,
            top: `${point.y}%`
          }"
          @mousedown="startDrag($event, layer.id, point.id)"
          @touchstart="startDrag($event, layer.id, point.id)"
        >
          <div class="clip-path-preview__point-dot"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { formatClipPath } from '@/shared/lib'
import type { ClipPathLayer } from '@/shared/types'

interface Props {
  layers: ClipPathLayer[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-point': [layerId: string, pointId: string, x: number, y: number]
}>()

const containerRef = ref<HTMLElement | null>(null)
const draggingPoint = ref<{ layerId: string; pointId: string } | null>(null)
let rafId: number | null = null

const layerColors = ['linear-gradient(135deg, #667eea 0%, #764ba2 100%)', '#ef4444', '#22c55e']

const visibleLayers = computed(() => props.layers.filter(layer => layer.visible))
const visiblePolygonLayers = computed(() => {
  return props.layers.filter(layer => layer.visible && layer.type === 'polygon' && layer.points)
})

function getLayerStyle(layer: ClipPathLayer, index: number, total: number) {
  const clipPathValue = formatClipPath([layer], 'inline')
  return {
    background: layerColors[index] ?? layerColors[layerColors.length - 1],
    clipPath: clipPathValue.replace('clip-path:', '').replace(';', '').trim(),
    zIndex: total - index
  }
}

function startDrag(event: MouseEvent | TouchEvent, layerId: string, pointId: string) {
  event.preventDefault()
  draggingPoint.value = { layerId, pointId }

  const moveHandler = (e: MouseEvent | TouchEvent) => {
    if (!draggingPoint.value || !containerRef.value) return

    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }

    rafId = requestAnimationFrame(() => {
      if (!draggingPoint.value || !containerRef.value) return

      const rect = containerRef.value.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY

      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
      const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100))

      emit('update-point', draggingPoint.value.layerId, draggingPoint.value.pointId, x, y)
      rafId = null
    })
  }

  const stopDrag = () => {
    draggingPoint.value = null
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    document.removeEventListener('mousemove', moveHandler)
    document.removeEventListener('mouseup', stopDrag)
    document.removeEventListener('touchmove', moveHandler)
    document.removeEventListener('touchend', stopDrag)
  }

  document.addEventListener('mousemove', moveHandler)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', moveHandler)
  document.addEventListener('touchend', stopDrag)
}
</script>

<style
  lang="scss"
  scoped
  src="@/features/clip-path/clip-path-generator/ui/clip-path-preview/clip-path-preview.scss"
></style>
