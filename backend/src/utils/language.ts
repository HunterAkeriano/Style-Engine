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
