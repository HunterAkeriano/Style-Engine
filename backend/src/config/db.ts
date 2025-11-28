import { Sequelize } from 'sequelize'
import type { Env } from './env'
import { initModels, type Models } from '../models'

let sequelize: Sequelize | null = null
let models: Models | null = null

export function initDb(env: Env) {
  sequelize = new Sequelize(env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: env.NODE_ENV === 'production' ? { ssl: { require: true, rejectUnauthorized: false } } : undefined
  })
  models = initModels(sequelize)
  return { sequelize, models }
}

export function getSequelize() {
  if (!sequelize) {
    throw new Error('DB not initialized')
  }
  return sequelize
}

export function getModels() {
  if (!models) {
    throw new Error('Models not initialized')
  }
  return models
}
