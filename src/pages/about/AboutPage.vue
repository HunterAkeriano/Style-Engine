<template>
  <div class="about-page">
    <div class="about-page__container">
      <Breadcrumbs />
      <AboutHero />
      <AboutMission />
      <AboutPlans :plans="plans" @select="handlePlanSelect" />
      <AboutCommunity />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { PRICING_PLANS, SubscriptionTier } from '@/shared/config/pricing'
import { Breadcrumbs } from '@/widgets/common'
import { AboutHero, AboutMission, AboutPlans, AboutCommunity } from '@/widgets/about'

const { locale } = useI18n()
const router = useRouter()

const plans = computed(() => [
  PRICING_PLANS[SubscriptionTier.FREE],
  PRICING_PLANS[SubscriptionTier.PRO],
  PRICING_PLANS[SubscriptionTier.PREMIUM]
])

function handlePlanSelect(tier: SubscriptionTier) {
  if (tier === SubscriptionTier.FREE) {
    router.push(`/${locale.value}/register`)
    return
  }

  router.push({
    path: `/${locale.value}/register`,
    query: { plan: tier }
  })
}
</script>

<style lang="scss" scoped src="./about-page.scss"></style>
