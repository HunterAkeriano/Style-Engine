// ESLint flat config (ESM)
import storybook from 'eslint-plugin-storybook'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import vueParser from 'vue-eslint-parser'
import vuePlugin from 'eslint-plugin-vue'

const layerOrder = ['app', 'processes', 'pages', 'widgets', 'features', 'entities', 'shared']
const layerExtras = {
  pages: ['@/processes/**']
}

function makeLayerConfig(layer) {
  const idx = layerOrder.indexOf(layer)
  const extraAllowed = layerExtras[layer] ?? []
  const forbidden = layerOrder
    .slice(0, idx)
    .map((l) => `@/${l}/**`)
    .filter((group) => !extraAllowed.includes(group))
  return {
    files: [`src/${layer}/**/*.ts`, `src/${layer}/**/*.tsx`, `src/${layer}/**/*.vue`],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: forbidden.map((group) => ({
            group: [group],
            message: `Layer violation: ${layer} cannot import ${group}`
          }))
        }
      ]
    }
  }
}

const isProd = process.env.NODE_ENV === 'production'
const vueEssentialRules = vuePlugin.configs['vue3-essential']?.rules ?? {}
const tsRecommendedRules = tsPlugin.configs.recommended?.rules ?? {}
const baseRules = {
  ...tsRecommendedRules,
  'no-console': isProd ? 'warn' : 'off',
  '@typescript-eslint/no-explicit-any': 'off'
}

export default [
  {
    ignores: ['dist/**', 'backend/dist/**', 'node_modules/**', 'coverage/**', 'storybook-static/**']
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      ...baseRules
    }
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      vue: vuePlugin
    },
    rules: {
      ...vueEssentialRules,
      ...baseRules,
      'vue/multi-word-component-names': 'off'
    }
  },
  {
    files: ['**/*.stories.@(ts|tsx)', '**/*.mdx'],
    plugins: {
      storybook
    },
    rules: {
      ...(storybook.configs['flat/recommended']?.rules ?? {})
    }
  },
  ...layerOrder.map(makeLayerConfig)
]
