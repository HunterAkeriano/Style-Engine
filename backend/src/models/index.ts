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
  declare payload: Record<string, unknown>
  declare status: CreationOptional<SavedStatus>
  declare isFeatured: CreationOptional<boolean>
  declare approvedAt: Date | null
  declare createdAt: CreationOptional<Date>
}

export interface Models {
  User: typeof User
  RefreshToken: typeof RefreshToken
  PasswordReset: typeof PasswordReset
  SavedGradient: typeof SavedGradient
  SavedShadow: typeof SavedShadow
  SavedAnimation: typeof SavedAnimation
  SavedClipPath: typeof SavedClipPath
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
      payload: { type: DataTypes.JSONB, allowNull: false },
      status: { type: DataTypes.TEXT, allowNull: false, defaultValue: 'private' },
      isFeatured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'is_featured' },
      approvedAt: { type: DataTypes.DATE, allowNull: true, field: 'approved_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'created_at' }
    },
    { sequelize, tableName: 'saved_clip_paths', ...savedConfig }
  )

  User.hasMany(RefreshToken, { foreignKey: 'userId', as: 'refreshTokens' })
  RefreshToken.belongsTo(User, { foreignKey: 'userId', as: 'user' })

  User.hasMany(SavedGradient, { foreignKey: 'userId', as: 'savedGradients' })
  User.hasMany(SavedShadow, { foreignKey: 'userId', as: 'savedShadows' })
  User.hasMany(SavedAnimation, { foreignKey: 'userId', as: 'savedAnimations' })
  User.hasMany(SavedClipPath, { foreignKey: 'userId', as: 'savedClipPaths' })

  SavedGradient.belongsTo(User, { foreignKey: 'userId', as: 'user' })
  SavedShadow.belongsTo(User, { foreignKey: 'userId', as: 'user' })
  SavedAnimation.belongsTo(User, { foreignKey: 'userId', as: 'user' })
  SavedClipPath.belongsTo(User, { foreignKey: 'userId', as: 'user' })

  User.hasMany(PasswordReset, { foreignKey: 'userId', as: 'passwordResets' })
  PasswordReset.belongsTo(User, { foreignKey: 'userId', as: 'user' })

  return {
    User,
    RefreshToken,
    PasswordReset,
    SavedGradient,
    SavedShadow,
    SavedAnimation,
    SavedClipPath
  }
}
