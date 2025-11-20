import { createI18n } from 'vue-i18n'
import uk from './locales/uk'
import en from './locales/en'

export const AVAILABLE_LOCALES = ['uk', 'en'] as const
export type Locale = typeof AVAILABLE_LOCALES[number]

export function getLocaleFromPath(): Locale {
  const pathParts = window.location.pathname.split('/').filter(Boolean)
  const firstPart = pathParts[0]

  if (AVAILABLE_LOCALES.includes(firstPart as any)) {
    return firstPart as Locale
  }

  return 'en'
}

const pathLocale = getLocaleFromPath()
const savedLocale = localStorage.getItem('locale') as Locale | null
const browserLocale = navigator.language.split('-')[0]
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
  localStorage.setItem('locale', locale)
  document.documentElement.setAttribute('lang', locale)
}

document.documentElement.setAttribute('lang', defaultLocale)
