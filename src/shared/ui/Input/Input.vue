<template>
  <div :class="['input', { 'input--error': error, 'input--disabled': disabled }]">
    <label v-if="label" :for="inputId" class="input__label">
      {{ label }}
      <span v-if="required" class="input__required">*</span>
    </label>

    <div class="input__wrapper">
      <span v-if="$slots.prefix" class="input__prefix">
        <slot name="prefix" />
      </span>

      <input
        v-model="inputValue"
        :id="inputId"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :readonly="readonly"
        :autocomplete="autocomplete"
        class="input__field"
        @blur="handleBlur"
        @focus="handleFocus"
      />

      <button
        v-if="isPassword && showToggle"
        :aria-label="isPasswordVisible ? 'Hide password' : 'Show password'"
        type="button"
        class="input__toggle"
        @click="toggleVisibility"
      >
        <Icon v-if="!isPasswordVisible" name="icon-eye" size="18" class="input__toggle-icon" />
        <Icon v-else name="icon-eye-off" size="18" class="input__toggle-icon" />
      </button>

      <span v-if="$slots.suffix" class="input__suffix">
        <slot name="suffix" />
      </span>
    </div>

    <span v-if="error" class="input__error">{{ error }}</span>
    <span v-else-if="hint" class="input__hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@/shared/ui/Icon/Icon.vue'

interface Props {
  modelValue: string | number
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  readonly?: boolean
  autocomplete?: string
  showPasswordToggle?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur', event: FocusEvent): void
  (e: 'focus', event: FocusEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  readonly: false,
  autocomplete: 'off'
})

const emit = defineEmits<Emits>()

const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`)
const isPasswordVisible = ref(false)
const isPassword = computed(() => props.type === 'password')
const showToggle = computed(() => props.showPasswordToggle ?? isPassword.value)
const inputType = computed(() => {
  if (isPassword.value && isPasswordVisible.value) {
    return 'text'
  }
  return props.type
})

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function toggleVisibility() {
  if (!isPassword.value) return
  isPasswordVisible.value = !isPasswordVisible.value
}
</script>

<style lang="scss" scoped src="./Input.scss"></style>
