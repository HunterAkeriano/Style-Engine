<template>
  <div class="code-export">
    <div class="code-export__header">
      <h3 class="code-export__title">Экспорт кода</h3>
      <Select
        v-model="selectedFormat"
        :options="formatOptions"
      />
    </div>

    <div class="code-export__code">
      <pre class="code-export__content">{{ code }}</pre>
      <Button
        variant="primary"
        size="sm"
        class="code-export__copy-button"
        @click="handleCopy"
      >
        {{ copied ? '✓ Скопировано' : 'Копировать' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGradientStore } from '@/features'
import { Button, Select, type SelectOption } from '@/shared/ui'
import { copyToClipboard, type CSSFormat } from '@/shared/lib'

const gradientStore = useGradientStore()
const selectedFormat = ref<CSSFormat>('css')
const copied = ref(false)

const formatOptions: SelectOption[] = [
  { label: 'CSS', value: 'css' },
  { label: 'SCSS', value: 'scss' },
  { label: 'Sass', value: 'sass' },
  { label: 'Stylus', value: 'stylus' },
  { label: 'Inline', value: 'inline' }
]

const code = computed(() => {
  return gradientStore.getCode(selectedFormat.value)
})

async function handleCopy() {
  const success = await copyToClipboard(code.value)
  if (success) {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>

<style lang="scss" scoped>
.code-export {
  display: flex;
  flex-direction: column;
  gap: $space-md;
}

.code-export__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: $space-md;
}

.code-export__title {
  font-size: $font-size-lg;
  font-weight: $font-weight-semibold;
  color: $color-text-primary;
}

.code-export__code {
  position: relative;
  background: $color-dark-bg-secondary;
  border-radius: $border-radius-lg;
  padding: $space-lg;
  overflow-x: auto;
}

.code-export__content {
  margin: 0;
  font-family: $font-family-mono;
  font-size: $font-size-sm;
  color: $color-dark-text-primary;
  white-space: pre-wrap;
  word-break: break-all;
}

.code-export__copy-button {
  position: absolute;
  top: $space-md;
  right: $space-md;
}
</style>
