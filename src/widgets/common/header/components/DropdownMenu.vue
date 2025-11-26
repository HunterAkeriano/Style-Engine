<template>
  <div class="dropdown-menu" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <button class="dropdown-menu__trigger" :class="{ 'dropdown-menu__trigger_active': isOpen }">
      {{ title }}
      <Icon
        :size="16"
        :class="{ 'dropdown-menu__icon_open': isOpen }"
        class="dropdown-menu__icon"
        name="icon-chevron-down"
      />
    </button>

    <transition name="dropdown-fade">
      <div v-if="isOpen" class="dropdown-menu__content">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Icon } from '@/shared/ui'

defineProps<{
  title: string
}>()

const isOpen = ref(false)
let closeTimeout: NodeJS.Timeout | null = null

function handleMouseEnter() {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  isOpen.value = true
}

function handleMouseLeave() {
  closeTimeout = setTimeout(() => {
    isOpen.value = false
  }, 200)
}
</script>

<style lang="scss" scoped>
.dropdown-menu {
  position: relative;
  display: inline-block;

  &__trigger {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 1rem;
    background: transparent;
    border: none;
    color: var(--text-primary);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    border-radius: 8px;
    transition: all 0.2s;

    &:hover,
    &_active {
      background: var(--bg-secondary);
      color: var(--accent-primary);
    }
  }

  &__icon {
    transition: transform 0.2s;

    &_open {
      transform: rotate(180deg);
    }
  }

  &__content {
    position: absolute;
    top: calc(100% + 0.5rem);
    left: 0;
    min-width: 200px;
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    padding: 0.5rem;
    z-index: 1000;

    :deep(.header__nav-link) {
      display: block;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      transition: all 0.2s;
      white-space: nowrap;

      &:hover {
        background: var(--bg-tertiary);
        color: var(--accent-primary);
      }
    }
  }
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
