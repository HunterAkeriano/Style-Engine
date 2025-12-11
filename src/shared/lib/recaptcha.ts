import { useReCaptcha } from 'vue-recaptcha-v3'

export function useRecaptchaToken(action: string) {
  let recaptchaInstance: ReturnType<typeof useReCaptcha> | null = null
  try {
    recaptchaInstance = useReCaptcha()
  } catch {
    recaptchaInstance = null
  }

  const getRecaptchaToken = async () => {
    if (typeof window === 'undefined' || !recaptchaInstance?.executeRecaptcha) return null
    await recaptchaInstance.recaptchaLoaded()
    return recaptchaInstance.executeRecaptcha(action)
  }

  return { getRecaptchaToken }
}
