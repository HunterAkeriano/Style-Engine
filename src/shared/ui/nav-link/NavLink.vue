<template>
  <router-link
    :to="localizedPath"
    :class="['nav-link', className]"
    @click="emit('click')"
  >
    <slot />
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  to: string
  className?: string
}

interface Emits {
  (e: 'click'): void
}

const props = withDefaults(defineProps<Props>(), {
  className: ''
})

const emit = defineEmits<Emits>()
const { locale } = useI18n()

const localizedPath = computed(() => {
  if (props.to.startsWith('/uk/') || props.to.startsWith('/en/')) {
    return props.to
  }

  const cleanPath = props.to.startsWith('/') ? props.to : `/${props.to}`
  return `/${locale.value}${cleanPath}`
})
</script>

<style lang="scss" scoped src="./nav-link.scss"></style>
