<template>
  <div class="quiz-questions-list">
    <div v-if="loading" class="quiz-questions-list__loading">Loading...</div>

    <div v-else-if="questions.length === 0" class="quiz-questions-list__empty">
      No questions found. Add your first question!
    </div>

    <div v-else class="quiz-questions-list__items">
      <div
        v-for="question in questions"
        :key="question.id"
        class="quiz-questions-list__item"
      >
        <div class="quiz-questions-list__item-header">
          <span class="quiz-questions-list__item-category">{{ question.category }}</span>
          <span class="quiz-questions-list__item-difficulty">{{ question.difficulty }}</span>
        </div>

        <p class="quiz-questions-list__item-text">{{ question.questionText }}</p>

        <div class="quiz-questions-list__item-info">
          <span>{{ question.answers.length }} answers</span>
          <span v-if="question.codeSnippet">Has code snippet</span>
        </div>

        <div class="quiz-questions-list__item-actions">
          <button
            class="quiz-questions-list__item-btn quiz-questions-list__item-btn_edit"
            @click="$emit('edit', question)"
          >
            Edit
          </button>
          <button
            class="quiz-questions-list__item-btn quiz-questions-list__item-btn_delete"
            @click="$emit('delete', question.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizQuestionAdmin } from '@/shared/types/quiz'
import './QuizQuestionsList.scss'

defineProps<{
  questions: QuizQuestionAdmin[]
  loading: boolean
}>()

defineEmits<{
  edit: [question: QuizQuestionAdmin]
  delete: [id: string]
}>()
</script>
