import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { Env } from '../config/env'
import { getModels } from '../config/db'
import { sendApiError } from '../utils/apiError'

export interface AuthRequest extends Request {
  userId?: string
  authUser?: {
    id: string
    isAdmin: boolean
    isPayment: boolean
    subscriptionTier: 'free' | 'pro' | 'premium'
  }
}

export function createAuthMiddleware(env: Env) {
  return async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization
    if (!header) {
      return sendApiError(res, 401, 'Missing authorization header')
    }
    const [, token] = header.split(' ')
    if (!token) {
      return sendApiError(res, 401, 'Invalid authorization header')
    }
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string }
      const { User } = getModels()
      const user = await User.findByPk(payload.sub, {
        attributes: ['id', 'isAdmin', 'isPayment', 'subscriptionTier']
      })
      if (!user) {
        return sendApiError(res, 401, 'User not found')
      }

      const plain = user.get()
      req.userId = plain.id
      req.authUser = {
        id: plain.id,
        isAdmin: Boolean(plain.isAdmin),
        isPayment: Boolean(plain.isPayment),
        subscriptionTier: (plain.subscriptionTier as 'free' | 'pro' | 'premium') ?? 'free'
      }
      next()
    } catch {
      sendApiError(res, 401, 'Invalid or expired token')
    }
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.authUser?.isAdmin) {
    return sendApiError(res, 403, 'Admin access required')
  }
  next()
}
