<template>
  <div
    class="dropdown-menu"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <button
      class="dropdown-menu__trigger"
      :class="{ 'dropdown-menu__trigger_active': isOpen }"
    >
      {{ title }}
      <Icon
        :size="16"
        :class="{ 'dropdown-menu__icon_open': isOpen }"
        class="dropdown-menu__icon"
        name="icon-chevron-down"
      />
    </button>

    <transition name="dropdown-fade">
      <div
        v-if="isOpen"
        class="dropdown-menu__content"
        @click="handleContentClick"
      >
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@/shared/ui";

defineProps<{
  title: string;
}>();

const isOpen = ref(false);
let closeTimeout: NodeJS.Timeout | null = null;

function handleMouseEnter() {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }
  isOpen.value = true;
}

function handleMouseLeave() {
  closeTimeout = setTimeout(() => {
    isOpen.value = false;
  }, 200);
}

function handleContentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.tagName === "A" || target.closest("a")) {
    isOpen.value = false;
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  }
}
</script>

<style lang="scss" scoped src="./dropdown-menu.scss"></style>
