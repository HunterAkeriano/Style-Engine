import { useApi } from '@/shared/api/client'
import type { ChristmasGiftResponse } from '../model/types'

const api = useApi()

class ChristmasGiftAPI {
  async claimGift(): Promise<ChristmasGiftResponse> {
    const response = await api.post<ChristmasGiftResponse>('/christmas-gift/claim')
    return response.data
  }
}

export const christmasGiftAPI = new ChristmasGiftAPI()
