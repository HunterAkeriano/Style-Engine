import type { ClipPathLayer, CreatorProfile } from '@/shared/types'

export interface ClipPathPreset {
  id: string
  name: string
  layers: ClipPathLayer[]
  owner?: CreatorProfile
}

export const CLIP_PATH_PRESETS: ClipPathPreset[] = [
  {
    id: 'diamond',
    name: 'Diamond',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 50, y: 0 },
          { id: 'p2', x: 100, y: 50 },
          { id: 'p3', x: 50, y: 100 },
          { id: 'p4', x: 0, y: 50 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'triangle',
    name: 'Triangle',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 50, y: 0 },
          { id: 'p2', x: 100, y: 100 },
          { id: 'p3', x: 0, y: 100 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 50, y: 0 },
          { id: 'p2', x: 100, y: 38 },
          { id: 'p3', x: 82, y: 100 },
          { id: 'p4', x: 18, y: 100 },
          { id: 'p5', x: 0, y: 38 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 25, y: 0 },
          { id: 'p2', x: 75, y: 0 },
          { id: 'p3', x: 100, y: 50 },
          { id: 'p4', x: 75, y: 100 },
          { id: 'p5', x: 25, y: 100 },
          { id: 'p6', x: 0, y: 50 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'star',
    name: 'Star',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 50, y: 0 },
          { id: 'p2', x: 61, y: 35 },
          { id: 'p3', x: 98, y: 35 },
          { id: 'p4', x: 68, y: 57 },
          { id: 'p5', x: 79, y: 91 },
          { id: 'p6', x: 50, y: 70 },
          { id: 'p7', x: 21, y: 91 },
          { id: 'p8', x: 32, y: 57 },
          { id: 'p9', x: 2, y: 35 },
          { id: 'p10', x: 39, y: 35 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'octagon',
    name: 'Octagon',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 30, y: 0 },
          { id: 'p2', x: 70, y: 0 },
          { id: 'p3', x: 100, y: 30 },
          { id: 'p4', x: 100, y: 70 },
          { id: 'p5', x: 70, y: 100 },
          { id: 'p6', x: 30, y: 100 },
          { id: 'p7', x: 0, y: 70 },
          { id: 'p8', x: 0, y: 30 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'parallelogram',
    name: 'Parallelogram',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 25, y: 0 },
          { id: 'p2', x: 100, y: 0 },
          { id: 'p3', x: 75, y: 100 },
          { id: 'p4', x: 0, y: 100 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'trapezoid',
    name: 'Trapezoid',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 20, y: 0 },
          { id: 'p2', x: 80, y: 0 },
          { id: 'p3', x: 100, y: 100 },
          { id: 'p4', x: 0, y: 100 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'arrow-right',
    name: 'Arrow Right',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 0, y: 20 },
          { id: 'p2', x: 60, y: 20 },
          { id: 'p3', x: 60, y: 0 },
          { id: 'p4', x: 100, y: 50 },
          { id: 'p5', x: 60, y: 100 },
          { id: 'p6', x: 60, y: 80 },
          { id: 'p7', x: 0, y: 80 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'chevron-right',
    name: 'Chevron Right',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 75, y: 0 },
          { id: 'p2', x: 100, y: 50 },
          { id: 'p3', x: 75, y: 100 },
          { id: 'p4', x: 25, y: 100 },
          { id: 'p5', x: 50, y: 50 },
          { id: 'p6', x: 25, y: 0 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'message-bubble',
    name: 'Message Bubble',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 0, y: 0 },
          { id: 'p2', x: 100, y: 0 },
          { id: 'p3', x: 100, y: 75 },
          { id: 'p4', x: 20, y: 75 },
          { id: 'p5', x: 0, y: 100 },
          { id: 'p6', x: 0, y: 75 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'notch',
    name: 'Notch Corner',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 0, y: 0 },
          { id: 'p2', x: 100, y: 0 },
          { id: 'p3', x: 100, y: 80 },
          { id: 'p4', x: 80, y: 100 },
          { id: 'p5', x: 0, y: 100 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'bevel',
    name: 'Bevel',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 20, y: 0 },
          { id: 'p2', x: 80, y: 0 },
          { id: 'p3', x: 100, y: 20 },
          { id: 'p4', x: 100, y: 80 },
          { id: 'p5', x: 80, y: 100 },
          { id: 'p6', x: 20, y: 100 },
          { id: 'p7', x: 0, y: 80 },
          { id: 'p8', x: 0, y: 20 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'close-icon',
    name: 'Close Icon',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 20, y: 0 },
          { id: 'p2', x: 50, y: 30 },
          { id: 'p3', x: 80, y: 0 },
          { id: 'p4', x: 100, y: 20 },
          { id: 'p5', x: 70, y: 50 },
          { id: 'p6', x: 100, y: 80 },
          { id: 'p7', x: 80, y: 100 },
          { id: 'p8', x: 50, y: 70 },
          { id: 'p9', x: 20, y: 100 },
          { id: 'p10', x: 0, y: 80 }
        ],
        visible: true
      }
    ]
  },
  {
    id: 'circle-50',
    name: 'Circle',
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
    id: 'ellipse-wide',
    name: 'Ellipse Wide',
    layers: [
      {
        id: 'layer-1',
        type: 'ellipse',
        radiusX: 50,
        radiusY: 35,
        visible: true
      }
    ]
  },
  {
    id: 'ellipse-tall',
    name: 'Ellipse Tall',
    layers: [
      {
        id: 'layer-1',
        type: 'ellipse',
        radiusX: 35,
        radiusY: 50,
        visible: true
      }
    ]
  },
  {
    id: 'rounded-rect',
    name: 'Rounded Rectangle',
    layers: [
      {
        id: 'layer-1',
        type: 'inset',
        inset: {
          top: 5,
          right: 5,
          bottom: 5,
          left: 5,
          round: 15
        },
        visible: true
      }
    ]
  },
  {
    id: 'card-left',
    name: 'Card Left Cut',
    layers: [
      {
        id: 'layer-1',
        type: 'inset',
        inset: {
          top: 0,
          right: 0,
          bottom: 0,
          left: 10,
          round: 0
        },
        visible: true
      }
    ]
  },
  {
    id: 'ticket',
    name: 'Ticket',
    layers: [
      {
        id: 'layer-1',
        type: 'polygon',
        points: [
          { id: 'p1', x: 0, y: 0 },
          { id: 'p2', x: 95, y: 0 },
          { id: 'p3', x: 100, y: 5 },
          { id: 'p4', x: 100, y: 45 },
          { id: 'p5', x: 95, y: 50 },
          { id: 'p6', x: 100, y: 55 },
          { id: 'p7', x: 100, y: 95 },
          { id: 'p8', x: 95, y: 100 },
          { id: 'p9', x: 0, y: 100 }
        ],
        visible: true
      }
    ]
  }
]
