<template>
  <div :class="['card', `card_${variant}`, { card_hoverable: hoverable }]">
    <div v-if="$slots.header" class="card__header">
      <slot name="header" />
    </div>

    <div class="card__body">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
type CardVariant = 'default' | 'bordered' | 'elevated'

interface Props {
  variant?: CardVariant
  hoverable?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
  hoverable: false
})
</script>

<style lang="scss" scoped src="./Card.scss"></style>
