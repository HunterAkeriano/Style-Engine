<template>
  <div
    ref="selectRef"
    :class="[
      'select',
      {
        'select_error': mergedError,
        'select_disabled': disabled,
        'select_open': isOpen,
        'select_drop-up': isDropUp
      }
    ]"
  >
    <label v-if="label" class="select__label">
      {{ label }}
      <span v-if="required" class="select__required">*</span>
    </label>

    <div class="select__wrapper">
      <button
        :disabled="disabled"
        type="button"
        class="select__control"
        @click="toggleDropdown"
        @keydown.enter.prevent="toggleDropdown"
        @keydown.space.prevent="toggleDropdown"
        @keydown.esc.prevent="closeDropdown"
      >
        <span :class="['select__value', { 'select__value_placeholder': !selectedOption }]">
          {{ selectedOption?.label ?? placeholder ?? 'Выберите значение' }}
        </span>

        <Icon
          :size="14"
          :class="['select__chevron', { 'select__chevron_open': isOpen, 'select__chevron_drop-up': isDropUp }]"
          name="icon-chevron-down"
        />
      </button>

      <transition name="select-dropdown">
        <div
          v-if="isOpen"
          ref="dropdownRef"
          class="select__dropdown"
        >
          <button
            v-for="option in options"
            :key="option.value"
            :class="['select__option', { 'select__option_active': option.value === selectValue }]"
            type="button"
            @click="handleSelect(option.value)"
          >
            {{ option.label }}
          </button>
        </div>
      </transition>
    </div>

    <span v-if="mergedError" class="select__error">{{ mergedError }}</span>
    <span v-else-if="hint" class="select__hint">{{ hint }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useFormContext } from '@/shared/lib/form/zodForm'
import Icon from '@/shared/ui/Icon/Icon.vue'
import type { SelectOption } from './types'

interface Props {
  modelValue: string | number
  options: SelectOption[]
  label?: string
  placeholder?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
  name?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  modelValue: ''
})

const emit = defineEmits<Emits>()

const selectRef = ref<HTMLElement | null>(null)
const dropdownRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const isDropUp = ref(false)
const form = useFormContext()
const field = props.name && form ? form.registerField(props.name) : null

const selectValue = computed({
  get: () => (field ? field.value.value : props.modelValue),
  set: (value: string | number) => {
    if (field) {
      field.setValue(value)
    }
    emit('update:modelValue', value)
  }
})

const selectedOption = computed(() => {
  return props.options.find(option => option.value === selectValue.value)
})

function handleSelect(value: string | number) {
  selectValue.value = value
  emit('change', value)
  closeDropdown()
}

function toggleDropdown() {
  if (props.disabled) return
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (!selectRef.value) return
  if (!selectRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

function updateDirection() {
  if (!selectRef.value) return
  const rect = selectRef.value.getBoundingClientRect()
  const dropdownHeight = dropdownRef.value?.offsetHeight ?? 0
  const spaceBelow = window.innerHeight - rect.bottom
  const spaceAbove = rect.top

  if (dropdownHeight === 0) {
    isDropUp.value = spaceBelow < 200 && spaceAbove > spaceBelow
    return
  }

  isDropUp.value = rect.bottom + dropdownHeight > window.innerHeight && spaceAbove > spaceBelow
}

watch(isOpen, async (open) => {
  if (open) {
    document.addEventListener('click', handleClickOutside)
    await nextTick()
    updateDirection()
  } else {
    document.removeEventListener('click', handleClickOutside)
  }
})

onMounted(() => {
  window.addEventListener('resize', updateDirection)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('resize', updateDirection)
})

const mergedError = computed(() => props.error || field?.error.value || '')
</script>

<style lang="scss" scoped src="./Select.scss"></style>
