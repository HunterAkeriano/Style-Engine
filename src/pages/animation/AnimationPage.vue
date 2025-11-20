<template>
  <div class="animation-page">
    <div class="animation-page__background">
      <span class="animation-page__beam animation-page__beam_left"></span>
      <span class="animation-page__beam animation-page__beam_right"></span>
      <span class="animation-page__grid-lines"></span>
    </div>

    <div class="container">
      <AnimationHero
        :eyebrow="t('ANIMATION.EYEBROW')"
        :title="t('ANIMATION.TITLE')"
        :subtitle="t('ANIMATION.SUBTITLE')"
        :back-text="t('ANIMATION.BACK')"
        :docs-text="t('ANIMATION.DOCS')"
        docs-link="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations"
      />

      <section class="animation-page__builder-section">
        <AnimationBuilder />
      </section>

      <section class="animation-page__examples">
        <AnimationExamplesGrid :examples="examples" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import AnimationHero from './components/AnimationHero.vue'
import AnimationBuilder from './components/AnimationBuilder.vue'
import AnimationExamplesGrid from './components/AnimationExamplesGrid.vue'
import { animationExamples } from './examples/examplesData'

const { t } = useI18n()

const examples = computed(() =>
  animationExamples.map(example => ({
    ...example,
    component: defineAsyncComponent(example.component)
  }))
)
</script>

<style lang="scss" src="./AnimationPage.scss"></style>
