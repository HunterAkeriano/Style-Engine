<template>
  <div class="language-switcher">
    <button
      class="language-switcher__trigger"
      @click="toggleDropdown"
      :title="t('COMMON.LANGUAGE')"
      v-click-outside="closeDropdown"
    >
      <span class="language-switcher__current">{{ currentLocale.toUpperCase() }}</span>
      <Icon
        name="icon-chevron-down"
        :size="12"
        :class="['language-switcher__arrow', { 'language-switcher__arrow_open': isOpen }]"
      />
    </button>

    <transition name="dropdown">
      <div v-if="isOpen" class="language-switcher__dropdown">
        <button
          v-for="lang in languages"
          :key="lang.code"
          class="language-switcher__option"
          :class="{ 'language-switcher__option_active': currentLocale === lang.code }"
          @click="changeLanguage(lang.code)"
        >
          <span class="language-switcher__option-code">{{ lang.code.toUpperCase() }}</span>
          <span class="language-switcher__option-name">{{ lang.name }}</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { Icon } from '@/shared/ui'
import { isLocale } from '@/shared/config/locales'

const { locale, t } = useI18n()
const router = useRouter()
const route = useRoute()
const isOpen = ref(false)

const currentLocale = computed(() => locale.value)

const languages = [
  { code: 'uk', name: 'Українська' },
  { code: 'en', name: 'English' }
]

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

function changeLanguage(newLocale: string) {
  const pathParts = route.path.split('/').filter(Boolean)

  if (!pathParts.length) {
    router.push({
      path: `/${newLocale}`,
      query: route.query,
      hash: route.hash
    })
    closeDropdown()
    return
  }

  if (pathParts[0] && isLocale(pathParts[0])) {
    pathParts[0] = newLocale
  } else {
    pathParts.unshift(newLocale)
  }

  router.push({
    path: '/' + pathParts.join('/'),
    query: route.query,
    hash: route.hash
  })
  closeDropdown()
}
</script>

<style lang="scss" scoped src="./language-switcher.scss"></style>
