import { ref, computed } from 'vue'
import { authAPI } from '@/shared/api/auth'
import { christmasGiftAPI } from '@/entities/christmas-gift'

const GIFT_CLAIMED_KEY = 'christmas_gift_2025_claimed'

export function useChristmasGift() {
  const isModalOpen = ref(false)
  const isLoading = ref(false)
  const premiumGrantedDate = ref<string>()
  const alreadyClaimed = ref(false)

  const isAuthenticated = computed(() => authAPI.isAuthenticated())

  function checkIfClaimed(): boolean {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(GIFT_CLAIMED_KEY) === 'true'
  }

  function markAsClaimed() {
    if (typeof window === 'undefined') return
    localStorage.setItem(GIFT_CLAIMED_KEY, 'true')
  }

  function resetClaimed() {
    if (typeof window === 'undefined') return
    localStorage.setItem(GIFT_CLAIMED_KEY, 'false')
  }

  async function handleTreeClick() {
    if (!isAuthenticated.value) {
      alreadyClaimed.value = false
      isModalOpen.value = true
      return
    }

    if (checkIfClaimed()) {
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
    handleTreeClick,
    closeModal
  }
}
