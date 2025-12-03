<template>
  <div class="quiz-management">
    <div class="quiz-management__header">
      <h1 class="quiz-management__title">Quiz Management</h1>
      <Button @click="showQuestionForm = true">Add Question</Button>
    </div>

    <div class="quiz-management__tabs">
      <button
        class="quiz-management__tab"
        :class="{ 'quiz-management__tab_active': activeTab === 'questions' }"
        @click="activeTab = 'questions'"
      >
        Questions
      </button>
      <button
        class="quiz-management__tab"
        :class="{ 'quiz-management__tab_active': activeTab === 'settings' }"
        @click="activeTab = 'settings'"
      >
        Settings
      </button>
    </div>

    <div v-if="activeTab === 'questions'" class="quiz-management__content">
      <QuizQuestionsList
        :questions="questions"
        :loading="loading"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <div v-if="activeTab === 'settings'" class="quiz-management__content">
      <QuizSettingsForm
        :settings="settings"
        :loading="settingsLoading"
        @save="handleSaveSettings"
      />
    </div>

    <QuizQuestionForm
      v-if="showQuestionForm"
      :question="editingQuestion"
      @save="handleSaveQuestion"
      @close="closeQuestionForm"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllQuestions, createQuestion, updateQuestion, deleteQuestion, getQuizSettings, updateQuizSettings } from '@/shared/api/quiz'
import type { QuizQuestionAdmin, QuizSettings } from '@/shared/types/quiz'
import Button from '@/shared/ui/Button/Button.vue'
import QuizQuestionsList from '@/widgets/quiz/QuizQuestionsList/QuizQuestionsList.vue'
import QuizQuestionForm from '@/widgets/quiz/QuizQuestionForm/QuizQuestionForm.vue'
import QuizSettingsForm from '@/widgets/quiz/QuizSettingsForm/QuizSettingsForm.vue'

const activeTab = ref<'questions' | 'settings'>('questions')
const loading = ref(true)
const settingsLoading = ref(true)
const questions = ref<QuizQuestionAdmin[]>([])
const settings = ref<QuizSettings | null>(null)
const showQuestionForm = ref(false)
const editingQuestion = ref<QuizQuestionAdmin | null>(null)

onMounted(async () => {
  await loadQuestions()
  await loadSettings()
})

async function loadQuestions() {
  try {
    loading.value = true
    questions.value = await getAllQuestions()
  } catch (error) {
    console.error('Failed to load questions:', error)
  } finally {
    loading.value = false
  }
}

async function loadSettings() {
  try {
    settingsLoading.value = true
    settings.value = await getQuizSettings()
  } catch (error) {
    console.error('Failed to load settings:', error)
  } finally {
    settingsLoading.value = false
  }
}

function handleEdit(question: QuizQuestionAdmin) {
  editingQuestion.value = question
  showQuestionForm.value = true
}

async function handleDelete(id: string) {
  if (!confirm('Are you sure you want to delete this question?')) return

  try {
    await deleteQuestion(id)
    questions.value = questions.value.filter(q => q.id !== id)
  } catch (error) {
    console.error('Failed to delete question:', error)
    alert('Failed to delete question')
  }
}

async function handleSaveQuestion(data: any) {
  try {
    if (editingQuestion.value) {
      const updated = await updateQuestion(editingQuestion.value.id, data)
      const index = questions.value.findIndex(q => q.id === updated.id)
      if (index !== -1) {
        questions.value[index] = updated
      }
    } else {
      const created = await createQuestion(data)
      questions.value.unshift(created)
    }
    closeQuestionForm()
  } catch (error) {
    console.error('Failed to save question:', error)
    alert('Failed to save question')
  }
}

async function handleSaveSettings(data: { questionsPerTest: number; timePerQuestion: number }) {
  try {
    settings.value = await updateQuizSettings(data)
    alert('Settings saved successfully')
  } catch (error) {
    console.error('Failed to save settings:', error)
    alert('Failed to save settings')
  }
}

function closeQuestionForm() {
  showQuestionForm.value = false
  editingQuestion.value = null
}
</script>

<style scoped lang="scss" src="./QuizManagementPage.scss"></style>

