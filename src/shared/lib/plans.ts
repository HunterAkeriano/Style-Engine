export type PlanTier = 'free' | 'pro' | 'premium'

const planTranslationKeys: Record<PlanTier, string> = {
  free: 'FORUM.UNIT.FREE',
  pro: 'FORUM.UNIT.PRO',
  premium: 'FORUM.UNIT.PREMIUM'
}

export function resolvePlanLabel(t: (key: string, values?: Record<string, unknown>) => string, tier?: PlanTier) {
  const key = planTranslationKeys[tier ?? 'free'] ?? planTranslationKeys.free
  return t(key)
}

export function resolvePlanClass(tier?: PlanTier) {
  return tier ?? 'free'
}
