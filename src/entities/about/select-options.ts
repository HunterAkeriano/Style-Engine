export type TierFilter = 'all' | 'free' | 'pro' | 'premium'

export interface TierFilterOption {
  value: TierFilter
  labelKey: string
}

export const ABOUT_TIER_FILTER_OPTIONS: TierFilterOption[] = [
  { value: 'all', labelKey: 'ABOUT.FILTER.ALL' },
  { value: 'free', labelKey: 'ABOUT.FILTER.FREE' },
  { value: 'pro', labelKey: 'ABOUT.FILTER.PRO' },
  { value: 'premium', labelKey: 'ABOUT.FILTER.PREMIUM' }
]
