<template>
  <router-link to="/" class="logo">
    <Icon name="icon-logo" :size="40" class="logo__icon" />

    <span v-if="!props.notShow" class="logo__text">
      <span class="logo__text-css">CSS-Zone</span>
    </span>
  </router-link>
</template>

<script setup lang="ts">
import Icon from "@/shared/ui/Icon/Icon.vue";

interface Props {
  notShow?: boolean;
}

const props = defineProps<Props>();
</script>

<style lang="scss" scoped src="./Logo.scss"></style>
