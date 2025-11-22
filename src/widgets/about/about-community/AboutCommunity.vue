<template>
  <section class="about-community">
    <div class="about-community__head">
      <p class="about-community__tag">{{ t('ABOUT.COMMUNITY_TAG') }}</p>
      <h2 class="about-community__title">{{ t('ABOUT.COMMUNITY_TITLE') }}</h2>
      <p class="about-community__subtitle">{{ t('ABOUT.COMMUNITY_SUBTITLE') }}</p>
    </div>

    <UsersTable />
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import UsersTable from '@/widgets/about/users-table/UsersTable.vue'

const { t } = useI18n()
</script>

<style lang="scss" scoped src="./about-community.scss"></style>
