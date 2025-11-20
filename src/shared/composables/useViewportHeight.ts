import { onBeforeUnmount, onMounted } from 'vue'

const CSS_VAR = '--app-vh'
const listeners: Array<() => void> = []
let initialized = false
let teardown: (() => void) | null = null

function setViewportVar() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty(CSS_VAR, `${vh}px`)
}

function setup() {
  if (initialized || typeof window === 'undefined') return
  initialized = true
  setViewportVar()

  const handler = () => {
    setViewportVar()
    listeners.forEach(fn => fn())
  }

  window.addEventListener('resize', handler)
  window.addEventListener('orientationchange', handler)

  teardown = () => {
    window.removeEventListener('resize', handler)
    window.removeEventListener('orientationchange', handler)
  }
}

export function useViewportHeight(onUpdate?: () => void) {
  setup()

  onMounted(() => {
    if (onUpdate) {
      listeners.push(onUpdate)
    }
  })

  onBeforeUnmount(() => {
    if (onUpdate) {
      const idx = listeners.indexOf(onUpdate)
      if (idx !== -1) listeners.splice(idx, 1)
    }
    if (listeners.length === 0 && teardown) {
      teardown()
      teardown = null
      initialized = false
    }
  })
}
