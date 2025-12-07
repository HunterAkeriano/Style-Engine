import {
  DataTypes,
  Model,
  type CreationOptional,
  type ForeignKey,
  type InferAttributes,
  type InferCreationAttributes,
  type Sequelize
} from 'sequelize'

type SubscriptionTier = 'free' | 'pro' | 'premium'
type SavedStatus = 'private' | 'pending' | 'approved'
type QuizCategory = 'css' | 'scss' | 'stylus'
type QuizDifficulty = 'easy' | 'medium' | 'hard'
type QuizResultCategory = 'css' | 'scss' | 'stylus' | 'mix'
type ForumStatus = 'open' | 'in_review' | 'closed'
type Attachment = { type: 'image' | 'youtube'; url: string }

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>
  declare email: string
  declare passwordHash: string
  declare name: string | null
  declare avatarUrl: string | null
  declare isPayment: CreationOptional<boolean>
  declare subscriptionTier: CreationOptional<SubscriptionTier>
  declare subscriptionExpiresAt: Date | null
  declare isAdmin: CreationOptional<boolean>
  declare isSuperAdmin: CreationOptional<boolean>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export class RefreshToken extends Model<InferAttributes<RefreshToken>, InferCreationAttributes<RefreshToken>> {
  declare id: CreationOptional<string>
  declare userId: ForeignKey<User['id']>
  declare user?: User
  declare tokenHash: string
  declare expiresAt: Date
  declare revoked: CreationOptional<boolean>
  declare createdAt: CreationOptional<Date>
}

export class PasswordReset extends Model<InferAttributes<PasswordReset>, InferCreationAttributes<PasswordReset>> {
  declare id: CreationOptional<string>
  declare userId: ForeignKey<User['id']>
  declare user?: User
  declare tokenHash: string
  declare expiresAt: Date
  declare used: CreationOptional<boolean>
  declare createdAt: CreationOptional<Date>
}

export class SavedGradient extends Model<InferAttributes<SavedGradient>, InferCreationAttributes<SavedGradient>> {
  declare id: CreationOptional<string>
  declare userId: ForeignKey<User['id']> | null
  declare user?: User | null
  declare name: string
  declare payloadHash: string | null
  declare payload: Record<string, unknown>
  declare status: CreationOptional<SavedStatus>
  declare isFeatured: CreationOptional<boolean>
  declare approvedAt: Date | null
  declare createdAt: CreationOptional<Date>
}

export class SavedShadow extends Model<InferAttributes<SavedShadow>, InferCreationAttributes<SavedShadow>> {
  declare id: CreationOptional<string>
  declare userId: ForeignKey<User['id']> | null
  declare user?: User | null
  declare name: string
  declare payloadHash: string | null
  declare payload: Record<string, unknown>
  declare status: CreationOptional<SavedStatus>
  declare isFeatured: CreationOptional<boolean>
  declare approvedAt: Date | null
  declare createdAt: CreationOptional<Date>
}

export class SavedAnimation extends Model<InferAttributes<SavedAnimation>, InferCreationAttributes<SavedAnimation>> {
  declare id: CreationOptional<string>
  declare userId: ForeignKey<User['id']> | null
  declare user?: User | null
  declare name: string
  declare payloadHash: string | null
  declare payload: Record<string, unknown>
  declare status: CreationOptional<SavedStatus>
  declare isFeatured: CreationOptional<boolean>
  declare approvedAt: Date | null
  declare createdAt: CreationOptional<Date>
}

export class SavedClipPath extends Model<InferAttributes<SavedClipPath>, InferCreationAttributes<SavedClipPath>> {
  declare id: CreationOptional<string>
  declare userId: ForeignKey<User['id']> | null
  declare user?: User | null
  declare name: string
  declare payloadHash: string | null
  declare payload: Record<string, unknown>
  declare status: CreationOptional<SavedStatus>
  declare isFeatured: CreationOptional<boolean>
  declare approvedAt: Date | null
  declare createdAt: CreationOptional<Date>
}

export class SavedFavicon extends Model<InferAttributes<SavedFavicon>, InferCreationAttributes<SavedFavicon>> {
  declare id: CreationOptional<string>
  declare userId: ForeignKey<User['id']> | null
  declare user?: User | null
  declare name: string
  declare payloadHash: string | null
  declare payload: Record<string, unknown>
  declare status: CreationOptional<SavedStatus>
  declare isFeatured: CreationOptional<boolean>
  declare approvedAt: Date | null
  declare createdAt: CreationOptional<Date>
}

export class QuizQuestion extends Model<InferAttributes<QuizQuestion>, InferCreationAttributes<QuizQuestion>> {
  declare id: CreationOptional<string>
  declare questionText: string
  declare questionTextUk: string | null
  declare codeSnippet: string | null
  declare answers: string[]
  declare answersUk: string[] | null
  declare correctAnswerIndex: number
  declare explanation: string | null
  declare explanationUk: string | null
  declare category: CreationOptional<QuizCategory>
  declare difficulty: CreationOptional<QuizDifficulty>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export class QuizSettings extends Model<InferAttributes<QuizSettings>, InferCreationAttributes<QuizSettings>> {
  declare id: CreationOptional<string>
  declare questionsPerTest: CreationOptional<number>
  declare timePerQuestion: CreationOptional<number>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export class QuizResult extends Model<InferAttributes<QuizResult>, InferCreationAttributes<QuizResult>> {
  declare id: CreationOptional<string>
  declare userId: ForeignKey<User['id']> | null
  declare user?: User | null
  declare username: string | null
  declare category: QuizResultCategory
  declare score: number
  declare totalQuestions: number
  declare timeTaken: number
  declare createdAt: CreationOptional<Date>
}

export class QuizAttempt extends Model<InferAttributes<QuizAttempt>, InferCreationAttributes<QuizAttempt>> {
  declare id: CreationOptional<string>
  declare userId: ForeignKey<User['id']> | null
  declare user?: User | null
  declare ipAddress: string | null
  declare attemptDate: CreationOptional<Date>
  declare attemptsCount: CreationOptional<number>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export class ForumTopic extends Model<InferAttributes<ForumTopic>, InferCreationAttributes<ForumTopic>> {
  declare id: CreationOptional<string>
  declare userId: ForeignKey<User['id']>
  declare user?: User
  declare title: string
  declare description: string
  declare status: CreationOptional<ForumStatus>
  declare attachments: Attachment[]
  declare messagesCount: CreationOptional<number>
  declare lastActivityAt: CreationOptional<Date>
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export class ForumMessage extends Model<InferAttributes<ForumMessage>, InferCreationAttributes<ForumMessage>> {
  declare id: CreationOptional<string>
  declare topicId: ForeignKey<ForumTopic['id']>
  declare topic?: ForumTopic
  declare userId: ForeignKey<User['id']>
  declare user?: User
  declare parentId: ForeignKey<ForumMessage['id']> | null
  declare parent?: ForumMessage | null
  declare content: string
  declare attachments: Attachment[]
  declare editedAt: Date | null
  declare editedBy: string | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export class ForumMute extends Model<InferAttributes<ForumMute>, InferCreationAttributes<ForumMute>> {
  declare id: CreationOptional<string>
  declare userId: ForeignKey<User['id']>
  declare user?: User
  declare mutedBy: ForeignKey<User['id']>
  declare mutedByUser?: User
  declare expiresAt: Date | null
  declare reason: string | null
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

export interface Models {
  User: typeof User
  RefreshToken: typeof RefreshToken
  PasswordReset: typeof PasswordReset
  SavedGradient: typeof SavedGradient
  SavedShadow: typeof SavedShadow
  SavedAnimation: typeof SavedAnimation
  SavedClipPath: typeof SavedClipPath
  SavedFavicon: typeof SavedFavicon
  QuizQuestion: typeof QuizQuestion
  QuizSettings: typeof QuizSettings
  QuizResult: typeof QuizResult
  QuizAttempt: typeof QuizAttempt
  ForumTopic: typeof ForumTopic
  ForumMessage: typeof ForumMessage
  ForumMute: typeof ForumMute
}

export function initModels(sequelize: Sequelize): Models {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
      passwordHash: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'password_hash'
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      avatarUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'avatar_url'
      },
      isPayment: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_payment'
      },
      subscriptionTier: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'free',
        field: 'subscription_tier'
      },
      subscriptionExpiresAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'subscription_expires_at'
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_admin'
      },
      isSuperAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_super_admin'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'updated_at'
      }
    },
    {
      sequelize,
      tableName: 'users',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )

  RefreshToken.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id'
      },
      tokenHash: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'token_hash'
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
      },
      revoked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      tableName: 'refresh_tokens',
      underscored: true,
      updatedAt: false,
      createdAt: 'created_at'
    }
  )

  PasswordReset.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id'
      },
      tokenHash: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'token_hash'
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at'
      },
      used: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        field: 'created_at'
      }
    },
    {
      sequelize,
      tableName: 'password_resets',
      underscored: true,
      updatedAt: false,
      createdAt: 'created_at'
    }
  )

  const savedConfig = {
    underscored: true,
    updatedAt: false,
    createdAt: 'created_at'
  } as const

  SavedGradient.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: true, field: 'user_id' },
      name: { type: DataTypes.TEXT, allowNull: false },
      payloadHash: { type: DataTypes.TEXT, allowNull: true, field: 'payload_hash' },
      payload: { type: DataTypes.JSONB, allowNull: false },
      status: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'private' },
      isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_featured' },
      approvedAt: { type: DataTypes.DATE, allowNull: true, field: 'approved_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' }
    },
    { sequelize, tableName: 'saved_gradients', ...savedConfig }
  )

  SavedShadow.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: true, field: 'user_id' },
      name: { type: DataTypes.TEXT, allowNull: false },
      payloadHash: { type: DataTypes.TEXT, allowNull: true, field: 'payload_hash' },
      payload: { type: DataTypes.JSONB, allowNull: false },
      status: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'private' },
      isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_featured' },
      approvedAt: { type: DataTypes.DATE, allowNull: true, field: 'approved_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' }
    },
    { sequelize, tableName: 'saved_shadows', ...savedConfig }
  )

  SavedAnimation.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: true, field: 'user_id' },
      name: { type: DataTypes.TEXT, allowNull: false },
      payloadHash: { type: DataTypes.TEXT, allowNull: true, field: 'payload_hash' },
      payload: { type: DataTypes.JSONB, allowNull: false },
      status: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'private' },
      isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_featured' },
      approvedAt: { type: DataTypes.DATE, allowNull: true, field: 'approved_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' }
    },
    { sequelize, tableName: 'saved_animations', ...savedConfig }
  )

  SavedClipPath.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: true, field: 'user_id' },
      name: { type: DataTypes.TEXT, allowNull: false },
      payloadHash: { type: DataTypes.TEXT, allowNull: true, field: 'payload_hash' },
      payload: { type: DataTypes.JSONB, allowNull: false },
      status: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'private' },
      isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_featured' },
      approvedAt: { type: DataTypes.DATE, allowNull: true, field: 'approved_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' }
    },
    { sequelize, tableName: 'saved_clip_paths', ...savedConfig }
  )

  SavedFavicon.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: true, field: 'user_id' },
      name: { type: DataTypes.TEXT, allowNull: false },
      payloadHash: { type: DataTypes.TEXT, allowNull: true, field: 'payload_hash' },
      payload: { type: DataTypes.JSONB, allowNull: false },
      status: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'private' },
      isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_featured' },
      approvedAt: { type: DataTypes.DATE, allowNull: true, field: 'approved_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' }
    },
    { sequelize, tableName: 'saved_favicons', ...savedConfig }
  )

  User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' })
  RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' })

  User.hasMany(SavedGradient, { foreignKey: 'userId', as: 'savedGradients' })
  User.hasMany(SavedShadow, { foreignKey: 'userId', as: 'savedShadows' })
  User.hasMany(SavedAnimation, { foreignKey: 'userId', as: 'savedAnimations' })
  User.hasMany(SavedClipPath, { foreignKey: 'userId', as: 'savedClipPaths' })
  User.hasMany(SavedFavicon, { foreignKey: 'userId', as: 'savedFavicons' })

  SavedGradient.belongsTo(User, { foreignKey: 'userId', as: 'user' })
  SavedShadow.belongsTo(User, { foreignKey: 'userId', as: 'user' })
  SavedAnimation.belongsTo(User, { foreignKey: 'userId', as: 'user' })
  SavedClipPath.belongsTo(User, { foreignKey: 'userId', as: 'user' })
  SavedFavicon.belongsTo(User, { foreignKey: 'userId', as: 'user' })

  User.hasMany(PasswordReset, { foreignKey: 'userId', as: 'passwordResets' })
  PasswordReset.belongsTo(User, { foreignKey: 'userId', as: 'user' })

  // Quiz models initialization
  QuizQuestion.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      questionText: { type: DataTypes.TEXT, allowNull: false, field: 'question_text' },
      questionTextUk: { type: DataTypes.TEXT, allowNull: true, field: 'question_text_uk' },
      codeSnippet: { type: DataTypes.TEXT, allowNull: true, field: 'code_snippet' },
      answers: { type: DataTypes.JSONB, allowNull: false },
      answersUk: { type: DataTypes.JSONB, allowNull: true, field: 'answers_uk' },
      correctAnswerIndex: { type: DataTypes.INTEGER, allowNull: false, field: 'correct_answer_index' },
      explanation: { type: DataTypes.TEXT, allowNull: true },
      explanationUk: { type: DataTypes.TEXT, allowNull: true, field: 'explanation_uk' },
      category: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'css' },
      difficulty: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'medium' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' }
    },
    {
      sequelize,
      tableName: 'quiz_questions',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )

  QuizSettings.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      questionsPerTest: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 20, field: 'questions_per_test' },
      timePerQuestion: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 60, field: 'time_per_question' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' }
    },
    {
      sequelize,
      tableName: 'quiz_settings',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )

  QuizResult.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: true, field: 'user_id' },
      username: { type: DataTypes.TEXT, allowNull: true },
      category: { type: DataTypes.TEXT, allowNull: false },
      score: { type: DataTypes.INTEGER, allowNull: false },
      totalQuestions: { type: DataTypes.INTEGER, allowNull: false, field: 'total_questions' },
      timeTaken: { type: DataTypes.INTEGER, allowNull: false, field: 'time_taken' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' }
    },
    {
      sequelize,
      tableName: 'quiz_results',
      underscored: true,
      updatedAt: false,
      createdAt: 'created_at'
    }
  )

  QuizAttempt.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: true, field: 'user_id' },
      ipAddress: { type: DataTypes.TEXT, allowNull: true, field: 'ip_address' },
      attemptDate: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW, field: 'attempt_date' },
      attemptsCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, field: 'attempts_count' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' }
    },
    {
      sequelize,
      tableName: 'quiz_attempts',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )

  ForumTopic.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
      title: { type: DataTypes.TEXT, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      status: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'open' },
      attachments: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      messagesCount: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'messages_count' },
      lastActivityAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'last_activity_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' }
    },
    {
      sequelize,
      tableName: 'forum_topics',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )

  ForumMessage.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      topicId: { type: DataTypes.UUID, allowNull: false, field: 'topic_id' },
      userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
      parentId: { type: DataTypes.UUID, allowNull: true, field: 'parent_id' },
      content: { type: DataTypes.TEXT, allowNull: false },
      attachments: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      editedAt: { type: DataTypes.DATE, allowNull: true, field: 'edited_at' },
      editedBy: { type: DataTypes.TEXT, allowNull: true, field: 'edited_by' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' }
    },
    {
      sequelize,
      tableName: 'forum_messages',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )

  ForumMute.init(
    {
      id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
      userId: { type: DataTypes.UUID, allowNull: false, field: 'user_id' },
      mutedBy: { type: DataTypes.UUID, allowNull: false, field: 'muted_by' },
      expiresAt: { type: DataTypes.DATE, allowNull: true, field: 'expires_at' },
      reason: { type: DataTypes.TEXT, allowNull: true },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'updated_at' }
    },
    {
      sequelize,
      tableName: 'forum_mutes',
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )

  // Quiz relationships
  User.hasMany(QuizResult, { foreignKey: 'userId', as: 'quizResults' })
  QuizResult.belongsTo(User, { foreignKey: 'userId', as: 'user' })

  User.hasMany(QuizAttempt, { foreignKey: 'userId', as: 'quizAttempts' })
  QuizAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' })

  ForumTopic.belongsTo(User, { foreignKey: 'userId', as: 'user' })
  ForumTopic.hasMany(ForumMessage, { foreignKey: 'topicId', as: 'messages' })
  ForumMessage.belongsTo(ForumTopic, { foreignKey: 'topicId', as: 'topic' })
  ForumMessage.belongsTo(User, { foreignKey: 'userId', as: 'user' })
  ForumMessage.belongsTo(ForumMessage, { foreignKey: 'parentId', as: 'parent' })
  ForumMessage.hasMany(ForumMessage, { foreignKey: 'parentId', as: 'replies' })
  ForumMute.belongsTo(User, { foreignKey: 'userId', as: 'user' })
  ForumMute.belongsTo(User, { foreignKey: 'mutedBy', as: 'mutedByUser' })

  return {
    User,
    RefreshToken,
    PasswordReset,
    SavedGradient,
    SavedShadow,
    SavedAnimation,
    SavedClipPath,
    SavedFavicon,
    QuizQuestion,
    QuizSettings,
    QuizResult,
    QuizAttempt,
    ForumTopic,
    ForumMessage,
    ForumMute
  }
}
