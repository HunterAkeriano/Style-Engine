import { ref, computed } from 'vue'
import { authAPI } from '@/shared/api/auth'
import { christmasGiftAPI } from '@/entities/christmas-gift'
import { useAuthStore } from '@/entities/user'

const GIFT_CLAIMED_KEY = 'christmas_gift_2025_claimed'

export function useChristmasGift() {
  const isModalOpen = ref(false)
  const isLoading = ref(false)
  const premiumGrantedDate = ref<string>()
  const alreadyClaimed = ref(false)
  const claimedLocal = ref(false)

  const authStore = useAuthStore()
  const isAuthenticated = computed(() => authAPI.isAuthenticated())
  const hasActiveSubscription = computed(() => {
    const user = authStore.user
    if (!user) return false
    const tier = user.subscriptionTier ?? 'free'
    const expiresAt = user.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt).getTime() : null
    if (tier !== 'premium') return false
    if (!expiresAt) return true
    return expiresAt > Date.now()
  })

  function checkIfClaimed(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(GIFT_CLAIMED_KEY) === 'true'
  }

  function markAsClaimed() {
    if (typeof window === 'undefined') return
    localStorage.setItem(GIFT_CLAIMED_KEY, 'true')
    claimedLocal.value = true
  }

  function resetClaimed() {
    if (typeof window === 'undefined') return
    localStorage.setItem(GIFT_CLAIMED_KEY, 'false')
    claimedLocal.value = false
  }

  if (typeof window !== 'undefined' && checkIfClaimed()) {
    claimedLocal.value = true
  }

  const treeVisible = computed(() => !claimedLocal.value && !hasActiveSubscription.value)

  async function handleTreeClick() {
    if (!isAuthenticated.value) {
      alreadyClaimed.value = false
      isModalOpen.value = true
      return
    }

    if (hasActiveSubscription.value) {
      alreadyClaimed.value = true
      markAsClaimed()
      isModalOpen.value = true
      return
    }

    if (claimedLocal.value || checkIfClaimed()) {
      alreadyClaimed.value = true
      isModalOpen.value = true
      return
    }

    isLoading.value = true
    try {
      const response = await christmasGiftAPI.claimGift()
      premiumGrantedDate.value = response.subscriptionExpiresAt
      alreadyClaimed.value = false
      markAsClaimed()

      await authStore.fetchProfile()

      isModalOpen.value = true
    } catch (error: unknown) {
      const apiError = error as { message?: string; status?: number }
      if (apiError.message?.includes('already claimed') || apiError.status === 409) {
        markAsClaimed()
        alreadyClaimed.value = true
      } else {
        resetClaimed()
        alreadyClaimed.value = false
      }
      isModalOpen.value = true
    } finally {
      isLoading.value = false
    }
  }

  function closeModal() {
    isModalOpen.value = false
  }

  return {
    isModalOpen,
    isLoading,
    premiumGrantedDate,
    alreadyClaimed,
    isAuthenticated,
    treeVisible,
    handleTreeClick,
    closeModal
  }
}
