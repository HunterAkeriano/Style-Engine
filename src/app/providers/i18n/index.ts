import { createI18n, type I18n } from 'vue-i18n'
import uk from './locales/uk'
import en from './locales/en'
import { AVAILABLE_LOCALES, type Locale, persistLocale, resolveInitialLocale } from '@/shared/config/locales'

const hasWindow = typeof window !== 'undefined'
const defaultLocale = resolveInitialLocale()

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
  persistLocale(locale)
}

export function getCurrentLocale(): Locale {
  const localeRef = i18n.global.locale as unknown as { value?: Locale }
  const current = localeRef.value
  return (AVAILABLE_LOCALES.includes(current as Locale) ? current : undefined) || 'en'
}

if (hasWindow) {
  document.documentElement.setAttribute('lang', defaultLocale)
}

export { AVAILABLE_LOCALES, getLocaleFromPath, type Locale } from '@/shared/config/locales'
