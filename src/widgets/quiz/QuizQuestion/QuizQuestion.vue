<template>
  <div class="quiz-question">
    <h2 class="quiz-question__text">{{ question.questionText }}</h2>

    <pre v-if="question.codeSnippet" class="quiz-question__code"><code>{{ question.codeSnippet }}</code></pre>

    <div class="quiz-question__answers">
      <button
        v-for="(answer, index) in question.answers"
        :key="index"
        class="quiz-question__answer"
        :class="{ 'quiz-question__answer_selected': selectedAnswer === index }"
        @click="$emit('select', index)"
      >
        <span class="quiz-question__answer-letter">{{ String.fromCharCode(65 + index) }}</span>
        <span class="quiz-question__answer-text">{{ answer }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizQuestion } from '@/shared/types/quiz'
import './QuizQuestion.scss'

defineProps<{
  question: QuizQuestion
  selectedAnswer: number | null
}>()

defineEmits<{
  select: [index: number]
}>()
</script>
