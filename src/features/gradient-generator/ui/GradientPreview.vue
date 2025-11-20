<template>
  <div class="gradient-preview">
    <div class="gradient-preview__box" :style="gradientStyle"></div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  gradientStyle: { background: string }
}

defineProps<Props>()
</script>

<style lang="scss" scoped src="./GradientPreview.scss"></style>
