<template>
  <div class="quiz-settings-form">
    <div v-if="loading" class="quiz-settings-form__loading">Loading...</div>

    <form v-else class="quiz-settings-form__form" @submit.prevent="handleSubmit">
      <div class="quiz-settings-form__field">
        <label class="quiz-settings-form__label">
          Questions Per Test (5-100)
        </label>
        <input
          v-model.number="formData.questionsPerTest"
          type="number"
          min="5"
          max="100"
          class="quiz-settings-form__input"
          required
        />
        <p class="quiz-settings-form__hint">
          Number of questions to show in each test
        </p>
      </div>

      <div class="quiz-settings-form__field">
        <label class="quiz-settings-form__label">
          Time Per Question (10-300 seconds)
        </label>
        <input
          v-model.number="formData.timePerQuestion"
          type="number"
          min="10"
          max="300"
          class="quiz-settings-form__input"
          required
        />
        <p class="quiz-settings-form__hint">
          Time limit for each question in seconds
        </p>
      </div>

      <Button type="submit">
        Save Settings
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { QuizSettings } from '@/shared/types/quiz'
import Button from '@/shared/ui/Button/Button.vue'
import './QuizSettingsForm.scss'

const props = defineProps<{
  settings: QuizSettings | null
  loading: boolean
}>()

const emit = defineEmits<{
  save: [data: { questionsPerTest: number; timePerQuestion: number }]
}>()

const formData = ref({
  questionsPerTest: 20,
  timePerQuestion: 60
})

watch(() => props.settings, (settings) => {
  if (settings) {
    formData.value = {
      questionsPerTest: settings.questionsPerTest,
      timePerQuestion: settings.timePerQuestion
    }
  }
}, { immediate: true })

function handleSubmit() {
  emit('save', formData.value)
}
</script>
