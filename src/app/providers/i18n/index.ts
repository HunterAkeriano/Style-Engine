import { createI18n } from 'vue-i18n'
import uk from './locales/uk'
import en from './locales/en'

export const AVAILABLE_LOCALES = ['uk', 'en'] as const
export type Locale = (typeof AVAILABLE_LOCALES)[number]

const hasWindow = typeof window !== 'undefined'

export function getLocaleFromPath(path?: string): Locale {
  const targetPath = path ?? (hasWindow ? window.location.pathname : '')
  const pathParts = targetPath.split('/').filter(Boolean)
  const localeFromPath = pathParts.find((part) => AVAILABLE_LOCALES.includes(part as Locale))

  return (localeFromPath as Locale) || 'en'
}

const pathLocale = getLocaleFromPath()
const savedLocale = hasWindow ? ((localStorage.getItem('locale') as Locale | null) ?? undefined) : undefined
const browserLocale = hasWindow ? navigator.language.split('-')[0] : 'en'
const defaultLocale = pathLocale || savedLocale || (browserLocale === 'uk' ? 'uk' : 'en')

export const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {
    uk,
    en
  }
})

export function setLocale(locale: Locale) {
  i18n.global.locale.value = locale
  if (hasWindow) {
    localStorage.setItem('locale', locale)
    document.documentElement.setAttribute('lang', locale)
  }
}

if (hasWindow) {
  document.documentElement.setAttribute('lang', defaultLocale)
}
