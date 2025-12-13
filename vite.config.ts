/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import path from 'node:path';
import { playwright } from '@vitest/browser-playwright';
import postcss from 'postcss';
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
  '/quiz',
  '/quiz/leaderboard',
  '/gradient',
  '/shadow',
  '/animation',
  '/clip-path',
  '/grid',
  '/privacy-policy',
  '/favicon',
  '/cookie-policy',
  '/forum',
  '/forum/status/open',
  '/forum/status/in_review',
  '/forum/status/closed'
];
const ssgIncludedRoutes = locales.flatMap(locale => ssgPublicRoutes.map(route => `/${locale}${route === '/' ? '' : route}`));
const base = process.env.VITE_BASE ?? '/css-lab/';

const wrapHoverWithMedia = (): postcss.Plugin => ({
  postcssPlugin: 'wrap-hover-with-media',
  Once(root) {
    const rulesToWrap: postcss.Rule[] = [];
    root.walkRules(rule => {
      if (!rule.selector.includes(':hover')) return;
      let parent = rule.parent;
      while (parent) {
        if (parent.type === 'atrule' && parent.name === 'media' && parent.params.includes('hover')) {
          return;
        }
        parent = parent.parent;
      }
      rulesToWrap.push(rule);
    });

    rulesToWrap.forEach(rule => {
      const media = postcss.atRule({ name: 'media', params: '(hover:hover)' });
      rule.replaceWith(media);
      media.append(rule);
    });
  }
});

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
      },
      postcss: {
        plugins: [wrapHoverWithMedia()]
      }
    },
    ssgOptions: {
      includedRoutes: () => ssgIncludedRoutes
    },
    test
  };
});
