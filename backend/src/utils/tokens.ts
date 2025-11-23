import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import type { Env } from '../config/env'

export function signAccessToken(env: Env, userId: string) {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: '15m' })
}

export function generateRefreshToken() {
  return crypto.randomBytes(32).toString('hex')
}

export function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex')
}
