<template>
  <div class="animation-builder">
    <div class="animation-builder__header">
      <p class="animation-builder__tag">{{ t('ANIMATION.BUILDER_TAG') }}</p>
      <h2 class="animation-builder__title">{{ t('ANIMATION.BUILDER_TITLE') }}</h2>
      <p class="animation-builder__subtitle">{{ t('ANIMATION.BUILDER_SUBTITLE') }}</p>
    </div>

    <div class="animation-builder__container">
      <div class="animation-builder__content">
        <div class="animation-builder__controls-section">
          <p class="animation-builder__section-label">Controls</p>
          <div class="animation-builder__controls">
            <Input v-model="duration" type="number" :label="t('ANIMATION.DURATION')" suffix="ms" />
            <Input v-model="delay" type="number" :label="t('ANIMATION.DELAY')" suffix="ms" />
            <Select v-model="easing" :options="timingOptions" :label="t('ANIMATION.EASING')" />
            <Select v-model="iterations" :options="iterationOptions" :label="t('ANIMATION.LOOPS')" />
            <Input v-model="distanceX" type="number" :label="t('ANIMATION.DISTANCE_X')" suffix="px" />
            <Input v-model="distanceY" type="number" :label="t('ANIMATION.DISTANCE_Y')" suffix="px" />
            <Input v-model="scaleFrom" type="number" :label="t('ANIMATION.SCALE_FROM')" step="0.01" />
            <Input v-model="scaleTo" type="number" :label="t('ANIMATION.SCALE_TO')" step="0.01" />
            <Input
              v-model="opacityFrom"
              type="number"
              :label="t('ANIMATION.OPACITY_FROM')"
              step="0.05"
              min="0"
              max="1"
            />
            <Input
              v-model="opacityTo"
              type="number"
              :label="t('ANIMATION.OPACITY_TO')"
              step="0.05"
              min="0"
              max="1"
            />
          </div>
        </div>

        <div class="animation-builder__right">
          <div class="animation-builder__preview-section">
            <p class="animation-builder__section-label">{{ t('ANIMATION.PREVIEW') }}</p>
            <div class="motion-preview" :style="previewStyle">
              <div class="motion-preview__dot"></div>
              <div class="motion-preview__card">CSS Motion</div>
            </div>
          </div>

          <div class="animation-builder__code-section">
            <p class="animation-builder__section-label">Code</p>
            <div class="animation-builder__code">
              <div class="animation-builder__code-controls">
                <span></span><span></span><span></span>
              </div>
              <div class="animation-builder__code-toolbar">
                <span class="animation-builder__code-mode">{{ t('ANIMATION.CODE_VIEW') }}</span>
                <div class="animation-builder__toggle" role="group" aria-label="Code view mode">
                  <button
                    type="button"
                    class="animation-builder__toggle-button"
                    :class="{ 'animation-builder__toggle-button_active': useVariables }"
                    @click="useVariables = true"
                  >
                    {{ t('ANIMATION.CODE_VIEW_VARIABLES') }}
                  </button>
                  <button
                    type="button"
                    class="animation-builder__toggle-button"
                    :class="{ 'animation-builder__toggle-button_active': !useVariables }"
                    @click="useVariables = false"
                  >
                    {{ t('ANIMATION.CODE_VIEW_VALUES') }}
                  </button>
                </div>
              </div>
              <pre class="code-block">{{ codeSnippet }}</pre>
              <div class="animation-builder__code-actions">
                <Button variant="primary" size="sm" @click="handleCopy">
                  {{ t('ANIMATION.COPY_SNIPPET') }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, type CSSProperties } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button, Input, Select, type SelectOption } from '@/shared/ui'
import { copyToClipboard } from '@/shared/lib'
import { useToast } from 'vue-toastification'

const { t } = useI18n()
const toast = useToast()
const animationName = 'style-engine-motion'

const duration = ref(1200)
const delay = ref(0)
const easing = ref('cubic-bezier(0.3, 0.8, 0.4, 1)')
const iterations = ref('infinite')
const distanceX = ref(24)
const distanceY = ref(-16)
const scaleFrom = ref(0.96)
const scaleTo = ref(1.06)
const opacityFrom = ref(0.72)
const opacityTo = ref(1)
const useVariables = ref(true)

const timingOptions: SelectOption[] = [
  { label: 'Ease', value: 'ease' },
  { label: 'Linear', value: 'linear' },
  { label: 'Ease-in-out', value: 'ease-in-out' },
  { label: 'Custom (soft)', value: 'cubic-bezier(0.3, 0.8, 0.4, 1)' }
]

const iterationOptions: SelectOption[] = [
  { label: 'Infinite', value: 'infinite' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' }
]

const motionValues = computed(() => ({
  startX: distanceX.value * -1,
  endX: distanceX.value,
  startY: distanceY.value,
  endY: distanceY.value * -1,
  startScale: scaleFrom.value,
  endScale: scaleTo.value,
  startOpacity: opacityFrom.value,
  endOpacity: opacityTo.value,
  duration: duration.value,
  delay: delay.value,
  easing: easing.value,
  iterations: iterations.value
}))

const previewStyle = computed<CSSProperties>(() => {
  const motion = motionValues.value
  return {
    '--motion-start-x': `${motion.startX}px`,
    '--motion-end-x': `${motion.endX}px`,
    '--motion-start-y': `${motion.startY}px`,
    '--motion-end-y': `${motion.endY}px`,
    '--motion-start-scale': `${motion.startScale}`,
    '--motion-end-scale': `${motion.endScale}`,
    '--motion-start-opacity': `${motion.startOpacity}`,
    '--motion-end-opacity': `${motion.endOpacity}`,
    '--motion-duration': `${motion.duration}ms`,
    '--motion-delay': `${motion.delay}ms`,
    '--motion-easing': motion.easing,
    '--motion-iterations': motion.iterations
  }
})

const codeSnippetWithVariables = computed(() => {
  const motion = motionValues.value
  return `<div class="motion-preview">
  <div class="motion-preview__dot"></div>
  <div class="motion-preview__card">CSS Motion</div>
</div>

.motion-preview {
  --motion-start-x: ${motion.startX}px;
  --motion-end-x: ${motion.endX}px;
  --motion-start-y: ${motion.startY}px;
  --motion-end-y: ${motion.endY}px;
  --motion-start-scale: ${motion.startScale};
  --motion-end-scale: ${motion.endScale};
  --motion-start-opacity: ${motion.startOpacity};
  --motion-end-opacity: ${motion.endOpacity};
  --motion-duration: ${motion.duration}ms;
  --motion-delay: ${motion.delay}ms;
  --motion-easing: ${motion.easing};
  --motion-iterations: ${motion.iterations};
  position: relative;
  display: grid;
  place-items: center;
  width: 220px;
  height: 160px;
  border-radius: 16px;
  background: radial-gradient(circle at 30% 30%, rgba(104, 185, 255, 0.14), #0b1120);
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
}

.motion-preview__dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #7dd3fc;
  animation: ${animationName} var(--motion-duration) var(--motion-easing) var(--motion-delay) var(--motion-iterations) alternate;
}

.motion-preview__card {
  padding: 12px 16px;
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #e2e8f0;
  font-weight: 600;
  animation: ${animationName} var(--motion-duration) var(--motion-easing) var(--motion-delay) var(--motion-iterations) alternate;
}

@keyframes ${animationName} {
  0% {
    transform: translate(var(--motion-start-x), var(--motion-start-y)) scale(var(--motion-start-scale));
    opacity: var(--motion-start-opacity);
  }
  100% {
    transform: translate(var(--motion-end-x), var(--motion-end-y)) scale(var(--motion-end-scale));
    opacity: var(--motion-end-opacity);
  }
}`
})

const codeSnippetWithValues = computed(() => {
  const motion = motionValues.value
  return `<div class="motion-preview">
  <div class="motion-preview__dot"></div>
  <div class="motion-preview__card">CSS Motion</div>
</div>

.motion-preview {
  position: relative;
  display: grid;
  place-items: center;
  width: 220px;
  height: 160px;
  border-radius: 16px;
  background: radial-gradient(circle at 30% 30%, rgba(104, 185, 255, 0.14), #0b1120);
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
}

.motion-preview__dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #7dd3fc;
  animation: ${animationName} ${motion.duration}ms ${motion.easing} ${motion.delay}ms ${motion.iterations} alternate;
}

.motion-preview__card {
  padding: 12px 16px;
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #e2e8f0;
  font-weight: 600;
  animation: ${animationName} ${motion.duration}ms ${motion.easing} ${motion.delay}ms ${motion.iterations} alternate;
}

@keyframes ${animationName} {
  0% {
    transform: translate(${motion.startX}px, ${motion.startY}px) scale(${motion.startScale});
    opacity: ${motion.startOpacity};
  }
  100% {
    transform: translate(${motion.endX}px, ${motion.endY}px) scale(${motion.endScale});
    opacity: ${motion.endOpacity};
  }
}`
})

const codeSnippet = computed(() => (useVariables.value ? codeSnippetWithVariables.value : codeSnippetWithValues.value))

async function handleCopy() {
  const ok = await copyToClipboard(codeSnippet.value)
  if (ok) {
    toast.success(t('COMMON.COPIED_TO_CLIPBOARD'))
  }
}
</script>

<style scoped lang="scss">
.animation-builder {
  display: flex;
  flex-direction: column;
  gap: $space-3xl;
  width: 100%;

  @media (max-width: $breakpoint-md) {
    gap: $space-2xl;
  }
}

.animation-builder__header {
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
}

.animation-builder__container {
  width: 100%;
  padding: $space-2xl;
  border-radius: $border-radius-2xl;
  border: 1px solid color-var-alpha('panel-border', 0.25);
  background: color-var-alpha('color-bg-secondary', 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  @media (max-width: $breakpoint-md) {
    padding: $space-xl;
  }

  @media (max-width: $breakpoint-sm) {
    padding: $space-lg;
  }
}

.animation-builder__content {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: $space-2xl;
  align-items: start;

  @media (max-width: $breakpoint-xl) {
    grid-template-columns: 1fr;
    gap: $space-xl;
  }
}

.animation-builder__controls-section {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
}

.animation-builder__right {
  display: flex;
  flex-direction: column;
  gap: $space-2xl;
  overflow: hidden;

  @media (max-width: $breakpoint-md) {
    gap: $space-xl;
  }
}

.animation-builder__preview-section,
.animation-builder__code-section {
  display: flex;
  flex-direction: column;
  gap: $space-lg;
}

.animation-builder__section-label {
  margin: 0;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: color-var-alpha('color-text-secondary', 0.7);
}

.animation-builder__tag {
  display: inline-flex;
  align-items: center;
  gap: $space-xs;
  padding: $space-xs $space-md;
  border-radius: $border-radius-full;
  border: 1px solid color-var-alpha('color-accent', 0.2);
  background: linear-gradient(135deg, color-var-alpha('color-accent', 0.12), color-var-alpha('color-primary', 0.08));
  color: $color-accent;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  width: fit-content;
  box-shadow: 0 2px 12px color-var-alpha('color-accent', 0.08);
}

.animation-builder__title {
  margin: 20px 0 0;
  font-size: $font-size-2xl;
  font-weight: $font-weight-bold;
  letter-spacing: -0.015em;
  line-height: 1.2;
}

.animation-builder__subtitle {
  margin: 20px auto 0;
  color: color-var-alpha('color-text-secondary', 0.85);
  line-height: 1.65;
  max-width: 720px;
  font-size: $font-size-sm;
}

.animation-builder__controls {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.animation-builder__code {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: $space-lg;
  padding: $space-2xl $space-xl $space-xl;
  border-radius: $border-radius-xl;
  border: 1px solid color-var-alpha('panel-border', 0.2);
  background: color-var-alpha('color-bg-primary', 0.5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);

  pre {
    margin: 0;
    font-family: $font-family-mono;
    font-size: $font-size-sm;
    color: $color-text-secondary;
    line-height: 1.7;
    white-space: pre;
    overflow-x: auto;
    overflow-y: auto;
    max-height: 350px;
    padding-right: $space-sm;

    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: color-var-alpha('panel-border', 0.1);
      border-radius: $border-radius-sm;
    }

    &::-webkit-scrollbar-thumb {
      background: color-var-alpha('color-primary', 0.3);
      border-radius: $border-radius-sm;

      &:hover {
        background: color-var-alpha('color-primary', 0.5);
      }
    }
  }
}

.animation-builder__code-controls {
  position: absolute;
  top: $space-lg;
  left: $space-lg;
  display: flex;
  gap: $space-xs;

  span {
    width: 11px;
    height: 11px;
    border-radius: 50%;
    background: color-var-alpha('panel-border', 0.3);
    transition: background $transition-base;

    &:nth-child(1) {
      background: color-var-alpha('color-error', 0.7);
    }
    &:nth-child(2) {
      background: color-var-alpha('color-warning', 0.7);
    }
    &:nth-child(3) {
      background: color-var-alpha('color-success', 0.7);
    }
  }
}

.animation-builder__code-toolbar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: $space-md;
  margin-top: $space-xs;
}

.animation-builder__code-mode {
  color: color-var-alpha('color-text-secondary', 0.7);
  font-size: $font-size-xs;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.animation-builder__toggle {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: $border-radius-full;
  background: color-var-alpha('panel-border', 0.14);
}

.animation-builder__toggle-button {
  border: none;
  background: transparent;
  color: $color-text-secondary;
  padding: 6px 12px;
  border-radius: $border-radius-full;
  font-size: $font-size-sm;
  font-weight: $font-weight-semibold;
  cursor: pointer;
  transition: background $transition-base, color $transition-base;

  &.animation-builder__toggle-button_active {
    background: color-var-alpha('color-primary', 0.18);
    color: $color-text-primary;
    box-shadow: 0 4px 16px color-var-alpha('color-primary', 0.15);
  }

  &:hover {
    color: $color-text-primary;
  }
}

.animation-builder__code-actions {
  display: flex;
  justify-content: flex-end;
}

.motion-preview {
  position: relative;
  display: grid;
  place-items: center;
  width: 100%;
  min-height: 350px;
  border-radius: $border-radius-xl;
  border: 1px solid color-var-alpha('panel-border', 0.2);
  background:
    radial-gradient(circle at 30% 30%, color-var-alpha('color-primary', 0.08), transparent 60%),
    color-var-alpha('color-bg-primary', 0.5);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  isolation: isolate;
  padding: $space-3xl;

  @media (max-width: $breakpoint-md) {
    min-height: 280px;
    padding: $space-2xl;
  }

  @media (max-width: $breakpoint-sm) {
    min-height: 240px;
    padding: $space-xl;
  }
}

.motion-preview__dot {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: $color-accent;
  box-shadow:
    0 0 32px color-var-alpha('color-accent', 0.8),
    0 0 64px color-var-alpha('color-accent', 0.4);
  animation: style-engine-motion var(--motion-duration) var(--motion-easing) var(--motion-delay) var(--motion-iterations) alternate;
}

.motion-preview__card {
  padding: $space-lg $space-2xl;
  border-radius: $border-radius-xl;
  background: linear-gradient(145deg, color-var-alpha('color-bg-secondary', 0.9), color-var-alpha('color-bg-secondary', 0.7));
  border: 1px solid color-var-alpha('panel-border', 0.3);
  color: $color-text-primary;
  font-weight: $font-weight-semibold;
  letter-spacing: 0.01em;
  font-size: $font-size-lg;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: style-engine-motion var(--motion-duration) var(--motion-easing) var(--motion-delay) var(--motion-iterations) alternate;

  @media (max-width: $breakpoint-md) {
    padding: $space-md $space-lg;
    font-size: $font-size-base;
  }
}

@keyframes style-engine-motion {
  0% {
    transform: translate(var(--motion-start-x), var(--motion-start-y)) scale(var(--motion-start-scale));
    opacity: var(--motion-start-opacity);
  }
  100% {
    transform: translate(var(--motion-end-x), var(--motion-end-y)) scale(var(--motion-end-scale));
    opacity: var(--motion-end-opacity);
  }
}
</style>
