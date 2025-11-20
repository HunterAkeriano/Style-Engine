<template>
  <button
    :class="['button', `button--${variant}`, `button--${size}`, { 'button--disabled': disabled }]"
    :disabled="disabled"
    :type="type"
    @click="handleClick"
  >
    <span v-if="$slots.icon" class="button__icon">
      <slot name="icon" />
    </span>
    <span class="button__text">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonType = 'button' | 'submit' | 'reset'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  type?: ButtonType
  disabled?: boolean
}

interface Emits {
  (e: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false
})

const emit = defineEmits<Emits>()

function handleClick(event: MouseEvent) {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style lang="scss" scoped src="./Button.scss"></style>
