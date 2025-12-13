<template>
  <div class="code-export">
    <div class="code-export__panel">
      <div class="code-export__toolbar">
        <h3 class="code-export__title">{{ title }}</h3>
        <div class="code-export__actions">
          <Select v-model="selectedFormat" :options="formatOptionsInternal" />
          <Button
            size="sm"
            variant="outline"
            class="code-export__copy-button"
            @click="handleCopy"
          >
            {{ copied ? copiedLabelText : copyLabelText }}
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="code-export__download-button"
            @click="downloadCode"
          >
            {{ downloadLabelText }}
          </Button>
          <Button
            size="sm"
            variant="primary"
            v-if="showSaveButton"
            @click="emit('save')"
          >
            {{ saveLabelText }}
          </Button>
        </div>
      </div>

      <div class="code-export__code">
        <div class="code-export__window-controls">
          <span></span><span></span><span></span>
        </div>
        <pre class="code-export__content"><code v-html="highlightedCode"></code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/shared/lib/toast'
import { copyToClipboard } from '@/shared/lib'
import { Button, Select, type SelectOption } from '@/shared/ui'

interface Props {
  title: string
  getCode: (format: string | number) => string
  filename?: string
  showSaveButton?: boolean
  allowExport?: boolean
  formatOptions?: SelectOption[]
  extensionMap?: Record<string, string>
  defaultFormat?: string | number
  copyLabel?: string
  copiedLabel?: string
  downloadLabel?: string
  saveLabel?: string
}

const defaultFormatOptions: SelectOption[] = [
  { label: 'CSS', value: 'css' },
  { label: 'SCSS', value: 'scss' },
  { label: 'Sass', value: 'sass' },
  { label: 'Stylus', value: 'stylus' },
  { label: 'Inline', value: 'inline' }
]

const defaultExtensionMap: Record<string, string> = {
  css: 'css',
  scss: 'scss',
  sass: 'sass',
  stylus: 'styl',
  inline: 'txt',
  tailwind: 'css'
}

const props = withDefaults(defineProps<Props>(), {
  showSaveButton: true,
  allowExport: true
})
const emit = defineEmits<{
  save: []
  'blocked-export': []
}>()

const { t } = useI18n()
const toast = useToast()

const formatOptionsInternal = computed(() =>
  props.formatOptions?.length ? props.formatOptions : defaultFormatOptions
)
const selectedFormat = ref<string | number>(
  props.defaultFormat ?? formatOptionsInternal.value[0]?.value ?? 'css'
)

watch(
  () => props.defaultFormat,
  value => {
    if (value !== undefined && value !== null) {
      selectedFormat.value = value
    }
  }
)

const copyLabelText = computed(() => props.copyLabel ?? t('COMMON.COPY'))
const copiedLabelText = computed(() => props.copiedLabel ?? t('COMMON.COPIED_TO_CLIPBOARD'))
const downloadLabelText = computed(() => props.downloadLabel ?? t('COMMON.DOWNLOAD'))
const saveLabelText = computed(() => props.saveLabel ?? t('COMMON.SAVE'))

const code = computed(() => props.getCode(String(selectedFormat.value)))
const copied = ref(false)
const highlightedCode = computed(() =>
  highlightCssLike(code.value)
)

async function handleCopy() {
  const success = await copyToClipboard(code.value)
  if (success) {
    copied.value = true
    toast.success(t('COMMON.COPIED_TO_CLIPBOARD'))
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } else {
    toast.error(t('COMMON.COPY_FAILED'))
  }
}

function downloadCode() {
  const extMap = props.extensionMap ?? defaultExtensionMap
  const ext = extMap[String(selectedFormat.value)] ?? 'txt'
  const filename = `${props.filename ?? 'snippet'}.${ext}`
  const blob = new Blob([code.value], { type: 'text/plain' })
  if (!props.allowExport) {
    emit('blocked-export')
    return
  }
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

function highlightCssLike(raw: string): string {
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  let highlighted = escapeHtml(raw)

  const patterns: { regex: RegExp; className: string }[] = [
    { regex: /\/\*[\s\S]*?\*\//g, className: 'token comment' },
    { regex: /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g, className: 'token string' },
    { regex: /(#(?:[0-9a-fA-F]{3,8}))/g, className: 'token color' },
    { regex: /\b(@[a-z-]+)/gi, className: 'token at-rule' },
    { regex: /\b(\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|fr|deg|s|ms)?)\b/g, className: 'token number' },
    {
      regex: /\b(var|calc|clamp|min|max|repeat|linear-gradient|rgba?|hsla?|url|inset)\b/g,
      className: 'token function'
    },
    { regex: /\b([a-z-]+)(?=\s*:)/g, className: 'token property' },
    { regex: /([{};:,])/g, className: 'token punctuation' }
  ]

  patterns.forEach(({ regex, className }) => {
    highlighted = highlighted.replace(regex, `<span class="${className}">$1</span>`)
  })

  highlighted = highlighted.replace(
    /(^|\n)\s*([^@{}\n][^{\n]+?)(?=\s*\{)/g,
    (_, prefix, selector) => `${prefix}<span class="token selector">${selector.trim()}</span>`
  )

  return highlighted
}
</script>

<style lang="scss" src="./code-export.scss"></style>
