<template>
  <div class="favicon-export">
    <div class="favicon-export__panel">
      <div class="favicon-export__toolbar">
        <h3 class="favicon-export__title">{{ t('FAVICON.EXPORT_TITLE') }}</h3>
        <div class="favicon-export__actions">
          <Select v-model="selectedTab" :options="tabOptions" />
          <Button
            size="sm"
            variant="outline"
            class="favicon-export__copy-button"
            :disabled="!hasContent"
            @click="handleCopy"
          >
            {{ copied ? t('COMMON.COPIED_TO_CLIPBOARD') : t('COMMON.COPY') }}
          </Button>
          <Button
            variant="primary"
            size="sm"
            class="favicon-export__download-button"
            :disabled="!hasContent"
            @click="handleDownloadAll"
          >
            {{ t('FAVICON.DOWNLOAD_ALL') }}
          </Button>
        </div>
      </div>

      <div class="favicon-export__code">
        <div class="favicon-export__window-controls">
          <span></span><span></span><span></span>
        </div>
        <pre class="favicon-export__content"><code>{{ currentCode }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from '@/shared/lib/toast'
import { copyToClipboard } from '@/shared/lib'
import { Button, Select, type SelectOption } from '@/shared/ui'

interface Props {
  htmlCode: string
  manifestJson: string
  hasContent: boolean
}

interface Emits {
  (e: 'download-all'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()
const toast = useToast()

const selectedTab = ref<string>('html')
const copied = ref(false)

const tabOptions = computed<SelectOption[]>(() => [
  { label: 'HTML', value: 'html' },
  { label: 'Manifest', value: 'manifest' }
])

const currentCode = computed(() => {
  if (selectedTab.value === 'html') {
    return props.htmlCode || t('FAVICON.NO_CODE_GENERATED')
  } else {
    return props.manifestJson || t('FAVICON.NO_CODE_GENERATED')
  }
})

async function handleCopy() {
  const success = await copyToClipboard(currentCode.value)
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

function handleDownloadAll() {
  emit('download-all')
}
</script>

<style lang="scss" scoped src="./favicon-export.scss"></style>
