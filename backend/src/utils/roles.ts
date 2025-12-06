import type { Env } from '../config/env'
import { isSuperAdminEmail } from '../config/super-admin'

export type UserRole = 'user' | 'moderator' | 'super_admin'

export function resolveUserRole(
  env: Env,
  user: { email?: string | null; isAdmin?: boolean | null; isSuperAdmin?: boolean | null }
) {
  const isSuperAdmin = Boolean(user.isSuperAdmin) || isSuperAdminEmail(env, user.email)
  const isAdmin = Boolean(user.isAdmin) || isSuperAdmin
  const role: UserRole = isSuperAdmin ? 'super_admin' : isAdmin ? 'moderator' : 'user'
  return { role, isAdmin, isSuperAdmin }
}

export function roleToFlags(role: UserRole) {
  if (role === 'super_admin') return { isAdmin: true, isSuperAdmin: true }
  if (role === 'moderator') return { isAdmin: true, isSuperAdmin: false }
  return { isAdmin: false, isSuperAdmin: false }
}
