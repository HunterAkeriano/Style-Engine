<template>
  <div class="docs-layout">
    <Header />
    <main class="docs-layout__content">
      <RouterView />
    </main>
    <Footer />
    <ChristmasGiftWidget />
  </div>
</template>

<script setup lang="ts">
import Header from '@/widgets/common/header/Header.vue'
import Footer from '@/widgets/common/footer/Footer.vue'
import { RouterView } from 'vue-router'
import ChristmasGiftWidget from '@/features/christmas-gift/ui/christmas-gift-widget/ChristmasGiftWidget.vue'
</script>

<style lang="scss" scoped src="./docs-layout.scss"></style>
