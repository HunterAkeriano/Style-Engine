<template>
  <div class="quiz-question-form-overlay" @click.self="$emit('close')">
    <div class="quiz-question-form">
      <div class="quiz-question-form__header">
        <h2 class="quiz-question-form__title">
          {{ question ? 'Edit Question' : 'Add Question' }}
        </h2>
        <button class="quiz-question-form__close" @click="$emit('close')">×</button>
      </div>

      <form class="quiz-question-form__form" @submit.prevent="handleSubmit">
        <div class="quiz-question-form__field">
          <label class="quiz-question-form__label">Question Text *</label>
          <textarea
            v-model="formData.questionText"
            class="quiz-question-form__textarea"
            rows="3"
            placeholder="Enter the question..."
            required
          />
        </div>

        <div class="quiz-question-form__field">
          <label class="quiz-question-form__label">Code Snippet (optional)</label>
          <textarea
            v-model="formData.codeSnippet"
            class="quiz-question-form__textarea quiz-question-form__textarea_code"
            rows="6"
            placeholder="Enter code snippet..."
          />
        </div>

        <div class="quiz-question-form__field">
          <label class="quiz-question-form__label">Answers * (2-6 answers)</label>
          <div class="quiz-question-form__answers">
            <div
              v-for="(_, index) in formData.answers"
              :key="index"
              class="quiz-question-form__answer"
            >
              <input
                v-model="formData.answers[index]"
                type="text"
                class="quiz-question-form__input"
                placeholder="Answer text..."
                required
              />
              <input
                v-model="formData.correctAnswerIndex"
                type="radio"
                :value="index"
                class="quiz-question-form__radio"
                required
              />
              <button
                v-if="formData.answers.length > 2"
                type="button"
                class="quiz-question-form__remove"
                @click="removeAnswer(index)"
              >
                ×
              </button>
            </div>
          </div>
          <button
            v-if="formData.answers.length < 6"
            type="button"
            class="quiz-question-form__add-answer"
            @click="addAnswer"
          >
            + Add Answer
          </button>
        </div>

        <div class="quiz-question-form__field">
          <label class="quiz-question-form__label">Explanation (optional)</label>
          <textarea
            v-model="formData.explanation"
            class="quiz-question-form__textarea"
            rows="3"
            placeholder="Explain the correct answer..."
          />
        </div>

        <div class="quiz-question-form__row">
          <div class="quiz-question-form__field">
            <label class="quiz-question-form__label">Category *</label>
            <select v-model="formData.category" class="quiz-question-form__select" required>
              <option value="css">CSS</option>
              <option value="scss">SCSS</option>
              <option value="stylus">Stylus</option>
            </select>
          </div>

          <div class="quiz-question-form__field">
            <label class="quiz-question-form__label">Difficulty *</label>
            <select v-model="formData.difficulty" class="quiz-question-form__select" required>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>

        <div class="quiz-question-form__actions">
          <Button type="button" variant="secondary" @click="$emit('close')">
            Cancel
          </Button>
          <Button type="submit">
            {{ question ? 'Update' : 'Create' }}
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { QuizQuestionAdmin } from '@/shared/types/quiz'
import Button from '@/shared/ui/Button/Button.vue'
import './QuizQuestionForm.scss'

const props = defineProps<{
  question: QuizQuestionAdmin | null
}>()

const emit = defineEmits<{
  save: [data: any]
  close: []
}>()

const formData = ref({
  questionText: '',
  codeSnippet: '',
  answers: ['', ''],
  correctAnswerIndex: 0,
  explanation: '',
  category: 'css' as 'css' | 'scss' | 'stylus',
  difficulty: 'medium' as 'easy' | 'medium' | 'hard'
})

onMounted(() => {
  if (props.question) {
    formData.value = {
      questionText: props.question.questionText,
      codeSnippet: props.question.codeSnippet || '',
      answers: [...props.question.answers],
      correctAnswerIndex: props.question.correctAnswerIndex,
      explanation: props.question.explanation || '',
      category: props.question.category,
      difficulty: props.question.difficulty
    }
  }
})

function addAnswer() {
  if (formData.value.answers.length < 6) {
    formData.value.answers.push('')
  }
}

function removeAnswer(index: number) {
  if (formData.value.answers.length > 2) {
    formData.value.answers.splice(index, 1)
    if (formData.value.correctAnswerIndex >= formData.value.answers.length) {
      formData.value.correctAnswerIndex = formData.value.answers.length - 1
    }
  }
}

function handleSubmit() {
  const data = {
    ...formData.value,
    codeSnippet: formData.value.codeSnippet || null,
    explanation: formData.value.explanation || null
  }
  emit('save', data)
}
</script>
