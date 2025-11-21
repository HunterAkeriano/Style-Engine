<template>
  <div class="main-layout">
    <Header />
    <main class="main-layout__content">
      <RouterView />
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '@/widgets/common/header/Header.vue'
import Footer from '@/widgets/common/footer/Footer.vue'
import { RouterView } from 'vue-router'
</script>

<style lang="scss" scoped src="./main-layout.scss"></style>
