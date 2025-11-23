import { createI18n, type I18n } from 'vue-i18n'
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

function createI18nInstance(locale: Locale) {
  return createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages: {
      uk,
      en
    }
  })
}

export let i18n: I18n = createI18nInstance(defaultLocale) as unknown as I18n

export function initI18n(locale: Locale): I18n {
  i18n = createI18nInstance(locale) as unknown as I18n
  return i18n
}

export function setLocale(locale: Locale) {
  const localeRef = i18n.global.locale as unknown as { value?: Locale }
  localeRef.value = locale
  if (hasWindow) {
    localStorage.setItem('locale', locale)
    document.documentElement.setAttribute('lang', locale)
  }
}

export function getCurrentLocale(): Locale {
  const localeRef = i18n.global.locale as unknown as { value?: Locale }
  const current = localeRef.value
  return (AVAILABLE_LOCALES.includes(current as Locale) ? current : undefined) || 'en'
}

if (hasWindow) {
  document.documentElement.setAttribute('lang', defaultLocale)
}
