const hasWindow = typeof window !== 'undefined'

export const AVAILABLE_LOCALES = ['uk', 'en'] as const
export type Locale = (typeof AVAILABLE_LOCALES)[number]

export function isLocale(value: string): value is Locale {
  return (AVAILABLE_LOCALES as readonly string[]).includes(value)
}

export function getLocaleFromPath(path?: string): Locale {
  const targetPath = path ?? (hasWindow ? window.location.pathname : '')
  const pathParts = targetPath.split('/').filter(Boolean)
  const localeFromPath = pathParts.find((part) => isLocale(part))

  return localeFromPath ? (localeFromPath as Locale) : 'en'
}

export function resolveInitialLocale(): Locale {
  const pathLocale = getLocaleFromPath()
  const savedLocale = hasWindow ? ((localStorage.getItem('locale') as Locale | null) ?? undefined) : undefined
  const browserLocale = hasWindow ? navigator.language.split('-')[0] : 'en'

  if (pathLocale) {
    return pathLocale
  }

  if (savedLocale && isLocale(savedLocale)) {
    return savedLocale
  }

  return browserLocale === 'uk' ? 'uk' : 'en'
}

export function persistLocale(locale: Locale) {
  if (hasWindow) {
    localStorage.setItem('locale', locale)
    document.documentElement.setAttribute('lang', locale)
  }
}
