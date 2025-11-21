import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  type Ref,
  type CSSProperties
} from 'vue'

interface UseFloatingPreviewOptions {
  containerRef: Ref<HTMLElement | null>
  boundingRef?: Ref<HTMLElement | null>
  topOffset?: number
  breakpoint?: number
}

export function useFloatingPreview(options: UseFloatingPreviewOptions) {
  const { containerRef, boundingRef, topOffset = 32, breakpoint = 1024 } = options
  const previewRef = ref<HTMLElement | null>(null)
  const wrapperRef = ref<HTMLElement | null>(null)
  const floatingStyle = ref<CSSProperties>({})
  const wrapperStyle = ref<CSSProperties>({})
  const isFloating = ref(false)

  let frameId: number | null = null
  let lastMeasuredHeight = 0
  let resizeObserver: ResizeObserver | null = null
  let observedWrapper: HTMLElement | null = null

  const updateWrapperStyle = (height: number) => {
    if (height > 0) {
      lastMeasuredHeight = height
      wrapperStyle.value = { minHeight: `${height}px` }
    } else if (lastMeasuredHeight > 0) {
      wrapperStyle.value = { minHeight: `${lastMeasuredHeight}px` }
    }
  }

  const resetFloating = () => {
    isFloating.value = false
    floatingStyle.value = {}
  }

  const updateFloating = () => {
    frameId = null

    const previewElement = previewRef.value
    const wrapperElement = wrapperRef.value
    const containerElement = containerRef.value

    if (
      typeof window === 'undefined' ||
      !previewElement ||
      !wrapperElement ||
      !containerElement
    ) {
      resetFloating()
      return
    }

    if (window.innerWidth < breakpoint) {
      resetFloating()
      return
    }

    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const wrapperRect = wrapperElement.getBoundingClientRect()
    const containerRect = containerElement.getBoundingClientRect()
    const containerTopAbs = containerRect.top + scrollTop
    const containerBottomAbs = containerTopAbs + containerRect.height
    const wrapperHeight = wrapperRect.height

    updateWrapperStyle(wrapperHeight)

    const wrapperTopAbs = wrapperRect.top + scrollTop
    const startScroll = wrapperTopAbs - topOffset
    const endScroll = containerBottomAbs - wrapperHeight - topOffset
    const shouldFloat = scrollTop >= startScroll && scrollTop < endScroll
    const shouldStickBottom = scrollTop >= endScroll && endScroll > startScroll

    if ((!shouldFloat && !shouldStickBottom) || startScroll >= endScroll) {
      resetFloating()
      return
    }

    const boundingElement = boundingRef?.value || document.documentElement
    const boundingRect = boundingElement.getBoundingClientRect()

    if (shouldStickBottom) {
      const absoluteTop = Math.max(0, containerRect.height - wrapperHeight)
      const absoluteLeft = wrapperRect.left - boundingRect.left
      isFloating.value = true
      floatingStyle.value = {
        position: 'absolute',
        top: `${absoluteTop}px`,
        left: `${absoluteLeft}px`,
        width: `${wrapperRect.width}px`
      }
      return
    }

    const floatingTop = topOffset
    isFloating.value = true
    floatingStyle.value = {
      position: 'fixed',
      top: `${floatingTop}px`,
      left: `${wrapperRect.left}px`,
      width: `${wrapperRect.width}px`,
      zIndex: 'var(--z-sticky, 1020)'
    }
  }

  const scheduleUpdate = () => {
    if (frameId) {
      cancelAnimationFrame(frameId)
    }
    frameId = requestAnimationFrame(updateFloating)
  }

  const handleScroll = () => scheduleUpdate()
  const handleResize = () => scheduleUpdate()

  onMounted(() => {
    if (typeof window === 'undefined') return
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(scheduleUpdate)
      if (resizeObserver) {
        observedWrapper = wrapperRef.value
        if (observedWrapper) {
          resizeObserver.observe(observedWrapper)
        }
      }
    }
    scheduleUpdate()
  })

  onUnmounted(() => {
    if (typeof window === 'undefined') return
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleResize)
    if (resizeObserver && wrapperRef.value) {
      if (observedWrapper) {
        resizeObserver.unobserve(observedWrapper)
        observedWrapper = null
      }
      resizeObserver.disconnect()
      resizeObserver = null
    }
    if (frameId) {
      cancelAnimationFrame(frameId)
    }
  })

  watch(
    wrapperRef,
    (el) => {
      if (resizeObserver) {
        if (observedWrapper) {
          resizeObserver.unobserve(observedWrapper)
        }
        observedWrapper = el
        if (observedWrapper) {
          resizeObserver.observe(observedWrapper)
        }
      }
      scheduleUpdate()
    },
    { flush: 'post' }
  )

  watch(
    containerRef,
    () => {
      scheduleUpdate()
    },
    { flush: 'post' }
  )

  if (boundingRef) {
    watch(
      boundingRef,
      () => {
        scheduleUpdate()
      },
      { flush: 'post' }
    )
  }

  return {
    previewRef,
    wrapperRef,
    floatingStyle,
    wrapperStyle,
    isFloating
  }
}
