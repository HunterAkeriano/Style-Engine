<template>
  <div class="auth-layout">
    <RouterView />
    <ChristmasGiftWidget />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ChristmasGiftWidget from '@/features/christmas-gift/ui/christmas-gift-widget/ChristmasGiftWidget.vue'
</script>

<style lang="scss" scoped src="./auth-layout.scss"></style>
