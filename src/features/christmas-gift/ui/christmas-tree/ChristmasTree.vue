<template>
  <div class="christmas-tree" @click="handleClick">
    <div class="christmas-tree__container">
      <div class="christmas-tree__star">★</div>

      <div class="christmas-tree__tree">
        <div class="christmas-tree__layer christmas-tree__layer--1">
          <div class="christmas-tree__layer-highlight"></div>
        </div>
        <div class="christmas-tree__layer christmas-tree__layer--2">
          <div class="christmas-tree__layer-highlight"></div>
        </div>
        <div class="christmas-tree__layer christmas-tree__layer--3">
          <div class="christmas-tree__layer-highlight"></div>
        </div>
        <div class="christmas-tree__layer christmas-tree__layer--4">
          <div class="christmas-tree__layer-highlight"></div>
        </div>
        <div class="christmas-tree__trunk"></div>
      </div>

      <div class="christmas-tree__lights">
        <div class="christmas-tree__light christmas-tree__light--red"></div>
        <div class="christmas-tree__light christmas-tree__light--yellow"></div>
        <div class="christmas-tree__light christmas-tree__light--blue"></div>
        <div class="christmas-tree__light christmas-tree__light--green"></div>
        <div class="christmas-tree__light christmas-tree__light--purple"></div>
        <div class="christmas-tree__light christmas-tree__light--cyan"></div>
        <div class="christmas-tree__light christmas-tree__light--orange"></div>
        <div class="christmas-tree__light christmas-tree__light--pink"></div>
      </div>

      <div class="christmas-tree__gift">
        <div class="christmas-tree__gift-box"></div>
        <div class="christmas-tree__gift-ribbon christmas-tree__gift-ribbon--h"></div>
        <div class="christmas-tree__gift-ribbon christmas-tree__gift-ribbon--v"></div>
        <div class="christmas-tree__gift-bow"></div>
      </div>
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
