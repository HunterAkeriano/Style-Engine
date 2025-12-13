<template>
  <Teleport to="body">
    <transition name="modal-pop">
      <div
        v-if="visible"
        ref="modalRef"
        role="dialog"
        aria-modal="true"
        class="modal"
        @click.self="handleBackdropClick"
      >
        <div :class="modalClass" class="modal__content">
          <div ref="cardRef" class="modal__card">
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
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock-upgrade'
import Button from '@/shared/ui/Button/Button.vue'

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
  lockScroll?: boolean
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
  buttonSize: 'md',
  lockScroll: true
})

const emit = defineEmits<{
  confirm: []
  close: []
  'update:visible': [value: boolean]
}>()

const modalClass = computed(() => `modal__card_${props.size}`)
const modalRef = ref<HTMLElement | null>(null)
const cardRef = ref<HTMLElement | null>(null)

function setScrollbarGap(isLocked: boolean) {
  const root = document.documentElement
  if (!root) return

  if (isLocked) {
    const gap = window.innerWidth - root.clientWidth
    if (gap > 0) {
      root.style.setProperty('--scrollbar-gap', `${gap}px`)
    }
  } else {
    root.style.removeProperty('--scrollbar-gap')
  }
}

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

watch(
  () => props.visible,
  async (isVisible) => {
    await nextTick()
    if (props.lockScroll) {
      const target = document.body
      if (isVisible) {
        setScrollbarGap(true)
        disableBodyScroll(target, { reserveScrollBarGap: true })
      } else {
        clearAllBodyScrollLocks()
        setScrollbarGap(false)
      }
    }
  }
)

onBeforeUnmount(() => {
  clearAllBodyScrollLocks()
  setScrollbarGap(false)
})
</script>

<style scoped lang="scss" src="./modal.scss"></style>
