<template>
  <div class="generator-layout">
    <Header />
    <main class="generator-layout__content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from '@/widgets/header/Header.vue'
import { RouterView } from 'vue-router'
</script>

<style lang="scss" scoped src="./GeneratorLayout.scss"></style>
