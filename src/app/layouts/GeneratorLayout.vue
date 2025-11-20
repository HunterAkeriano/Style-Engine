<template>
  <div class="generator-layout">
    <Header />
    <main class="generator-layout__content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/widgets/header/Header.vue'
</script>

<style lang="scss" scoped src="./GeneratorLayout.scss"></style>
