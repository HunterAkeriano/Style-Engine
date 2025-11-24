import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'style-engine-theme'
const theme = ref<Theme>('dark')
const isReady = ref(false)
let mediaQuery: MediaQueryList | null = null
let mediaListener: ((event: MediaQueryListEvent) => void) | null = null

function applyTheme(next: Theme, persist = true) {
  if (typeof document === 'undefined') return
  theme.value = next
  document.documentElement.setAttribute('data-theme', next)
  if (persist && typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, next)
  }
}

function detectInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') {
    return saved
  }

  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  return 'dark'
}

function setupSystemListener() {
  if (mediaListener) return
  if (typeof window === 'undefined') return
  if (!mediaQuery) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  }

  mediaListener = (event: MediaQueryListEvent) => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved !== 'light' && saved !== 'dark') {
      applyTheme(event.matches ? 'dark' : 'light', false)
    }
  }

  mediaQuery.addEventListener('change', mediaListener)
}

export function useTheme() {
  const isDark = computed(() => theme.value === 'dark')

  const toggleTheme = () => {
    const next = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme(next)
  }

  const setTheme = (next: Theme) => {
    applyTheme(next)
  }

  if (typeof window !== 'undefined' && !isReady.value) {
    applyTheme(detectInitialTheme(), true)
  }

  onMounted(() => {
    if (!isReady.value) {
      setupSystemListener()
      isReady.value = true
    }
  })

  onBeforeUnmount(() => {
    if (mediaQuery && mediaListener) {
      mediaQuery.removeEventListener('change', mediaListener)
    }
  })

  return {
    theme,
    isDark,
    isReady,
    toggleTheme,
    setTheme
  }
}
