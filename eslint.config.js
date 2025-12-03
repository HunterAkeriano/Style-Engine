// ESLint flat config (ESM)
import storybook from 'eslint-plugin-storybook'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import vueParser from 'vue-eslint-parser'
import vuePlugin from 'eslint-plugin-vue'

const isProd = process.env.NODE_ENV === 'production'
const vueEssentialRules = vuePlugin.configs['vue3-essential']?.rules ?? {}
const tsRecommendedRules = tsPlugin.configs.recommended?.rules ?? {}

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
      ...tsRecommendedRules,
      'no-console': isProd ? 'warn' : 'off',
      '@typescript-eslint/no-explicit-any': 'off'
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
      ...tsRecommendedRules,
      'no-console': isProd ? 'warn' : 'off',
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
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
  }
]
