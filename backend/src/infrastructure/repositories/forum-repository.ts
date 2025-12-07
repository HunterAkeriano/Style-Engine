import type { Attributes, InferCreationAttributes, WhereOptions } from 'sequelize'
import type { ForumMessage, ForumMute, ForumTopic, Models } from '../../models'
import { Op } from 'sequelize'

export type ForumStatus = 'open' | 'in_review' | 'closed'

export interface TopicQueryOptions {
  page: number
  limit: number
  status?: ForumStatus
}

export class ForumRepository {
  constructor(private readonly models: Models) {}

  listTopics(options: TopicQueryOptions) {
    const where: WhereOptions<Attributes<ForumTopic>> = {}
    if (options.status) {
      where.status = options.status
    }

    return this.models.ForumTopic.findAndCountAll({
      where,
      order: [
        [{ model: this.models.ForumPinnedTopic, as: 'pin' }, 'createdAt', 'DESC'],
        ['lastActivityAt', 'DESC'],
        ['createdAt', 'DESC']
      ],
      distinct: true,
      col: 'id',
      limit: options.limit,
      offset: (options.page - 1) * options.limit,
      include: [
        {
          model: this.models.ForumPinnedTopic,
          as: 'pin',
          attributes: ['id', 'createdAt', 'createdBy'],
          required: false
        },
        {
          model: this.models.User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatarUrl', 'isAdmin', 'subscriptionTier']
        }
      ]
    })
  }

  createTopic(payload: InferCreationAttributes<ForumTopic>) {
    return this.models.ForumTopic.create(payload)
  }

  findTopicById(id: string) {
    return this.models.ForumTopic.findByPk(id, {
      include: [
        {
          model: this.models.ForumPinnedTopic,
          as: 'pin',
          attributes: ['id', 'createdAt', 'createdBy'],
          required: false
        },
        {
          model: this.models.User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatarUrl', 'isAdmin', 'subscriptionTier']
        }
      ]
    })
  }

  updateTopic(topic: ForumTopic, patch: Partial<Attributes<ForumTopic>>) {
    return topic.update(patch)
  }

  findMessageById(id: string) {
    return this.models.ForumMessage.findByPk(id, {
      include: [
        {
          model: this.models.User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatarUrl', 'isAdmin', 'subscriptionTier']
        }
      ]
    })
  }

  listMessages(topicId: string) {
    return this.models.ForumMessage.findAll({
      where: { topicId },
      order: [
        ['createdAt', 'ASC'],
        ['id', 'ASC']
      ],
      include: [
        {
          model: this.models.User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatarUrl', 'isAdmin', 'subscriptionTier']
        },
        { model: this.models.ForumMessage, as: 'parent', attributes: ['id', 'userId'] }
      ]
    })
  }

  createMessage(payload: InferCreationAttributes<ForumMessage>) {
    return this.models.ForumMessage.create(payload)
  }

  deleteMessagesByUser(topicId: string, userId: string) {
    return this.models.ForumMessage.destroy({
      where: { topicId, userId }
    })
  }

  findUserOpenTopics(userId: string) {
    return this.models.ForumTopic.findAll({
      where: {
        userId,
        status: ['open', 'in_review']
      },
      attributes: ['id', 'status'],
      order: [['lastActivityAt', 'DESC']]
    })
  }

  pinTopic(topicId: string, createdBy: string) {
    return this.models.ForumPinnedTopic.upsert({ topicId, createdBy })
  }

  unpinTopic(topicId: string) {
    return this.models.ForumPinnedTopic.destroy({ where: { topicId } })
  }

  listPinnedTopics(limit: number) {
    return this.models.ForumPinnedTopic.findAll({
      order: [['createdAt', 'DESC']],
      limit,
      include: [
        {
          model: this.models.ForumTopic,
          as: 'topic',
          include: [
            {
              model: this.models.User,
              as: 'user',
              attributes: ['id', 'name', 'email', 'avatarUrl', 'isAdmin', 'subscriptionTier']
            }
          ]
        }
      ]
    })
  }

  createMute(payload: InferCreationAttributes<ForumMute>) {
    return this.models.ForumMute.create(payload)
  }

  findActiveMute(userId: string) {
    return this.models.ForumMute.findOne({
      where: {
        userId,
        [Op.or]: [
          { expiresAt: null },
          { expiresAt: { [Op.gt]: new Date() } }
        ]
      }
    })
  }

  findAllActiveMutes(userId: string) {
    return this.models.ForumMute.findAll({
      where: {
        userId,
        [Op.or]: [
          { expiresAt: null },
          { expiresAt: { [Op.gt]: new Date() } }
        ]
      }
    })
  }

  removeMute(userId: string) {
    return this.models.ForumMute.destroy({
      where: { userId }
    })
  }

  async getTopicParticipants(topicId: string) {
    const messages = await this.models.ForumMessage.findAll({
      where: { topicId },
      attributes: ['userId'],
      include: [
        {
          model: this.models.User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatarUrl', 'isAdmin', 'isSuperAdmin', 'subscriptionTier']
        }
      ]
    })

    const uniqueUsers = new Map()
    messages.forEach(msg => {
      if (msg.user && !uniqueUsers.has(msg.userId)) {
        uniqueUsers.set(msg.userId, msg)
      }
    })

    return Array.from(uniqueUsers.values())
  }
}
