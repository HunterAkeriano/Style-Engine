import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@unhead/vue/client'
import Toast, { POSITION } from 'vue-toastification'
import { router, i18n } from '@/app/providers'
import { App } from '@/app'
import { clickOutside } from '@/shared/directives'

import '@/app/styles/index.scss'
import 'vue-toastification/dist/index.css'

const app = createApp(App)
const pinia = createPinia()
const head = createHead()

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(head)
app.use(Toast, {
  position: POSITION.BOTTOM_RIGHT,
  timeout: 2200,
  hideProgressBar: true,
  closeButton: false,
  transition: 'Vue-Toastification__fade',
  maxToasts: 4,
  toastClassName: 'se-toast',
  bodyClassName: 'se-toast__body'
})

app.directive('click-outside', clickOutside)
app.mount('#app')
