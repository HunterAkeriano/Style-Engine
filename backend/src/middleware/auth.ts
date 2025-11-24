import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { Env } from '../config/env'
import { getDb } from '../config/db'

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
      return res.status(401).json({ message: 'Missing authorization header' })
    }
    const [, token] = header.split(' ')
    if (!token) {
      return res.status(401).json({ message: 'Invalid authorization header' })
    }
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string }
      const db = getDb()
      const result = await db.query(
        `SELECT id, is_admin as "isAdmin", is_payment as "isPayment", subscription_tier as "subscriptionTier"
         FROM users
         WHERE id = $1`,
        [payload.sub]
      )
      const user = result.rows[0]
      if (!user) {
        return res.status(401).json({ message: 'User not found' })
      }

      req.userId = user.id
      req.authUser = {
        id: user.id,
        isAdmin: Boolean(user.isAdmin),
        isPayment: Boolean(user.isPayment),
        subscriptionTier: (user.subscriptionTier as 'free' | 'pro' | 'premium') ?? 'free'
      }
      next()
    } catch {
      res.status(401).json({ message: 'Invalid or expired token' })
    }
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.authUser?.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}
