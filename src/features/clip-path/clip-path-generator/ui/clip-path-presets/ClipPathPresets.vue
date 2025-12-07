<template>
  <section class="clip-path-presets">
    <div class="clip-path-presets__header">
      <div>
        <p class="clip-path-presets__tag">{{ t('CLIP_PATH.PRESETS_TAG') }}</p>
        <h2 class="clip-path-presets__title">{{ t('CLIP_PATH.PRESETS_TITLE') }}</h2>
        <p class="clip-path-presets__subtitle">{{ t('CLIP_PATH.PRESETS_SUBTITLE') }}</p>
      </div>
    </div>

    <div class="clip-path-presets__grid">
      <article
        v-for="preset in presets"
        :key="preset.id"
        class="clip-path-presets__card"
        @click="emit('apply', preset)"
      >
        <div v-if="preset.owner" class="clip-path-presets__author">
          <div class="clip-path-presets__avatar" :style="computeCreatorAvatarStyle(preset.owner)">
            <span v-if="!preset.owner.avatarUrl">{{ computeCreatorInitials(preset.owner) }}</span>
          </div>
          <div>
            <span class="clip-path-presets__author-name" :title="computeCreatorLabel(preset.owner)">
              {{ computeCreatorLabel(preset.owner) }}
            </span>
            <span v-if="preset.owner.email" class="clip-path-presets__author-email">
              {{ preset.owner.email }}
            </span>
          </div>
        </div>

        <div class="clip-path-presets__preview" :style="getPreviewStyle(preset)" />

        <div class="clip-path-presets__content">
          <h3 class="clip-path-presets__card-title">{{ preset.name }}</h3>

          <div class="clip-path-presets__actions">
            <Button size="sm" variant="ghost" @click.stop="emit('copy', preset)">
              {{ t('CLIP_PATH.COPY') }}
            </Button>
            <Button
              size="sm"
              variant="primary"
              @click.stop="emit('save', preset)"
              :disabled="savingId === preset.id || isPresetSaved(preset)"
            >
              {{ t('CLIP_PATH.SAVE') }}
            </Button>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ClipPathPreset } from '@/entities/clip-path/model/clip-path-presets'
import { Button } from '@/shared/ui'
import { formatClipPath } from '@/shared/lib/clip-path'
import {
  getCreatorAvatarStyle as computeCreatorAvatarStyle,
  getCreatorInitials as computeCreatorInitials,
  getCreatorLabel as computeCreatorLabel
} from '@/shared/lib/creator'

interface Props {
  presets: ClipPathPreset[]
  savingId?: string | null
  isSaved?: (preset: ClipPathPreset) => boolean
}

interface Emits {
  (e: 'apply', preset: ClipPathPreset): void
  (e: 'copy', preset: ClipPathPreset): void
  (e: 'save', preset: ClipPathPreset): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { presets, savingId, isSaved } = toRefs(props)
const { t } = useI18n()
const isPresetSaved = (preset: ClipPathPreset) => (isSaved?.value && isSaved.value(preset)) ?? false

function getPreviewStyle(preset: ClipPathPreset) {
  const clipPathValue = formatClipPath(preset.layers, 'inline')
  return {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    clipPath: clipPathValue.replace('clip-path:', '').replace(';', '').trim()
  }
}
</script>

<style lang="scss" scoped src="./clip-path-presets.scss"></style>
