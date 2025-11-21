import type { ObjectDirective } from 'vue'

type ClickOutsideElement = HTMLElement & { clickOutsideEvent?: (event: Event) => void }

export const clickOutside: ObjectDirective<ClickOutsideElement, () => void> = {
  mounted(el, binding) {
    el.clickOutsideEvent = event => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value?.()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  }
}
