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
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { AnimationHero, AnimationBuilder, AnimationExamplesGrid } from '@/widgets/animation'
import { animationExamples } from '@/entities/animation'
import { listPublicSaves, type SavedItem } from '@/shared/api/saves'
import { buildCreatorProfile, getCreatorLabel } from '@/shared/lib/creator'
import type { AnimationExample } from '@/entities/animation/model/examples-data'

const { t } = useI18n()

const communityExamples = ref<AnimationExample[]>([])

const builtInExamples = computed(() =>
  animationExamples.map(example => ({
    ...example,
    component: defineAsyncComponent(example.component!)
  }))
)

const examples = computed(() => [...communityExamples.value, ...builtInExamples.value])

function mapCommunityAnimation(item: SavedItem): AnimationExample | null {
  const payload = item.payload || {}
  const html = typeof payload.html === 'string' ? payload.html : ''
  const css = typeof payload.css === 'string' ? payload.css : ''
  if (!html && !css) {
    return null
  }
  const owner = buildCreatorProfile(item)
  const ownerLabel = getCreatorLabel(owner)
  return {
    id: `community-${item.id}`,
    titleKey: 'ANIMATION.COMMUNITY_ANIMATION',
    descriptionKey: 'ANIMATION.COMMUNITY_CREATED_BY',
    titleText: item.name || t('ANIMATION.COMMUNITY_ANIMATION'),
    descriptionText: t('ANIMATION.COMMUNITY_CREATED_BY', { user: ownerLabel }),
    category: 'community',
    html,
    css,
    owner,
    previewText: css ? `${css.substring(0, 120)}...` : html.substring(0, 120),
    isCommunity: true
  }
}

async function loadCommunityAnimations() {
  try {
    const items = await listPublicSaves('animation')
    communityExamples.value = items
      .map(mapCommunityAnimation)
      .filter(Boolean) as AnimationExample[]
  } catch (error) {
    console.warn('Failed to load community animations', error)
  }
}

onMounted(() => {
  loadCommunityAnimations()
})
</script>

<style lang="scss" src="./animation-page.scss"></style>
