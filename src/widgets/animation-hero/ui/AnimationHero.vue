<template>
  <section class="animation-hero">
    <div class="animation-hero__orbits" aria-hidden="true">
      <span class="animation-hero__ring animation-hero__ring--outer"></span>
      <span class="animation-hero__ring animation-hero__ring--inner"></span>
      <span class="animation-hero__planet animation-hero__planet--primary"></span>
      <span class="animation-hero__planet animation-hero__planet--secondary"></span>
      <span class="animation-hero__planet animation-hero__planet--tertiary"></span>
    </div>
    <p class="animation-hero__eyebrow">{{ eyebrow }}</p>
    <h1 class="animation-hero__title">{{ title }}</h1>
    <p class="animation-hero__subtitle">
      {{ subtitle }}
    </p>
    <div class="animation-hero__meta">
      <span class="animation-hero__chip">{{ t('ANIMATION.HTML_CSS') }}</span>
      <span class="animation-hero__chip">{{ t('ANIMATION.LIVE_PREVIEW') }}</span>
      <span class="animation-hero__chip">{{ t('ANIMATION.KEYFRAMES_READY') }}</span>
    </div>
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
import { useI18n } from 'vue-i18n'

interface Props {
  eyebrow: string
  title: string
  subtitle: string
  backText: string
  docsText: string
  docsLink: string
}

defineProps<Props>()

const { t } = useI18n()
</script>

<style scoped lang="scss">
.animation-hero {
  position: relative;
  text-align: center;
  max-width: 1100px;
  margin: 0 auto $space-4xl;
  display: flex;
  flex-direction: column;
  gap: $space-xl;
  padding: $space-3xl $space-2xl;
  border-radius: $border-radius-2xl;
  border: 1px solid color-var-alpha('panel-border', 0.28);
  background:
    linear-gradient(135deg, color-var-alpha('color-bg-secondary', 0.8), color-var-alpha('color-bg-primary', 0.75)),
    radial-gradient(circle at 12% 18%, color-var-alpha('color-primary', 0.12), transparent 30%),
    radial-gradient(circle at 86% 16%, color-var-alpha('color-accent', 0.12), transparent 32%),
    color-var-alpha('color-bg-secondary', 0.5);
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 color-var-alpha('panel-border', 0.35);
  overflow: hidden;
  isolation: isolate;
  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: $breakpoint-md) {
    gap: $space-lg;
    margin-bottom: $space-3xl;
    padding: $space-2xl $space-lg;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  &::before {
    background: radial-gradient(circle at 64% 90%, color-var-alpha('color-accent', 0.12), transparent 38%);
    opacity: 0.9;
  }

  &::after {
    background: linear-gradient(120deg, color-var-alpha('color-primary', 0.08), transparent 32%, color-var-alpha('color-accent', 0.12) 68%, transparent 100%);
    opacity: 0.8;
  }
}

.animation-hero__eyebrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $space-sm $space-xl;
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
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, color-var-alpha('color-primary', 0.25), transparent);
    opacity: 0;
    transition: opacity $transition-base;
  }

  &:hover::after {
    opacity: 1;
  }
}

.animation-hero__orbits {
  position: absolute;
  inset: -20% -12%;
  pointer-events: none;
  z-index: 0;
}

.animation-hero__ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(10deg);
  border: 1px solid color-var-alpha('color-primary', 0.22);
  border-radius: 50%;
  opacity: 0.9;
  box-shadow:
    0 0 28px color-var-alpha('color-primary', 0.14),
    inset 0 0 32px color-var-alpha('color-primary', 0.1);
  background: radial-gradient(circle at 35% 35%, color-var-alpha('color-primary', 0.08), transparent 55%);
}

.animation-hero__ring--outer {
  width: 520px;
  height: 520px;
}

.animation-hero__ring--inner {
  width: 360px;
  height: 360px;
  border-color: color-var-alpha('color-accent', 0.32);
}

.animation-hero__planet {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  box-shadow: 0 0 24px color-var-alpha('color-primary', 0.45);
}

.animation-hero__planet--primary {
  width: 16px;
  height: 16px;
  background: linear-gradient(135deg, color-var-alpha('color-primary', 0.9), color-var-alpha('color-accent', 0.8));
  animation: planet-one 14s linear infinite;
}

.animation-hero__planet--secondary {
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, color-var-alpha('color-accent', 0.95), color-var-alpha('color-primary', 0.75));
  animation: planet-two 20s linear infinite reverse;
  box-shadow: 0 0 20px color-var-alpha('color-accent', 0.45);
}

.animation-hero__planet--tertiary {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, color-var-alpha('color-warning', 0.85), color-var-alpha('color-primary', 0.7));
  animation: planet-three 28s linear infinite;
  box-shadow: 0 0 14px color-var-alpha('color-warning', 0.35);
}

@keyframes planet-one {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) translateX(230px);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg) translateX(230px);
  }
}

@keyframes planet-two {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) translateX(175px);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg) translateX(175px);
  }
}

@keyframes planet-three {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) translateX(125px);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg) translateX(125px);
  }
}

.animation-hero__title {
  font-size: clamp($font-size-3xl, 6vw, 58px);
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
  max-width: 760px;
  color: color-var-alpha('color-text-secondary', 0.92);
  line-height: 1.8;
  font-size: $font-size-lg;
  text-wrap: balance;

  @media (max-width: $breakpoint-md) {
    font-size: $font-size-base;
    line-height: 1.7;
  }
}

.animation-hero__meta {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: $space-sm;
  margin: -$space-sm auto 0;
}

.animation-hero__chip {
  display: inline-flex;
  align-items: center;
  gap: $space-xs;
  padding: $space-sm $space-md;
  border-radius: $border-radius-full;
  border: 1px solid color-var-alpha('color-primary', 0.22);
  background: color-var-alpha('color-bg-primary', 0.6);
  color: $color-text-primary;
  font-size: $font-size-xs;
  letter-spacing: 0.01em;
  box-shadow: 0 2px 12px color-var-alpha('color-primary', 0.14);
}

.animation-hero__actions {
  display: flex;
  justify-content: center;
  gap: $space-lg;
  flex-wrap: wrap;
  margin-top: $space-md;
  align-items: center;
}

.animation-hero__link {
  display: inline-flex;
  align-items: center;
  gap: $space-sm;
  padding: $space-md $space-xl;
  border-radius: $border-radius-full;
  border: 1px solid color-var-alpha('panel-border', 0.35);
  background:
    linear-gradient(145deg, color-var-alpha('color-bg-secondary', 0.82), color-var-alpha('color-bg-secondary', 0.64));
  color: $color-text-primary;
  text-decoration: none;
  font-weight: $font-weight-medium;
  font-size: $font-size-sm;
  transition: all $transition-base;

  &:hover {
    border-color: color-var-alpha('color-primary', 0.5);
    background: color-var-alpha('color-primary', 0.12);
    color: $color-primary;
    transform: translateY(-2px);
    box-shadow:
      0 8px 24px color-var-alpha('color-primary', 0.15),
      0 0 0 1px color-var-alpha('color-primary', 0.08);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
