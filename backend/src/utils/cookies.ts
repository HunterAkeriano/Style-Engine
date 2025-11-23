export function parseCookies(cookieHeader?: string): Record<string, string> {
  if (!cookieHeader) return {}
  return cookieHeader.split(';').reduce<Record<string, string>>((acc, part) => {
    const [key, ...rest] = part.trim().split('=')
    if (!key) return acc
    acc[key] = decodeURIComponent(rest.join('='))
    return acc
  }, {})
}

export function serializeCookie(
  name: string,
  value: string,
  options: {
    httpOnly?: boolean
    secure?: boolean
    path?: string
    sameSite?: 'lax' | 'strict' | 'none'
    maxAge?: number
  } = {}
): string {
  const segments = [`${name}=${encodeURIComponent(value)}`]
  if (options.maxAge !== undefined) segments.push(`Max-Age=${options.maxAge}`)
  segments.push(`Path=${options.path ?? '/'}`)
  if (options.httpOnly) segments.push('HttpOnly')
  if (options.secure) segments.push('Secure')
  if (options.sameSite) segments.push(`SameSite=${options.sameSite}`)
  return segments.join('; ')
}
