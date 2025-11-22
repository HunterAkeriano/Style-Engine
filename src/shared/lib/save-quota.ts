import { listSaves, type SaveCategory } from '@/shared/api/saves'
import { getUserLimit, SubscriptionTier } from '@/shared/config/pricing'
import { useAuthStore } from '@/entities'

export interface SaveQuotaResult {
  allowed: boolean
  limit: number
  used: number
  plan?: SubscriptionTier
}

export function resolveSubscriptionTier(value?: string | SubscriptionTier): SubscriptionTier | undefined {
  const normalized = typeof value === 'string' ? value.toLowerCase() : value
  if (!normalized) return undefined

  if (normalized === 'free') return SubscriptionTier.FREE
  if (normalized === 'pro') return SubscriptionTier.PRO
  if (normalized === 'premium') return SubscriptionTier.PREMIUM
  return undefined
}

export async function evaluateSaveQuota(category: SaveCategory): Promise<SaveQuotaResult> {
  const authStore = useAuthStore()
  const tier = resolveSubscriptionTier(authStore.user?.subscriptionTier ?? (authStore.userPlan as string | undefined))

  if (tier !== SubscriptionTier.PRO) {
    return { allowed: true, limit: Infinity, used: 0, plan: tier }
  }

  const limit = getUserLimit(SubscriptionTier.PRO, 'savedTemplates')
  if (limit === -1) {
    return { allowed: true, limit: Infinity, used: 0, plan: tier }
  }

  const saved = await listSaves(category)
  return {
    allowed: saved.length < limit,
    limit,
    used: saved.length,
    plan: tier
  }
}
