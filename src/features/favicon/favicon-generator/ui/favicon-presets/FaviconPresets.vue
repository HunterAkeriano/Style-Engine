<template>
  <div class="favicon-presets">
    <div class="favicon-presets__header">
      <span class="favicon-presets__tag">{{ t('FAVICON.PRESETS_TAG') }}</span>
      <h2 class="favicon-presets__title">{{ t('FAVICON.PRESETS_TITLE') }}</h2>
      <p class="favicon-presets__subtitle">{{ t('FAVICON.PRESETS_SUBTITLE') }}</p>
    </div>

    <div class="favicon-presets__grid">
      <div
        v-for="preset in presets"
        :key="preset.id"
        class="favicon-presets__item"
      >
        <div class="favicon-presets__preview" :style="{ backgroundColor: preset.backgroundColor }">
          <div
            class="favicon-presets__icon"
            v-html="preset.svg"
          />
        </div>
        <div class="favicon-presets__info">
          <h3 class="favicon-presets__name">{{ preset.name }}</h3>

          <div v-if="preset.owner" class="favicon-presets__author">
            <div class="favicon-presets__avatar" :style="getCreatorAvatarStyle(preset.owner)">
              <span v-if="!preset.owner.avatarUrl">{{ getCreatorInitials(preset.owner) }}</span>
            </div>
            <span class="favicon-presets__author-name" :title="getCreatorLabel(preset.owner)">
              {{ getCreatorLabel(preset.owner) }}
            </span>
          </div>

          <div class="favicon-presets__actions">
            <Button
              size="sm"
              variant="outline"
              @click="emit('apply', preset)"
            >
              {{ t('COMMON.APPLY') }}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              @click="emit('download', preset)"
            >
              <Icon name="icon-download" :size="16" />
            </Button>
            <Button
              size="sm"
              variant="primary"
              @click.stop="emit('save', preset)"
              :disabled="savingId === preset.id || isPresetSaved(preset)"
            >
              {{ t('GRADIENT.SAVE') }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button, Icon } from '@/shared/ui'
import type { FaviconPreset } from '@/shared/types/favicon'
import {
  getCreatorAvatarStyle,
  getCreatorInitials,
  getCreatorLabel
} from '@/shared/lib/creator'

interface Props {
  presets: FaviconPreset[]
  savingId?: string | null
  isSaved?: (preset: FaviconPreset) => boolean
}

interface Emits {
  (e: 'apply', preset: FaviconPreset): void
  (e: 'download', preset: FaviconPreset): void
  (e: 'save', preset: FaviconPreset): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { presets, savingId, isSaved } = toRefs(props)
const { t } = useI18n()
const isPresetSaved = (preset: FaviconPreset) => (isSaved?.value && isSaved.value(preset)) ?? false
</script>

<style lang="scss" scoped src="./favicon-presets.scss"></style>
