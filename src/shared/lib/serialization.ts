function stringifyValue(value: unknown, visited: Set<unknown>): string {
  if (value === null) {
    return 'null'
  }
  if (value === undefined) {
    return 'undefined'
  }
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return JSON.stringify(value)
  }
  if (Array.isArray(value)) {
    return `[${value.map(item => stringifyValue(item, visited)).join(',')}]`
  }
  if (typeof value === 'object') {
    if (visited.has(value)) {
      return '"[Circular]"'
    }
    visited.add(value)
    const entries = Object.keys(value as Record<string, unknown>)
      .sort()
      .map(key => `${key}:${stringifyValue((value as Record<string, unknown>)[key], visited)}`)
    visited.delete(value)
    return `{${entries.join(',')}}`
  }
  return JSON.stringify(value)
}

export function stableStringify(value: unknown): string {
  return stringifyValue(value, new Set())
}
