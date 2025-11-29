import type { GeneratedFavicon, FaviconConfig } from '@/shared/types/favicon'
import JSZip from 'jszip'

export function generateFaviconHTML(favicons: GeneratedFavicon[]): string {
  const lines: string[] = []

  const favicon16 = favicons.find(f => f.size === 16)
  const favicon32 = favicons.find(f => f.size === 32)

  if (favicon16) {
    lines.push(`<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">`)
  }
  if (favicon32) {
    lines.push(`<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">`)
  }

  const appleTouchIcon = favicons.find(f => f.size === 180)
  if (appleTouchIcon) {
    lines.push(`<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`)
  }

  lines.push(`<link rel="manifest" href="/site.webmanifest">`)

  const msTile = favicons.find(f => f.size === 144)
  if (msTile) {
    lines.push(`<meta name="msapplication-TileImage" content="/mstile-144x144.png">`)
    lines.push(`<meta name="msapplication-TileColor" content="#ffffff">`)
  }

  lines.push(`<meta name="theme-color" content="#ffffff">`)

  return lines.join('\n')
}

export function generateManifestJSON(favicons: GeneratedFavicon[]): string {
  const android192 = favicons.find(f => f.size === 192)
  const android512 = favicons.find(f => f.size === 512)

  const manifest = {
    name: 'Your App Name',
    short_name: 'App',
    icons: [
      android192 && {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      android512 && {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ].filter(Boolean),
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
  }

  return JSON.stringify(manifest, null, 2)
}

export async function generateFaviconFromImage(
  sourceImage: HTMLImageElement,
  size: number,
  config: FaviconConfig
): Promise<GeneratedFavicon> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = size
  canvas.height = size

  if (config.backgroundColor && config.backgroundColor !== 'transparent') {
    ctx.fillStyle = config.backgroundColor
    ctx.fillRect(0, 0, size, size)
  }

  const padding = (size * config.padding) / 100
  const drawSize = size - padding * 2

  if (config.borderRadius > 0) {
    const radius = (drawSize * config.borderRadius) / 100
    ctx.save()
    roundRect(ctx, padding, padding, drawSize, drawSize, radius)
    ctx.clip()
  }

  ctx.drawImage(sourceImage, padding, padding, drawSize, drawSize)

  if (config.borderRadius > 0) {
    ctx.restore()
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      blob => {
        if (blob) resolve(blob)
        else reject(new Error('Failed to create blob'))
      },
      'image/png',
      1.0
    )
  })

  const dataUrl = canvas.toDataURL('image/png', 1.0)
  const filename = getFaviconFilename(size)

  return {
    size,
    dataUrl,
    blob,
    filename,
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

export function getFaviconFilename(size: number): string {
  switch (size) {
    case 16:
      return 'favicon-16x16.png'
    case 32:
      return 'favicon-32x32.png'
    case 48:
      return 'favicon-48x48.png'
    case 180:
      return 'apple-touch-icon.png'
    case 192:
      return 'android-chrome-192x192.png'
    case 512:
      return 'android-chrome-512x512.png'
    case 144:
      return 'mstile-144x144.png'
    default:
      return `favicon-${size}x${size}.png`
  }
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

export async function createFaviconZip(
  favicons: GeneratedFavicon[],
  manifestJson: string
): Promise<Blob> {
  const zip = new JSZip()

  for (const favicon of favicons) {
    zip.file(favicon.filename, favicon.blob)
  }

  zip.file('site.webmanifest', manifestJson)

  return await zip.generateAsync({ type: 'blob' })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
