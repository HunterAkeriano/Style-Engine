<template>
  <section class="quiz-support">
    <h2 class="quiz-support__title">{{ title }}</h2>
    <p class="quiz-support__description">{{ description }}</p>

    <ul class="quiz-support__list">
      <li v-for="reason in reasons" :key="reason" class="quiz-support__item">
        {{ reason }}
      </li>
    </ul>

    <Button class="quiz-support__button" @click="$emit('contact')">
      {{ buttonText }}
    </Button>
  </section>
</template>

<script setup lang="ts">
import Button from '@/shared/ui/Button/Button.vue'

withDefaults(defineProps<{
  title: string
  description: string
  reasons: string[]
  buttonText: string
}>(), {
  reasons: () => []
})
</script>

<style scoped lang="scss" src="./QuizSupportSection.scss"></style>
