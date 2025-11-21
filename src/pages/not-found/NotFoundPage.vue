<template>
  <div class="not-found-page">
    <div class="container">
      <h1 class="not-found-page__title">404</h1>
      <p class="not-found-page__text">Страница не найдена</p>
      <NavLink to="/" className="not-found-page__back-link">← Вернуться на главную</NavLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NavLink } from '@/shared/ui'
</script>

<style lang="scss" scoped src="./not-found-page.scss"></style>
