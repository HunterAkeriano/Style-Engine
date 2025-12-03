import { Op, type Attributes, type InferCreationAttributes } from 'sequelize'
import type { Models, RefreshToken } from '../../models'

export class RefreshTokenRepository {
  constructor(private readonly models: Models) {}

  create(payload: Partial<InferCreationAttributes<RefreshToken>>) {
    return this.models.RefreshToken.create(payload as any)
  }

  findValid(tokenHash: string, now = new Date()) {
    return this.models.RefreshToken.findOne({
      where: {
        tokenHash,
        revoked: false,
        expiresAt: { [Op.gt]: now }
      }
    })
  }

  revokeByHash(tokenHash: string) {
    return this.models.RefreshToken.update({ revoked: true }, { where: { tokenHash } })
  }
}
