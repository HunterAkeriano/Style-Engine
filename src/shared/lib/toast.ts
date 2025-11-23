import * as Toast from 'vue-toastification/dist/index.mjs'
import type { Plugin } from 'vue'

const pluginCandidate = (Toast as Record<string, unknown>).default ?? Toast

export const toastPlugin = pluginCandidate as Plugin
export const useToast = (Toast as typeof import('vue-toastification/dist/index.mjs')).useToast

export default toastPlugin
