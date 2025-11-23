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
            <Input v-model="rotateFrom" type="number" :label="t('ANIMATION.ROTATION_FROM')" suffix="°" />
            <Input v-model="rotateTo" type="number" :label="t('ANIMATION.ROTATION_TO')" suffix="°" />
            <Input v-model="skewXFrom" type="number" :label="t('ANIMATION.SKEW_X_FROM')" suffix="°" />
            <Input v-model="skewXTo" type="number" :label="t('ANIMATION.SKEW_X_TO')" suffix="°" />
            <Input v-model="skewYFrom" type="number" :label="t('ANIMATION.SKEW_Y_FROM')" suffix="°" />
            <Input v-model="skewYTo" type="number" :label="t('ANIMATION.SKEW_Y_TO')" suffix="°" />
          </div>
        </div>

        <div class="animation-builder__right">
          <div class="animation-builder__preview-section">
            <p class="animation-builder__section-label">{{ t('ANIMATION.PREVIEW') }}</p>
            <div class="motion-preview" :style="previewStyle">
              <div class="motion-preview__dot"></div>
              <div class="motion-preview__card">CSS Motion</div>
            </div>
            <div class="animation-builder__preview-actions">
              <Button
                class="animation-builder__play-button"
                variant="primary"
                size="sm"
                type="button"
                @click="togglePlaying"
              >
                {{ isPlaying ? t('ANIMATION.STOP_ANIMATION') : t('ANIMATION.START_ANIMATION') }}
              </Button>
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
                <Button variant="secondary" size="sm" @click="handleExportRequest">
                  {{ t('COMMON.EXPORT') }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Modal
    :visible="showExportModal"
    :title="t('COMMON.EXPORT')"
    @close="showExportModal = false"
  >
    <div class="animation-export">
      <div class="animation-export__toolbar">
        <Select v-model="exportFormat" :options="animationExportFormats" />
        <div class="animation-export__actions">
          <Button variant="outline" size="sm" @click="copyExportCode">
            {{ t('COMMON.COPY') }}
          </Button>
          <Button variant="ghost" size="sm" @click="downloadExportCode">
            {{ t('COMMON.DOWNLOAD') }}
          </Button>
        </div>
      </div>
      <div class="animation-export__code">
        <pre class="code-block"><code>{{ exportCode }}</code></pre>
      </div>
    </div>
  </Modal>
  <Modal
    :visible="showExportProModal"
    :title="t('COMMON.PRO_EXPORT_TITLE')"
    :subtitle="t('COMMON.PRO_EXPORT_MESSAGE')"
    show-actions
    :confirm-text="t('COMMON.PRO_EXPORT_ACTION')"
    :cancel-text="t('COMMON.CANCEL')"
    @confirm="handleExportUpgrade"
    @close="showExportProModal = false"
  />
  <Modal
    :visible="showAuthModal"
    :title="t('COMMON.AUTH_REQUIRED_TITLE')"
    :subtitle="t('COMMON.AUTH_REQUIRED_DESCRIPTION')"
    show-actions
    :confirm-text="t('COMMON.AUTH_REQUIRED_CONFIRM')"
    :cancel-text="t('COMMON.AUTH_REQUIRED_CLOSE')"
    @confirm="handleAuthConfirm"
    @close="showAuthModal = false"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref, type CSSProperties } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { Button, Input, Select, Modal, type SelectOption } from '@/shared/ui'
import { copyToClipboard } from '@/shared/lib'
import { useToast } from '@/shared/lib/toast'
import { listPublicSaves, type SavedItem } from '@/shared/api/saves'
import { useAuthStore } from '@/entities'
import { resolveSubscriptionTier } from '@/shared/lib/save-quota'
import { SubscriptionTier } from '@/shared/config/pricing'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const showAuthModal = ref(false)
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
const rotateFrom = ref(0)
const rotateTo = ref(6)
const skewXFrom = ref(0)
const skewXTo = ref(4)
const skewYFrom = ref(0)
const skewYTo = ref(2)
const useVariables = ref(true)
const isPlaying = ref(false)

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

const previewPlayState = computed(() => (isPlaying.value ? 'running' : 'paused'))

const communityAnimations = ref<SavedItem[]>([])
const communityLoading = ref(false)
const showExportModal = ref(false)
const showExportProModal = ref(false)
const exportFormat = ref<'html' | 'css' | 'json'>('html')
const animationExportFormats = [
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' }
]
const exportCode = computed(() => {
  if (!codeSnippet.value) return ''
  if (exportFormat.value === 'css') {
    return codeSnippetWithValues.value
  }
  if (exportFormat.value === 'json') {
    return JSON.stringify(motionValues.value, null, 2)
  }
  return codeSnippet.value
})
const exportFileName = computed(() => `animation-builder-export.${exportFormat.value}`)

const motionValues = computed(() => ({
  startX: distanceX.value * -1,
  endX: distanceX.value,
  startY: distanceY.value,
  endY: distanceY.value * -1,
  startScale: scaleFrom.value,
  endScale: scaleTo.value,
  startOpacity: opacityFrom.value,
  endOpacity: opacityTo.value,
  startRotate: rotateFrom.value,
  endRotate: rotateTo.value,
  startSkewX: skewXFrom.value,
  endSkewX: skewXTo.value,
  startSkewY: skewYFrom.value,
  endSkewY: skewYTo.value,
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
    '--motion-start-rotate': `${motion.startRotate}deg`,
    '--motion-end-rotate': `${motion.endRotate}deg`,
    '--motion-start-skew-x': `${motion.startSkewX}deg`,
    '--motion-end-skew-x': `${motion.endSkewX}deg`,
    '--motion-start-skew-y': `${motion.startSkewY}deg`,
    '--motion-end-skew-y': `${motion.endSkewY}deg`,
    '--motion-duration': `${motion.duration}ms`,
    '--motion-delay': `${motion.delay}ms`,
    '--motion-easing': motion.easing,
    '--motion-iterations': motion.iterations,
    '--motion-play-state': previewPlayState.value
  }
})

function getUserTier(): SubscriptionTier | undefined {
  return resolveSubscriptionTier(
    authStore.user?.subscriptionTier ?? (authStore.userPlan as string | undefined)
  )
}

async function loadCommunityAnimations() {
  communityLoading.value = true
  try {
    communityAnimations.value = await listPublicSaves('animation')
  } catch (error) {
    console.warn('Failed to load community animations', error)
  } finally {
    communityLoading.value = false
  }
}

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
  --motion-start-rotate: ${motion.startRotate}deg;
  --motion-end-rotate: ${motion.endRotate}deg;
  --motion-start-skew-x: ${motion.startSkewX}deg;
  --motion-end-skew-x: ${motion.endSkewX}deg;
  --motion-start-skew-y: ${motion.startSkewY}deg;
  --motion-end-skew-y: ${motion.endSkewY}deg;
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
    transform: translate(var(--motion-start-x), var(--motion-start-y)) rotate(var(--motion-start-rotate)) skew(var(--motion-start-skew-x), var(--motion-start-skew-y)) scale(var(--motion-start-scale));
    opacity: var(--motion-start-opacity);
  }
  100% {
    transform: translate(var(--motion-end-x), var(--motion-end-y)) rotate(var(--motion-end-rotate)) skew(var(--motion-end-skew-x), var(--motion-end-skew-y)) scale(var(--motion-end-scale));
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
    transform: translate(${motion.startX}px, ${motion.startY}px) rotate(${motion.startRotate}deg) skew(${motion.startSkewX}deg, ${motion.startSkewY}deg) scale(${motion.startScale});
    opacity: ${motion.startOpacity};
  }
  100% {
    transform: translate(${motion.endX}px, ${motion.endY}px) rotate(${motion.endRotate}deg) skew(${motion.endSkewX}deg, ${motion.endSkewY}deg) scale(${motion.endScale});
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

function handleExportRequest() {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return
  }

  const tier = getUserTier()
  if (!tier || tier === SubscriptionTier.FREE) {
    showExportProModal.value = true
    return
  }

  showExportModal.value = true
}

function handleExportUpgrade() {
  showExportProModal.value = false
  router.push({
    path: `/${locale.value}/about`,
    query: { plan: 'premium' }
  })
}

async function copyExportCode() {
  if (!exportCode.value) return
  const ok = await copyToClipboard(exportCode.value)
  toast[ok ? 'success' : 'error'](ok ? t('COMMON.COPIED_TO_CLIPBOARD') : t('COMMON.COPY_FAILED'))
}

function downloadExportCode() {
  const blob = new Blob([exportCode.value], { type: 'text/plain' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = exportFileName.value
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

function handleAuthConfirm() {
  showAuthModal.value = false
  router.push({
    name: `${locale.value}-login`,
    query: { redirect: route.fullPath }
  })
}

function togglePlaying() {
  isPlaying.value = !isPlaying.value
}

onMounted(() => {
  loadCommunityAnimations()
})
</script>

<style lang="scss" scoped src="./animation-builder.scss"></style>
