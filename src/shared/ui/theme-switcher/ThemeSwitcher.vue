<template>
  <button class="theme-switcher" type="button" @click="toggleTheme">
    <span class="theme-switcher__icon">
      <Icon v-if="isDark" name="icon-moon" :size="16" />
      <Icon v-else name="icon-sun" :size="16" />
    </span>
    <span class="theme-switcher__label">
      {{ isDark ? lightLabel : darkLabel }}
    </span>
    <span class="theme-switcher__thumb" :class="{ 'theme-switcher__thumb--dark': isDark }"></span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/shared/composables'
import Icon from '@/shared/ui/icon/Icon.vue'

const { toggleTheme, isDark } = useTheme()
const { t } = useI18n()

const lightLabel = computed(() => t('NAV.THEME_LIGHT'))
const darkLabel = computed(() => t('NAV.THEME_DARK'))
</script>

<style lang="scss" scoped src="./ThemeSwitcher.scss"></style>
