import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import type { Env } from '../config/env'
import { getModels } from '../config/db'
import { sendApiError } from '../utils/apiError'
import { resolveUserRole, type UserRole } from '../utils/roles'

export interface AuthRequest extends Request {
  userId?: string
  authUser?: {
    id: string
    role: UserRole
    isAdmin: boolean
    isSuperAdmin: boolean
    isPayment: boolean
    subscriptionTier: 'free' | 'pro' | 'premium'
  }
}

type CachedAuthUser = NonNullable<AuthRequest['authUser']>
const AUTH_CACHE_TTL_MS = 60_000
const authCache = new Map<string, { data: CachedAuthUser; expiresAt: number }>()

function getCachedAuthUser(userId: string): CachedAuthUser | null {
  const cached = authCache.get(userId)
  if (!cached) return null
  if (cached.expiresAt < Date.now()) {
    authCache.delete(userId)
    return null
  }
  return cached.data
}

function setCachedAuthUser(user: CachedAuthUser) {
  authCache.set(user.id, { data: user, expiresAt: Date.now() + AUTH_CACHE_TTL_MS })
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
      const cached = getCachedAuthUser(payload.sub)
      if (cached) {
        req.userId = cached.id
        req.authUser = cached
        return next()
      }
      const { User } = getModels()
      const user = await User.findByPk(payload.sub, {
        attributes: ['id', 'email', 'isAdmin', 'isSuperAdmin', 'isPayment', 'subscriptionTier']
      })
      if (!user) {
        return sendApiError(res, 401, 'User not found')
      }

      const plain = user.get()
      const roleData = resolveUserRole(env, { email: plain.email, isAdmin: plain.isAdmin, isSuperAdmin: plain.isSuperAdmin })
      req.userId = plain.id
      req.authUser = {
        id: plain.id,
        role: roleData.role,
        isAdmin: roleData.isAdmin,
        isSuperAdmin: roleData.isSuperAdmin,
        isPayment: Boolean(plain.isPayment),
        subscriptionTier: (plain.subscriptionTier as 'free' | 'pro' | 'premium') ?? 'free'
      }
      setCachedAuthUser(req.authUser)
      next()
    } catch {
      sendApiError(res, 401, 'Invalid or expired token')
    }
  }
}

export function createOptionalAuthMiddleware(env: Env) {
  return async function optionalAuthMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization
    if (!header) {
      return next()
    }
    const [, token] = header.split(' ')
    if (!token) {
      return next()
    }
    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as { sub: string }
      const cached = getCachedAuthUser(payload.sub)
      if (cached) {
        req.userId = cached.id
        req.authUser = cached
        return next()
      }
      const { User } = getModels()
      const user = await User.findByPk(payload.sub, {
        attributes: ['id', 'email', 'isAdmin', 'isSuperAdmin', 'isPayment', 'subscriptionTier']
      })
      if (user) {
        const plain = user.get()
        const roleData = resolveUserRole(env, { email: plain.email, isAdmin: plain.isAdmin, isSuperAdmin: plain.isSuperAdmin })
        req.userId = plain.id
        req.authUser = {
          id: plain.id,
          role: roleData.role,
          isAdmin: roleData.isAdmin,
          isSuperAdmin: roleData.isSuperAdmin,
          isPayment: Boolean(plain.isPayment),
          subscriptionTier: (plain.subscriptionTier as 'free' | 'pro' | 'premium') ?? 'free'
        }
        setCachedAuthUser(req.authUser)
      }
    } catch {
    }
    next()
  }
}

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.authUser?.isAdmin) {
    return sendApiError(res, 403, 'Admin access required')
  }
  next()
}

export function requireModerator(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.authUser?.isAdmin && !req.authUser?.isSuperAdmin) {
    return sendApiError(res, 403, 'Moderator or admin access required')
  }
  next()
}