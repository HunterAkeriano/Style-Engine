export type CSSFormat = 'css' | 'scss' | 'sass' | 'stylus' | 'tailwind' | 'inline'

export type GradientExtent = 'closest-side' | 'farthest-side' | 'closest-corner' | 'farthest-corner'

export interface GradientCenter {
  x: number
  y: number
}

export interface GradientOptions {
  shape?: 'circle' | 'ellipse'
  extent?: GradientExtent
  center?: GradientCenter
  repeating?: boolean
}

const clampPercent = (value: unknown, fallback = 50) => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  return Math.min(100, Math.max(0, value))
}

export function buildGradientValue(
  type: 'linear' | 'radial' | 'conic',
  angle: number,
  colors: Array<{ color: string; position: number }>,
  options: GradientOptions = {}
): string {
  const colorStops = colors.map(c => `${c.color} ${c.position}%`).join(', ')
  const center = options.center
    ? `${clampPercent(options.center.x)}% ${clampPercent(options.center.y)}%`
    : '50% 50%'
  const isRepeating = options.repeating ?? false
  const prefix = isRepeating ? 'repeating-' : ''

  switch (type) {
    case 'radial':
      return `${prefix}radial-gradient(${options.shape ?? 'circle'} ${options.extent ?? 'farthest-corner'} at ${center}, ${colorStops})`
    case 'conic':
      return `${prefix}conic-gradient(from ${angle}deg at ${center}, ${colorStops})`
    default:
      return `${prefix}linear-gradient(${angle}deg, ${colorStops})`
  }
}

export function formatGradient(
  type: 'linear' | 'radial' | 'conic',
  angle: number,
  colors: Array<{ color: string; position: number }>,
  format: CSSFormat = 'css',
  options: GradientOptions = {}
): string {
  const gradient = buildGradientValue(type, angle, colors, options)
  return formatCSSProperty('background', gradient, format)
}

export function formatBoxShadow(
  shadows: Array<{
    x: number
    y: number
    blur?: number
    spread: number
    color: string
    inset?: boolean
  }>,
  format: CSSFormat = 'css'
): string {
  const shadowValues = shadows
    .map(s => {
      const inset = s.inset ? 'inset ' : ''
      const blur = typeof s.blur === 'number' ? s.blur : 0
      return `${inset}${s.x}px ${s.y}px ${blur}px ${s.spread}px ${s.color}`
    })
    .join(', ')

  return formatCSSProperty('box-shadow', shadowValues, format)
}

export function formatTextShadow(
  shadows: Array<{
    x: number
    y: number
    blur: number
    color: string
  }>,
  format: CSSFormat = 'css'
): string {
  const shadowValues = shadows
    .map(s => `${s.x}px ${s.y}px ${s.blur}px ${s.color}`)
    .join(', ')

  return formatCSSProperty('text-shadow', shadowValues, format)
}

export function formatAnimation(
  name: string,
  duration: number,
  timingFunction: string,
  delay: number,
  iterationCount: number | 'infinite',
  direction: string,
  fillMode: string,
  format: CSSFormat = 'css'
): string {
  const value = `${name} ${duration}s ${timingFunction} ${delay}s ${iterationCount} ${direction} ${fillMode}`
  return formatCSSProperty('animation', value, format)
}

export function formatKeyframes(
  name: string,
  keyframes: Array<{ position: number; properties: Record<string, string> }>
): string {
  const frames = keyframes
    .map(kf => {
      const props = Object.entries(kf.properties)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n')
      return `  ${kf.position}% {\n${props}\n  }`
    })
    .join('\n')

  return `@keyframes ${name} {\n${frames}\n}`
}

export function formatCSSProperty(
  property: string,
  value: string,
  format: CSSFormat = 'css'
): string {
  switch (format) {
    case 'css':
    case 'scss':
      return `${property}: ${value};`
    case 'sass':
      return `${property}: ${value}`
    case 'stylus':
      return `${property} ${value}`
    case 'tailwind':
      return convertToTailwind(property, value)
    case 'inline':
      return `${property}: ${value};`
    default:
      return `${property}: ${value};`
  }
}

function convertToTailwind(property: string, value: string): string {
  return `/* Tailwind conversion for ${property}: ${value} */`
}

export function minifyCSS(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*{\s*/g, '{')
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*:\s*/g, ':')
    .replace(/\s*;\s*/g, ';')
    .replace(/;\}/g, '}')
    .trim()
}

export function prettifyCSS(css: string): string {
  return css
    .replace(/\s*{\s*/g, ' {\n  ')
    .replace(/\s*}\s*/g, '\n}\n')
    .replace(/\s*;\s*/g, ';\n  ')
    .replace(/\n\s*\n/g, '\n')
    .trim()
}
