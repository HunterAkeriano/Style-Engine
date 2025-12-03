<template>
  <div class="quiz-questions-list">
    <div v-if="loading" class="quiz-questions-list__loading">{{ t('QUIZ.MANAGE.LIST_LOADING') }}</div>

    <div v-else-if="questions.length === 0" class="quiz-questions-list__empty">
      {{ t('QUIZ.MANAGE.LIST_EMPTY') }}
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
          <span>{{ t('QUIZ.MANAGE.LIST_ANSWERS', { count: question.answers.length }) }}</span>
          <span v-if="question.codeSnippet">{{ t('QUIZ.MANAGE.LIST_HAS_SNIPPET') }}</span>
        </div>

        <div class="quiz-questions-list__item-actions">
          <Button
            size="sm"
            variant="secondary"
            class="quiz-questions-list__item-btn quiz-questions-list__item-btn_edit"
            @click="$emit('edit', question)"
          >
            {{ t('QUIZ.MANAGE.LIST_EDIT') }}
          </Button>
          <Button
            size="sm"
            variant="outline"
            class="quiz-questions-list__item-btn quiz-questions-list__item-btn_delete"
            @click="$emit('delete', question.id)"
          >
            {{ t('QUIZ.MANAGE.LIST_DELETE') }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizQuestionAdmin } from '@/shared/types/quiz'
import { useI18n } from 'vue-i18n'
import { Button } from '@/shared/ui'
import './QuizQuestionsList.scss'

defineProps<{
  questions: QuizQuestionAdmin[]
  loading: boolean
}>()

defineEmits<{
  edit: [question: QuizQuestionAdmin]
  delete: [id: string]
}>()

const { t } = useI18n()
</script>
