<template>
  <div class="quiz-leaderboard">
    <div class="quiz-leaderboard__header">
      <h1 class="quiz-leaderboard__title">Leaderboard</h1>

      <div class="quiz-leaderboard__filters">
        <select v-model="selectedCategory" class="quiz-leaderboard__select" @change="loadLeaderboard">
          <option value="all">All Categories</option>
          <option value="css">CSS</option>
          <option value="scss">SCSS</option>
          <option value="stylus">Stylus</option>
          <option value="mix">Mix</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="quiz-leaderboard__loading">Loading...</div>

    <div v-else-if="leaderboard.length === 0" class="quiz-leaderboard__empty">
      No results yet. Be the first to take the quiz!
    </div>

    <div v-else class="quiz-leaderboard__table">
      <div class="quiz-leaderboard__row quiz-leaderboard__row_header">
        <div class="quiz-leaderboard__cell">Rank</div>
        <div class="quiz-leaderboard__cell">User</div>
        <div class="quiz-leaderboard__cell">Score</div>
        <div class="quiz-leaderboard__cell">Category</div>
        <div class="quiz-leaderboard__cell">Time</div>
        <div class="quiz-leaderboard__cell">Date</div>
      </div>

      <div
        v-for="entry in leaderboard"
        :key="`${entry.username}-${entry.createdAt}`"
        class="quiz-leaderboard__row"
        :class="{
          'quiz-leaderboard__row_gold': entry.rank === 1,
          'quiz-leaderboard__row_silver': entry.rank === 2,
          'quiz-leaderboard__row_bronze': entry.rank === 3
        }"
      >
        <div class="quiz-leaderboard__cell quiz-leaderboard__cell_rank">
          {{ entry.rank }}
        </div>
        <div class="quiz-leaderboard__cell quiz-leaderboard__cell_username">
          {{ entry.username }}
        </div>
        <div class="quiz-leaderboard__cell">
          {{ entry.score }}/{{ entry.totalQuestions }} ({{ entry.percentage }}%)
        </div>
        <div class="quiz-leaderboard__cell">
          {{ entry.category.toUpperCase() }}
        </div>
        <div class="quiz-leaderboard__cell">
          {{ formatTime(entry.timeTaken) }}
        </div>
        <div class="quiz-leaderboard__cell">
          {{ formatDate(entry.createdAt) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getQuizLeaderboard } from '@/shared/api/quiz'
import type { QuizLeaderboardEntry, QuizResultCategory } from '@/shared/types/quiz'

const loading = ref(true)
const leaderboard = ref<QuizLeaderboardEntry[]>([])
const selectedCategory = ref<QuizResultCategory | 'all'>('all')

onMounted(() => {
  loadLeaderboard()
})

async function loadLeaderboard() {
  try {
    loading.value = true
    leaderboard.value = await getQuizLeaderboard(selectedCategory.value, 50)
  } catch (error) {
    console.error('Failed to load leaderboard:', error)
  } finally {
    loading.value = false
  }
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}m ${secs}s`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped lang="scss" src="./QuizLeaderboardPage.scss"></style>

