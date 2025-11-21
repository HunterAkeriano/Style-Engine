<template>
  <div class="code-export">
    <div class="code-export__panel">
      <div class="code-export__toolbar">
        <h3 class="code-export__title">{{ t('SHADOW.EXPORT_TITLE') }}</h3>
        <div class="code-export__actions">
          <Select
            v-model="selectedFormat"
            :options="formatOptions"
          />
          <Button
            variant="outline"
            size="sm"
            class="code-export__copy-button"
            @click="handleCopy"
          >
            {{ copied ? `✓ ${t('SHADOW.COPIED')}` : t('SHADOW.COPY') }}
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
import { useToast } from 'vue-toastification'
import { Button, Select, type SelectOption } from '@/shared/ui'
import { copyToClipboard, type CSSFormat } from '@/shared/lib'

interface Props {
  getCode: (format: CSSFormat) => string
}

const props = defineProps<Props>()
const { t } = useI18n()
const toast = useToast()

const selectedFormat = ref<CSSFormat>('css')
const copied = ref(false)

const formatOptions: SelectOption[] = [
  { label: 'CSS', value: 'css' },
  { label: 'SCSS', value: 'scss' },
  { label: 'Sass', value: 'sass' },
  { label: 'Stylus', value: 'stylus' },
  { label: 'Inline', value: 'inline' }
]

const code = computed(() => props.getCode(selectedFormat.value))

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
</script>

<style lang="scss" scoped src="./ShadowCodeExport.scss"></style>
