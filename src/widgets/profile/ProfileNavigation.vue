<template>
  <nav class="profile-page__navigation">
    <RouterLink
      :to="{ name: `${locale}-profile-gradients` }"
      active-class="profile-page__nav-link_active"
      class="profile-page__nav-link"
    >
      {{ t('PROFILE.NAV_GRADIENTS') }}
    </RouterLink>

    <RouterLink
      :to="{ name: `${locale}-profile-shadows` }"
      active-class="profile-page__nav-link_active"
      class="profile-page__nav-link"
    >
      {{ t('PROFILE.NAV_SHADOWS') }}
    </RouterLink>

    <RouterLink
      :to="{ name: `${locale}-profile-animations` }"
      active-class="profile-page__nav-link_active"
      class="profile-page__nav-link"
    >
      {{ t('PROFILE.NAV_ANIMATIONS') }}
    </RouterLink>

    <RouterLink
      v-if="isAdmin"
      :to="{ name: `${locale}-moderation` }"
      class="profile-page__nav-link profile-page__nav-link_admin"
    >
      {{ t('PROFILE.MODERATION_LINK') }}
    </RouterLink>
    <RouterLink
      v-if="isSuperAdmin"
      :to="{ name: `${locale}-moderation-users` }"
      class="profile-page__nav-link profile-page__nav-link_admin"
    >
      {{ t('PROFILE.USER_MANAGEMENT_LINK') }}
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

interface Props {
  isAdmin: boolean
  isSuperAdmin: boolean
}

defineProps<Props>()

const { t, locale } = useI18n()
</script>
