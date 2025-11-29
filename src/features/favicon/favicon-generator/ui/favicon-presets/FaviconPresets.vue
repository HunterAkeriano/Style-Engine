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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button, Icon } from '@/shared/ui'
import type { FaviconPreset } from '@/shared/types/favicon'

interface Props {
  presets: FaviconPreset[]
}

interface Emits {
  (e: 'apply', preset: FaviconPreset): void
  (e: 'download', preset: FaviconPreset): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()
</script>

<style lang="scss" scoped src="./favicon-presets.scss"></style>
