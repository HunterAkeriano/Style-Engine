import type { ClipPathLayer } from '@/shared/types/clip-path'
import type { CSSFormat } from './css'

export function formatClipPath(layers: ClipPathLayer[], format: CSSFormat = 'css'): string {
  const visibleLayers = layers.filter(layer => layer.visible)

  if (visibleLayers.length === 0) {
    return ''
  }

  const clipPaths = visibleLayers.map(layer => generateClipPathValue(layer))
  const clipPathValue = clipPaths.join(', ')

  switch (format) {
    case 'css':
      return `clip-path: ${clipPathValue};`
    case 'scss':
    case 'sass':
      return `clip-path: ${clipPathValue}`
    case 'stylus':
      return `clip-path ${clipPathValue}`
    case 'inline':
      return `clip-path: ${clipPathValue};`
    default:
      return `clip-path: ${clipPathValue};`
  }
}

function generateClipPathValue(layer: ClipPathLayer): string {
  switch (layer.type) {
    case 'polygon':
      if (!layer.points || layer.points.length < 3) {
        return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
      }
      const points = layer.points
        .map(p => `${p.x}% ${p.y}%`)
        .join(', ')
      return `polygon(${points})`

    case 'circle':
      const radius = layer.radius ?? 50
      return `circle(${radius}% at 50% 50%)`

    case 'ellipse':
      const radiusX = layer.radiusX ?? 50
      const radiusY = layer.radiusY ?? 50
      return `ellipse(${radiusX}% ${radiusY}% at 50% 50%)`

    case 'inset':
      if (!layer.inset) {
        return 'inset(0% 0% 0% 0%)'
      }
      const { top, right, bottom, left, round } = layer.inset
      const insetValue = `${top}% ${right}% ${bottom}% ${left}%`
      return round ? `inset(${insetValue} round ${round}%)` : `inset(${insetValue})`

    default:
      return 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
  }
}

export function parseClipPathFromSVG(svgContent: string): ClipPathLayer[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(svgContent, 'image/svg+xml')
  const layers: ClipPathLayer[] = []

  // Ищем все <clipPath> элементы
  const clipPaths = doc.querySelectorAll('clipPath')

  clipPaths.forEach((clipPath, index) => {
    // Ищем polygon внутри clipPath
    const polygon = clipPath.querySelector('polygon')
    if (polygon) {
      const pointsAttr = polygon.getAttribute('points')
      if (pointsAttr) {
        const points = parsePolygonPoints(pointsAttr)
        layers.push({
          id: `layer-${index + 1}`,
          type: 'polygon',
          points,
          visible: true
        })
      }
    }

    // Ищем circle
    const circle = clipPath.querySelector('circle')
    if (circle) {
      const r = parseFloat(circle.getAttribute('r') || '50')
      layers.push({
        id: `layer-${index + 1}`,
        type: 'circle',
        radius: r,
        visible: true
      })
    }

    // Ищем ellipse
    const ellipse = clipPath.querySelector('ellipse')
    if (ellipse) {
      const rx = parseFloat(ellipse.getAttribute('rx') || '50')
      const ry = parseFloat(ellipse.getAttribute('ry') || '50')
      layers.push({
        id: `layer-${index + 1}`,
        type: 'ellipse',
        radiusX: rx,
        radiusY: ry,
        visible: true
      })
    }
  })

  return layers
}

function parsePolygonPoints(pointsString: string): Array<{ id: string; x: number; y: number }> {
  const points: Array<{ id: string; x: number; y: number }> = []
  const coords = pointsString.trim().split(/[\s,]+/)

  for (let i = 0; i < coords.length; i += 2) {
    if (i + 1 < coords.length) {
      points.push({
        id: `point-${i / 2 + 1}`,
        x: parseFloat(coords[i]),
        y: parseFloat(coords[i + 1])
      })
    }
  }

  return points
}
