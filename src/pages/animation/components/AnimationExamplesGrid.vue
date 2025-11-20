<template>
  <div class="animation-examples">
    <div class="animation-page__gallery-header">
      <div>
        <p class="animation-page__gallery-tag">{{ t('ANIMATION.SNIPPETS_TAG') }}</p>
        <h2 class="animation-page__gallery-title">{{ t('ANIMATION.SNIPPETS_TITLE') }}</h2>
        <p class="animation-page__gallery-subtitle">
          {{ t('ANIMATION.SNIPPETS_SUBTITLE') }}
        </p>
      </div>
      <div class="animation-page__legend">
        <span class="animation-page__dot animation-page__dot_primary"></span>
        <span>{{ t('ANIMATION.HTML_CSS') }}</span>
      </div>
    </div>

    <div class="animation-page__cards">
      <article
        v-for="example in normalizedExamples"
        :key="example.id"
        class="animation-card"
      >
        <div class="animation-card__head">
          <div>
            <p class="animation-card__tag">{{ t('ANIMATION.PREVIEW') }}</p>
            <h3 class="animation-card__title">{{ t(example.titleKey) }}</h3>
            <p class="animation-card__description">{{ t(example.descriptionKey) }}</p>
          </div>
        </div>

        <div class="animation-card__preview">
          <component :is="example.component" />
        </div>

        <NavLink
          className="animation-card__link"
          :to="`/animation/${example.id}`"
        >
          {{ t('ANIMATION.OPEN') }}
        </NavLink>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { NavLink } from '@/shared/ui'

interface ExampleItem {
  id: string
  titleKey: string
  descriptionKey: string
  component: any
}

const props = defineProps<{
  examples: ExampleItem[] | ComputedRef<ExampleItem[]>
}>()

const normalizedExamples = computed<ExampleItem[]>(() =>
  Array.isArray((props.examples as any).value) ? (props.examples as any).value : (props.examples as ExampleItem[])
)

const { t } = useI18n()
</script>

<style scoped lang="scss">
.animation-examples {
  display: flex;
  flex-direction: column;
  gap: $space-3xl;
  width: 100%;

  @media (max-width: $breakpoint-md) {
    gap: $space-2xl;
  }
}

.animation-page__gallery-header {
  display: flex;
  justify-content: space-between;
  gap: $space-2xl;
  align-items: flex-start;
  margin-bottom: $space-xl;
  flex-wrap: wrap;
  width: 100%;

  @media (max-width: $breakpoint-md) {
    gap: $space-lg;
    margin-bottom: $space-lg;
  }
}

.animation-page__gallery-tag {
  display: inline-flex;
  align-items: center;
  gap: $space-xs;
  padding: $space-xs $space-md;
  border-radius: $border-radius-full;
  background: linear-gradient(135deg, color-var-alpha('color-secondary', 0.12), color-var-alpha('color-accent', 0.08));
  color: $color-secondary;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: $space-sm;
  border: 1px solid color-var-alpha('color-secondary', 0.2);
  box-shadow: 0 2px 12px color-var-alpha('color-secondary', 0.08);
}

.animation-page__gallery-title {
  font-size: $font-size-3xl;
  margin: 0 0 $space-md;
  font-weight: $font-weight-bold;
  letter-spacing: -0.015em;
  line-height: 1.2;

  @media (max-width: $breakpoint-md) {
    font-size: $font-size-2xl;
  }
}

.animation-page__gallery-subtitle {
  margin: 0;
  color: color-var-alpha('color-text-secondary', 0.85);
  max-width: 720px;
  line-height: 1.7;
  font-size: $font-size-base;
}

.animation-page__legend {
  display: inline-flex;
  align-items: center;
  gap: $space-sm;
  padding: $space-sm $space-lg;
  border-radius: $border-radius-full;
  background: color-var-alpha('color-bg-secondary', 0.5);
  color: color-var-alpha('color-text-secondary', 0.85);
  font-size: $font-size-xs;
  font-weight: $font-weight-medium;
  border: 1px solid color-var-alpha('panel-border', 0.2);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
}

.animation-page__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;

  &_primary {
    background: linear-gradient(135deg, $color-primary, $color-accent);
    box-shadow:
      0 0 12px color-var-alpha('color-primary', 0.4),
      0 0 6px color-var-alpha('color-accent', 0.3);
  }
}

.animation-page__cards {
  display: grid;
  gap: $space-2xl;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  position: relative;
  z-index: 1;
  width: 100%;

  @media (max-width: $breakpoint-xl) {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: $space-xl;
  }

  @media (max-width: $breakpoint-md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: $breakpoint-sm) {
    grid-template-columns: 1fr;
    gap: $space-lg;
  }
}

.animation-card {
  background: color-var-alpha('color-bg-secondary', 0.5);
  border: 1px solid color-var-alpha('panel-border', 0.25);
  border-radius: $border-radius-xl;
  padding: $space-xl;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: $space-lg;
  transition: all $transition-base;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      color-var-alpha('color-primary', 0.5),
      transparent
    );
    opacity: 0;
    transition: opacity $transition-base;
  }

  @media (max-width: $breakpoint-md) {
    padding: $space-lg;
  }

  &:hover {
    transform: translateY(-6px);
    border-color: color-var-alpha('color-primary', 0.4);
    box-shadow:
      0 12px 40px rgba(0, 0, 0, 0.12),
      0 8px 20px color-var-alpha('color-primary', 0.08);

    &::before {
      opacity: 1;
    }
  }
}

.animation-card__head {
  display: flex;
  justify-content: space-between;
  gap: $space-md;
  align-items: flex-start;
  flex-wrap: wrap;
}

.animation-card__tag {
  display: inline-flex;
  align-items: center;
  gap: $space-xs;
  padding: $space-xs $space-sm;
  border-radius: $border-radius-full;
  background: linear-gradient(135deg, color-var-alpha('color-accent', 0.12), color-var-alpha('color-primary', 0.08));
  color: $color-accent;
  font-size: $font-size-xs;
  font-weight: $font-weight-semibold;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: $space-xs;
  border: 1px solid color-var-alpha('color-accent', 0.2);
  box-shadow: 0 2px 8px color-var-alpha('color-accent', 0.06);
}

.animation-card__title {
  margin: 0 0 $space-sm;
  font-size: $font-size-lg;
  font-weight: $font-weight-bold;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.animation-card__description {
  margin: 0;
  color: color-var-alpha('color-text-secondary', 0.8);
  max-width: 540px;
  line-height: 1.6;
  font-size: $font-size-sm;
}

.animation-card__preview {
  border: 1px solid color-var-alpha('panel-border', 0.15);
  border-radius: $border-radius-lg;
  padding: $space-xl;
  background:
    radial-gradient(circle at 30% 30%, color-var-alpha('color-primary', 0.06), transparent 50%),
    color-var-alpha('color-bg-primary', 0.4);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  min-height: 200px;
  aspect-ratio: 4 / 3;
  display: grid;
  place-items: center;
  width: 100%;
  backdrop-filter: blur(8px);

  @media (max-width: $breakpoint-md) {
    padding: $space-lg;
    min-height: 160px;
  }
}

.animation-card__link {
  align-self: flex-start;
  margin-top: auto;
  transition: transform $transition-base;
  font-size: $font-size-sm;

  &:hover {
    transform: translateY(-2px);
  }
}
</style>
