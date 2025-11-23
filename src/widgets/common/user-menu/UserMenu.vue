<template>
  <div class="user-menu" v-click-outside="closeMenu">
    <button class="user-menu__trigger" @click="toggleMenu">
      <div class="user-menu__avatar-wrapper">
        <div :class="['user-menu__avatar', { 'user-menu__avatar_premium': isPremiumUser }]">
          <img
            v-if="user.avatarUrl"
            :src="user.avatarUrl"
            :alt="user.name || 'User'"
            class="user-menu__avatar-img"
          />
          <span v-else class="user-menu__avatar-initials">{{ initials }}</span>
        </div>

        <Icon
          v-if="isPaidUser"
          :size="12"
          :class="['user-menu__crown', { 'user-menu__crown_premium': isPremiumUser }]"
          name="icon-crown"
        />
      </div>
      <span class="user-menu__name">{{ user.name || user.email }}</span>
      <Icon
        :size="16"
        :class="['user-menu__arrow', { 'user-menu__arrow_open': isOpen }]"
        name="icon-arrow-down"
      />
    </button>

    <transition name="dropdown">
      <div v-if="isOpen" class="user-menu__dropdown">
        <NavLink :to="`/${locale}/profile`" class-name="user-menu__item" @click="closeMenu">
          <Icon :size="20" class-name="user-menu__item-icon" name="icon-user" />
          <span>{{ t('NAV.PROFILE') }}</span>
        </NavLink>

        <div class="user-menu__divider"></div>

        <button class="user-menu__item user-menu__item_danger" @click="handleLogout">
          <Icon :size="20" class-name="user-menu__item-icon" name="icon-logout" />
          <span>{{ t('NAV.LOGOUT') }}</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/entities'
import type { User } from '@/entities'
import { Icon, NavLink } from '@/shared/ui'

interface Props {
  user: User
}

const props = defineProps<Props>()
const router = useRouter()
const authStore = useAuthStore()
const { t, locale } = useI18n()

const isOpen = ref(false)

const initials = computed(() => {
  const name = props.user.name || props.user.email
  const names = name.split(' ')
  return names.map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const isPaidUser = computed(() => {
  return (
    props.user.subscriptionTier === 'pro' ||
    props.user.subscriptionTier === 'premium' ||
    props.user.plan === 'pro' ||
    props.user.plan === 'premium' ||
    Boolean(props.user.isPayment)
  )
})

const isPremiumUser = computed(() => {
  return (
    props.user.subscriptionTier === 'premium' ||
    props.user.plan === 'premium'
  )
})

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
}

function handleLogout() {
  authStore.logout()
  closeMenu()
  router.push(`/${locale.value}`)
}
</script>

<style lang="scss" scoped src="./user-menu.scss"></style>
