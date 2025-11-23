<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__content">
        <div class="footer__brand">
          <Logo class="footer__logo" />
          <h3 class="footer__brand-title">Style Engine</h3>
          <p class="footer__brand-description">
            {{ t('HOME.SUBTITLE') }}
          </p>
        </div>

        <div class="footer__section">
          <h4 class="footer__section-title">{{ t('FOOTER.NAVIGATION') }}</h4>
          <nav class="footer__nav">
            <NavLink to="/gradient" className="footer__link">
              {{ t('NAV.GRADIENTS') }}
            </NavLink>
            <NavLink to="/shadow" className="footer__link">
              {{ t('NAV.SHADOWS') }}
            </NavLink>
            <NavLink to="/animation" className="footer__link">
              {{ t('NAV.ANIMATIONS') }}
            </NavLink>
            <NavLink to="/about" className="footer__link">
              {{ t('NAV.ABOUT') }}
            </NavLink>
          </nav>
        </div>

        <div class="footer__section">
          <h4 class="footer__section-title">{{ t('FOOTER.DOCUMENTATION') }}</h4>
          <nav class="footer__nav">
            <NavLink to="/docs" className="footer__link">
              {{ t('NAV.DOCS') }}
            </NavLink>
            <NavLink to="/privacy-policy" className="footer__link">
              {{ t('PRIVACY.NAV') }}
            </NavLink>
            <NavLink to="/cookie-policy" className="footer__link">
              {{ t('COOKIE.NAV') }}
            </NavLink>
          </nav>
        </div>

        <div class="footer__section">
          <h4 class="footer__section-title">{{ t('FOOTER.SETTINGS') }}</h4>
          <div class="footer__settings">
            <div class="footer__setting">
              <span class="footer__setting-label">{{ t('FOOTER.THEME') }}</span>
              <ThemeSwitcher />
            </div>
            <div class="footer__setting">
              <span class="footer__setting-label">{{ t('FOOTER.LANGUAGE') }}</span>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <div class="footer__divider"></div>
        <div class="footer__bottom-content">
          <p class="footer__copyright">
            © {{ currentYear }} Style Engine. {{ t('FOOTER.ALL_RIGHTS_RESERVED') }}
          </p>
          <p class="footer__author">
            {{ t('FOOTER.DEVELOPED_BY') }}
            <a
              href="https://github.com/dmitriy-hulak"
              target="_blank"
              rel="noopener noreferrer"
              class="footer__author-link"
            >
              Dmitriy Hulak
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Logo from '@/shared/ui/logo/Logo.vue'
import { NavLink } from '@/shared/ui'
import ThemeSwitcher from '@/shared/ui/theme-switcher/ThemeSwitcher.vue'
import { LanguageSwitcher } from '@/features'

const { t } = useI18n()
const currentYear = computed(() => new Date().getFullYear())
</script>

<style lang="scss" scoped src="./footer.scss"></style>
