import type { ClipPathLayer, CreatorProfile } from '@/shared/types'

export interface ClipPathPreset {
  id: string
  name: string
  layers: ClipPathLayer[]
  owner?: CreatorProfile
}

export const CLIP_PATH_PRESETS: ClipPathPreset[] = [
  {
    id: 'hero-diagonal',
    name: 'Hero Diagonal',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 0, y: 0 },
          { id: 'p2', x: 100, y: 0 },
          { id: 'p3', x: 100, y: 80 },
          { id: 'p4', x: 60, y: 100 },
          { id: 'p5', x: 0, y: 90 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'card-cut-corner',
    name: 'Card With Cut Corner',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 0, y: 0 },
          { id: 'p2', x: 80, y: 0 },
          { id: 'p3', x: 100, y: 15 },
          { id: 'p4', x: 100, y: 100 },
          { id: 'p5', x: 0, y: 100 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'ticket-stub',
    name: 'Ticket Stub',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 0, y: 0 },
          { id: 'p2', x: 100, y: 0 },
          { id: 'p3', x: 100, y: 30 },
          { id: 'p4', x: 88, y: 40 },
          { id: 'p5', x: 100, y: 50 },
          { id: 'p6', x: 100, y: 70 },
          { id: 'p7', x: 88, y: 80 },
          { id: 'p8', x: 100, y: 90 },
          { id: 'p9', x: 100, y: 100 },
          { id: 'p10', x: 0, y: 100 },
          { id: 'p11', x: 0, y: 90 },
          { id: 'p12', x: 12, y: 80 },
          { id: 'p13', x: 0, y: 70 },
          { id: 'p14', x: 0, y: 50 },
          { id: 'p15', x: 12, y: 40 },
          { id: 'p16', x: 0, y: 30 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'speech-bubble',
    name: 'Speech Bubble',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 10, y: 10 },
          { id: 'p2', x: 90, y: 10 },
          { id: 'p3', x: 90, y: 65 },
          { id: 'p4', x: 60, y: 65 },
          { id: 'p5', x: 50, y: 80 },
          { id: 'p6', x: 40, y: 65 },
          { id: 'p7', x: 10, y: 65 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'hex-badge',
    name: 'Hex Badge',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 50, y: 0 },
          { id: 'p2', x: 90, y: 25 },
          { id: 'p3', x: 90, y: 75 },
          { id: 'p4', x: 50, y: 100 },
          { id: 'p5', x: 10, y: 75 },
          { id: 'p6', x: 10, y: 25 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'angled-bottom-card',
    name: 'Angled Bottom Card',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 0, y: 0 },
          { id: 'p2', x: 100, y: 0 },
          { id: 'p3', x: 100, y: 85 },
          { id: 'p4', x: 65, y: 100 },
          { id: 'p5', x: 0, y: 90 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'circle-avatar',
    name: 'Circle Avatar',
    layers: [
      {
        id: 'layer-1',
        type: 'circle',
        radius: 50,
        visible: true
      }
    ]
  },
  {
    id: 'tab-label',
    name: 'Tab Label',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 0, y: 0 },
          { id: 'p2', x: 85, y: 0 },
          { id: 'p3', x: 100, y: 20 },
          { id: 'p4', x: 85, y: 40 },
          { id: 'p5', x: 0, y: 40 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'angled-header',
    name: 'Angled Header',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 0, y: 0 },
          { id: 'p2', x: 100, y: 0 },
          { id: 'p3', x: 100, y: 55 },
          { id: 'p4', x: 0, y: 80 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'notched-banner',
    name: 'Notched Banner',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 0, y: 0 },
          { id: 'p2', x: 100, y: 0 },
          { id: 'p3', x: 100, y: 60 },
          { id: 'p4', x: 70, y: 60 },
          { id: 'p5', x: 60, y: 80 },
          { id: 'p6', x: 50, y: 60 },
          { id: 'p7', x: 0, y: 60 }
        ],
        visible: true
      }
    ]
  }
]
