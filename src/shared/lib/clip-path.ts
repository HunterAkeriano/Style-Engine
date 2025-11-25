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

  const svg = doc.querySelector('svg')
  if (!svg) return layers

  const viewBox = svg.getAttribute('viewBox')
  let width = parseFloat(svg.getAttribute('width') || '100')
  let height = parseFloat(svg.getAttribute('height') || '100')

  if (viewBox) {
    const parts = viewBox.split(/[\s,]+/)
    if (parts.length === 4) {
      width = parseFloat(parts[2])
      height = parseFloat(parts[3])
    }
  }

  if (!width || width <= 0) width = 100
  if (!height || height <= 0) height = 100

  let layerIndex = 0

  const collectShapes = (element: Element): Element[] => {
    const shapes: Element[] = []

    const basicShapes = ['circle', 'ellipse']
    basicShapes.forEach(selector => {
      const elements = element.querySelectorAll(selector)
      elements.forEach(el => shapes.push(el))
    })

    if (shapes.length > 0) {
      return shapes.slice(0, 3)
    }

    const simpleShapes = ['rect', 'polygon']
    simpleShapes.forEach(selector => {
      const elements = element.querySelectorAll(selector)
      elements.forEach(el => shapes.push(el))
    })

    if (shapes.length > 0) {
      return shapes.slice(0, 3)
    }

    const paths = element.querySelectorAll('path')
    paths.forEach(path => shapes.push(path))

    return shapes.slice(0, 3)
  }

  const allShapes = collectShapes(svg)

  allShapes.forEach((shape) => {
    const tagName = shape.tagName.toLowerCase()

    try {
      if (tagName === 'polygon') {
        const pointsAttr = shape.getAttribute('points')
        if (pointsAttr) {
          const points = parsePolygonPoints(pointsAttr, width, height)
          if (points.length >= 3) {
            layers.push({
              id: `layer-${++layerIndex}`,
              type: 'polygon',
              points,
              visible: true
            })
          }
        }
      } else if (tagName === 'circle') {
        const cx = parseFloat(shape.getAttribute('cx') || '50')
        const cy = parseFloat(shape.getAttribute('cy') || '50')
        const r = parseFloat(shape.getAttribute('r') || '25')

        if (r > 0) {
          const minSize = Math.min(width, height)
          const radiusPercent = Math.min(50, (r / minSize) * 100)

          layers.push({
            id: `layer-${++layerIndex}`,
            type: 'circle',
            radius: radiusPercent,
            visible: true
          })
        }
      } else if (tagName === 'ellipse') {
        const cx = parseFloat(shape.getAttribute('cx') || '50')
        const cy = parseFloat(shape.getAttribute('cy') || '50')
        const rx = parseFloat(shape.getAttribute('rx') || '50')
        const ry = parseFloat(shape.getAttribute('ry') || '50')

        if (rx > 0 && ry > 0) {
          const radiusXPercent = Math.min(50, (rx / width) * 100)
          const radiusYPercent = Math.min(50, (ry / height) * 100)

          layers.push({
            id: `layer-${++layerIndex}`,
            type: 'ellipse',
            radiusX: radiusXPercent,
            radiusY: radiusYPercent,
            visible: true
          })
        }
      } else if (tagName === 'rect') {
        const x = parseFloat(shape.getAttribute('x') || '0')
        const y = parseFloat(shape.getAttribute('y') || '0')
        const w = parseFloat(shape.getAttribute('width') || '0')
        const h = parseFloat(shape.getAttribute('height') || '0')

        if (w > 0 && h > 0) {
          const points = [
            { id: 'p1', x: Math.max(0, Math.min(100, (x / width) * 100)), y: Math.max(0, Math.min(100, (y / height) * 100)) },
            { id: 'p2', x: Math.max(0, Math.min(100, ((x + w) / width) * 100)), y: Math.max(0, Math.min(100, (y / height) * 100)) },
            { id: 'p3', x: Math.max(0, Math.min(100, ((x + w) / width) * 100)), y: Math.max(0, Math.min(100, ((y + h) / height) * 100)) },
            { id: 'p4', x: Math.max(0, Math.min(100, (x / width) * 100)), y: Math.max(0, Math.min(100, ((y + h) / height) * 100)) }
          ]

          layers.push({
            id: `layer-${++layerIndex}`,
            type: 'polygon',
            points,
            visible: true
          })
        }
      } else if (tagName === 'path') {
        const d = shape.getAttribute('d')
        if (d) {
          const points = parsePathToPoints(d, width, height)
          if (points.length >= 3) {
            layers.push({
              id: `layer-${++layerIndex}`,
              type: 'polygon',
              points,
              visible: true
            })
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to parse ${tagName} element:`, error)
    }
  })

  if (layers.length === 0) {
    layers.push({
      id: 'layer-1',
      type: 'polygon',
      points: [
        { id: 'p1', x: 0, y: 0 },
        { id: 'p2', x: 100, y: 0 },
        { id: 'p3', x: 100, y: 100 },
        { id: 'p4', x: 0, y: 100 }
      ],
      visible: true
    })
  }

  return layers.slice(0, 3)
}

function parsePolygonPoints(
  pointsString: string,
  width: number,
  height: number
): Array<{ id: string; x: number; y: number }> {
  const points: Array<{ id: string; x: number; y: number }> = []
  const coords = pointsString.trim().split(/[\s,]+/)

  for (let i = 0; i < coords.length; i += 2) {
    if (i + 1 < coords.length) {
      const x = parseFloat(coords[i])
      const y = parseFloat(coords[i + 1])

      const xPercent = (x / width) * 100
      const yPercent = (y / height) * 100

      points.push({
        id: `p${i / 2 + 1}`,
        x: Math.max(0, Math.min(100, xPercent)),
        y: Math.max(0, Math.min(100, yPercent))
      })
    }
  }

  return points
}

function parsePathToPoints(
  pathString: string,
  width: number,
  height: number
): Array<{ id: string; x: number; y: number }> {
  const points: Array<{ id: string; x: number; y: number }> = []

  const allCommands = pathString.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || []

  let currentX = 0
  let currentY = 0
  let startX = 0
  let startY = 0

  allCommands.forEach((cmdStr) => {
    const cmd = cmdStr[0].toUpperCase()
    const values = cmdStr.substring(1).trim()
      .split(/[\s,]+/)
      .filter(v => v)
      .map(v => parseFloat(v))

    if (cmd === 'M' || cmd === 'm') {
      if (values.length >= 2) {
        if (cmd === 'M') {
          currentX = values[0]
          currentY = values[1]
        } else {
          currentX += values[0]
          currentY += values[1]
        }
        startX = currentX
        startY = currentY

        const xPercent = (currentX / width) * 100
        const yPercent = (currentY / height) * 100

        if (points.length < 10) {
          points.push({
            id: `p${points.length + 1}`,
            x: Math.max(0, Math.min(100, xPercent)),
            y: Math.max(0, Math.min(100, yPercent))
          })
        }
      }
    } else if (cmd === 'L' || cmd === 'l') {
      for (let i = 0; i < values.length; i += 2) {
        if (i + 1 < values.length) {
          if (cmd === 'L') {
            currentX = values[i]
            currentY = values[i + 1]
          } else {
            currentX += values[i]
            currentY += values[i + 1]
          }

          const xPercent = (currentX / width) * 100
          const yPercent = (currentY / height) * 100

          if (points.length < 10) {
            points.push({
              id: `p${points.length + 1}`,
              x: Math.max(0, Math.min(100, xPercent)),
              y: Math.max(0, Math.min(100, yPercent))
            })
          }
        }
      }
    } else if (cmd === 'H' || cmd === 'h') {
      values.forEach(value => {
        if (cmd === 'H') {
          currentX = value
        } else {
          currentX += value
        }

        const xPercent = (currentX / width) * 100
        const yPercent = (currentY / height) * 100

        if (points.length < 10) {
          points.push({
            id: `p${points.length + 1}`,
            x: Math.max(0, Math.min(100, xPercent)),
            y: Math.max(0, Math.min(100, yPercent))
          })
        }
      })
    } else if (cmd === 'V' || cmd === 'v') {
      values.forEach(value => {
        if (cmd === 'V') {
          currentY = value
        } else {
          currentY += value
        }

        const xPercent = (currentX / width) * 100
        const yPercent = (currentY / height) * 100

        if (points.length < 10) {
          points.push({
            id: `p${points.length + 1}`,
            x: Math.max(0, Math.min(100, xPercent)),
            y: Math.max(0, Math.min(100, yPercent))
          })
        }
      })
    } else if (cmd === 'Z' || cmd === 'z') {
      currentX = startX
      currentY = startY
    }
  })

  return points.length >= 3 ? points : []
}
