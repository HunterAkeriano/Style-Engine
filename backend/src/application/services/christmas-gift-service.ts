import type { Models } from '../../models'

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

    let newExpiresAt: Date

    if (user.subscriptionExpiresAt && new Date(user.subscriptionExpiresAt) > currentDate) {
      const existingExpiration = new Date(user.subscriptionExpiresAt)
      newExpiresAt = new Date(existingExpiration)
      newExpiresAt.setMonth(newExpiresAt.getMonth() + 1)
    } else {
      newExpiresAt = oneMonthLater
    }

    user.subscriptionTier = 'premium'
    user.subscriptionExpiresAt = newExpiresAt.toISOString()
    await user.save()

    return {
      subscriptionExpiresAt: newExpiresAt.toISOString(),
      subscriptionTier: 'premium'
    }
  }

  async hasClaimedGift(userId: string): Promise<boolean> {
    const user = await this.models.User.findByPk(userId)
    if (!user) {
      return false
    }

    return user.subscriptionTier === 'premium' || user.subscriptionTier === 'pro'
  }
}
