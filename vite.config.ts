import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

process.env.SASS_SILENCE_DEPRECATIONS = process.env.SASS_SILENCE_DEPRECATIONS || 'all'
process.env.SASS_QUIET_DEPS = process.env.SASS_QUIET_DEPS || 'true'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
        additionalData: `@import "@/app/styles/variables.scss";`,
        quietDeps: true,
        silenceDeprecations: ['all'],
        logger: {
          warn() {
            // swallow sass deprecation warnings
          },
          debug(...args) {
            // ignore debug logs
          }
        }
      }
    }
  }
})
