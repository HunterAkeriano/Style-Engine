<template>
  <div class="quiz-test">
    <div v-if="loading" class="quiz-test__loading">Loading...</div>

    <div v-else-if="error" class="quiz-test__error">
      <p>{{ error }}</p>
      <Button @click="handleRetry">Back to Start</Button>
    </div>

    <div v-else-if="!finished && currentQuestion" class="quiz-test__container">
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

      <div class="quiz-test__actions">
        <Button
          v-if="selectedAnswer !== null"
          @click="handleNextQuestion"
        >
          {{ isLastQuestion ? 'Finish' : 'Next' }}
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { getQuizTest, submitQuizTest } from '@/shared/api/quiz'
import { useAuthStore } from '@/entities/user/model/auth-store'
import Button from '@/shared/ui/Button/Button.vue'
import QuizProgress from '@/widgets/quiz/QuizProgress/QuizProgress.vue'
import QuizTimer from '@/widgets/quiz/QuizTimer/QuizTimer.vue'
import QuizQuestion from '@/widgets/quiz/QuizQuestion/QuizQuestion.vue'
import QuizResults from '@/widgets/quiz/QuizResults/QuizResults.vue'
import type { QuizQuestion as QuizQuestionType, QuizAnswer, QuizResult, QuizDetailedResult, QuizResultCategory } from '@/shared/types/quiz'

const route = useRoute()
const router = useRouter()
const { locale } = useI18n()
const authStore = useAuthStore()

const loading = ref(true)
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

let timerInterval: ReturnType<typeof setInterval> | null = null

const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])
const isLastQuestion = computed(() => currentQuestionIndex.value === questions.value.length - 1)

onMounted(async () => {
  try {
    const category = (route.query.category as QuizResultCategory) || 'mix'
    const test = await getQuizTest(category)
    questions.value = test.questions
    timePerQuestion.value = test.timePerQuestion
    timeLeft.value = test.timePerQuestion
    startTimer()
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Failed to load quiz'
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

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
    const category = (route.query.category as QuizResultCategory) || 'mix'

    const response = await submitQuizTest(
      category,
      answers.value,
      timeTaken,
      authStore.user?.name || undefined
    )

    result.value = response.result
    detailedResults.value = response.detailedResults
    finished.value = true
  } catch (err) {
    console.error('Failed to submit quiz', err)
    error.value = 'Failed to submit quiz'
  }
}

function handleRetry() {
  const currentLocale = locale.value || 'en'
  router.push({ name: `${currentLocale}-quiz-start` })
}
</script>

<style scoped lang="scss" src="./QuizTestPage.scss"></style>

