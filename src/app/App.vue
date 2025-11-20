<template>
  <div class="app">
    <component :is="layout">
      <RouterView />
    </component>


    <Sprite />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { MainLayout, AuthLayout, GeneratorLayout } from './layouts'
import { Sprite } from '@/shared/ui'
import { useTheme, useViewportHeight } from '@/shared/composables'

const route = useRoute()
useTheme()
useViewportHeight()

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
  min-height: calc(var(--app-vh, 1vh) * 100);
}
</style>
