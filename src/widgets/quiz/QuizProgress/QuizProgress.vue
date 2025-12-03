<template>
  <div class="quiz-progress">
    <div class="quiz-progress__info">
      <span class="quiz-progress__text">Question {{ current }} of {{ total }}</span>
      <span class="quiz-progress__percentage">{{ percentage }}%</span>
    </div>
    <div class="quiz-progress__bar">
      <div
        class="quiz-progress__fill"
        :style="{ width: `${percentage}%` }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number
  total: number
}>()

const percentage = computed(() => {
  return Math.round((props.current / props.total) * 100)
})
</script>

<style scoped lang="scss">
@import './QuizProgress.scss';
</style>
