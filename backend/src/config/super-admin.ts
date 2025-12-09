import bcrypt from 'bcryptjs'
import { getModels } from './db'
import type { Env } from './env'

export async function ensureSuperAdmin(env: Env) {
  const { User } = getModels()
  const email = env.SUPER_ADMIN_EMAIL.toLowerCase()
  const passwordHash = await bcrypt.hash(env.SUPER_ADMIN_PASSWORD, 10)

  const existing = await User.findOne({ where: { email } })

  if (existing) {
    await existing.update({
      passwordHash,
      isPayment: true,
      role: 'super_admin',
      subscriptionTier: 'pro'
    })
    return
  }

  await User.create({
    email,
    passwordHash,
    isPayment: true,
    role: 'super_admin',
    subscriptionTier: 'pro'
  })
}

export function isSuperAdminEmail(env: Env, email?: string | null) {
  if (!email) return false
  return email.toLowerCase() === env.SUPER_ADMIN_EMAIL.toLowerCase()
}
