import { col, fn, literal, Op, where } from 'sequelize'
import type {
  Models,
  SavedAnimation,
  SavedClipPath,
  SavedFavicon,
  SavedGradient,
  SavedShadow
} from '../../models'
import type { Category } from '../../domain/saves/types'

type SavedModel =
  | typeof SavedGradient
  | typeof SavedShadow
  | typeof SavedAnimation
  | typeof SavedClipPath
  | typeof SavedFavicon

export class SavedItemRepository {
  private readonly modelMap: Record<Category, SavedModel>

  constructor(private readonly models: Models, private readonly env: { SUPER_ADMIN_EMAIL: string }) {
    this.modelMap = {
      gradient: models.SavedGradient,
      shadow: models.SavedShadow,
      animation: models.SavedAnimation,
      'clip-path': models.SavedClipPath,
      favicon: models.SavedFavicon
    }
  }

  private model(category: Category): SavedModel {
    return this.modelMap[category]
  }

  countByUser(userId: string) {
    return Promise.all([
      this.models.SavedGradient.count({ where: { userId } }),
      this.models.SavedShadow.count({ where: { userId } }),
      this.models.SavedAnimation.count({ where: { userId } }),
      this.models.SavedClipPath.count({ where: { userId } }),
      this.models.SavedFavicon.count({ where: { userId } })
    ]).then(([g, s, a, c, f]) => g + s + a + c + f)
  }

  findAllByUser(category: Category, userId: string) {
    return this.model(category).findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    })
  }

  findAllByStatus(category: Category, status: string) {
    return this.model(category).findAll({
      where: { status },
      order: [['createdAt', 'DESC']]
    })
  }

  findPublic(category: Category) {
    const model = this.model(category)
    const baseConditions = { status: 'approved' }
    const whereConditions =
      category !== 'clip-path'
        ? {
            ...baseConditions,
            [Op.and]: [
              {
                [Op.or]: [
                  { '$user.email$': null },
                  where(fn('LOWER', col('user.email')), { [Op.ne]: this.env.SUPER_ADMIN_EMAIL.toLowerCase() })
                ]
              }
            ]
          }
        : baseConditions

    return model.findAll({
      where: whereConditions,
      include: [{ model: this.models.User, as: 'user', attributes: ['name', 'email', 'avatarUrl'], required: false }],
      order: [
        ['isFeatured', 'DESC'],
        [literal('"approved_at"'), 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: 50
    })
  }

  create(category: Category, payload: any) {
    return this.model(category).create(payload)
  }

  findOne(category: Category, whereClause: any) {
    return this.model(category).findOne({ where: whereClause })
  }

  destroy(category: Category, whereClause: any) {
    return this.model(category).destroy({ where: whereClause })
  }
}
