<template>
  <div class="quiz-settings-form">
    <div v-if="loading" class="quiz-settings-form__loading">{{ t('QUIZ.MANAGE.SETTINGS_LOADING') }}</div>

    <form v-else class="quiz-settings-form__form" @submit.prevent="handleSubmit">
      <Input
        v-model.number="formData.questionsPerTest"
        type="number"
        :min="5"
        :max="100"
        :label="t('QUIZ.MANAGE.SETTINGS_QUESTIONS_LABEL')"
        :hint="t('QUIZ.MANAGE.SETTINGS_QUESTIONS_HINT')"
        class="quiz-settings-form__field"
        required
      />

      <Input
        v-model.number="formData.timePerQuestion"
        type="number"
        :min="10"
        :max="300"
        :label="t('QUIZ.MANAGE.SETTINGS_TIME_LABEL')"
        :hint="t('QUIZ.MANAGE.SETTINGS_TIME_HINT')"
        class="quiz-settings-form__field"
        required
      />

      <Button type="submit">
        {{ t('QUIZ.MANAGE.SETTINGS_SAVE') }}
      </Button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Input } from '@/shared/ui'
import { useI18n } from 'vue-i18n'
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

const { t } = useI18n()

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
