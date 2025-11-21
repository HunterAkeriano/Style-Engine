export interface ShadowLayer {
  id: string
  x: number
  y: number
  spread: number
  color: string
  opacity: number
  inset?: boolean
}

export interface ShadowPreset {
  id: string
  name: string
  description: string
  layers: ShadowLayer[]
}
