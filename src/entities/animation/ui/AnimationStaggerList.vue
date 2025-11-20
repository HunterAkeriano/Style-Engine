<template>
  <ul class="stagger-list">
    <li v-for="item in items" :key="item" />
  </ul>
</template>

<script setup lang="ts">
const items = Array.from({ length: 5 }).map((_, i) => i)
</script>

<style lang="scss" scoped src="./AnimationStaggerList.scss"></style>