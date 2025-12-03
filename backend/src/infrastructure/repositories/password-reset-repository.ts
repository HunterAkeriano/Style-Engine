import { Op, type Attributes, type InferCreationAttributes } from 'sequelize'
import type { Models, PasswordReset } from '../../models'

export class PasswordResetRepository {
  constructor(private readonly models: Models) {}

  create(payload: Partial<InferCreationAttributes<PasswordReset>>) {
    return this.models.PasswordReset.create(payload as any)
  }

  findValid(tokenHash: string, now = new Date()) {
    return this.models.PasswordReset.findOne({
      where: {
        tokenHash,
        used: false,
        expiresAt: { [Op.gt]: now }
      }
    })
  }

  markUsed(reset: PasswordReset) {
    return reset.update({ used: true })
  }
}
