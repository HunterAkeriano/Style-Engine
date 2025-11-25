import type { ClipPathLayer, CreatorProfile } from '@/shared/types'

export interface ClipPathPreset {
  id: string
  name: string
  layers: ClipPathLayer[]
  owner?: CreatorProfile
}

export const CLIP_PATH_PRESETS: ClipPathPreset[] = [
  {
    id: 'geometric-mandala',
    name: 'Geometric Mandala',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 50, y: 5 },
          { id: 'p2', x: 58, y: 15 },
          { id: 'p3', x: 70, y: 12 },
          { id: 'p4', x: 65, y: 23 },
          { id: 'p5', x: 78, y: 28 },
          { id: 'p6', x: 68, y: 35 },
          { id: 'p7', x: 72, y: 48 },
          { id: 'p8', x: 60, y: 45 },
          { id: 'p9', x: 55, y: 55 },
          { id: 'p10', x: 50, y: 45 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'abstract-wave',
    name: 'Abstract Wave',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 0, y: 25 },
          { id: 'p2', x: 12, y: 18 },
          { id: 'p3', x: 25, y: 22 },
          { id: 'p4', x: 38, y: 12 },
          { id: 'p5', x: 50, y: 15 },
          { id: 'p6', x: 62, y: 8 },
          { id: 'p7', x: 75, y: 12 },
          { id: 'p8', x: 88, y: 5 },
          { id: 'p9', x: 100, y: 10 },
          { id: 'p10', x: 100, y: 100 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'starburst-complex',
    name: 'Starburst Complex',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 50, y: 0 },
          { id: 'p2', x: 54, y: 18 },
          { id: 'p3', x: 68, y: 12 },
          { id: 'p4', x: 58, y: 26 },
          { id: 'p5', x: 75, y: 30 },
          { id: 'p6', x: 62, y: 40 },
          { id: 'p7', x: 72, y: 55 },
          { id: 'p8', x: 56, y: 48 },
          { id: 'p9', x: 50, y: 65 },
          { id: 'p10', x: 44, y: 48 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'tech-pattern',
    name: 'Tech Pattern',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 15, y: 0 },
          { id: 'p2', x: 35, y: 0 },
          { id: 'p3', x: 38, y: 8 },
          { id: 'p4', x: 50, y: 8 },
          { id: 'p5', x: 50, y: 20 },
          { id: 'p6', x: 62, y: 20 },
          { id: 'p7', x: 65, y: 0 },
          { id: 'p8', x: 85, y: 0 },
          { id: 'p9', x: 100, y: 15 },
          { id: 'p10', x: 100, y: 35 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'ornate-ribbon',
    name: 'Ornate Ribbon',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 5, y: 30 },
          { id: 'p2', x: 15, y: 25 },
          { id: 'p3', x: 20, y: 35 },
          { id: 'p4', x: 30, y: 30 },
          { id: 'p5', x: 35, y: 40 },
          { id: 'p6', x: 50, y: 35 },
          { id: 'p7', x: 65, y: 40 },
          { id: 'p8', x: 70, y: 30 },
          { id: 'p9', x: 80, y: 35 },
          { id: 'p10', x: 85, y: 25 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'intricate-badge',
    name: 'Intricate Badge',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 50, y: 8 },
          { id: 'p2', x: 62, y: 15 },
          { id: 'p3', x: 72, y: 12 },
          { id: 'p4', x: 78, y: 22 },
          { id: 'p5', x: 88, y: 25 },
          { id: 'p6', x: 85, y: 35 },
          { id: 'p7', x: 92, y: 45 },
          { id: 'p8', x: 82, y: 50 },
          { id: 'p9', x: 78, y: 62 },
          { id: 'p10', x: 68, y: 58 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'decorative-arrow',
    name: 'Decorative Arrow',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 0, y: 35 },
          { id: 'p2', x: 8, y: 28 },
          { id: 'p3', x: 15, y: 35 },
          { id: 'p4', x: 45, y: 32 },
          { id: 'p5', x: 52, y: 25 },
          { id: 'p6', x: 60, y: 18 },
          { id: 'p7', x: 65, y: 12 },
          { id: 'p8', x: 78, y: 25 },
          { id: 'p9', x: 92, y: 35 },
          { id: 'p10', x: 100, y: 50 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'ornamental-speech',
    name: 'Ornamental Speech',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 8, y: 10 },
          { id: 'p2', x: 20, y: 5 },
          { id: 'p3', x: 40, y: 8 },
          { id: 'p4', x: 60, y: 5 },
          { id: 'p5', x: 80, y: 8 },
          { id: 'p6', x: 92, y: 10 },
          { id: 'p7', x: 95, y: 25 },
          { id: 'p8', x: 92, y: 45 },
          { id: 'p9', x: 85, y: 58 },
          { id: 'p10', x: 72, y: 62 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'decorative-frame',
    name: 'Decorative Frame',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 12, y: 5 },
          { id: 'p2', x: 25, y: 8 },
          { id: 'p3', x: 35, y: 5 },
          { id: 'p4', x: 50, y: 10 },
          { id: 'p5', x: 65, y: 5 },
          { id: 'p6', x: 75, y: 8 },
          { id: 'p7', x: 88, y: 5 },
          { id: 'p8', x: 95, y: 12 },
          { id: 'p9', x: 92, y: 25 },
          { id: 'p10', x: 95, y: 35 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'art-deco',
    name: 'Art Deco',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 50, y: 0 },
          { id: 'p2', x: 65, y: 10 },
          { id: 'p3', x: 70, y: 8 },
          { id: 'p4', x: 82, y: 18 },
          { id: 'p5', x: 88, y: 15 },
          { id: 'p6', x: 95, y: 25 },
          { id: 'p7', x: 90, y: 35 },
          { id: 'p8', x: 85, y: 38 },
          { id: 'p9', x: 75, y: 48 },
          { id: 'p10', x: 68, y: 45 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'petal-complex',
    name: 'Petal Complex',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 50, y: 15 },
          { id: 'p2', x: 58, y: 20 },
          { id: 'p3', x: 68, y: 18 },
          { id: 'p4', x: 72, y: 28 },
          { id: 'p5', x: 78, y: 35 },
          { id: 'p6', x: 75, y: 45 },
          { id: 'p7', x: 68, y: 52 },
          { id: 'p8', x: 58, y: 48 },
          { id: 'p9', x: 50, y: 55 },
          { id: 'p10', x: 42, y: 48 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'crystal-geo',
    name: 'Crystal Geometric',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 50, y: 5 },
          { id: 'p2', x: 62, y: 12 },
          { id: 'p3', x: 58, y: 22 },
          { id: 'p4', x: 70, y: 28 },
          { id: 'p5', x: 68, y: 38 },
          { id: 'p6', x: 78, y: 45 },
          { id: 'p7', x: 72, y: 58 },
          { id: 'p8', x: 60, y: 52 },
          { id: 'p9', x: 55, y: 65 },
          { id: 'p10', x: 45, y: 58 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'architectural-pattern',
    name: 'Architectural',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 20, y: 5 },
          { id: 'p2', x: 30, y: 5 },
          { id: 'p3', x: 32, y: 15 },
          { id: 'p4', x: 42, y: 15 },
          { id: 'p5', x: 45, y: 25 },
          { id: 'p6', x: 55, y: 25 },
          { id: 'p7', x: 58, y: 15 },
          { id: 'p8', x: 68, y: 15 },
          { id: 'p9', x: 70, y: 5 },
          { id: 'p10', x: 80, y: 5 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'flowing-curves',
    name: 'Flowing Curves',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 15, y: 20 },
          { id: 'p2', x: 22, y: 12 },
          { id: 'p3', x: 32, y: 18 },
          { id: 'p4', x: 42, y: 10 },
          { id: 'p5', x: 52, y: 15 },
          { id: 'p6', x: 62, y: 8 },
          { id: 'p7', x: 72, y: 14 },
          { id: 'p8', x: 82, y: 10 },
          { id: 'p9', x: 90, y: 18 },
          { id: 'p10', x: 95, y: 28 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'tribal-pattern',
    name: 'Tribal Pattern',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 50, y: 8 },
          { id: 'p2', x: 60, y: 12 },
          { id: 'p3', x: 65, y: 22 },
          { id: 'p4', x: 75, y: 25 },
          { id: 'p5', x: 78, y: 35 },
          { id: 'p6', x: 72, y: 45 },
          { id: 'p7', x: 75, y: 55 },
          { id: 'p8', x: 65, y: 58 },
          { id: 'p9', x: 60, y: 68 },
          { id: 'p10', x: 50, y: 72 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'layered-mountain',
    name: 'Layered Mountain',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 0, y: 100 },
          { id: 'p2', x: 12, y: 65 },
          { id: 'p3', x: 20, y: 70 },
          { id: 'p4', x: 28, y: 55 },
          { id: 'p5', x: 35, y: 60 },
          { id: 'p6', x: 45, y: 40 },
          { id: 'p7', x: 52, y: 45 },
          { id: 'p8', x: 60, y: 35 },
          { id: 'p9', x: 68, y: 42 },
          { id: 'p10', x: 75, y: 30 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'polygon-burst',
    name: 'Polygon Burst',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 50, y: 10 },
          { id: 'p2', x: 56, y: 22 },
          { id: 'p3', x: 68, y: 18 },
          { id: 'p4', x: 65, y: 30 },
          { id: 'p5', x: 78, y: 32 },
          { id: 'p6', x: 70, y: 42 },
          { id: 'p7', x: 75, y: 55 },
          { id: 'p8', x: 62, y: 50 },
          { id: 'p9', x: 58, y: 62 },
          { id: 'p10', x: 50, y: 52 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'abstract-leaf',
    name: 'Abstract Leaf',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 50, y: 5 },
          { id: 'p2', x: 62, y: 15 },
          { id: 'p3', x: 68, y: 25 },
          { id: 'p4', x: 75, y: 38 },
          { id: 'p5', x: 78, y: 50 },
          { id: 'p6', x: 75, y: 65 },
          { id: 'p7', x: 68, y: 75 },
          { id: 'p8', x: 58, y: 85 },
          { id: 'p9', x: 50, y: 92 },
          { id: 'p10', x: 45, y: 82 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'futuristic-panel',
    name: 'Futuristic Panel',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 10, y: 8 },
          { id: 'p2', x: 25, y: 5 },
          { id: 'p3', x: 35, y: 12 },
          { id: 'p4', x: 48, y: 8 },
          { id: 'p5', x: 52, y: 18 },
          { id: 'p6', x: 65, y: 15 },
          { id: 'p7', x: 75, y: 22 },
          { id: 'p8', x: 90, y: 18 },
          { id: 'p9', x: 95, y: 28 },
          { id: 'p10', x: 88, y: 38 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'gothic-arch',
    name: 'Gothic Arch',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 20, y: 100 },
          { id: 'p2', x: 25, y: 65 },
          { id: 'p3', x: 30, y: 55 },
          { id: 'p4', x: 35, y: 40 },
          { id: 'p5', x: 40, y: 25 },
          { id: 'p6', x: 45, y: 15 },
          { id: 'p7', x: 50, y: 5 },
          { id: 'p8', x: 55, y: 15 },
          { id: 'p9', x: 60, y: 25 },
          { id: 'p10', x: 65, y: 40 }
        ],
        visible: true
      }
    ]
  }
]
