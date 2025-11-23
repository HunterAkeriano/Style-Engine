export interface CookieOptions {
  days?: number
  path?: string
  secure?: boolean
  sameSite?: 'Lax' | 'Strict' | 'None'
}

const isBrowser = () => typeof document !== 'undefined'

export function setCookie(name: string, value: string, options: CookieOptions = {}) {
  if (!isBrowser()) return
  const { days, path = '/', sameSite = 'Lax', secure } = options
  const encoded = encodeURIComponent(value)
  let cookie = `${name}=${encoded}; path=${path}; SameSite=${sameSite}`

  if (days) {
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    cookie += `; expires=${expires.toUTCString()}`
  }

  const shouldSecure = secure ?? (typeof window !== 'undefined' && window.location.protocol === 'https:')
  if (shouldSecure) {
    cookie += '; Secure'
  }

  document.cookie = cookie
}

export function getCookie(name: string): string | null {
  if (!isBrowser()) return null
  const cookies = document.cookie ? document.cookie.split('; ') : []
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split('=')
    if (key === name) {
      return decodeURIComponent(rest.join('='))
    }
  }
  return null
}

export function removeCookie(name: string, path = '/') {
  if (!isBrowser()) return
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`
}
