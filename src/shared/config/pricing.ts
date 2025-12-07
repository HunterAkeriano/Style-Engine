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
      savedTemplates: 10,
      exportFormats: ['css', 'scss'],
      historyDays: 7,
      aiGenerations: 0
    },
    features: [
      'PRICING.FEATURE_GENERATORS',
      'PRICING.FEATURE_FORUM',
      'PRICING.FEATURE_SAVE_10',
      'PRICING.FEATURE_EXPORT_CORE',
      'PRICING.FEATURE_QUIZ'
    ]
  },
  [SubscriptionTier.PRO]: {
    tier: SubscriptionTier.PRO,
    name: 'Pro',
    price: 5,
    interval: 'month',
    limits: {
      savedTemplates: 200,
      exportFormats: ['css', 'scss', 'json'],
      historyDays: 30,
      aiGenerations: 0
    },
    features: [
      'PRICING.FEATURE_GENERATORS',
      'PRICING.FEATURE_FORUM',
      'PRICING.FEATURE_SAVE_200',
      'PRICING.FEATURE_EXPORT_PRO',
      'PRICING.FEATURE_SUPPORT_PRIORITY'
    ],
    popular: true
  },
  [SubscriptionTier.PREMIUM]: {
    tier: SubscriptionTier.PREMIUM,
    name: 'Premium',
    price: 10,
    interval: 'month',
    limits: {
      savedTemplates: -1,
      exportFormats: ['css', 'scss', 'sass', 'less', 'json'],
      historyDays: -1,
      aiGenerations: -1
    },
    features: [
      'PRICING.FEATURE_GENERATORS',
      'PRICING.FEATURE_FORUM',
      'PRICING.FEATURE_SAVE_UNLIMITED',
      'PRICING.FEATURE_EXPORT_FULL',
      'PRICING.FEATURE_SUPPORT_PREMIUM'
    ]
  }
}

export type NumericLimitKey = Exclude<keyof PricingPlan['limits'], 'exportFormats'>

export function getUserLimit(tier: SubscriptionTier, limitType: NumericLimitKey): number {
  return PRICING_PLANS[tier].limits[limitType]
}

export function canUserSaveTemplate(tier: SubscriptionTier, currentCount: number): boolean {
  const limit = getUserLimit(tier, 'savedTemplates')
  if (limit === -1) return true
  return currentCount < limit
}
