import { ref, onMounted, onUnmounted, type Ref } from 'vue'

interface UseStickyOptions {
  offset?: number
  container?: Ref<HTMLElement | null>
}

export function useSticky(options: UseStickyOptions = {}) {
  const { offset = 16, container } = options
  const elementRef = ref<HTMLElement | null>(null)
  const isSticky = ref(false)
  const stickyStyle = ref<Record<string, string>>({})

  let animationFrameId: number | null = null

  const updateStickyState = () => {
    if (!elementRef.value) return

    const element = elementRef.value
    const rect = element.getBoundingClientRect()
    const containerElement = container?.value || document.documentElement

    let scrollContainer = element.parentElement
    while (scrollContainer && scrollContainer !== containerElement) {
      const overflow = window.getComputedStyle(scrollContainer).overflow
      if (overflow === 'auto' || overflow === 'scroll' || overflow === 'hidden') {
        break
      }
      scrollContainer = scrollContainer.parentElement
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const elementTop = rect.top + scrollTop
    const shouldStick = scrollTop > elementTop - offset

    if (shouldStick) {
      const containerRect = scrollContainer?.getBoundingClientRect() || containerElement.getBoundingClientRect()
      const maxScroll = containerRect.bottom - rect.height - offset

      if (maxScroll > 0) {
        isSticky.value = true
        stickyStyle.value = {
          position: 'fixed',
          top: `${offset}px`,
          width: `${element.offsetWidth}px`,
          zIndex: '10'
        }
      } else {
        isSticky.value = false
        stickyStyle.value = {}
      }
    } else {
      isSticky.value = false
      stickyStyle.value = {}
    }
  }

  const onScroll = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
    animationFrameId = requestAnimationFrame(updateStickyState)
  }

  const onResize = () => {
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
    animationFrameId = requestAnimationFrame(updateStickyState)
  }

  onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    updateStickyState()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onResize)
    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
  })

  return {
    elementRef,
    isSticky,
    stickyStyle
  }
}
