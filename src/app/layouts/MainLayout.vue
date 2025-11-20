<template>
  <div class="main-layout">
    <Header />
    <main class="main-layout__content">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/widgets/header/Header.vue'
</script>

<style lang="scss" scoped src="./MainLayout.scss"></style>
