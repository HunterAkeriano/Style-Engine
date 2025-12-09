import type { Env } from '../config/env'
export type UserRole = 'user' | 'moderator' | 'super_admin'

export function resolveUserRole(env: Env | undefined, user: { email?: string | null; role?: UserRole | null }) {
  const configuredSuper =
    env && user.email ? user.email.toLowerCase() === env.SUPER_ADMIN_EMAIL.toLowerCase() : false
  const fromRole = user.role || null
  const role: UserRole = fromRole ?? (configuredSuper ? 'super_admin' : 'user')
  return { role }
}
