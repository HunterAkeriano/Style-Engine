export function smoothScrollToTop(offset = 0) {
  if (typeof window === 'undefined') return

  window.scrollTo({
    top: Math.max(0, offset),
    left: 0,
    behavior: 'smooth'
  })
}
