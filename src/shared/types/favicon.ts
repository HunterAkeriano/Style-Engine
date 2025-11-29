export interface FaviconSize {
  name: string
  size: number
  purpose: string
  filename: string
}

export interface FaviconConfig {
  sourceImage: File | null
  sourceImageUrl: string | null
  backgroundColor: string
  padding: number
  borderRadius: number
}

export interface GeneratedFavicon {
  size: number
  dataUrl: string
  blob: Blob
  filename: string
}

export interface FaviconExportData {
  favicons: GeneratedFavicon[]
  htmlCode: string
  manifestJson: string
  zipBlob?: Blob
}

export interface FaviconPreset {
  id: string
  name: string
  svg: string
  backgroundColor: string
  padding: number
  borderRadius: number
}

export const FAVICON_SIZES: FaviconSize[] = [
  { name: 'Favicon 16x16', size: 16, purpose: 'Browser tab', filename: 'favicon-16x16.png' },
  { name: 'Favicon 32x32', size: 32, purpose: 'Browser tab (retina)', filename: 'favicon-32x32.png' },
  { name: 'Favicon 48x48', size: 48, purpose: 'Windows site icon', filename: 'favicon-48x48.png' },
  { name: 'Apple Touch Icon', size: 180, purpose: 'iOS home screen', filename: 'apple-touch-icon.png' },
  { name: 'Android Chrome 192', size: 192, purpose: 'Android home screen', filename: 'android-chrome-192x192.png' },
  { name: 'Android Chrome 512', size: 512, purpose: 'Android splash screen', filename: 'android-chrome-512x512.png' },
  { name: 'MS Tile', size: 144, purpose: 'Windows tile', filename: 'mstile-144x144.png' },
]

export type FaviconFormat = 'png' | 'ico'
