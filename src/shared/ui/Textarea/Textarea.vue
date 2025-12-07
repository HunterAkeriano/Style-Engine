<template>
  <div :class="['textarea', { textarea_error: mergedError, textarea_disabled: disabled }]">
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

    <span v-if="mergedError" class="textarea__error">{{ mergedError }}</span>
    <span v-else-if="hint" class="textarea__hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFormContext } from '@/shared/lib/form/zodForm'

interface Props {
  modelValue: string
  name?: string
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
const form = useFormContext()
const field = props.name && form ? form.registerField(props.name) : null

const localValue = computed({
  get: () => (field ? field.value.value : props.modelValue),
  set: value => {
    if (field) {
      field.setValue(value)
    }
    emit('update:modelValue', value)
  }
})

const mergedError = computed(() => props.error || field?.error.value || '')
</script>

<style scoped lang="scss" src="./Textarea.scss"></style>
