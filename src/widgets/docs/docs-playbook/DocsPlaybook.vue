<template>
  <section class="docs-playbook">
    <div class="docs-playbook__head">
      <p class="docs-playbook__eyebrow">{{ eyebrow }}</p>
      <h2 class="docs-playbook__title">{{ title }}</h2>
      <p class="docs-playbook__subtitle">{{ subtitle }}</p>
    </div>

    <div class="docs-playbook__grid">
      <div v-for="snippet in snippets" :key="snippet.title" class="docs-snippet">
        <div
          class="docs-snippet__preview"
          :class="{
            'docs-snippet__preview_card': snippet.preview === 'card',
            'docs-snippet__preview_marquee': snippet.preview === 'marquee',
            'docs-snippet__preview_pulse': snippet.preview === 'pulse'
          }"
        >
          <template v-if="snippet.preview === 'card'">
            <div class="docs-snippet__shine"></div>
            <div class="docs-snippet__chip"></div>
            <div class="docs-snippet__rows">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </template>

          <template v-else-if="snippet.preview === 'marquee'">
            <div class="docs-snippet__track">
              <span v-for="n in 6" :key="n">animate • gradient • shadow</span>
            </div>
          </template>

          <template v-else>
            <div class="docs-snippet__pulse"></div>
            <div class="docs-snippet__pulse docs-snippet__pulse_delayed"></div>
          </template>
        </div>
        <div class="docs-snippet__body">
          <h3>{{ snippet.title }}</h3>
          <p>{{ snippet.description }}</p>
          <div class="docs-snippet__code">
            <pre><code>{{ snippet.code }}</code></pre>
            <Button variant="ghost" size="sm" @click="copy(snippet.code)">
              {{ copyLabel }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import type { DocsSnippet } from '@/pages/docs/model/content'
import { Button } from '@/shared/ui'
import { copyToClipboard } from '@/shared/lib'

defineProps<{
  eyebrow: string
  title: string
  subtitle: string
  snippets: DocsSnippet[]
}>()

const { t } = useI18n()
const toast = useToast()
const copyLabel = computed(() => t('DOCS.COPY'))

async function copy(code: string) {
  const ok = await copyToClipboard(code)
  toast[ok ? 'success' : 'error'](t(ok ? 'COMMON.COPIED_TO_CLIPBOARD' : 'COMMON.COPY_FAILED'))
}
</script>

<style lang="scss" scoped src="./docs-playbook.scss"></style>
