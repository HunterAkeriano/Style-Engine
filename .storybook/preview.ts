import type { Preview } from '@storybook/vue3-vite'
import { setup } from '@storybook/vue3'
import { i18n } from '@/app/providers/i18n'
import Sprite from '@/shared/ui/sprite/Sprite.vue'

import '@/app/styles/index.scss'
import 'vue-toastification/dist/index.css'

setup(app => {
  app.use(i18n)
  app.component('router-link', {
    props: ['to'],
    template: '<a :href="to"><slot /></a>'
  })
  app.component('RouterView', { template: '<div />' })
  app.component('Sprite', Sprite)
})

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  decorators: [
    (story) => ({
      components: { story, Sprite },
      template: '<div><Sprite /><story /></div>'
    })
  ]
};

export default preview;
