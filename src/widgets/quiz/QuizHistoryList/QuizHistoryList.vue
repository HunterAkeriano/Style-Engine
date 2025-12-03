<template>
  <div class="quiz-history-list">
    <div v-if="loading" class="quiz-history-list__status quiz-history-list__status_loading">
      {{ loadingText }}
    </div>

    <div v-else-if="!results.length" class="quiz-history-list__status">
      {{ emptyText }}
      <Button size="md" class="quiz-history-list__cta" @click="$emit('go-start')">
        {{ ctaText }}
      </Button>
    </div>

    <div v-else class="quiz-history-list__items">
      <article v-for="result in results" :key="result.id" class="quiz-history-list__item">
        <header class="quiz-history-list__item-header">
          <span class="quiz-history-list__item-category">{{ result.category.toUpperCase() }}</span>
          <span class="quiz-history-list__item-date">{{ formatDate(result.createdAt) }}</span>
        </header>

        <div class="quiz-history-list__item-score">
          <div class="quiz-history-list__item-score-circle">
            <span class="quiz-history-list__item-score-value">{{ Math.round((result.score / result.totalQuestions) * 100) }}%</span>
          </div>
          <div class="quiz-history-list__item-score-details">
            <p class="quiz-history-list__item-score-text">
              {{ result.score }} / {{ result.totalQuestions }} correct answers
            </p>
            <p class="quiz-history-list__item-time">{{ formatTime(result.timeTaken) }}</p>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/shared/ui/Button/Button.vue'
import type { QuizResult } from '@/shared/types/quiz'

defineProps({
  results: { type: Array as () => QuizResult[], default: () => [] },
  loading: { type: Boolean, default: false },
  loadingText: { type: String, default: 'Loading...' },
  emptyText: { type: String, default: 'No results yet' },
  ctaText: { type: String, default: 'Go to start' }
})

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString()
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}m ${secs.toString().padStart(2, '0')}s`
}
</script>

<style scoped lang="scss" src="./QuizHistoryList.scss"></style>
