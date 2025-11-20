<template>
  <router-link
    :to="to"
    :class="['nav-link', className]"
    @click="emit('click')"
  >
    <slot />
  </router-link>
</template>

<script setup lang="ts">
interface Props {
  to: string
  className?: string
}

interface Emits {
  (e: 'click'): void
}

withDefaults(defineProps<Props>(), {
  className: ''
})

const emit = defineEmits<Emits>()
</script>

<style lang="scss" scoped src="./NavLink.scss"></style>
