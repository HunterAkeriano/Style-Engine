export type CSSFormat = 'css' | 'scss' | 'sass' | 'stylus' | 'tailwind' | 'inline'

export function formatGradient(
  type: 'linear' | 'radial' | 'conic',
  angle: number,
  colors: Array<{ color: string; position: number }>,
  format: CSSFormat = 'css'
): string {
  const colorStops = colors
    .map(c => `${c.color} ${c.position}%`)
    .join(', ')

  let gradient = ''

  switch (type) {
    case 'linear':
      gradient = `linear-gradient(${angle}deg, ${colorStops})`
      break
    case 'radial':
      gradient = `radial-gradient(circle, ${colorStops})`
      break
    case 'conic':
      gradient = `conic-gradient(from ${angle}deg, ${colorStops})`
      break
  }

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
