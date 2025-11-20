<template>
  <header class="header">
    <div class="container">
      <div class="header__content">
        <Logo />

        <nav class="header__nav">
          <NavLink to="/gradient" className="header__nav-link">
            {{ t('NAV.GRADIENTS') }}
          </NavLink>
          <NavLink to="/shadow" className="header__nav-link">
            {{ t('NAV.SHADOWS') }}
          </NavLink>
          <NavLink to="/animation" className="header__nav-link">
            {{ t('NAV.ANIMATIONS') }}
          </NavLink>
        </nav>

        <div class="header__actions">
          <ThemeSwitcher />
          <LanguageSwitcher />

          <template v-if="authStore.isAuthenticated && authStore.user">
            <UserMenu :user="authStore.user" />
          </template>
          <template v-else>
            <Button variant="outline" size="sm" @click="goToAuth">
              {{ t('NAV.LOGIN') }}
            </Button>
          </template>
        </div>

        <button class="header__mobile-toggle" @click="toggleMobileMenu">
          <Icon v-if="!isMobileMenuOpen" name="icon-menu" :size="24" />
          <Icon v-else name="icon-close" :size="24" />
        </button>
      </div>
    </div>

    <transition name="mobile-menu">
      <div v-if="isMobileMenuOpen" ref="mobileMenuRef" class="header__mobile-menu">

        <nav class="header__mobile-nav">
          <NavLink to="/gradient" className="header__mobile-link" @click="closeMobileMenu">
            {{ t('NAV.GRADIENTS') }}
          </NavLink>

          <NavLink to="/shadow" className="header__mobile-link" @click="closeMobileMenu">
            {{ t('NAV.SHADOWS') }}
          </NavLink>

          <NavLink to="/animation" className="header__mobile-link" @click="closeMobileMenu">
            {{ t('NAV.ANIMATIONS') }}
          </NavLink>
        </nav>

        <div class="header__mobile-actions">
          <ThemeSwitcher />
          <LanguageSwitcher />

          <template v-if="authStore.isAuthenticated && authStore.user">
            <NavLink to="/profile" className="header__mobile-link" @click="closeMobileMenu">
              {{ t('NAV.PROFILE') }}
            </NavLink>

            <Button variant="danger" size="md" @click="handleLogout" style="width: 100%;">
              {{ t('NAV.LOGOUT') }}
            </Button>
          </template>
          <template v-else>
            <Button variant="primary" size="md" @click="goToAuth" style="width: 100%;">
              {{ t('NAV.LOGIN') }}
            </Button>
          </template>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock-upgrade'
import { useAuthStore } from '@/entities'
import { LanguageSwitcher } from '@/features'
import Logo from '@/shared/ui/logo/Logo.vue'
import { Button, Icon, NavLink, ThemeSwitcher } from '@/shared/ui'
import UserMenu from '@/widgets/user-menu/UserMenu.vue'

const router = useRouter()
const authStore = useAuthStore()
const { t, locale } = useI18n()
const isMobileMenuOpen = ref(false)
const mobileMenuRef = ref<HTMLElement | null>(null)

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function goToAuth() {
  closeMobileMenu()
  router.push(`/${locale.value}/auth`)
}

function handleLogout() {
  authStore.logout()
  closeMobileMenu()
  router.push(`/${locale.value}`)
}

watch(isMobileMenuOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    if (mobileMenuRef.value) {
      disableBodyScroll(mobileMenuRef.value, {
        reserveScrollBarGap: true
      })
    }
  } else {
    clearAllBodyScrollLocks()
  }
})

onBeforeUnmount(() => {
  clearAllBodyScrollLocks()
})
</script>

<style lang="scss" scoped src="./Header.scss"></style>
