<template>
  <div class="quiz-history">
    <h1 class="quiz-history__title">My Quiz Results</h1>

    <div v-if="loading" class="quiz-history__loading">Loading...</div>

    <div v-else-if="results.length === 0" class="quiz-history__empty">
      <p>You haven't taken any quizzes yet.</p>
      <Button @click="goToStart">
        Take Your First Quiz
      </Button>
    </div>

    <div v-else class="quiz-history__list">
      <div
        v-for="result in results"
        :key="result.id"
        class="quiz-history__item"
      >
        <div class="quiz-history__item-header">
          <span class="quiz-history__item-category">{{ result.category.toUpperCase() }}</span>
          <span class="quiz-history__item-date">{{ formatDate(result.createdAt) }}</span>
        </div>

        <div class="quiz-history__item-score">
          <div class="quiz-history__item-score-circle">
            <span class="quiz-history__item-score-value">
              {{ Math.round((result.score / result.totalQuestions) * 100) }}%
            </span>
          </div>
          <div class="quiz-history__item-score-details">
            <p class="quiz-history__item-score-text">
              {{ result.score }} / {{ result.totalQuestions }} correct
            </p>
            <p class="quiz-history__item-time">
              Time: {{ formatTime(result.timeTaken) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { getMyQuizResults } from '@/shared/api/quiz'
import type { QuizResult } from '@/shared/types/quiz'
import Button from '@/shared/ui/Button/Button.vue'

const loading = ref(true)
const results = ref<QuizResult[]>([])
const router = useRouter()
const { locale } = useI18n()

onMounted(async () => {
  try {
    loading.value = true
    results.value = await getMyQuizResults()
  } catch (error) {
    console.error('Failed to load results:', error)
  } finally {
    loading.value = false
  }
})

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}m ${secs}s`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function goToStart() {
  const currentLocale = locale.value || 'en'
  router.push({ name: `${currentLocale}-quiz-start` })
}
</script>

<style scoped lang="scss" src="./QuizHistoryPage.scss"></style>

