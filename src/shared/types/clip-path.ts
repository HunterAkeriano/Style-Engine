export type ClipPathType = 'polygon' | 'ellipse' | 'circle' | 'inset'

export interface ClipPathPoint {
  id: string
  x: number
  y: number
}

export interface ClipPathLayer {
  id: string
  type: ClipPathType
  points?: ClipPathPoint[]
  radius?: number
  radiusX?: number
  radiusY?: number
  inset?: {
    top: number
    right: number
    bottom: number
    left: number
    round?: number
  }
  visible: boolean
}

export interface ClipPathConfig {
  layers: ClipPathLayer[]
}

export interface SavedClipPath {
  id: string
  name: string
  config: ClipPathConfig
  createdAt: string
  updatedAt: string
}
