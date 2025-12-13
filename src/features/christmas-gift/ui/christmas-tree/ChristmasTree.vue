<template>
  <div class="christmas-gift" @click="handleClick">
    <div class="christmas-gift__container">
      <div class="christmas-gift__box">
        <div class="christmas-gift__box-top"></div>
        <div class="christmas-gift__box-main"></div>
        <div class="christmas-gift__box-side"></div>
      </div>

      <div class="christmas-gift__ribbon christmas-gift__ribbon--h"></div>
      <div class="christmas-gift__ribbon christmas-gift__ribbon--v"></div>

      <div class="christmas-gift__bow">
        <div class="christmas-gift__bow-left"></div>
        <div class="christmas-gift__bow-right"></div>
        <div class="christmas-gift__bow-center"></div>
        <div class="christmas-gift__bow-knot"></div>
      </div>

      <div class="christmas-gift__shadow"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  click: []
}>()

function handleClick() {
  emit('click')
}
</script>

<style lang="scss" scoped src="./christmas-tree.scss"></style>
