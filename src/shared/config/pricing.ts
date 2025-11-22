export enum SubscriptionTier {
  FREE = 'free',
  PRO = 'pro',
  PREMIUM = 'premium'
}

export interface PricingPlan {
  tier: SubscriptionTier
  name: string
  price: number
  interval: 'month'
  limits: {
    savedTemplates: number
    exportFormats: string[]
    historyDays: number
    aiGenerations: number
  }
  features: string[]
  popular?: boolean
}

export const PRICING_PLANS: Record<SubscriptionTier, PricingPlan> = {
  [SubscriptionTier.FREE]: {
    tier: SubscriptionTier.FREE,
    name: 'Free',
    price: 0,
    interval: 'month',
    limits: {
      savedTemplates: 5,
      exportFormats: ['css'],
      historyDays: 0,
      aiGenerations: 0
    },
    features: [
      'PRICING.FREE_TEMPLATES',
      'PRICING.BASIC_GENERATORS',
      'PRICING.CSS_EXPORT',
      'PRICING.COMMUNITY_SUPPORT'
    ]
  },
  [SubscriptionTier.PRO]: {
    tier: SubscriptionTier.PRO,
    name: 'Pro',
    price: 5,
    interval: 'month',
    limits: {
      savedTemplates: 50,
      exportFormats: ['css', 'scss', 'json'],
      historyDays: 30,
      aiGenerations: 100
    },
    features: [
      'PRICING.PRO_TEMPLATES',
      'PRICING.ALL_GENERATORS',
      'PRICING.MULTIPLE_EXPORTS',
      'PRICING.HISTORY_30_DAYS',
      'PRICING.AI_GENERATIONS',
      'PRICING.PRIORITY_SUPPORT'
    ],
    popular: true
  },
  [SubscriptionTier.PREMIUM]: {
    tier: SubscriptionTier.PREMIUM,
    name: 'Premium',
    price: 10,
    interval: 'month',
    limits: {
      savedTemplates: -1, // unlimited
      exportFormats: ['css', 'scss', 'sass', 'less', 'json', 'figma', 'sketch'],
      historyDays: -1, // unlimited
      aiGenerations: -1 // unlimited
    },
    features: [
      'PRICING.UNLIMITED_TEMPLATES',
      'PRICING.ALL_GENERATORS',
      'PRICING.ALL_EXPORTS',
      'PRICING.UNLIMITED_HISTORY',
      'PRICING.UNLIMITED_AI',
      'PRICING.FIGMA_SKETCH_EXPORT',
      'PRICING.TEAM_COLLABORATION',
      'PRICING.PREMIUM_SUPPORT',
      'PRICING.EARLY_ACCESS'
    ]
  }
}

export type NumericLimitKey = Exclude<keyof PricingPlan['limits'], 'exportFormats'>

export function getUserLimit(tier: SubscriptionTier, limitType: NumericLimitKey): number {
  return PRICING_PLANS[tier].limits[limitType]
}

export function canUserSaveTemplate(tier: SubscriptionTier, currentCount: number): boolean {
  const limit = getUserLimit(tier, 'savedTemplates')
  if (limit === -1) return true // unlimited
  return currentCount < limit
}
