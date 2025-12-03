<template>
  <div :class="['textarea', { textarea_error: error, textarea_disabled: disabled }]">
    <label v-if="label" :for="textareaId" class="textarea__label">
      {{ label }}
      <span v-if="required" class="textarea__required">*</span>
    </label>

    <div class="textarea__wrapper">
      <textarea
        v-model="localValue"
        :id="textareaId"
        class="textarea__field"
        :placeholder="placeholder"
        :rows="rows"
        :disabled="disabled"
        :required="required"
      />
    </div>

    <span v-if="error" class="textarea__error">{{ error }}</span>
    <span v-else-if="hint" class="textarea__hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue: string
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  rows?: number
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  rows: 3,
  disabled: false,
  required: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const textareaId = ref(`textarea-${Math.random().toString(36).slice(2, 9)}`)

const localValue = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})
</script>

<style scoped lang="scss" src="./Textarea.scss"></style>
