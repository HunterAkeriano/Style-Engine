<template>
  <router-link to="/" class="logo">
    <svg class="logo__icon" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="32" height="32" rx="8" fill="url(#logo-gradient)" />
      <path d="M12 16 L20 12 L28 16 L28 24 L20 28 L12 24 Z" fill="white" fill-opacity="0.9" />
      <circle cx="20" cy="20" r="4" fill="url(#logo-gradient)" />
    </svg>
    <span v-if="showText" class="logo__text">CSS Lab</span>
  </router-link>
</template>

<script setup lang="ts">
interface Props {
  showText?: boolean
}

withDefaults(defineProps<Props>(), {
  showText: true
})
</script>

<style lang="scss" scoped src="./Logo.scss"></style>
