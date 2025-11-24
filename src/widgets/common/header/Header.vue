<template>
  <header class="header" :class="{ header_open: isMobileMenuOpen }">
    <div class="container">
      <div class="header__content">
        <Logo />

        <div class="header__mobile-title" aria-hidden="true">
          style engine
        </div>

        <nav class="header__nav">
          <NavLink :to="`/${locale}/gradient`" class-name="header__nav-link">
            {{ t('NAV.GRADIENTS') }}
          </NavLink>

          <NavLink :to="`/${locale}/shadow`" class-name="header__nav-link">
            {{ t('NAV.SHADOWS') }}
          </NavLink>

          <NavLink :to="`/${locale}/animation`" class-name="header__nav-link">
            {{ t('NAV.ANIMATIONS') }}
          </NavLink>

          <NavLink :to="`/${locale}/docs`" class-name="header__nav-link">
            {{ t('NAV.DOCS') }}
          </NavLink>

          <NavLink :to="`/${locale}/about`" class-name="header__nav-link">
            {{ t('NAV.ABOUT') }}
          </NavLink>
        </nav>

        <div class="header__actions">
          <ThemeSwitcher />
          <LanguageSwitcher />

          <template v-if="authStore.isAuthenticated && authStore.user">
            <UserMenu :user="authStore.user" />
          </template>
          <template v-else>
            <Button size="sm" variant="outline" @click="goToAuth">
              {{ t('NAV.LOGIN') }}
            </Button>
          </template>
        </div>

        <button class="header__mobile-toggle" @click="toggleMobileMenu">
          <Icon v-if="!isMobileMenuOpen" :size="24" name="icon-menu" />
          <Icon v-else :size="24" name="icon-close" />
        </button>
      </div>
    </div>

    <div
      ref="mobileMenuRef"
      class="header__mobile-menu"
      :class="{ 'header__mobile-menu_open': isMobileMenuOpen }"
      :aria-hidden="!isMobileMenuOpen"
    >
      <nav class="header__mobile-nav">
        <NavLink :to="`/${locale}/gradient`" class-name="header__mobile-link" @click="closeMobileMenu">
          {{ t('NAV.GRADIENTS') }}
        </NavLink>

        <NavLink :to="`/${locale}/shadow`" class-name="header__mobile-link" @click="closeMobileMenu">
          {{ t('NAV.SHADOWS') }}
        </NavLink>

        <NavLink :to="`/${locale}/animation`" class-name="header__mobile-link" @click="closeMobileMenu">
          {{ t('NAV.ANIMATIONS') }}
        </NavLink>

        <NavLink :to="`/${locale}/docs`" class-name="header__mobile-link" @click="closeMobileMenu">
          {{ t('NAV.DOCS') }}
        </NavLink>

        <NavLink :to="`/${locale}/about`" class-name="header__mobile-link" @click="closeMobileMenu">
          {{ t('NAV.ABOUT') }}
        </NavLink>
      </nav>

      <div class="header__mobile-actions">
        <ThemeSwitcher />
        <LanguageSwitcher />

        <template v-if="authStore.isAuthenticated && authStore.user">
          <NavLink :to="`/${locale}/profile`" class-name="header__mobile-link" @click="closeMobileMenu">
            {{ t('NAV.PROFILE') }}
          </NavLink>

          <Button size="md" variant="danger" style="width: 100%;" @click="handleLogout">
            {{ t('NAV.LOGOUT') }}
          </Button>
        </template>
        <template v-else>
          <Button size="md" variant="primary" style="width: 100%;" @click="goToAuth">
            {{ t('NAV.LOGIN') }}
          </Button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock-upgrade'
import { useAuthStore } from '@/entities'
import { LanguageSwitcher } from '@/features'
import Logo from '@/shared/ui/Logo/Logo.vue'
import { Button, Icon, NavLink, ThemeSwitcher } from '@/shared/ui'
import UserMenu from '@/widgets/common/user-menu/UserMenu.vue'

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
  router.push(`/${locale.value}/login`)
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

<style lang="scss" scoped src="./header.scss"></style>
