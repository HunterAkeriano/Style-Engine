import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import type { Env } from '../../config/env'
import { generateRefreshToken, hashToken, signAccessToken } from '../../utils/tokens'

export interface AccessPair {
  accessToken: string
  refreshToken: string
  refreshHash: string
  refreshExpires: Date
}

export class TokenService {
  constructor(private readonly env: Env) {}

  issueAccess(userId: string) {
    return signAccessToken(this.env, userId)
  }

  issueRefresh(): AccessPair {
    const refreshToken = generateRefreshToken()
    const refreshHash = hashToken(refreshToken)
    const refreshExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    const accessToken = this.issueAccess('')
    return { accessToken, refreshToken, refreshHash, refreshExpires }
  }

  signPair(userId: string): AccessPair {
    const refreshToken = generateRefreshToken()
    const refreshHash = hashToken(refreshToken)
    const refreshExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    const accessToken = this.issueAccess(userId)
    return { accessToken, refreshToken, refreshHash, refreshExpires }
  }

  verifyAccess(token: string) {
    const payload = jwt.verify(token, this.env.JWT_SECRET) as { sub: string }
    return payload.sub
  }

  hashResetToken(token: string) {
    return crypto.createHash('sha256').update(token).digest('hex')
  }
}
