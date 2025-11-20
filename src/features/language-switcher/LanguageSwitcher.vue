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
        :class="['language-switcher__arrow', { 'language-switcher__arrow--open': isOpen }]"
      />
    </button>

    <transition name="dropdown">
      <div v-if="isOpen" class="language-switcher__dropdown">
        <button
          v-for="lang in languages"
          :key="lang.code"
          class="language-switcher__option"
          :class="{ 'language-switcher__option--active': currentLocale === lang.code }"
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
import { setLocale } from '@/app/providers'
import { Icon } from '@/shared/ui'

const { locale, t } = useI18n()
const isOpen = ref(false)

const currentLocale = computed(() => locale.value)

const languages = [
  { code: 'uk', name: 'Українська' },
  { code: 'en', name: 'English' }
]

interface HTMLElementWithEvent extends HTMLElement {
  clickOutsideEvent?: (event: Event) => void
}

const vClickOutside = {
  mounted(el: HTMLElementWithEvent, binding: { value: () => void }) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el: HTMLElementWithEvent) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  }
}

function toggleDropdown() {
  isOpen.value = !isOpen.value
}

function closeDropdown() {
  isOpen.value = false
}

function changeLanguage(code: string) {
  setLocale(code)
  closeDropdown()
}
</script>

<style lang="scss" scoped src="./LanguageSwitcher.scss"></style>
