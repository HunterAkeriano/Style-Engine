import { Router } from 'express'
import type { Env } from '../../../config/env'
import type { Models } from '../../../models'
import { ChristmasGiftService } from '../../../application/services/christmas-gift-service'
import { ProfileService } from '../../../application/services/profile-service'
import { UserRepository } from '../../../infrastructure/repositories/user-repository'
import type { HttpController } from '../api-router'
import { createAuthMiddleware, clearAuthCache, type AuthRequest } from '../../../middleware/auth'
import { sendApiError } from '../../../utils/apiError'

export class ChristmasGiftController implements HttpController {
  readonly basePath = '/christmas-gift'

  private readonly authMiddleware
  private readonly service: ChristmasGiftService
  private readonly profileService: ProfileService

  constructor(
    private readonly env: Env,
    private readonly models: Models
  ) {
    this.authMiddleware = createAuthMiddleware(env)
    this.service = new ChristmasGiftService(models)
    this.profileService = new ProfileService(env, new UserRepository(models))
  }

  register(router: Router): void {
    router.post('/claim', this.authMiddleware, async (req, res) => {
      try {
        const authReq = req as AuthRequest
        const userId = authReq.userId
        if (!userId) {
          return sendApiError(res, 401, 'Unauthorized')
        }

        console.log('[ChristmasGift] Claiming gift for user:', userId)

        const result = await this.service.claimGift(userId)

        this.profileService.clearCache(userId)
        clearAuthCache(userId)

        console.log('[ChristmasGift] Gift claimed successfully, all caches cleared:', result)

        res.json({
          message: 'Premium subscription granted successfully',
          subscriptionExpiresAt: result.subscriptionExpiresAt,
          subscriptionTier: result.subscriptionTier
        })
      } catch (error) {
        console.error('[ChristmasGift] Error claiming gift:', error)
        sendApiError(res, 500, 'Failed to claim gift')
      }
    })
  }
}
