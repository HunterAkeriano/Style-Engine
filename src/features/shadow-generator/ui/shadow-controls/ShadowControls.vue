<template>
  <section class="shadow-controls">
    <div class="shadow-controls__header">
      <div>
        <p class="shadow-controls__tag">{{ t('SHADOW.LAYERS_TAG') }}</p>
        <h2 class="shadow-controls__title">{{ t('SHADOW.LAYERS_TITLE') }}</h2>
        <p class="shadow-controls__subtitle">{{ t('SHADOW.LAYERS_SUBTITLE') }}</p>
      </div>
      <Button variant="primary" size="sm" @click="emit('add-layer')">
        + {{ t('SHADOW.ADD_LAYER') }}
      </Button>
    </div>

    <div class="shadow-controls__list">
      <article
        v-for="layer in layers"
        :key="layer.id"
        class="shadow-controls__item"
      >
        <header class="shadow-controls__item-head">
          <div class="shadow-controls__pill">
            <span class="shadow-controls__index">#{{ layer.id }}</span>
            <span class="shadow-controls__pill-text">{{ t('SHADOW.LAYER_CARD') }}</span>
          </div>
          <div class="shadow-controls__actions">
            <Button
              size="sm"
              variant="ghost"
              :class="{ 'shadow-controls__toggle_active': layer.inset }"
              @click="emit('update-layer', layer.id, { inset: !layer.inset })"
            >
              {{ layer.inset ? t('SHADOW.INSET_ON') : t('SHADOW.INSET_OFF') }}
            </Button>
            <Button
              size="sm"
              variant="danger"
              :disabled="layers.length <= 1"
              @click="emit('remove-layer', layer.id)"
            >
              ✕
            </Button>
          </div>
        </header>

        <div class="shadow-controls__grid">
          <label class="shadow-controls__field">
            <span class="shadow-controls__label">{{ t('SHADOW.OFFSET_X') }}</span>
            <div class="shadow-controls__input-row">
              <input
                :value="layer.x"
                type="range"
                min="-120"
                max="120"
                step="1"
                class="shadow-controls__range"
                @input="(e) => emit('update-layer', layer.id, { x: parseInt((e.target as HTMLInputElement).value) })"
              />
              <Input
                :model-value="layer.x"
                type="number"
                class="shadow-controls__number"
                @update:modelValue="(value) => emit('update-layer', layer.id, { x: Number(value) })"
              />
            </div>
          </label>

          <label class="shadow-controls__field">
            <span class="shadow-controls__label">{{ t('SHADOW.OFFSET_Y') }}</span>
            <div class="shadow-controls__input-row">
              <input
                :value="layer.y"
                type="range"
                min="-120"
                max="120"
                step="1"
                class="shadow-controls__range"
                @input="(e) => emit('update-layer', layer.id, { y: parseInt((e.target as HTMLInputElement).value) })"
              />
              <Input
                :model-value="layer.y"
                type="number"
                class="shadow-controls__number"
                @update:modelValue="(value) => emit('update-layer', layer.id, { y: Number(value) })"
              />
            </div>
          </label>

          <label class="shadow-controls__field">
            <span class="shadow-controls__label">{{ t('SHADOW.SPREAD') }}</span>
            <div class="shadow-controls__input-row">
              <input
                :value="layer.spread"
                type="range"
                min="-40"
                max="80"
                step="1"
                class="shadow-controls__range"
                @input="(e) => emit('update-layer', layer.id, { spread: parseInt((e.target as HTMLInputElement).value) })"
              />
              <Input
                :model-value="layer.spread"
                type="number"
                class="shadow-controls__number"
                @update:modelValue="(value) => emit('update-layer', layer.id, { spread: Number(value) })"
              />
            </div>
          </label>

          <label class="shadow-controls__field">
            <span class="shadow-controls__label">{{ t('SHADOW.OPACITY') }} ({{ Math.round(layer.opacity * 100) }}%)</span>
            <div class="shadow-controls__input-row">
              <input
                :value="layer.opacity"
                type="range"
                min="0"
                max="1"
                step="0.01"
                class="shadow-controls__range"
                @input="(e) => emit('update-layer', layer.id, { opacity: parseFloat((e.target as HTMLInputElement).value) })"
              />
              <Input
                :model-value="layer.opacity"
                type="number"
                step="0.01"
                min="0"
                max="1"
                class="shadow-controls__number"
                @update:modelValue="(value) => emit('update-layer', layer.id, { opacity: Number(value) })"
              />
            </div>
          </label>

          <label class="shadow-controls__field shadow-controls__field_full">
            <span class="shadow-controls__label">{{ t('SHADOW.COLOR') }}</span>
            <div class="shadow-controls__color-row">
              <input
                :value="layer.color"
                type="color"
                class="shadow-controls__color"
                @input="(e) => emit('update-layer', layer.id, { color: (e.target as HTMLInputElement).value })"
              />
              <Input
                :model-value="layer.color"
                type="text"
                placeholder="#0b1220"
                class="shadow-controls__hex"
                @update:modelValue="(value) => emit('update-layer', layer.id, { color: value as string })"
              />
            </div>
          </label>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ShadowLayer } from '@/shared/types'
import { Button, Input } from '@/shared/ui'
import { useI18n } from 'vue-i18n'

interface Props {
  layers: ShadowLayer[]
}

interface Emits {
  (e: 'update-layer', id: string, patch: Partial<ShadowLayer>): void
  (e: 'remove-layer', id: string): void
  (e: 'add-layer'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()
</script>

<style lang="scss" scoped src="./ShadowControls.scss"></style>
