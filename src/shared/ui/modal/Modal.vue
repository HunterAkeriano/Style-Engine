<template>
  <transition name="fade">
    <div v-if="visible" role="dialog" aria-modal="true" class="modal" @click.self="handleBackdropClick">
      <div class="modal__backdrop"></div>
      <div class="modal__card" :class="modalClass">
        <button v-if="closable" type="button" aria-label="Close" class="modal__close" @click="handleClose">
          ×
        </button>
        <div v-if="$slots.header || title" class="modal__header">
          <slot name="header">
            <h2 class="modal__title">{{ title }}</h2>
            <p v-if="subtitle" class="modal__subtitle">{{ subtitle }}</p>
          </slot>
        </div>
        <div class="modal__body">
          <slot></slot>
        </div>
        <div v-if="$slots.footer || showActions" class="modal__footer">
          <slot name="footer">
            <div class="modal__actions">
              <Button
                v-if="showCancel"
                :size="buttonSize"
                variant="ghost"
                @click="handleClose"
              >
                {{ cancelText }}
              </Button>
              <Button
                v-if="showConfirm"
                :variant="confirmVariant"
                :size="buttonSize"
                :disabled="confirmDisabled"
                @click="handleConfirm"
              >
                {{ confirmText }}
              </Button>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from '@/shared/ui/button/Button.vue'

interface Props {
  visible: boolean
  title?: string
  subtitle?: string
  size?: 'sm' | 'md' | 'lg'
  closable?: boolean
  closeOnBackdrop?: boolean
  showActions?: boolean
  showConfirm?: boolean
  showCancel?: boolean
  confirmText?: string
  cancelText?: string
  confirmVariant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  confirmDisabled?: boolean
  buttonSize?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  closable: true,
  closeOnBackdrop: true,
  showActions: false,
  showConfirm: true,
  showCancel: true,
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmVariant: 'primary',
  confirmDisabled: false,
  buttonSize: 'md'
})

const emit = defineEmits<{
  confirm: []
  close: []
  'update:visible': [value: boolean]
}>()

const modalClass = computed(() => `modal__card_${props.size}`)

function handleConfirm() {
  emit('confirm')
}

function handleClose() {
  emit('close')
  emit('update:visible', false)
}

function handleBackdropClick() {
  if (props.closeOnBackdrop) {
    handleClose()
  }
}
</script>

<style scoped lang="scss" src="./modal.scss"></style>
