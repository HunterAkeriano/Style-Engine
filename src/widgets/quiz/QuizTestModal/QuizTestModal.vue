<template>
  <Modal
    :visible="isOpen"
    size="lg"
    :close-on-backdrop="true"
    @close="handleClose"
  >
    <div class="quiz-test-modal">
      <div v-if="step === 'category'" class="quiz-test-modal__content">
        <h2 class="quiz-test-modal__title">{{ t('QUIZ.SELECT_CATEGORY') }}</h2>
        <p class="quiz-test-modal__description">{{ t('QUIZ.SELECT_CATEGORY_DESCRIPTION') }}</p>

        <div class="quiz-test-modal__categories">
          <button
            v-for="category in categories"
            :key="category.value"
            class="quiz-test-modal__category"
            :class="{ 'quiz-test-modal__category_active': selectedCategory === category.value }"
            @click="selectedCategory = category.value as QuizResultCategory"
          >
            <div class="quiz-test-modal__category-icon">{{ category.icon }}</div>
            <div class="quiz-test-modal__category-name">{{ t(`QUIZ.CATEGORIES.${category.value.toUpperCase()}`) }}</div>
          </button>
        </div>

        <Button class="quiz-test-modal__button" @click="step = 'confirm'">
          {{ t('QUIZ.CONTINUE') }}
        </Button>
      </div>

      <div v-else-if="step === 'confirm'" class="quiz-test-modal__content">
        <h2 class="quiz-test-modal__title">{{ t('QUIZ.READY_TITLE') }}</h2>
        <p class="quiz-test-modal__description">{{ t('QUIZ.READY_DESCRIPTION') }}</p>

        <div class="quiz-test-modal__info">
          <div class="quiz-test-modal__info-item">
            <strong>{{ t('QUIZ.CATEGORY') }}:</strong> {{ t(`QUIZ.CATEGORIES.${selectedCategory.toUpperCase()}`) }}
          </div>
          <div class="quiz-test-modal__info-item">
            <strong>{{ t('QUIZ.QUESTIONS_COUNT') }}:</strong> {{ questionsCount }}
          </div>
          <div class="quiz-test-modal__info-item">
            <strong>{{ t('QUIZ.TIME_PER_QUESTION') }}:</strong> {{ timePerQuestion }}s
          </div>
        </div>

        <div class="quiz-test-modal__actions">
          <Button variant="secondary" @click="step = 'category'">
            {{ t('QUIZ.BACK') }}
          </Button>
          <Button @click="startTest">
            {{ t('QUIZ.START_TEST') }}
          </Button>
        </div>
      </div>

      <div v-else-if="step === 'test'" class="quiz-test-modal__content">
        <div v-if="loading" class="quiz-test-modal__loading">{{ t('QUIZ.LOADING') }}</div>

        <div v-else-if="error" class="quiz-test-modal__error">
          <p>{{ error }}</p>
          <Button @click="handleClose">{{ t('QUIZ.CLOSE') }}</Button>
        </div>

        <div v-else-if="!finished && currentQuestion" class="quiz-test-modal__test">
          <QuizProgress
            :current="currentQuestionIndex + 1"
            :total="questions.length"
          />

          <QuizTimer
            :time-left="timeLeft"
            :time-per-question="timePerQuestion"
          />

          <QuizQuestion
            :question="currentQuestion"
            :selected-answer="selectedAnswer"
            @select="handleSelectAnswer"
          />

          <div class="quiz-test-modal__actions">
            <Button
              v-if="selectedAnswer !== null"
              @click="handleNextQuestion"
            >
              {{ isLastQuestion ? t('QUIZ.FINISH') : t('QUIZ.NEXT') }}
            </Button>
          </div>
        </div>

        <QuizResults
          v-else-if="finished && result"
          :result="result"
          :detailed-results="detailedResults"
          @retry="handleRetry"
        />
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { getQuizTest, submitQuizTest } from '@/shared/api/quiz'
import { useAuthStore } from '@/entities/user/model/auth-store'
import Button from '@/shared/ui/Button/Button.vue'
import Modal from '@/shared/ui/modal/Modal.vue'
import QuizProgress from '@/widgets/quiz/QuizProgress/QuizProgress.vue'
import QuizTimer from '@/widgets/quiz/QuizTimer/QuizTimer.vue'
import QuizQuestion from '@/widgets/quiz/QuizQuestion/QuizQuestion.vue'
import QuizResults from '@/widgets/quiz/QuizResults/QuizResults.vue'
import type { QuizQuestion as QuizQuestionType, QuizAnswer, QuizResult, QuizDetailedResult, QuizResultCategory } from '@/shared/types/quiz'

const props = defineProps<{
  isOpen: boolean
  questionsCount: number
  timePerQuestionProp: number
}>()

const emit = defineEmits<{
  close: []
  testCompleted: []
}>()

const { t } = useI18n()
const authStore = useAuthStore()

const step = ref<'category' | 'confirm' | 'test'>('category')
const selectedCategory = ref<QuizResultCategory>('mix')
const loading = ref(false)
const error = ref<string | null>(null)
const questions = ref<QuizQuestionType[]>([])
const currentQuestionIndex = ref(0)
const selectedAnswer = ref<number | null>(null)
const answers = ref<QuizAnswer[]>([])
const timePerQuestion = ref(60)
const timeLeft = ref(60)
const finished = ref(false)
const result = ref<QuizResult | null>(null)
const detailedResults = ref<QuizDetailedResult[]>([])
const startTime = ref(Date.now())

const categories = [
  { value: 'css', icon: '🎨' },
  { value: 'scss', icon: '📦' },
  { value: 'stylus', icon: '✨' },
  { value: 'mix', icon: '🔀' }
]

let timerInterval: ReturnType<typeof setInterval> | null = null

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    resetModal()
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

function resetModal() {
  step.value = 'category'
  selectedCategory.value = 'mix'
  loading.value = false
  error.value = null
  questions.value = []
  currentQuestionIndex.value = 0
  selectedAnswer.value = null
  answers.value = []
  finished.value = false
  result.value = null
  detailedResults.value = []
  if (timerInterval) clearInterval(timerInterval)
}

async function startTest() {
  try {
    loading.value = true
    error.value = null
    step.value = 'test'
    const test = await getQuizTest(selectedCategory.value)
    questions.value = test.questions
    timePerQuestion.value = test.timePerQuestion
    timeLeft.value = test.timePerQuestion
    startTime.value = Date.now()
    startTimer()
  } catch (err: any) {
    error.value = err.response?.data?.message || t('QUIZ.FAILED_TO_LOAD')
  } finally {
    loading.value = false
  }
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      handleNextQuestion()
    }
  }, 1000)
}

function handleSelectAnswer(index: number) {
  selectedAnswer.value = index
}

function handleNextQuestion() {
  if (selectedAnswer.value !== null) {
    answers.value.push({
      questionId: currentQuestion.value.id,
      answerIndex: selectedAnswer.value
    })
  }

  if (isLastQuestion.value) {
    submitTest()
  } else {
    currentQuestionIndex.value++
    selectedAnswer.value = null
    timeLeft.value = timePerQuestion.value
  }
}

async function submitTest() {
  if (timerInterval) clearInterval(timerInterval)

  try {
    const timeTaken = Math.floor((Date.now() - startTime.value) / 1000)

    const response = await submitQuizTest(
      selectedCategory.value,
      answers.value,
      timeTaken,
      authStore.user?.name || undefined
    )

    result.value = response.result
    detailedResults.value = response.detailedResults
    finished.value = true
    emit('testCompleted')
  } catch {
    error.value = t('QUIZ.FAILED_TO_SUBMIT')
  }
}

function handleRetry() {
  resetModal()
  emit('close')
}

function handleClose() {
  if (step.value === 'test' && !finished.value) {
    if (confirm(t('QUIZ.CONFIRM_EXIT'))) {
      emit('close')
    }
  } else {
    emit('close')
  }
}
</script>

<style scoped lang="scss">
@import './QuizTestModal.scss';
</style>
