import { Router } from 'express'
import type { Env } from '../config/env'
import { createAuthRouter } from './auth'
import { createProfileRouter } from './profile'
import { createSavesRouter } from './saves'
import { createModerationRouter } from './moderation'
import { createUsersRouter } from './users'
import { createQuizRouter } from './quiz'
import { healthRouter } from './health'

export function createApiRouter(env: Env) {
  const router = Router()
  router.use('/health', healthRouter)
  router.use('/auth', createAuthRouter(env))
  router.use('/profile', createProfileRouter(env))
  router.use('/saves', createSavesRouter(env))
  router.use('/moderation', createModerationRouter(env))
  router.use('/users', createUsersRouter(env))
  router.use('/quiz', createQuizRouter(env))
  return router
}
