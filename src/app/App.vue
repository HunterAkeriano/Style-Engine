<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { MainLayout, AuthLayout, GeneratorLayout } from './layouts'

const route = useRoute()

const layouts = {
  MainLayout,
  AuthLayout,
  GeneratorLayout
}

const layout = computed(() => {
  const layoutName = route.meta.layout as keyof typeof layouts
  return layouts[layoutName] || MainLayout
})
</script>

<style lang="scss">
.app {
  width: 100%;
  min-height: 100vh;
}
</style>
