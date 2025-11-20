<template>
  <div :class="['select', { 'select--error': error, 'select--disabled': disabled }]">
    <label v-if="label" :for="selectId" class="select__label">
      {{ label }}
      <span v-if="required" class="select__required">*</span>
    </label>

    <div class="select__wrapper">
      <select
        :id="selectId"
        v-model="selectValue"
        :disabled="disabled"
        :required="required"
        class="select__field"
        @change="handleChange"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>

      <span class="select__icon">▼</span>
    </div>

    <span v-if="error" class="select__error">{{ error }}</span>
    <span v-else-if="hint" class="select__hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

export interface SelectOption {
  label: string
  value: string | number
}

interface Props {
  modelValue: string | number
  options: SelectOption[]
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false
})

const emit = defineEmits<Emits>()

const selectId = ref(`select-${Math.random().toString(36).substr(2, 9)}`)

const selectValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  emit('change', target.value)
}
</script>

<style lang="scss" scoped src="./Select.scss"></style>
