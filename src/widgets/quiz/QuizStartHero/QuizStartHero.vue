<template>
  <section class="quiz-start-hero">
    <h1 class="quiz-start-hero__title">{{ title }}</h1>
    <p class="quiz-start-hero__subtitle">{{ subtitle }}</p>

    <div class="quiz-start-hero__content">
      <div class="quiz-start-hero__importance">
        <h2 class="quiz-start-hero__importance-title">{{ reasonsTitle }}</h2>
        <ul class="quiz-start-hero__importance-list">
          <li v-for="reason in reasons" :key="reason" class="quiz-start-hero__importance-item">
            {{ reason }}
          </li>
        </ul>
      </div>

      <div v-if="limitWarning?.length" class="quiz-start-hero__limit-warning">
        <p v-for="line in limitWarning" :key="line">{{ line }}</p>
      </div>

      <div v-else-if="limitInfo" class="quiz-start-hero__limit-info">
        {{ limitInfo }}
      </div>

      <Button
        class="quiz-start-hero__start-button"
        :disabled="startDisabled"
        @click="$emit('start')"
      >
        {{ buttonText }}
      </Button>
    </div>
  </section>
</template>

<script setup lang="ts">
import Button from '@/shared/ui/Button/Button.vue'

withDefaults(defineProps<{
  title: string
  subtitle: string
  reasonsTitle: string
  reasons: string[]
  limitWarning?: string[]
  limitInfo?: string
  buttonText: string
  startDisabled?: boolean
}>(), {
  reasons: () => [],
  limitWarning: undefined,
  limitInfo: '',
  startDisabled: false
})
</script>

<style scoped lang="scss" src="./QuizStartHero.scss"></style>
