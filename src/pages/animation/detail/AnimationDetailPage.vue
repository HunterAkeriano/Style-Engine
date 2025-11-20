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
            <Button variant="ghost" size="sm" @click="handleShare">
              {{ t('ANIMATION.SHARE') }}
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Button, NavLink } from '@/shared/ui'
import { copyToClipboard } from '@/shared/lib'
import { useToast } from 'vue-toastification'
import { animationExamples } from '../examples/examplesData'

const route = useRoute()
const { t } = useI18n()
const copied = ref(false)
const toast = useToast()

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

async function handleShare() {
  if (!selectedExample.value) return
  const payload = snippet.value
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Style Engine — ${t(selectedExample.value.titleKey)}`,
        text: payload
      })
      return
    } catch {
      /* fallback to copy */
    }
  }
  await handleCopy()
}
</script>

<style lang="scss" scoped src="./AnimationDetailPage.scss"></style>
