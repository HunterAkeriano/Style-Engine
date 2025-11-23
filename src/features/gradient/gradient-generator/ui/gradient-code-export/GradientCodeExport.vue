<template>
  <div class="code-export">
    <div class="code-export__panel">
      <div class="code-export__toolbar">
        <h3 class="code-export__title">{{ t('GRADIENT.EXPORT_TITLE') }}</h3>
        <div class="code-export__actions">
          <Select
            v-model="selectedFormat"
            :options="formatOptions"
          />
          <Button
            size="sm"
            variant="outline"
            class="code-export__copy-button"
            @click="handleCopy"
          >
            {{ copied ? `✓ ${t('GRADIENT.COPIED')}` : t('GRADIENT.COPY') }}
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="code-export__download-button"
            @click="downloadCode"
          >
            {{ t('COMMON.DOWNLOAD') }}
          </Button>
          <Button
            size="sm"
            variant="primary"
            v-if="props.showSaveButton !== false"
            @click="emit('save')"
          >
            {{ t('GRADIENT.SAVE') }}
          </Button>
        </div>
      </div>

      <div class="code-export__code">
        <div class="code-export__window-controls">
          <span></span><span></span><span></span>
        </div>
        <pre class="code-export__content"><code>{{ code }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/shared/lib/toast'
import { Button, Select, type SelectOption } from '@/shared/ui'
import { copyToClipboard, type CSSFormat } from '@/shared/lib'

interface Props {
  getCode: (format: CSSFormat) => string
  filename?: string
  showSaveButton?: boolean
  allowExport?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  allowExport: true
})
const emit = defineEmits<{
  save: []
  'blocked-export': []
}>()
const { t } = useI18n()
const toast = useToast()

const selectedFormat = ref<CSSFormat>('css')
const copied = ref(false)
const extensionMap: Record<CSSFormat, string> = {
  css: 'css',
  scss: 'scss',
  sass: 'sass',
  stylus: 'styl',
  inline: 'txt',
  tailwind: 'css'
}

const formatOptions: SelectOption[] = [
  { label: 'CSS', value: 'css' },
  { label: 'SCSS', value: 'scss' },
  { label: 'Sass', value: 'sass' },
  { label: 'Stylus', value: 'stylus' },
  { label: 'Inline', value: 'inline' }
]

const code = computed(() => {
  return props.getCode(selectedFormat.value)
})

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
  const ext = extensionMap[selectedFormat.value] ?? 'txt'
  const filename = `${props.filename ?? 'gradient'}.${ext}`
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
</script>

<style lang="scss" scoped src="./gradient-code-export.scss"></style>
