<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="close">
        <div class="limit-modal">
          <button class="limit-modal__close" @click="close" :aria-label="t('PRICING.CLOSE')">
            <Icon name="icon-cross" :size="20" />
          </button>

          <div class="limit-modal__header">
            <div class="limit-modal__icon">
              <Icon name="icon-lock" :size="32" />
            </div>
            <h2 class="limit-modal__title">{{ t('PRICING.LIMIT_REACHED_TITLE') }}</h2>
            <p class="limit-modal__message">
              {{ t('PRICING.LIMIT_REACHED_MESSAGE', { limit: props.limit, type: templateTypeLabel }) }}
            </p>
            <p class="limit-modal__upgrade">
              {{ t('PRICING.LIMIT_UPGRADE_MESSAGE') }}
            </p>
          </div>

          <div class="limit-modal__actions">
            <Button
              variant="primary"
              size="lg"
              @click="goToPlans"
            >
              {{ t('PRICING.VIEW_PLANS') }}
            </Button>

            <span class="limit-modal__separator">{{ t('PRICING.OR') }}</span>

            <Button
              variant="secondary"
              size="lg"
              @click="manageTemplates"
            >
              {{ t('PRICING.DELETE_TEMPLATE') }}
            </Button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Icon, Button } from '@/shared/ui'

interface Props {
  isOpen: boolean
  limit: number
  templateType: 'gradient' | 'shadow' | 'animation'
}

interface Emits {
  (e: 'close'): void
  (e: 'manage'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const { t, locale } = useI18n()
const router = useRouter()

const templateTypeLabel = computed(() => {
  const types = {
    gradient: t('GRADIENT.TITLE').toLowerCase(),
    shadow: t('SHADOW.TITLE').toLowerCase(),
    animation: t('ANIMATION.TITLE').toLowerCase()
  }
  return types[props.templateType]
})

function close() {
  emit('close')
}

function goToPlans() {
  close()
  router.push(`/${locale.value}/about`)
}

function manageTemplates() {
  emit('manage')
  close()
}
</script>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: $space-lg;
}

.limit-modal {
  position: relative;
  max-width: 560px;
  width: 100%;
  background: color-var-alpha('surface-panel-2', 0.98);
  border-radius: $border-radius-2xl;
  padding: $space-2xl;
  border: 1px solid color-var-alpha('panel-border', 0.3);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.4);

  @media (max-width: 480px) {
    padding: $space-xl;
    max-width: 100%;
  }

  &__close {
    position: absolute;
    top: $space-lg;
    right: $space-lg;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: $border-radius-md;
    color: $color-text-secondary;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;

    &:hover {
      background: color-var-alpha('color-text-primary', 0.1);
      color: $color-text-primary;
    }
  }

  &__header {
    text-align: center;
    margin-bottom: $space-2xl;
  }

  &__icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: $border-radius-full;
    background: linear-gradient(135deg, $color-primary, $color-accent);
    margin-bottom: $space-lg;
    color: white;
  }

  &__title {
    font-size: $font-size-2xl;
    font-weight: $font-weight-bold;
    color: $color-text-primary;
    margin: 0 0 $space-md 0;

    @media (max-width: 480px) {
      font-size: $font-size-xl;
    }
  }

  &__message {
    font-size: $font-size-base;
    color: $color-text-secondary;
    margin: 0 0 $space-sm 0;
    line-height: 1.6;

    @media (max-width: 480px) {
      font-size: $font-size-sm;
    }
  }

  &__upgrade {
    font-size: $font-size-base;
    color: $color-text-primary;
    margin: 0;
    font-weight: $font-weight-medium;

    @media (max-width: 480px) {
      font-size: $font-size-sm;
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    gap: $space-md;
    align-items: center;
  }

  &__separator {
    font-size: $font-size-sm;
    color: $color-text-tertiary;
    text-transform: uppercase;
    font-weight: $font-weight-semibold;
    letter-spacing: 0.1em;
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;

  .limit-modal {
    transition: transform 0.3s ease, opacity 0.3s ease;
  }
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;

  .limit-modal {
    transform: scale(0.95);
    opacity: 0;
  }
}
</style>
