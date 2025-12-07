import type { Models } from '../../models'
import { ApiError } from '../../core/errors/api-error'

export class ChristmasGiftService {
  constructor(private readonly models: Models) {}

  async claimGift(userId: string): Promise<{ subscriptionExpiresAt: string; subscriptionTier: 'premium' }> {
    const user = await this.models.User.findByPk(userId)
    if (!user) {
      throw new Error('User not found')
    }

    const currentDate = new Date()
    const oneMonthLater = new Date(currentDate)
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1)

    const hasActiveSubscription =
      (user.subscriptionTier && user.subscriptionTier !== 'free') &&
      (!user.subscriptionExpiresAt || new Date(user.subscriptionExpiresAt) > currentDate)

    if (hasActiveSubscription) {
      throw new ApiError(409, 'Gift already claimed')
    }

    const newExpiresAt = oneMonthLater

    console.log('[ChristmasGift] Before update:', {
      userId,
      currentTier: user.subscriptionTier,
      currentExpiresAt: user.subscriptionExpiresAt
    })

    await this.models.User.update(
      {
        subscriptionTier: 'premium',
        subscriptionExpiresAt: newExpiresAt
      },
      {
        where: { id: userId }
      }
    )

    const updatedUser = await this.models.User.findByPk(userId)

    console.log('[ChristmasGift] After update from DB:', {
      userId,
      subscriptionTier: updatedUser?.subscriptionTier,
      subscriptionExpiresAt: updatedUser?.subscriptionExpiresAt
    })

    return {
      subscriptionExpiresAt: newExpiresAt.toISOString(),
      subscriptionTier: 'premium'
    }
  }
}
