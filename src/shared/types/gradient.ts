export type GradientType = 'linear' | 'radial' | 'conic'

export type GradientExtent = 'closest-side' | 'farthest-side' | 'closest-corner' | 'farthest-corner'

export interface GradientColor {
  id: string
  color: string
  position: number
}

export interface GradientCenter {
  x: number
  y: number
}

export interface LinearGradientConfig {
  type: 'linear'
  angle: number
  colors: GradientColor[]
  repeating?: boolean
}

export interface RadialGradientConfig {
  type: 'radial'
  shape: 'circle' | 'ellipse'
  position: string
  colors: GradientColor[]
  extent?: GradientExtent
  center?: GradientCenter
  repeating?: boolean
}

export interface ConicGradientConfig {
  type: 'conic'
  angle: number
  position: string
  colors: GradientColor[]
  center?: GradientCenter
  repeating?: boolean
}

export type GradientConfig = LinearGradientConfig | RadialGradientConfig | ConicGradientConfig

export interface SavedGradient {
  id: string
  name: string
  config: GradientConfig
  createdAt: string
  updatedAt: string
}
