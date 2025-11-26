<template>
  <div class="moderation-page">
    <Breadcrumbs />
    <div class="moderation-page__header">
      <div>
        <h1 class="moderation-page__title">{{ t('MODERATION.TITLE') }}</h1>
        <p class="moderation-page__subtitle">{{ t('MODERATION.SUBTITLE') }}</p>
      </div>
      <button class="moderation-page__refresh" type="button" @click="fetchPending" :disabled="loading">
        {{ loading ? t('MODERATION.LOADING') : t('MODERATION.REFRESH') }}
      </button>
    </div>

    <div v-if="error" class="moderation-page__error">{{ error }}</div>

    <div v-if="loading && !items.length" class="moderation-page__empty">
      {{ t('MODERATION.LOADING') }}
    </div>

    <div v-else-if="!items.length" class="moderation-page__empty">
      {{ t('MODERATION.EMPTY') }}
    </div>

    <div v-else class="moderation-page__groups">
      <template v-for="group in categoryGroups" :key="group.key">
        <div v-if="group.items.length" class="moderation-page__group">
          <div class="moderation-page__group-head">
            <h2 class="moderation-page__group-title">
              {{ t(`MODERATION.CATEGORY_${group.key.toUpperCase()}`) }}
              <span class="moderation-page__group-count">- {{ group.items.length }}</span>
            </h2>
          </div>
          <div class="moderation-page__list">
            <div
              v-for="item in group.items"
              :key="item.id"
              class="moderation-page__card"
            >
              <div class="moderation-page__card-head">
                <div>
                  <p class="moderation-page__category">{{ t(`MODERATION.CATEGORY_${group.key.toUpperCase()}`) }}</p>
                  <h3 class="moderation-page__name">{{ item.name }}</h3>
                </div>
                <button
                  class="moderation-page__approve"
                  type="button"
                  :disabled="approvingId === item.id"
                  @click="approve(item)"
                >
                  {{ approvingId === item.id ? t('MODERATION.APPROVING') : t('MODERATION.APPROVE') }}
                </button>
              </div>
              <p class="moderation-page__date">
                {{ t('MODERATION.SUBMITTED') }} {{ new Date(item.createdAt).toLocaleString() }}
              </p>
              <div class="moderation-page__preview" v-if="group.key === 'gradient' && gradientStyle(item.payload)">
                <div class="moderation-page__gradient" :style="gradientStyle(item.payload)" />
              </div>
              <div class="moderation-page__preview" v-else-if="group.key === 'shadow' && shadowStyle(item.payload)">
                <div class="moderation-page__shadow">
                  <div class="moderation-page__shadow-box" :style="shadowStyle(item.payload)" />
                </div>
              </div>
              <div class="moderation-page__preview" v-else-if="group.key === 'clip-path' && clipPathStyle(item.payload)">
                <div class="moderation-page__clip-path" :style="clipPathStyle(item.payload)" />
              </div>
              <div class="moderation-page__preview" v-else-if="group.key === 'animation'">
                <pre class="moderation-page__payload moderation-page__payload_compact">{{ animationSnippet(item.payload) }}</pre>
              </div>
              <pre class="moderation-page__payload">{{ formatPayload(item.payload) }}</pre>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  approveSubmission,
  listPendingModeration,
  type SavedItem,
  type SaveCategory
} from '@/shared/api/saves'
import { Breadcrumbs } from '@/widgets/common'

const { t } = useI18n()

const items = ref<SavedItem[]>([])
const loading = ref(false)
const approvingId = ref<string | null>(null)
const error = ref('')

const categoryGroups = computed<{ key: string; items: SavedItem[] }[]>(() => {
  const groups: Record<string, SavedItem[]> = { gradient: [], shadow: [], animation: [], 'clip-path': [] }
  items.value.forEach(item => {
    const key = item.category ?? 'other'
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
  })
  return [
    { key: 'gradient', items: groups.gradient },
    { key: 'shadow', items: groups.shadow },
    { key: 'animation', items: groups.animation },
    { key: 'clip-path', items: groups['clip-path'] }
  ]
})

function formatPayload(value: unknown) {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return ''
  }
}

function gradientStyle(payload: any) {
  if (!payload || typeof payload !== 'object') return null
  const type = payload.type || 'linear'
  const angle = Number(payload.angle) || 90
  const colors = Array.isArray(payload.colors) ? payload.colors : []
  const stops = colors.map((c: any) => `${c.color ?? '#000'} ${c.position ?? 0}%`).join(', ')
  if (!stops) return null
  let background = ''
  switch (type) {
    case 'radial':
      background = `radial-gradient(circle, ${stops})`
      break
    case 'conic':
      background = `conic-gradient(from ${angle}deg, ${stops})`
      break
    default:
      background = `linear-gradient(${angle}deg, ${stops})`
  }
  return { background }
}

function shadowStyle(payload: any) {
  const layers = Array.isArray(payload?.layers) ? payload.layers : []
  if (!layers.length) return null
  const boxShadow = layers
    .map((layer: any) => {
      const x = Number(layer.x) || 0
      const y = Number(layer.y) || 0
      const spread = Number(layer.spread) || 0
      const color = typeof layer.color === 'string' ? layer.color : '#000000'
      const inset = layer.inset ? 'inset ' : ''
      return `${inset}${x}px ${y}px 0 ${spread}px ${color}`
    })
    .join(', ')
  return { boxShadow }
}

function clipPathStyle(payload: any) {
  const layers = Array.isArray(payload?.layers) ? payload.layers : []
  if (!layers.length) return null

  const clipPathValue = layers
    .map((layer: any) => {
      const { type, value } = layer
      if (type === 'polygon' && value) {
        return `polygon(${value})`
      }
      if (type === 'circle' && value) {
        return `circle(${value})`
      }
      if (type === 'ellipse' && value) {
        return `ellipse(${value})`
      }
      if (type === 'inset' && value) {
        return `inset(${value})`
      }
      return null
    })
    .filter(Boolean)[0]

  if (!clipPathValue) return null

  return {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    clipPath: clipPathValue,
    width: '100%',
    height: '200px'
  }
}

function animationSnippet(payload: any) {
  if (!payload) return ''
  if (payload.code) return String(payload.code).slice(0, 600)
  if (payload.html || payload.css) {
    return `${payload.html ?? ''}\n\n<style>\n${payload.css ?? ''}\n</style>`.trim().slice(0, 800)
  }
  return formatPayload(payload)
}

async function fetchPending() {
  loading.value = true
  error.value = ''
  try {
    items.value = await listPendingModeration()
  } catch (err: any) {
    error.value = err?.message || t('MODERATION.LOAD_ERROR')
  } finally {
    loading.value = false
  }
}

async function approve(item: SavedItem) {
  if (!item.category) return
  approvingId.value = item.id
  error.value = ''
  try {
    await approveSubmission(item.category as SaveCategory, item.id)
    items.value = items.value.filter((row) => row.id !== item.id)
  } catch (err: any) {
    error.value = err?.message || t('MODERATION.APPROVE_ERROR')
  } finally {
    approvingId.value = null
  }
}

onMounted(fetchPending)
</script>

<style scoped lang="scss" src="./ModerationPage.scss"></style>
