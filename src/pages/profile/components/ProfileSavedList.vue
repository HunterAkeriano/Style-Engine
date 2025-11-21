<template>
  <section class="profile-saved-list">
    <header class="profile-saved-list__header">
      <div>
        <p class="profile-saved-list__tag">{{ t(titleKey) }}</p>
        <h2 class="profile-saved-list__title">{{ t(titleKey) }}</h2>
        <p class="profile-saved-list__subtitle">{{ t(subtitleKey) }}</p>
      </div>
    </header>

    <div v-if="error" class="profile-saved-list__empty">{{ error }}</div>
    <div v-else-if="loading" class="profile-saved-list__empty">
      {{ t('PROFILE.SAVES_LOADING') }}
    </div>
    <div v-else-if="!items.length" class="profile-saved-list__empty">
      {{ t('PROFILE.SAVES_EMPTY') }}
    </div>

    <div v-else class="profile-saved-list__grid">
      <article
        v-for="item in items"
        :key="item.id"
        class="profile-saved-list__card"
      >
        <div class="profile-saved-list__preview" :class="`profile-saved-list__preview_${category}`">
          <div v-if="category === 'gradient'" class="profile-saved-list__preview-swatch" :style="getPreviewStyle(item)" />
          <div v-else-if="category === 'shadow'" class="profile-saved-list__preview-shadow" :style="getPreviewStyle(item)" />
          <div v-else class="profile-saved-list__preview-animation">
            <div v-html="getAnimationHTML(item)" class="profile-saved-list__preview-animation-content" />
          </div>
        </div>
        <div class="profile-saved-list__body">
          <header class="profile-saved-list__body-head">
            <h3>{{ item.name }}</h3>
            <span
              class="profile-saved-list__status"
              :class="`profile-saved-list__status_${item.status ?? 'private'}`"
            >
              {{ t(`PROFILE.STATUS_${(item.status ?? 'private').toUpperCase()}`) }}
            </span>
          </header>
          <p class="profile-saved-list__meta">
            {{ t('PROFILE.SAVED_AT') }} {{ toLocaleDate(item.createdAt) }}
          </p>
          <div class="profile-saved-list__actions">
            <Button
              variant="ghost"
              size="sm"
              @click="copyCSS(item)"
              :title="t('PROFILE.COPY_CSS')"
            >
              {{ t('PROFILE.COPY') }}
            </Button>
            <Button
              v-if="item.status === 'private'"
              variant="ghost"
              size="sm"
              :disabled="publishingId === item.id || !canPublish(item)"
              :title="getPublishTooltip(item)"
              @click="publish(item)"
            >
              {{ publishingId === item.id ? t('PROFILE.PUBLISHING') : t('PROFILE.PUBLISH') }}
            </Button>
            <span v-else-if="item.status === 'pending'" class="profile-saved-list__hint">
              {{ t('PROFILE.PENDING_REVIEW') }}
            </span>
            <span v-else class="profile-saved-list__hint">
              {{ t('PROFILE.APPROVED') }}
            </span>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { Button } from '@/shared/ui'
import {
  listPublicSaves,
  listSaves,
  requestPublish,
  type SavedItem,
  type SaveCategory
} from '@/shared/api/saves'
import { normalizePayload, stableStringify, formatGradient, formatBoxShadow, copyToClipboard } from '@/shared/lib'

const props = defineProps<{
  category: SaveCategory
  titleKey: string
  subtitleKey: string
}>()

const items = ref<SavedItem[]>([])
const loading = ref(true)
const error = ref('')
const publishingId = ref<string | null>(null)
const toast = useToast()
const { t } = useI18n()

const serverPayloadHashes = ref<Set<string>>(new Set())

const itemHashMap = computed(() => {
  const map = new Map<string, string>()
  items.value.forEach(item => {
    map.set(item.id, stableStringify(normalizePayload(props.category, item.payload ?? {})))
  })
  return map
})

const localHashCounts = computed(() => {
  const counts = new Map<string, number>()
  itemHashMap.value.forEach(hash => {
    counts.set(hash, (counts.get(hash) ?? 0) + 1)
  })
  return counts
})

type DuplicateReason = 'local' | 'public' | null

function getItemHash(item: SavedItem) {
  return (
    itemHashMap.value.get(item.id) ??
    stableStringify(normalizePayload(props.category, item.payload ?? {}))
  )
}

function getDuplicateReason(item: SavedItem): DuplicateReason {
  if (item.status !== 'private') {
    return null
  }
  const hash = getItemHash(item)
  if ((localHashCounts.value.get(hash) ?? 0) > 1) {
    return 'local'
  }
  if (serverPayloadHashes.value.has(hash)) {
    return 'public'
  }
  return null
}

function canPublish(item: SavedItem) {
  return getDuplicateReason(item) === null
}

function getPublishTooltip(item: SavedItem) {
  const reason = getDuplicateReason(item)
  if (!reason) return ''
  return reason === 'local' ? t('PROFILE.DUPLICATE_LOCAL') : t('PROFILE.DUPLICATE_PUBLIC')
}

async function loadPublicHashes() {
  try {
    const publicItems = await listPublicSaves(props.category)
    serverPayloadHashes.value = new Set(
      publicItems.map(item => stableStringify(normalizePayload(props.category, item.payload ?? {})))
    )
  } catch (error) {
    console.warn('Failed to load public saves', error)
  }
}

async function loadItems() {
  loading.value = true
  error.value = ''
  try {
    items.value = await listSaves(props.category)
  } catch (err: any) {
    error.value = err?.message || t('PROFILE.LOAD_SAVES_ERROR')
  } finally {
    loading.value = false
  }
}

async function publish(item: SavedItem) {
  if (!canPublish(item)) return
  publishingId.value = item.id
  try {
    await requestPublish(props.category, item.id)
    toast.success(t('PROFILE.PUBLISH_SUCCESS'))
    await Promise.all([loadItems(), loadPublicHashes()])
  } catch (err: any) {
    const errorMessage = err?.status === 409
      ? t('PROFILE.DUPLICATE_EXISTS')
      : (err?.message || t('PROFILE.PUBLISH_ERROR'))
    toast.error(errorMessage)
  } finally {
    publishingId.value = null
  }
}

function toLocaleDate(value: string) {
  return new Date(value).toLocaleDateString()
}

function getPreviewStyle(item: SavedItem) {
  const payload = item.payload as Record<string, any>
  if (props.category === 'gradient') {
    const colors = Array.isArray(payload.colors)
      ? payload.colors
      : []
    const stops = colors
      .map((c: any) => `${c.color ?? '#000'} ${c.position ?? 0}%`)
      .join(', ')
    const angle = typeof payload.angle === 'number' ? payload.angle : 90
    switch (payload.type) {
      case 'radial':
        return { background: `radial-gradient(circle, ${stops})` }
      case 'conic':
        return { background: `conic-gradient(from ${angle}deg, ${stops})` }
      default:
        return { background: `linear-gradient(${angle}deg, ${stops})` }
    }
  }
  if (props.category === 'shadow') {
    const layers = Array.isArray(payload.layers) ? payload.layers : []
    const boxShadow = layers
      .map((layer: any) => {
        const color = layer.color ?? '#000'
        return `${layer.inset ? 'inset ' : ''}${layer.x ?? 0}px ${layer.y ?? 0}px 0 ${layer.spread ?? 0}px ${color}`
      })
      .join(', ')
    return {
      boxShadow
    }
  }
  return {}
}

function getAnimationHTML(item: SavedItem): string {
  const payload = item.payload as { css?: string; html?: string }
  const html = payload.html || '<div class="animated-element"></div>'
  const css = payload.css || ''

  return `
    <style scoped>
      ${css}
    </style>
    ${html}
  `
}

function generateCSS(item: SavedItem): string {
  const payload = item.payload as Record<string, any>

  if (props.category === 'gradient') {
    const colors = Array.isArray(payload.colors) ? payload.colors : []
    const angle = typeof payload.angle === 'number' ? payload.angle : 90
    const type = payload.type || 'linear'
    return formatGradient(type, angle, colors, 'css')
  }

  if (props.category === 'shadow') {
    const layers = Array.isArray(payload.layers) ? payload.layers : []
    return formatBoxShadow(layers, 'css')
  }

  if (props.category === 'animation') {
    return payload.css || payload.html || ''
  }

  return ''
}

async function copyCSS(item: SavedItem) {
  try {
    const css = generateCSS(item)
    await copyToClipboard(css)
    toast.success(t('PROFILE.COPIED'))
  } catch (error) {
    toast.error(t('PROFILE.COPY_ERROR'))
  }
}

onMounted(() => {
  loadItems()
  loadPublicHashes()
})
</script>

<style scoped lang="scss">
.profile-saved-list {
  padding: $space-xl 0;

  &__header {
    margin-bottom: $space-lg;
  }

  &__tag {
    margin: 0;
    color: $color-text-secondary;
    text-transform: uppercase;
    font-size: $font-size-sm;
    letter-spacing: 0.08em;
  }

  &__title {
    margin: $space-xs 0;
    font-size: $font-size-2xl;
    color: $color-text-primary;
  }

  &__subtitle {
    margin: 0;
    color: $color-text-secondary;
  }

  &__empty {
    padding: $space-lg;
    color: $color-text-secondary;
    text-align: center;
  }

  &__grid {
    display: grid;
    gap: $space-lg;
  }

  &__card {
    display: flex;
    gap: $space-lg;
    padding: $space-lg;
    border-radius: $border-radius-lg;
    background: color-var-alpha('surface-panel-2', 0.45);
    border: 1px solid color-var-alpha('color-border', 0.35);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    &:hover {
      transform: translateY(-4px);
      border-color: color-var-alpha('color-primary', 0.5);
      box-shadow:
        0 8px 24px color-var-alpha('color-primary', 0.15),
        0 2px 8px color-var-alpha('color-border', 0.25);

      &::before {
        opacity: 1;
      }
    }
  }

  &__preview {
    width: 120px;
    height: 120px;
    border-radius: $border-radius-lg;
    background: color-var-alpha('surface-panel-1', 0.12);
    border: 2px solid color-var-alpha('color-border', 0.25);
    box-shadow: 0 4px 12px color-var-alpha('color-border', 0.15);
    position: relative;
    z-index: 1;
    flex-shrink: 0;
  }

  &__preview-swatch {
    width: 100%;
    height: 100%;
    border-radius: inherit;
  }

  &__preview-shadow {
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background: $color-bg-primary;
  }

  &__preview-animation {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: color-var-alpha('color-border', 0.15);
    border-radius: inherit;
  }

  &__preview-animation-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(0.7);
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: $space-sm;
  }

  &__body-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $space-sm;
    position: relative;
    z-index: 1;

    h3 {
      margin: 0;
      font-size: $font-size-lg;
      font-weight: $font-weight-bold;
      color: $color-text-primary;
      background: linear-gradient(135deg, $color-text-primary 0%, color-var-alpha('color-primary', 0.9) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__status {
    padding: 3px 10px;
    border-radius: $border-radius-full;
    font-size: $font-size-xs;
    text-transform: capitalize;

    &_private {
      background: color-var-alpha('color-text-secondary', 0.15);
      color: $color-text-secondary;
    }

    &_pending {
      background: color-var-alpha('color-warning', 0.15);
      color: $color-warning;
    }

    &_approved {
      background: color-var-alpha('color-success', 0.15);
      color: $color-success;
    }
  }

  &__meta {
    margin: 0;
    color: $color-text-secondary;
    font-size: $font-size-sm;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: $space-sm;
  }

  &__hint {
    color: $color-text-secondary;
    font-size: $font-size-sm;
  }
}
</style>
