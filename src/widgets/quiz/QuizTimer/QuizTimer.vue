<template>
  <div class="quiz-timer">
    <div class="quiz-timer__circle">
      <svg class="quiz-timer__svg" viewBox="0 0 100 100">
        <circle
          class="quiz-timer__track"
          cx="50"
          cy="50"
          r="45"
        />
        <circle
          class="quiz-timer__progress"
          cx="50"
          cy="50"
          r="45"
          :style="{ strokeDashoffset: strokeDashoffset }"
        />
      </svg>
      <div class="quiz-timer__time">{{ formattedTime }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import './QuizTimer.scss'

const props = defineProps<{
  timeLeft: number
  timePerQuestion: number
}>()

const percentage = computed(() => {
  return (props.timeLeft / props.timePerQuestion) * 100
})

const strokeDashoffset = computed(() => {
  const circumference = 2 * Math.PI * 45
  return circumference - (percentage.value / 100) * circumference
})

const formattedTime = computed(() => {
  const minutes = Math.floor(props.timeLeft / 60)
  const seconds = props.timeLeft % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})
</script>
