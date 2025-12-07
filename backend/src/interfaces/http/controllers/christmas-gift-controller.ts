import { Router } from 'express'
import type { Env } from '../../../config/env'
import type { Models } from '../../../models'
import { ChristmasGiftService } from '../../../application/services/christmas-gift-service'
import type { HttpController } from '../api-router'
import { requireAuth } from '../../../middleware/auth'
import { sendApiError } from '../../../utils/apiError'

export class ChristmasGiftController implements HttpController {
  readonly basePath = '/christmas-gift'

  private readonly service: ChristmasGiftService

  constructor(
    private readonly env: Env,
    private readonly models: Models
  ) {
    this.service = new ChristmasGiftService(models)
  }

  register(router: Router): void {
    router.post('/claim', requireAuth, async (req, res) => {
      try {
        const userId = req.userId
        if (!userId) {
          return sendApiError(res, 'Unauthorized', 401)
        }

        const hasClaimed = await this.service.hasClaimedGift(userId)
        if (hasClaimed) {
          return sendApiError(res, 'Gift already claimed', 409)
        }

        const result = await this.service.claimGift(userId)

        res.json({
          message: 'Premium subscription granted successfully',
          subscriptionExpiresAt: result.subscriptionExpiresAt,
          subscriptionTier: result.subscriptionTier
        })
      } catch (error) {
        console.error('Error claiming Christmas gift:', error)
        sendApiError(res, 'Failed to claim gift', 500)
      }
    })
  }
}
