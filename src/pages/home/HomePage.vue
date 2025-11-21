<template>
  <div class="home-page">
    <HomeHero />
    <HomeAbout />
    <HomeFeatures />
    <HomeShowcase />
  </div>
</template>

<script setup lang="ts">
import { HomeHero, HomeAbout, HomeFeatures, HomeShowcase } from '@/widgets/home'
</script>

<style lang="scss" scoped src="./home-page.scss"></style>
