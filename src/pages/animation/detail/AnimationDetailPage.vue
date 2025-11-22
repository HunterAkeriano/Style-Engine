<template>
  <div class="animation-detail">
    <div class="animation-detail__background">
      <span class="animation-detail__beam animation-detail__beam_left"></span>
      <span class="animation-detail__beam animation-detail__beam_right"></span>
    </div>

    <div class="container animation-detail__container">
      <div class="animation-detail__header">
        <div>
          <p class="animation-detail__eyebrow">{{ t('ANIMATION.EYEBROW') }}</p>
          <h1 class="animation-detail__title">{{ title }}</h1>
          <p class="animation-detail__subtitle">{{ description }}</p>
        </div>
        <div class="animation-detail__actions">
          <NavLink to="/animation" className="button button_secondary">
            {{ t('ANIMATION.BACK') }}
          </NavLink>
        </div>
      </div>

      <div class="animation-detail__layout">
        <div class="animation-detail__preview">
          <p class="animation-card__tag">{{ t('ANIMATION.PREVIEW') }}</p>
          <component v-if="selectedExample" :is="selectedExample.component" />
          <div class="animation-detail__preview-actions">
         <Button variant="primary" size="sm" @click="handleCopy">
           {{ copied ? t('COMMON.COPIED_TO_CLIPBOARD') : t('ANIMATION.COPY_SNIPPET') }}
         </Button>
          <Button variant="secondary" size="sm" @click="handleExportRequest">
            {{ t('COMMON.EXPORT') }}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            @click="handleSaveExample"
            :disabled="savingExampleId === selectedExample?.id || isAnimationSaved"
          >
              {{ t('ANIMATION.SAVE') }}
            </Button>
          </div>
        </div>

        <div class="animation-detail__code">
          <div class="animation-detail__code-head">
            <div class="animation-card__code-controls">
              <span></span><span></span><span></span>
            </div>
            <p class="animation-card__tag">{{ t('ANIMATION.HTML_CSS') }}</p>
          </div>
          <pre class="code-block" v-html="highlightedCode"></pre>
    </div>
  </div>
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
    <Modal
      :visible="showSaveModal"
      :title="t('PROFILE.SAVES_TITLE')"
      :subtitle="t('PROFILE.SAVES_SUBTITLE')"
      @close="closeSaveModal"
    >
      <Input v-model="saveName" :label="t('COMMON.NAME')" />
      <template #footer>
        <div class="modal__actions">
          <Button variant="ghost" size="md" @click="closeSaveModal">
            {{ t('COMMON.CANCEL') }}
          </Button>
          <Button variant="primary" size="md" @click="confirmSaveExample(saveName)">
            {{ t('COMMON.SAVE') }}
          </Button>
        </div>
      </template>
    </Modal>
    <Modal
      :visible="showProLimitModal"
      :title="t('PROFILE.PRO_LIMIT_TITLE')"
      :subtitle="proLimitSubtitle"
      show-actions
      :confirm-text="t('PROFILE.PRO_LIMIT_ACTION')"
      :cancel-text="t('COMMON.CANCEL')"
      @confirm="handleProLimitConfirm"
      @close="showProLimitModal = false"
    />
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
  </div>
</div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Modal, Button, NavLink, Input, Select } from '@/shared/ui'
import { copyToClipboard } from '@/shared/lib'
import { useToast } from 'vue-toastification'
import { animationExamples } from '@/entities/animation'
import {
  createSave,
  listSaves,
  type SavedItem,
  type SaveCategory
} from '@/shared/api/saves'
import { useAuthStore } from '@/entities'
import { getUserLimit, SubscriptionTier } from '@/shared/config/pricing'
import { evaluateSaveQuota, type SaveQuotaResult, resolveSubscriptionTier } from '@/shared/lib/save-quota'

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()
const copied = ref(false)
const toast = useToast()
const authStore = useAuthStore()
const showAuthModal = ref(false)
const showSaveModal = ref(false)
const showProLimitModal = ref(false)
const showExportModal = ref(false)
const showExportProModal = ref(false)
const saveName = ref('')
const saveContext = ref<{ defaultName: string; payload: Record<string, unknown> } | null>(null)
const entityLabel = computed(() => t('PROFILE.SAVED_ANIMATIONS'))
const proSaveLimit = getUserLimit(SubscriptionTier.PRO, 'savedTemplates')
const proQuota = ref<SaveQuotaResult | null>(null)
const proLimitSubtitle = computed(() =>
  t('PROFILE.PRO_LIMIT_MESSAGE', {
    limit: proQuota.value?.limit ?? proSaveLimit,
    entity: entityLabel.value
  })
)
function getUserTier(): SubscriptionTier | undefined {
  return resolveSubscriptionTier(
    authStore.user?.subscriptionTier ?? (authStore.userPlan as string | undefined)
  )
}
const savedAnimationHashes = ref<Set<string>>(new Set())
const savingExampleId = ref<string | null>(null)
const animationPayloadHash = computed(() => {
  const payload = selectedExample.value
  if (!payload) return ''
  return JSON.stringify({ html: payload.html, css: payload.css })
})
const isAnimationSaved = computed(() =>
  animationPayloadHash.value ? savedAnimationHashes.value.has(animationPayloadHash.value) : false
)

const exportFormat = ref<'html' | 'css' | 'json'>('html')
const animationExportFormats = [
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' }
]
const exportCode = computed(() => {
  const example = selectedExample.value
  if (!example) return ''
  if (exportFormat.value === 'css') {
    return example.css
  }
  if (exportFormat.value === 'json') {
    return JSON.stringify({ html: example.html, css: example.css }, null, 2)
  }
  return `${example.html}\n\n<style>\n${example.css}\n</style>`
})
const exportFileName = computed(() => `${selectedExample.value?.id ?? 'animation'}.${exportFormat.value}`)

const examplesWithComponents = animationExamples.map(example => ({
  ...example,
  component: defineAsyncComponent(example.component)
}))

const selectedExample = computed(() =>
  examplesWithComponents.find(example => example.id === route.params.id) ?? examplesWithComponents[0]
)

const title = computed(() => t(selectedExample.value.titleKey))
const description = computed(() => t(selectedExample.value.descriptionKey))

const snippet = computed(() =>
  selectedExample.value
    ? `${selectedExample.value.html}\n\n<style>\n${selectedExample.value.css}\n</style>`
    : ''
)

const highlightedCode = computed(() => {
  const value = snippet.value
  const escaped = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  return escaped
    .replace(
      /&lt;\/?([a-z0-9-]+)([^&]*?)&gt;/gi,
      (full: string, tagName: string, attrs: string) => {
        const isClosing = full.startsWith('&lt;/')
        const tagPrefix = isClosing ? '/' : ''
        const formattedAttrs = attrs.replace(
          /\s([a-z-:]+)=("[^"]*")/gi,
          (_attrFull: string, name: string, valueAttr: string) =>
            ` <span class="code-attr">${name}</span>=<span class="code-value">${valueAttr}</span>`
        )
        return `<span class="code-tag">&lt;${tagPrefix}${tagName}</span>${formattedAttrs}<span class="code-tag">&gt;</span>`
      }
    )
    .replace(/({|})/g, '<span class="code-brace">$1</span>')
})

async function handleCopy() {
  const ok = await copyToClipboard(snippet.value)
  if (ok) {
    copied.value = true
    toast.success(t('COMMON.COPIED_TO_CLIPBOARD'))
    setTimeout(() => (copied.value = false), 1500)
  }
}



async function handleSaveExample() {
  if (!selectedExample.value) return
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true
    return
  }

  saveContext.value = {
    defaultName: t(selectedExample.value.titleKey),
    payload: {
      html: selectedExample.value.html,
      css: selectedExample.value.css
    }
  }
  saveName.value = t(selectedExample.value.titleKey)
  showSaveModal.value = true
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

async function confirmSaveExample(name: string) {
  if (isAnimationSaved.value) return
  const context = saveContext.value
  if (!context) return

  const finalName = name || context.defaultName
  showSaveModal.value = false
  const allowed = await ensureProQuota('animation')
  if (!allowed) {
    return
  }
  savingExampleId.value = selectedExample.value?.id ?? null
  try {
    await createSave('animation', finalName, context.payload)
    toast.success(t('COMMON.SAVE_SUCCESS', { entity: entityLabel.value }))
    savedAnimationHashes.value.add(JSON.stringify(context.payload))
  } catch (error: any) {
    if (error?.status === 409) {
      toast.error(t('COMMON.ALREADY_SAVED', { entity: entityLabel.value }))
    } else {
      toast.error(
        error?.message || t('COMMON.SAVE_ERROR', { entity: entityLabel.value })
      )
    }
  } finally {
    savingExampleId.value = null
    saveContext.value = null
  }
}

function closeSaveModal() {
  showSaveModal.value = false
  saveContext.value = null
}

async function ensureProQuota(category: SaveCategory) {
  const quota = await evaluateSaveQuota(category)
  proQuota.value = quota
  if (!quota.allowed) {
    showProLimitModal.value = true
    return false
  }
  return true
}

function handleProLimitConfirm() {
  showProLimitModal.value = false
  router.push({
    path: `/${locale.value}/about`,
    query: { plan: 'premium' }
  })
}

async function loadSavedAnimations() {
  if (!authStore.isAuthenticated) {
    savedAnimationHashes.value = new Set()
    return
  }

  try {
    const saved = await listSaves('animation')
    savedAnimationHashes.value = new Set(saved.map((item: SavedItem) => JSON.stringify(item.payload)))
  } catch (error) {
    console.warn('Failed to load saved animations', error)
  }
}

function handleAuthConfirm() {
  showAuthModal.value = false
  router.push({
    name: `${locale.value}-login`,
    query: { redirect: route.fullPath }
  })
}

onMounted(() => {
  loadSavedAnimations()
})
</script>

<style lang="scss" scoped src="./animation-detail-page.scss"></style>
