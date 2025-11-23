<template>
  <transition name="cookie-consent-fade">
    <div v-if="visible" class="cookie-consent" role="dialog" aria-live="polite">
      <div class="cookie-consent__bg" aria-hidden="true"></div>
      <div class="cookie-consent__content">
        <div class="cookie-consent__meta">
          <span class="cookie-consent__eyebrow">{{ t('COOKIE_MODAL.TAG') }}</span>
          <h2 class="cookie-consent__title">{{ t('COOKIE_MODAL.TITLE') }}</h2>
          <p class="cookie-consent__text">{{ t('COOKIE_MODAL.DESCRIPTION') }}</p>
          <div class="cookie-consent__links">

            <NavLink to="/privacy-policy" className="cookie-consent__link">
              {{ t('PRIVACY.NAV') }}
            </NavLink>

            <NavLink to="/cookie-policy" className="cookie-consent__link">
              {{ t('COOKIE.NAV') }}
            </NavLink>
          </div>
        </div>

        <div class="cookie-consent__actions">
          <Button size="md" variant="secondary" class="cookie-consent__btn" @click="handleDecline">
            {{ t('COOKIE_MODAL.DECLINE') }}
          </Button>
          <Button size="md" variant="primary" class="cookie-consent__btn" @click="handleAccept">
            {{ t('COOKIE_MODAL.ACCEPT') }}
          </Button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button, NavLink } from '@/shared/ui'
import { getCookie, setCookie, removeCookie } from '@/shared/lib/cookies'

const STORAGE_KEY = 'style-engine-cookie-accepted-at'
const SESSION_KEY = 'style-engine-cookie-dismissed'
const THIRTY_DAYS = 30

const visible = ref(false)
const { t } = useI18n()

const shouldShow = () => {
  if (typeof window === 'undefined') return false
  const sessionDismissed = getCookie(SESSION_KEY) === 'true'
  if (sessionDismissed) return false

  const acceptedAt = Number(getCookie(STORAGE_KEY) || 0)
  if (acceptedAt && Date.now() - acceptedAt < THIRTY_DAYS * 24 * 60 * 60 * 1000) return false
  return true
}

function handleAccept() {
  if (typeof window !== 'undefined') {
    setCookie(STORAGE_KEY, String(Date.now()), { days: THIRTY_DAYS, path: '/' })
    removeCookie(SESSION_KEY)
    console.log('Cookies accepted') // TODO: placeholder for real tracking/consent actions
  }
  visible.value = false
}

function handleDecline() {
  if (typeof window !== 'undefined') {
    setCookie(SESSION_KEY, 'true', { path: '/' })
  }
  visible.value = false
}

onMounted(() => {
  visible.value = shouldShow()
})
</script>

<style lang="scss" scoped src="./cookie-consent.scss"></style>
