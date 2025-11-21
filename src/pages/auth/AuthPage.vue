<template>
  <div class="auth-page">
    <div class="container">
      <div class="auth-card">
        <div class="auth-card__head">
          <p class="auth-card__eyebrow">Личный кабинет</p>
          <h1 class="auth-card__title">
            {{ mode === 'login' ? 'Вход' : 'Регистрация' }}
          </h1>
          <p class="auth-card__subtitle">
            {{ mode === 'login' ? 'Введите почту и пароль, чтобы продолжить' : 'Создайте аккаунт, чтобы сохранять пресеты' }}
          </p>
        </div>

        <form class="auth-form" @submit.prevent="handleSubmit">
          <div class="auth-form__grid">
            <Input
              v-model="form.email"
              type="email"
              label="Email"
              placeholder="you@example.com"
              required
            />
            <Input
              v-if="mode === 'register'"
              v-model="form.name"
              type="text"
              label="Имя"
              placeholder="Ваше имя"
            />
            <Input
              v-model="form.password"
              type="password"
              label="Пароль"
              placeholder="••••••••"
              required
              minlength="8"
            />
          </div>

          <div class="auth-form__actions">
            <Button :loading="auth.isLoading" type="submit" variant="primary" size="lg" class="auth-form__submit">
              {{ mode === 'login' ? 'Войти' : 'Создать аккаунт' }}
            </Button>
            <button type="button" class="auth-form__switch" @click="toggleMode">
              {{ mode === 'login' ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти' }}
            </button>
          </div>

          <p v-if="auth.error" class="auth-form__error">{{ auth.error }}</p>
        </form>

        <NavLink to="/" className="auth-card__back-link">← Вернуться на главную</NavLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NavLink, Input, Button } from '@/shared/ui'
import { useAuthStore } from '@/entities'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const mode = ref<'login' | 'register'>('login')
const form = reactive({
  email: '',
  password: '',
  name: ''
})

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  auth.setError(null)
}

async function handleSubmit() {
  if (!form.email || !form.password) return

  if (mode.value === 'login') {
    await auth.login(form.email, form.password)
  } else {
    await auth.register(form.email, form.password, form.name)
  }

  if (auth.isAuthenticated) {
    const locale = (route.params.locale as string) || (router.currentRoute.value.params.locale as string) || ''
    const redirect = (route.query.redirect as string) || `/${locale ? `${locale}/` : ''}profile`
    router.push(redirect.startsWith('/') ? redirect : `/${redirect}`)
  }
}
</script>

<style lang="scss" scoped src="./auth-page.scss"></style>
