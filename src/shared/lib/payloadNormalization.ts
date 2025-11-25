import type { SaveCategory } from '@/shared/api/saves'

type NormalizedColor = {
  color: string
  position: number
}

type NormalizedLayer = {
  inset: boolean
  x: number
  y: number
  blur: number
  spread: number
  color: string
}

const normalizeColorString = (value: unknown) =>
  (typeof value === 'string' ? value.trim().toLowerCase() : '')

const normalizeNumber = (value: unknown) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim().length) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  return 0
}

function normalizeGradientPayload(payload: Record<string, unknown>) {
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

function normalizeShadowPayload(payload: Record<string, unknown>) {
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

function normalizeAnimationPayload(payload: Record<string, unknown>) {
  return {
    html: typeof payload.html === 'string' ? payload.html.trim() : '',
    css: typeof payload.css === 'string' ? payload.css.trim() : ''
  }
}

function normalizeClipPathPayload(payload: Record<string, unknown>) {
  const layers = Array.isArray(payload.layers) ? payload.layers : []
  const normalizedLayers = layers.map((layer: any) => ({
    id: typeof layer?.id === 'string' ? layer.id : '',
    type: typeof layer?.type === 'string' ? layer.type : 'polygon',
    points: Array.isArray(layer?.points)
      ? layer.points.map((p: any) => ({
          id: typeof p?.id === 'string' ? p.id : '',
          x: normalizeNumber(p?.x),
          y: normalizeNumber(p?.y)
        }))
      : undefined,
    radius: layer?.radius !== undefined ? normalizeNumber(layer.radius) : undefined,
    radiusX: layer?.radiusX !== undefined ? normalizeNumber(layer.radiusX) : undefined,
    radiusY: layer?.radiusY !== undefined ? normalizeNumber(layer.radiusY) : undefined,
    inset: layer?.inset ? {
      top: normalizeNumber(layer.inset.top),
      right: normalizeNumber(layer.inset.right),
      bottom: normalizeNumber(layer.inset.bottom),
      left: normalizeNumber(layer.inset.left),
      round: layer.inset.round !== undefined ? normalizeNumber(layer.inset.round) : undefined
    } : undefined,
    visible: typeof layer?.visible === 'boolean' ? layer.visible : true
  }))
  return {
    layers: normalizedLayers
  }
}

export function normalizePayload(category: SaveCategory, payload: unknown) {
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
