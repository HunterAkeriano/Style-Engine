export type PreferredLanguage = "en" | "uk"

export function resolvePreferredLanguage(
  value: string | string[] | undefined | null,
  fallback: PreferredLanguage = "en",
): PreferredLanguage {
  const raw = Array.isArray(value) ? value.join(",") : value || ""
  const normalized = raw.toLowerCase()
  if (normalized.includes("uk")) return "uk"
  return fallback
}

export function resolveRequestLanguage(
  req: { headers?: Record<string, unknown> },
  fallback: PreferredLanguage = "en",
): PreferredLanguage {
  const header = req?.headers?.["accept-language"] as
    | string
    | string[]
    | undefined
  return resolvePreferredLanguage(header, fallback)
}

function normalizeBaseUrl(baseUrl: string) {
  return baseUrl.replace(/\/+$/, "")
}

function stripLocaleFromUrl(url: string) {
  return url.replace(/\/uk$/, "")
}

export function buildLocalizedUrl(
  baseUrl: string,
  locale: PreferredLanguage,
  path: string = "",
) {
  const cleanBase = normalizeBaseUrl(baseUrl || "")
  const baseHasLocale = /\/uk$/i.test(cleanBase)
  const baseWithLocale =
    locale === "uk"
      ? baseHasLocale
        ? cleanBase
        : `${cleanBase}/uk`
      : baseHasLocale
        ? stripLocaleFromUrl(cleanBase)
        : cleanBase

  const normalizedPath = path ? `/${path.replace(/^\/+/, "")}` : ""
  return `${baseWithLocale}${normalizedPath}`
}
