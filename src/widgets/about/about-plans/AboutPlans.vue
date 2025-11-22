<template>
  <section class="about-plans">
    <div class="about-plans__head">
      <div>
        <p class="about-plans__tag">{{ t('ABOUT.PLANS_TAG') }}</p>
        <h2 class="about-plans__title">{{ t('ABOUT.PLANS_TITLE') }}</h2>
        <p class="about-plans__subtitle">{{ t('ABOUT.PLANS_SUBTITLE') }}</p>
      </div>
    </div>

    <div class="about-plans__grid">
      <article
        v-for="plan in plans"
        :key="plan.tier"
        :class="['pricing-card', { 'pricing-card_popular': plan.popular }]"
      >
        <div v-if="plan.popular" class="pricing-card__badge">
          {{ t('PRICING.POPULAR') }}
        </div>

        <div class="pricing-card__header">
          <h3 class="pricing-card__name">{{ plan.name }}</h3>
          <div class="pricing-card__price">
            <span class="pricing-card__amount">${{ plan.price }}</span>
            <span class="pricing-card__interval">/ {{ t('PRICING.MONTHLY') }}</span>
          </div>
        </div>

        <ul class="pricing-card__features">
          <li
            v-for="(feature, index) in plan.features"
            :key="index"
            class="pricing-card__feature"
          >
            <Icon name="icon-check" :size="16" />
            <span>{{ t(feature) }}</span>
          </li>
        </ul>

        <Button
          :variant="plan.popular ? 'primary' : 'secondary'"
          size="lg"
          class="pricing-card__button"
          @click="$emit('select', plan.tier)"
        >
          {{ plan.price === 0 ? t('PRICING.GET_STARTED') : t('PRICING.UPGRADE') }}
        </Button>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button, Icon } from '@/shared/ui'
import type { PricingPlan, SubscriptionTier } from '@/shared/config/pricing'

interface Props {
  plans: PricingPlan[]
}

defineProps<Props>()

defineEmits<{
  (e: 'select', tier: SubscriptionTier): void
}>()

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./about-plans.scss"></style>
