import type { Category } from '../routes/saves'

interface NormalizedColor {
  color: string
  position: number
}

interface NormalizedLayer {
  inset: boolean
  x: number
  y: number
  blur: number
  spread: number
  color: string
}

const normalizeColorString = (value: unknown): string =>
  typeof value === 'string' ? value.trim().toLowerCase() : ''

const normalizeNumber = (value: unknown): number => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim().length) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return 0
}

function normalizeGradientPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const colors = Array.isArray(payload.colors) ? payload.colors : []
  const normalizedColors: NormalizedColor[] = colors
    .map((color: any) => ({
      color: normalizeColorString(color?.color),
      position: normalizeNumber(color?.position)
    }))
    .sort((a, b) => a.position - b.position)
  return {
    type: typeof payload.type === 'string' ? payload.type : 'linear',
    angle: normalizeNumber(payload.angle),
    colors: normalizedColors
  }
}

function normalizeShadowPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const layers = Array.isArray(payload.layers) ? payload.layers : []
  const normalizedLayers: NormalizedLayer[] = layers
    .map((layer: any) => ({
      inset: Boolean(layer?.inset),
      x: normalizeNumber(layer?.x),
      y: normalizeNumber(layer?.y),
      blur: normalizeNumber(layer?.blur),
      spread: normalizeNumber(layer?.spread),
      color: normalizeColorString(layer?.color) || '#000'
    }))
    .sort((a, b) => {
      const aValue = `${a.inset}-${a.x}-${a.y}-${a.blur}-${a.spread}-${a.color}`
      const bValue = `${b.inset}-${b.x}-${b.y}-${b.blur}-${b.spread}-${b.color}`
      return aValue.localeCompare(bValue)
    })
  return {
    layers: normalizedLayers
  }
}

function normalizeAnimationPayload(payload: Record<string, unknown>): Record<string, unknown> {
  return {
    html: typeof payload.html === 'string' ? payload.html.trim() : '',
    css: typeof payload.css === 'string' ? payload.css.trim() : ''
  }
}

function normalizeClipPathPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const layers = Array.isArray(payload.layers) ? payload.layers : []
  const normalizedLayers = layers
    .map((layer: any) => {
      const normalized: any = {
        id: typeof layer?.id === 'string' ? layer.id : '',
        type: typeof layer?.type === 'string' ? layer.type : 'polygon',
        visible: Boolean(layer?.visible)
      }

      if (layer?.type === 'polygon' && Array.isArray(layer.points)) {
        normalized.points = layer.points
          .map((point: any) => ({
            id: typeof point?.id === 'string' ? point.id : '',
            x: normalizeNumber(point?.x),
            y: normalizeNumber(point?.y)
          }))
          .sort((a: any, b: any) => a.id.localeCompare(b.id))
      } else if (layer?.type === 'circle') {
        normalized.radius = normalizeNumber(layer?.radius)
      } else if (layer?.type === 'ellipse') {
        normalized.radiusX = normalizeNumber(layer?.radiusX)
        normalized.radiusY = normalizeNumber(layer?.radiusY)
      } else if (layer?.type === 'inset' && layer.inset) {
        normalized.inset = {
          top: normalizeNumber(layer.inset.top),
          right: normalizeNumber(layer.inset.right),
          bottom: normalizeNumber(layer.inset.bottom),
          left: normalizeNumber(layer.inset.left),
          round: normalizeNumber(layer.inset.round)
        }
      }

      return normalized
    })
    .sort((a: any, b: any) => a.id.localeCompare(b.id))

  return {
    layers: normalizedLayers
  }
}

export function normalizePayload(category: Category, payload: unknown): Record<string, unknown> {
  if (!payload || typeof payload !== 'object') {
    return {}
  }

  switch (category) {
    case 'gradient':
      return normalizeGradientPayload(payload as Record<string, unknown>)
    case 'shadow':
      return normalizeShadowPayload(payload as Record<string, unknown>)
    case 'animation':
      return normalizeAnimationPayload(payload as Record<string, unknown>)
    case 'clip-path':
      return normalizeClipPathPayload(payload as Record<string, unknown>)
    default:
      return payload as Record<string, unknown>
  }
}

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
