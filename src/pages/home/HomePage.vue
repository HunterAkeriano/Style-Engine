<template>
  <div class="home-page">
    <HomeHero />
    <HomeAbout />
    <HomeFeatures />
    <HomeShowcase />
    <HomeTech />
  </div>
</template>

<script setup lang="ts">
import { HomeHero, HomeAbout, HomeFeatures, HomeShowcase, HomeTech } from '@/widgets/home'
</script>

<style lang="scss" scoped src="./home-page.scss"></style>
