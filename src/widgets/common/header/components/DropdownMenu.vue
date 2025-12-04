<template>
  <div
      :class="{'dropdown-menu_first': props.isFirst}"
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
import { computed, inject, ref, type Ref } from "vue";
import { Icon } from "@/shared/ui";

const props = defineProps<{
  title: string;
  id: string;
  isFirst?: boolean;
}>();

const activeDropdownId = inject<Ref<string | null>>('activeDropdownId', ref(null));
const setActiveDropdown = inject<(id: string | null) => void>('setActiveDropdown', () => {});

const isOpen = computed(() => activeDropdownId.value === props.id);
let closeTimeout: NodeJS.Timeout | null = null;

function handleMouseEnter() {
  if (closeTimeout) {
    clearTimeout(closeTimeout);
    closeTimeout = null;
  }
  setActiveDropdown(props.id);
}

function handleMouseLeave() {
  closeTimeout = setTimeout(() => {
    if (activeDropdownId.value === props.id) {
      setActiveDropdown(null);
    }
  }, 200);
}

function handleContentClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.tagName === "A" || target.closest("a")) {
    setActiveDropdown(null);
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  }
}
</script>

<style lang="scss" scoped src="./dropdown-menu.scss"></style>
