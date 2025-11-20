<template>
  <div class="user-menu" v-click-outside="closeMenu">
    <button class="user-menu__trigger" @click="toggleMenu">
      <div class="user-menu__avatar">
        <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="user-menu__avatar-img" />
        <span v-else class="user-menu__avatar-initials">{{ initials }}</span>
      </div>
      <span class="user-menu__name">{{ user.name }}</span>
      <Icon
        name="icon-arrow-down"
        :size="16"
        :class="['user-menu__arrow', { 'user-menu__arrow_open': isOpen }]"
      />
    </button>

    <transition name="dropdown">
      <div v-if="isOpen" class="user-menu__dropdown">
        <NavLink to="/profile" className="user-menu__item" @click="closeMenu">
          <Icon name="icon-user" :size="20" className="user-menu__item-icon" />
          <span>Особистий кабінет</span>
        </NavLink>

        <div class="user-menu__divider"></div>

        <button class="user-menu__item user-menu__item_danger" @click="handleLogout">
          <Icon name="icon-logout" :size="20" className="user-menu__item-icon" />
          <span>Вийти</span>
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
const { locale } = useI18n()

const isOpen = ref(false)

const initials = computed(() => {
  const names = props.user.name.split(' ')
  return names.map(n => n[0]).join('').toUpperCase().slice(0, 2)
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

<style lang="scss" scoped src="./UserMenu.scss"></style>
