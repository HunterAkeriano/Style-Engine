import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

export interface UseSectionVisibilityOptions {
  threshold?: number
  rootMargin?: string
  once?: boolean
}

export function useSectionVisibility(
  options: UseSectionVisibilityOptions = {}
): { sectionRef: Ref<HTMLElement | null>; isVisible: Ref<boolean> } {
  const { threshold = 0.1, rootMargin = '50px', once = false } = options

  const sectionRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (typeof window === 'undefined' || !sectionRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry) {
          isVisible.value = entry.isIntersecting

          if (once && entry.isIntersecting && observer && sectionRef.value) {
            observer.unobserve(sectionRef.value)
          }
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(sectionRef.value)
  })

  onBeforeUnmount(() => {
    if (observer && sectionRef.value) {
      observer.unobserve(sectionRef.value)
    }
    observer = null
  })

  return { sectionRef, isVisible }
}
