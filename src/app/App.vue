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
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { MainLayout, AuthLayout, GeneratorLayout } from './layouts'
import { Sprite } from '@/shared/ui'
import { useTheme, useViewportHeight } from '@/shared/composables'

const route = useRoute()
const { t, locale } = useI18n()
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

const DEFAULT_ROBOTS = 'index, follow'

useHead(() => {
  const titleKey = route.meta.titleKey as string | undefined
  const descriptionKey = route.meta.descriptionKey as string | undefined

  const title = titleKey ? t(titleKey) : (route.meta.title as string | undefined)
  const description = descriptionKey
    ? t(descriptionKey)
    : (route.meta.description as string | undefined)
  const robots = (route.meta.robots as string | undefined) || DEFAULT_ROBOTS
  const url = typeof window !== 'undefined' ? `${window.location.origin}${route.fullPath}` : ''

  const meta = [
    description && { name: 'description', content: description },
    robots && { name: 'robots', content: robots },
    title && { property: 'og:title', content: title },
    description && { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    url && { property: 'og:url', content: url },
    locale.value && { property: 'og:locale', content: locale.value }
  ].filter(Boolean) as { name?: string; property?: string; content: string }[]

  const link = url ? [{ rel: 'canonical', href: url }] : []

  return {
    title,
    meta,
    link
  }
})
</script>

<style lang="scss" src="./App.scss"></style>