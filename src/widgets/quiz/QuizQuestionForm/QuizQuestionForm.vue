<template>
  <Modal
    :visible="visible"
    :title="question ? t('QUIZ.MANAGE.FORM_TITLE_EDIT') : t('QUIZ.MANAGE.FORM_TITLE_ADD')"
    :close-on-backdrop="true"
    :closable="true"
    :show-actions="false"
    size="lg"
    @close="handleClose"
    @update:visible="handleVisibleChange"
  >
    <form class="quiz-question-form__form" @submit.prevent="handleSubmit">
      <Textarea
        v-model="formData.questionText"
        class="quiz-question-form__field"
        :label="t('QUIZ.MANAGE.FORM_QUESTION_LABEL')"
        :placeholder="t('QUIZ.MANAGE.FORM_QUESTION_PLACEHOLDER')"
        required
        :rows="3"
      />

      <Textarea
        v-model="formData.codeSnippet"
        class="quiz-question-form__field"
        :label="t('QUIZ.MANAGE.FORM_SNIPPET_LABEL')"
        :placeholder="t('QUIZ.MANAGE.FORM_SNIPPET_PLACEHOLDER')"
        :rows="6"
      />

      <div class="quiz-question-form__field">
        <label class="quiz-question-form__label">{{ t('QUIZ.MANAGE.FORM_ANSWERS_LABEL') }}</label>
        <div class="quiz-question-form__answers">
          <div
            v-for="(_, index) in formData.answers"
            :key="index"
            class="quiz-question-form__answer"
          >
            <Input
              v-model="formData.answers[index]"
              :placeholder="t('QUIZ.MANAGE.FORM_ANSWER_PLACEHOLDER')"
              class="quiz-question-form__input"
              required
            />
            <label class="quiz-question-form__radio-label">
              <input
                v-model="formData.correctAnswerIndex"
                type="radio"
                :value="index"
                class="quiz-question-form__radio"
                required
              />
              {{ t('QUIZ.MANAGE.FORM_CORRECT') }}
            </label>
            <Button
              v-if="formData.answers.length > 2"
              type="button"
              size="sm"
              variant="ghost"
              class="quiz-question-form__remove"
              @click="removeAnswer(index)"
            >
              ×
            </Button>
          </div>
        </div>
        <Button
          v-if="formData.answers.length < 6"
          type="button"
          variant="secondary"
          size="sm"
          class="quiz-question-form__add-answer"
          @click="addAnswer"
        >
          {{ t('QUIZ.MANAGE.FORM_ADD_ANSWER') }}
        </Button>
      </div>

      <Textarea
        v-model="formData.explanation"
        class="quiz-question-form__field"
        :label="t('QUIZ.MANAGE.FORM_EXPLANATION_LABEL')"
        :placeholder="t('QUIZ.MANAGE.FORM_EXPLANATION_PLACEHOLDER')"
        :rows="3"
      />

      <div class="quiz-question-form__row">
        <Select
          v-model="formData.category"
          class="quiz-question-form__field"
          :label="t('QUIZ.MANAGE.FORM_CATEGORY_LABEL')"
          :options="categoryOptions"
          required
        />

        <Select
          v-model="formData.difficulty"
          class="quiz-question-form__field"
          :label="t('QUIZ.MANAGE.FORM_DIFFICULTY_LABEL')"
          :options="difficultyOptions"
          required
        />
      </div>

      <div class="quiz-question-form__actions">
        <Button type="button" variant="secondary" @click="handleClose">
          {{ t('QUIZ.MANAGE.FORM_CANCEL') }}
        </Button>
        <Button type="submit">
          {{ question ? t('QUIZ.MANAGE.FORM_UPDATE') : t('QUIZ.MANAGE.FORM_CREATE') }}
        </Button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { QuizQuestionAdmin } from '@/shared/types/quiz'
import { Button, Input, Modal, Select, Textarea, type SelectOption } from '@/shared/ui'
import './QuizQuestionForm.scss'

const props = defineProps<{
  question: QuizQuestionAdmin | null
  visible: boolean
}>()

const emit = defineEmits<{
  save: [data: any]
  close: []
  'update:visible': [value: boolean]
}>()

const { t } = useI18n()

const formData = ref({
  questionText: '',
  codeSnippet: '',
  answers: ['', ''],
  correctAnswerIndex: 0,
  explanation: '',
  category: 'css' as 'css' | 'scss' | 'stylus',
  difficulty: 'medium' as 'easy' | 'medium' | 'hard'
})

const categoryOptions = computed<SelectOption[]>(() => [
  { value: 'css', label: t('QUIZ.MANAGE.FORM_CATEGORY_CSS') },
  { value: 'scss', label: t('QUIZ.MANAGE.FORM_CATEGORY_SCSS') },
  { value: 'stylus', label: t('QUIZ.MANAGE.FORM_CATEGORY_STYLUS') }
])

const difficultyOptions = computed<SelectOption[]>(() => [
  { value: 'easy', label: t('QUIZ.MANAGE.FORM_DIFFICULTY_EASY') },
  { value: 'medium', label: t('QUIZ.MANAGE.FORM_DIFFICULTY_MEDIUM') },
  { value: 'hard', label: t('QUIZ.MANAGE.FORM_DIFFICULTY_HARD') }
])

onMounted(() => {
  hydrateForm()
})

watch(
  () => props.question,
  () => {
    hydrateForm()
  }
)

function hydrateForm() {
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
  } else {
    formData.value = {
      questionText: '',
      codeSnippet: '',
      answers: ['', ''],
      correctAnswerIndex: 0,
      explanation: '',
      category: 'css',
      difficulty: 'medium'
    }
  }
}

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

function handleClose() {
  emit('close')
  emit('update:visible', false)
}

function handleVisibleChange(value: boolean) {
  if (!value) {
    handleClose()
  }
}
</script>

<style scoped lang="scss" src="./QuizQuestionForm.scss"></style>
