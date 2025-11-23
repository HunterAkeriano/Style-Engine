<template>
  <nav v-if="shouldRender" class="breadcrumbs" aria-label="Breadcrumb">
    <ol class="breadcrumbs__list">
      <li
        v-for="(item, index) in items"
        :key="`${item.label}-${index}`"
        class="breadcrumbs__item"
      >
        <RouterLink
          v-if="item.to && index !== items.length - 1"
          :to="item.to"
          class="breadcrumbs__link"
        >
          {{ item.label }}
        </RouterLink>
        <span v-else class="breadcrumbs__current">{{ item.label }}</span>
        <span v-if="index !== items.length - 1" class="breadcrumbs__separator">/</span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter, type RouteLocationRaw } from 'vue-router'
import { useI18n } from 'vue-i18n'

type BreadcrumbItem = {
  label: string
  to?: RouteLocationRaw
}

const props = defineProps<{
  currentLabel?: string
}>()

const route = useRoute()
const router = useRouter()
const { t, locale } = useI18n()

const shouldHide = computed(() => route.matched.some(record => record.meta?.hideBreadcrumbs))

const homeCrumb = computed<BreadcrumbItem>(() => {
  const homeName = `${locale.value}-home`
  return {
    label: t('BREADCRUMBS.HOME'),
    to: { name: homeName as string }
  }
})

const routeCrumbs = computed<BreadcrumbItem[]>(() => {
  const matched = route.matched.filter(record => record.meta?.breadcrumbKey)

  return matched.map((record, index) => {
    const key = record.meta?.breadcrumbKey as string
    const label = key ? t(key) : String(record.name ?? '')
    const isLast = index === matched.length - 1
    const to =
      !isLast && record.name
        ? {
            name: record.name as string,
            params: route.params,
            query: route.query
          }
        : undefined

    return { label, to }
  })
})

const items = computed<BreadcrumbItem[]>(() => {
  const crumbs = [homeCrumb.value, ...routeCrumbs.value].filter(item => Boolean(item.label))

  if (props.currentLabel && crumbs.length) {
    const lastIndex = crumbs.length - 1
    crumbs[lastIndex] = { ...crumbs[lastIndex], label: props.currentLabel, to: undefined }
  }

  return crumbs
})

const shouldRender = computed(() => !shouldHide.value && items.value.length > 1)
</script>

<style scoped lang="scss" src="./breadcrumbs.scss"></style>
