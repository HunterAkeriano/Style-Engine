<template>
  <div class="contact-widget" v-click-outside="close" :class="{ 'contact-widget_open': isOpen }">
    <span class="contact-widget__glow" aria-hidden="true" />
    <button class="contact-widget__fab" type="button" @click="toggle" :aria-expanded="isOpen">
      <Icon name="icon-message" size="22" />
      <span class="sr-only">{{ t('CONTACT_WIDGET.TRIGGER') }}</span>
    </button>

    <transition name="contact-dropdown">
      <div v-if="isOpen" class="contact-widget__dropdown">
        <p class="contact-widget__title">{{ t('CONTACT_WIDGET.TITLE') }}</p>
        <div class="contact-widget__list">
          <a
            v-for="item in contacts"
            :key="item.id"
            class="contact-widget__item"
            :class="`contact-widget__item_${item.id}`"
            :href="item.href"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon :name="item.icon" size="18" />
            <div class="contact-widget__labels">
              <span class="contact-widget__label">{{ item.label }}</span>
              <span class="contact-widget__hint">{{ item.hint }}</span>
            </div>
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@/shared/ui'

const isOpen = ref(false)
const { t } = useI18n()

const contacts = computed(() => [
  {
    id: 'telegram',
    label: 'Telegram',
    hint: t('CONTACT_WIDGET.TELEGRAM'),
    icon: 'icon-telegram',
    href: 'https://t.me/dima_gulak'
  },
  {
    id: 'viber',
    label: 'Viber',
    hint: t('CONTACT_WIDGET.VIBER'),
    icon: 'icon-viber',
    href: 'viber://chat?number=%2B380974779784'
  },
  {
    id: 'mail',
    label: t('CONTACT_WIDGET.MAIL'),
    hint: t('CONTACT_WIDGET.EMAIL'),
    icon: 'icon-mail',
    href: 'mailto:gamerstaject@gmail.com'
  }
])

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}
</script>

<style scoped lang="scss" src="./contact-widget.scss"></style>
