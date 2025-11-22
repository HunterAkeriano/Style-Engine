import bcrypt from 'bcryptjs'
import { getDb } from './db'
import type { Env } from './env'

export async function ensureSuperAdmin(env: Env) {
  const db = getDb()
  const email = env.SUPER_ADMIN_EMAIL.toLowerCase()
  const password = env.SUPER_ADMIN_PASSWORD

  const existing = await db.query(
    `SELECT id FROM users WHERE email = $1`,
    [email]
  )

  if (existing.rowCount) {
    await db.query(
      `UPDATE users SET is_admin = TRUE, is_payment = TRUE, subscription_tier = 'pro' WHERE email = $1`,
      [email]
    )
    return
  }

  const passwordHash = await bcrypt.hash(password, 10)
  await db.query(
    `INSERT INTO users (email, password_hash, is_admin, is_payment, subscription_tier)
     VALUES ($1, $2, TRUE, TRUE, 'pro')`,
    [email, passwordHash]
  )
}

export function isSuperAdminEmail(env: Env, email?: string | null) {
  if (!email) return false
  return email.toLowerCase() === env.SUPER_ADMIN_EMAIL.toLowerCase()
}
