/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

process.env.SASS_SILENCE_DEPRECATIONS = process.env.SASS_SILENCE_DEPRECATIONS || 'all';
process.env.SASS_QUIET_DEPS = process.env.SASS_QUIET_DEPS || 'true';
const locales = ['en', 'uk'];
const ssgPublicRoutes = [
  '/',
  '/about',
  '/docs',
  '/docs/gradients',
  '/docs/shadows',
  '/docs/animations',
  '/gradient',
  '/shadow',
  '/animation',
  '/clip-path',
  '/grid',
  '/privacy-policy',
  '/favicon',
  '/cookie-policy'
];
const ssgIncludedRoutes = locales.flatMap(locale => ssgPublicRoutes.map(route => `/${locale}${route === '/' ? '' : route}`));
const base = process.env.VITE_BASE ?? '/css-lab/';

export default defineConfig(async ({ command }) => {
  const shouldConfigureTests = command === 'test' || process.env.VITEST;
  const test = shouldConfigureTests
    ? {
        projects: [
          {
            extends: true,
            plugins: [
              (await import('@storybook/addon-vitest/vitest-plugin')).storybookTest({
                configDir: path.join(dirname, '.storybook')
              })
            ],
            test: {
              name: 'storybook',
              browser: {
                enabled: true,
                headless: true,
                provider: playwright({}),
                instances: [
                  {
                    browser: 'chromium'
                  }
                ]
              },
              setupFiles: ['.storybook/vitest.setup.ts']
            }
          }
        ]
      }
    : undefined;

  return {
    base,
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
            debug() {
              // ignore debug logs
            }
          }
        }
      }
    },
    ssgOptions: {
      includedRoutes: () => ssgIncludedRoutes
    },
    test
  };
});
