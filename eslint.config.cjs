// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
const storybook = require('eslint-plugin-storybook')
const tsParser = require('@typescript-eslint/parser')
const tsPlugin = require('@typescript-eslint/eslint-plugin')
const vueParser = require('vue-eslint-parser')
const vuePlugin = require('eslint-plugin-vue')

const isProd = process.env.NODE_ENV === 'production'
const vueEssentialRules = (vuePlugin.configs['vue3-essential'] && vuePlugin.configs['vue3-essential'].rules) || {}
const tsRecommendedRules = (tsPlugin.configs.recommended && tsPlugin.configs.recommended.rules) || {}

module.exports = [
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**']
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
      ...(storybook.configs['flat/recommended']?.rules || {})
    }
  }
]
