<template>
  <section class="animation-hero">
    <p class="animation-hero__eyebrow">{{ eyebrow }}</p>
    <h1 class="animation-hero__title">{{ title }}</h1>
    <p class="animation-hero__subtitle">
      {{ subtitle }}
    </p>
    <div class="animation-hero__actions">
      <NavLink to="/" className="button button_primary">
        {{ backText }}
      </NavLink>
      <a
        class="animation-hero__link"
        :href="docsLink"
        target="_blank"
        rel="noreferrer"
      >
        {{ docsText }}
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { NavLink } from '@/shared/ui'

interface Props {
  eyebrow: string
  title: string
  subtitle: string
  backText: string
  docsText: string
  docsLink: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.animation-hero {
  position: relative;
  text-align: center;
  max-width: 1000px;
  margin: 0 auto $space-4xl;
  display: flex;
  flex-direction: column;
  gap: $space-xl;
  padding: $space-2xl $space-lg;

  @media (max-width: $breakpoint-md) {
    gap: $space-lg;
    margin-bottom: $space-3xl;
    padding: $space-xl $space-md;
  }
}

.animation-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $space-sm $space-lg;
  border-radius: $border-radius-full;
  background: linear-gradient(135deg, color-var-alpha('color-primary', 0.12), color-var-alpha('color-accent', 0.08));
  color: $color-primary;
  font-weight: $font-weight-semibold;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: $font-size-xs;
  margin: 0 auto;
  border: 1px solid color-var-alpha('color-primary', 0.2);
  box-shadow: 0 2px 16px color-var-alpha('color-primary', 0.1);
  backdrop-filter: blur(10px);
}

.animation-hero__title {
  font-size: clamp($font-size-3xl, 6vw, $font-size-5xl);
  font-weight: $font-weight-bold;
  letter-spacing: -0.025em;
  margin: 0;
  line-height: 1.05;
  background: linear-gradient(
    180deg,
    $color-text-primary 0%,
    color-var-alpha('color-text-primary', 0.8) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: $breakpoint-md) {
    font-size: $font-size-3xl;
    line-height: 1.1;
  }
}

.animation-hero__subtitle {
  margin: 0 auto;
  max-width: 720px;
  color: color-var-alpha('color-text-secondary', 0.9);
  line-height: 1.8;
  font-size: $font-size-lg;
  text-wrap: balance;

  @media (max-width: $breakpoint-md) {
    font-size: $font-size-base;
    line-height: 1.7;
  }
}

.animation-hero__actions {
  display: flex;
  justify-content: center;
  gap: $space-md;
  flex-wrap: wrap;
  margin-top: $space-md;
}

.animation-hero__link {
  display: inline-flex;
  align-items: center;
  gap: $space-sm;
  padding: $space-md $space-xl;
  border-radius: $border-radius-xl;
  border: 1px solid color-var-alpha('panel-border', 0.3);
  background: color-var-alpha('color-bg-secondary', 0.5);
  color: $color-text-primary;
  text-decoration: none;
  font-weight: $font-weight-medium;
  font-size: $font-size-sm;
  transition: all $transition-base;
  backdrop-filter: blur(8px);

  &:hover {
    border-color: color-var-alpha('color-primary', 0.5);
    background: color-var-alpha('color-primary', 0.1);
    color: $color-primary;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px color-var-alpha('color-primary', 0.15);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
