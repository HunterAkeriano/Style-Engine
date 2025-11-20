<template>
  <header class="header">
    <div class="container">
      <div class="header__content">
        <Logo />

        <nav class="header__nav">
          <router-link to="/gradient" class="header__nav-link">
            {{ t('nav.gradients') }}
          </router-link>
          <router-link to="/shadow" class="header__nav-link">
            {{ t('nav.shadows') }}
          </router-link>
          <router-link to="/animation" class="header__nav-link">
            {{ t('nav.animations') }}
          </router-link>
        </nav>

        <div class="header__actions">
          <button class="header__lang-switcher" @click="toggleLanguage" :title="t('common.language')">
            {{ currentLocale.toUpperCase() }}
          </button>

          <template v-if="authStore.isAuthenticated && authStore.user">
            <UserMenu :user="authStore.user" />
          </template>
          <template v-else>
            <Button variant="outline" size="sm" @click="goToAuth">
              {{ t('nav.login') }}
            </Button>
          </template>
        </div>

        <button class="header__mobile-toggle" @click="toggleMobileMenu">
          <svg v-if="!isMobileMenuOpen" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M3 12h18M3 6h18M3 18h18" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
          </svg>
        </button>
      </div>

      <transition name="mobile-menu">
        <div v-if="isMobileMenuOpen" ref="mobileMenuRef" class="header__mobile-menu">
          <nav class="header__mobile-nav">
            <router-link to="/gradient" class="header__mobile-link" @click="closeMobileMenu">
              {{ t('nav.gradients') }}
            </router-link>
            <router-link to="/shadow" class="header__mobile-link" @click="closeMobileMenu">
              {{ t('nav.shadows') }}
            </router-link>
            <router-link to="/animation" class="header__mobile-link" @click="closeMobileMenu">
              {{ t('nav.animations') }}
            </router-link>
          </nav>

          <div class="header__mobile-actions">
            <button class="header__mobile-link" @click="toggleLanguage">
              {{ currentLocale === 'uk' ? 'EN' : 'UA' }}
            </button>

            <template v-if="authStore.isAuthenticated && authStore.user">
              <router-link to="/profile" class="header__mobile-link" @click="closeMobileMenu">
                {{ t('nav.profile') }}
              </router-link>
              <button class="header__mobile-link header__mobile-link--danger" @click="handleLogout">
                {{ t('nav.logout') }}
              </button>
            </template>
            <template v-else>
              <Button variant="primary" size="md" @click="goToAuth" style="width: 100%;">
                {{ t('nav.login') }}
              </Button>
            </template>
          </div>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock-upgrade'
import { useAuthStore } from '@/entities'
import { setLocale } from '@/app/providers'
import Logo from '@/shared/ui/Logo/Logo.vue'
import { Button } from '@/shared/ui'
import UserMenu from '@/widgets/user-menu/UserMenu.vue'

const router = useRouter()
const authStore = useAuthStore()
const { locale, t } = useI18n()
const isMobileMenuOpen = ref(false)
const mobileMenuRef = ref<HTMLElement | null>(null)

const currentLocale = computed(() => locale.value)

function toggleLanguage() {
  const newLocale = currentLocale.value === 'uk' ? 'en' : 'uk'
  setLocale(newLocale)
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu() {
  isMobileMenuOpen.value = false
}

function goToAuth() {
  closeMobileMenu()
  router.push('/auth')
}

function handleLogout() {
  authStore.logout()
  closeMobileMenu()
  router.push('/')
}

watch(isMobileMenuOpen, (isOpen) => {
  if (isOpen && mobileMenuRef.value) {
    disableBodyScroll(mobileMenuRef.value, {
      reserveScrollBarGap: true
    })
  } else {
    clearAllBodyScrollLocks()
  }
})
</script>

<style lang="scss" scoped>
.header {
  position: sticky;
  top: 0;
  z-index: $z-sticky;
  background: rgba($color-bg-primary, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid $color-border;

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $space-md 0;
    gap: $space-lg;
  }

  &__nav {
    display: none;
    align-items: center;
    gap: $space-md;

    @media (min-width: $breakpoint-md) {
      display: flex;
    }
  }

  &__nav-link {
    padding: $space-sm $space-md;
    color: $color-text-secondary;
    font-size: $font-size-sm;
    font-weight: $font-weight-medium;
    text-decoration: none;
    border-radius: $border-radius-md;
    transition: all $transition-base;

    &:hover {
      color: $color-primary;
      background: rgba($color-primary, 0.1);
    }

    &.router-link-active {
      color: $color-primary;
      background: rgba($color-primary, 0.1);
    }
  }

  &__actions {
    display: none;

    @media (min-width: $breakpoint-md) {
      display: flex;
      align-items: center;
      gap: $space-sm;
    }
  }

  &__lang-switcher {
    padding: $space-xs $space-sm;
    border: 1px solid $color-border;
    background: transparent;
    color: $color-text-primary;
    font-size: $font-size-xs;
    font-weight: $font-weight-semibold;
    border-radius: $border-radius-md;
    cursor: pointer;
    transition: all $transition-base;
    min-width: 40px;

    &:hover {
      background: $color-bg-tertiary;
      border-color: $color-primary;
      color: $color-primary;
    }
  }

  &__mobile-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $space-xs;
    border: none;
    background: transparent;
    color: $color-text-primary;
    cursor: pointer;
    border-radius: $border-radius-md;
    transition: all $transition-base;

    &:hover {
      background: $color-bg-tertiary;
    }

    @media (min-width: $breakpoint-md) {
      display: none;
    }
  }

  &__mobile-menu {
    padding-bottom: $space-lg;
    border-top: 1px solid $color-border;
    margin-top: $space-md;
    max-height: calc(100vh - 100px);
    overflow-y: auto;

    @media (min-width: $breakpoint-md) {
      display: none;
    }
  }

  &__mobile-nav {
    display: flex;
    flex-direction: column;
    gap: $space-xs;
    padding: $space-md 0;
  }

  &__mobile-link {
    display: block;
    padding: $space-md;
    color: $color-text-primary;
    font-size: $font-size-base;
    font-weight: $font-weight-medium;
    text-decoration: none;
    border-radius: $border-radius-md;
    transition: all $transition-base;
    border: none;
    background: transparent;
    text-align: left;
    width: 100%;
    cursor: pointer;

    &:hover {
      background: $color-bg-tertiary;
    }

    &.router-link-active {
      color: $color-primary;
      background: rgba($color-primary, 0.1);
    }

    &--danger {
      color: $color-error;

      &:hover {
        background: rgba($color-error, 0.1);
      }
    }
  }

  &__mobile-actions {
    padding-top: $space-md;
    border-top: 1px solid $color-border;
    display: flex;
    flex-direction: column;
    gap: $space-xs;
  }
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all $transition-base;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
