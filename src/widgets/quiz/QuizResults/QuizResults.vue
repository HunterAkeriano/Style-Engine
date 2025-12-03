<template>
  <div class="quiz-results">
    <div class="quiz-results__summary">
      <h1 class="quiz-results__title">Test Completed!</h1>

      <div class="quiz-results__score">
        <div class="quiz-results__score-circle">
          <span class="quiz-results__score-value">{{ percentage }}%</span>
        </div>
        <p class="quiz-results__score-text">
          {{ result.score }} / {{ result.totalQuestions }} correct
        </p>
      </div>

      <div class="quiz-results__stats">
        <div class="quiz-results__stat">
          <span class="quiz-results__stat-label">Category</span>
          <span class="quiz-results__stat-value">{{ result.category.toUpperCase() }}</span>
        </div>
        <div class="quiz-results__stat">
          <span class="quiz-results__stat-label">Time Taken</span>
          <span class="quiz-results__stat-value">{{ formattedTime }}</span>
        </div>
      </div>
    </div>

    <div class="quiz-results__detailed">
      <h2 class="quiz-results__detailed-title">Detailed Results</h2>

      <div
        v-for="(item, index) in detailedResults"
        :key="item.questionId"
        class="quiz-results__item"
        :class="{
          'quiz-results__item_correct': item.isCorrect,
          'quiz-results__item_incorrect': !item.isCorrect
        }"
      >
        <div class="quiz-results__item-header">
          <span class="quiz-results__item-number">{{ index + 1 }}</span>
          <span class="quiz-results__item-status">
            {{ item.isCorrect ? '✓ Correct' : '✗ Incorrect' }}
          </span>
        </div>

        <p class="quiz-results__item-question">{{ item.questionText }}</p>

        <pre v-if="item.codeSnippet" class="quiz-results__item-code"><code>{{ item.codeSnippet }}</code></pre>

        <div class="quiz-results__item-answers">
          <div
            v-for="(answer, answerIndex) in item.answers"
            :key="answerIndex"
            class="quiz-results__item-answer"
            :class="{
              'quiz-results__item-answer_correct': answerIndex === item.correctAnswer,
              'quiz-results__item-answer_wrong': answerIndex === item.userAnswer && !item.isCorrect
            }"
          >
            <span class="quiz-results__item-answer-letter">
              {{ String.fromCharCode(65 + answerIndex) }}
            </span>
            <span class="quiz-results__item-answer-text">{{ answer }}</span>
            <span
              v-if="answerIndex === item.correctAnswer"
              class="quiz-results__item-answer-icon"
            >
              ✓
            </span>
            <span
              v-if="answerIndex === item.userAnswer && !item.isCorrect"
              class="quiz-results__item-answer-icon"
            >
              ✗
            </span>
          </div>
        </div>

        <div v-if="item.explanation" class="quiz-results__item-explanation">
          <strong>Explanation:</strong> {{ item.explanation }}
        </div>
      </div>
    </div>

    <div class="quiz-results__actions">
      <Button @click="$emit('retry')">Try Again</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { QuizResult, QuizDetailedResult } from '@/shared/types/quiz'
import Button from '@/shared/ui/Button/Button.vue'
import './QuizResults.scss'

const props = defineProps<{
  result: QuizResult
  detailedResults: QuizDetailedResult[]
}>()

defineEmits<{
  retry: []
}>()

const percentage = computed(() => {
  return Math.round((props.result.score / props.result.totalQuestions) * 100)
})

const formattedTime = computed(() => {
  const minutes = Math.floor(props.result.timeTaken / 60)
  const seconds = props.result.timeTaken % 60
  return `${minutes}m ${seconds}s`
})
</script>
