import { Op, type Attributes, type InferCreationAttributes } from 'sequelize'
import type { Models, User } from '../../models'

export class UserRepository {
  constructor(private readonly models: Models) {}

  findById(id: string, attributes?: (keyof Attributes<User>)[]) {
    return this.models.User.findByPk(id, { attributes: attributes as any })
  }

  findByEmail(email: string, attributes?: (keyof Attributes<User>)[]) {
    return this.models.User.findOne({
      where: { email: email.toLowerCase() },
      attributes: attributes as any
    })
  }

  create(payload: Partial<InferCreationAttributes<User>>) {
    return this.models.User.create(payload as any)
  }

  update(user: User, patch: Partial<Attributes<User>>) {
    return user.update(patch)
  }

  countById(id: string) {
    return this.models.User.count({ where: { id } })
  }

  findUsers(options: {
    limit?: number
    offset?: number
    search?: string
    attributes?: (keyof Attributes<User>)[]
  }) {
    const where = options.search
      ? {
          [Op.or]: [
            { email: { [Op.iLike]: `%${options.search}%` } },
            { name: { [Op.iLike]: `%${options.search}%` } }
          ]
        }
      : undefined
    return this.models.User.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: options.limit,
      offset: options.offset,
      attributes: options.attributes as any
    })
  }
}
