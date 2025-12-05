import type { GridItem } from '@/shared/types/grid'

export interface GridPreset {
  id: string
  name: string
  columns: number
  rows: number
  gap: number
  columnGap?: number
  rowGap?: number
  columnTemplate: string
  rowTemplate: string
  customColumns: string
  customRows: string
  autoFlow?: string
  justifyItems?: string
  alignItems?: string
  justifyContent?: string
  alignContent?: string
  items: Omit<GridItem, 'id'>[]
}

export function resolveGridTemplate(template: string, count: number, custom: string): string {
  if (template === 'equal') {
    return `repeat(${count}, 1fr)`
  }

  if (template === 'auto') {
    return `repeat(${count}, auto)`
  }

  return custom
}

export const GRID_PRESETS: GridPreset[] = [
  {
    id: 'holy-grail',
    name: 'Holy Grail Layout',
    columns: 3,
    rows: 3,
    gap: 16,
    columnTemplate: 'custom',
    rowTemplate: 'custom',
    customColumns: '200px 1fr 200px',
    customRows: 'auto 1fr auto',
    items: [
      { label: 'Header', columnStart: 1, columnEnd: 4, rowStart: 1, rowEnd: 2, backgroundColor: '#667eea' },
      { label: 'Nav', columnStart: 1, columnEnd: 2, rowStart: 2, rowEnd: 3, backgroundColor: '#764ba2' },
      { label: 'Main', columnStart: 2, columnEnd: 3, rowStart: 2, rowEnd: 3, backgroundColor: '#f093fb' },
      { label: 'Aside', columnStart: 3, columnEnd: 4, rowStart: 2, rowEnd: 3, backgroundColor: '#4facfe' },
      { label: 'Footer', columnStart: 1, columnEnd: 4, rowStart: 3, rowEnd: 4, backgroundColor: '#43e97b' }
    ]
  },
  {
    id: 'dashboard',
    name: 'Dashboard Layout',
    columns: 4,
    rows: 4,
    gap: 20,
    columnTemplate: 'equal',
    rowTemplate: 'custom',
    customColumns: '1fr 1fr 1fr 1fr',
    customRows: '80px 200px 200px 1fr',
    items: [
      { label: 'Header', columnStart: 1, columnEnd: 5, rowStart: 1, rowEnd: 2, backgroundColor: '#667eea' },
      { label: 'Sidebar', columnStart: 1, columnEnd: 2, rowStart: 2, rowEnd: 5, backgroundColor: '#764ba2' },
      { label: 'Card 1', columnStart: 2, columnEnd: 3, rowStart: 2, rowEnd: 3, backgroundColor: '#f093fb' },
      { label: 'Card 2', columnStart: 3, columnEnd: 4, rowStart: 2, rowEnd: 3, backgroundColor: '#4facfe' },
      { label: 'Card 3', columnStart: 4, columnEnd: 5, rowStart: 2, rowEnd: 3, backgroundColor: '#43e97b' },
      { label: 'Chart', columnStart: 2, columnEnd: 5, rowStart: 3, rowEnd: 4, backgroundColor: '#fa709a' },
      { label: 'Table', columnStart: 2, columnEnd: 5, rowStart: 4, rowEnd: 5, backgroundColor: '#fee140' }
    ]
  },
  {
    id: 'magazine',
    name: 'Magazine Layout',
    columns: 6,
    rows: 4,
    gap: 12,
    columnTemplate: 'equal',
    rowTemplate: 'custom',
    customColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
    customRows: '200px 150px 150px 100px',
    items: [
      { label: 'Hero', columnStart: 1, columnEnd: 5, rowStart: 1, rowEnd: 3, backgroundColor: '#667eea' },
      { label: 'Feature', columnStart: 5, columnEnd: 7, rowStart: 1, rowEnd: 2, backgroundColor: '#764ba2' },
      { label: 'Ad', columnStart: 5, columnEnd: 7, rowStart: 2, rowEnd: 3, backgroundColor: '#f093fb' },
      { label: 'Article 1', columnStart: 1, columnEnd: 3, rowStart: 3, rowEnd: 4, backgroundColor: '#4facfe' },
      { label: 'Article 2', columnStart: 3, columnEnd: 5, rowStart: 3, rowEnd: 4, backgroundColor: '#43e97b' },
      { label: 'Article 3', columnStart: 5, columnEnd: 7, rowStart: 3, rowEnd: 4, backgroundColor: '#fa709a' },
      { label: 'Footer', columnStart: 1, columnEnd: 7, rowStart: 4, rowEnd: 5, backgroundColor: '#fee140' }
    ]
  },
  {
    id: 'gallery',
    name: 'Photo Gallery',
    columns: 4,
    rows: 4,
    gap: 8,
    columnTemplate: 'equal',
    rowTemplate: 'equal',
    customColumns: '1fr 1fr 1fr 1fr',
    customRows: '1fr 1fr 1fr 1fr',
    items: [
      { label: '1', columnStart: 1, columnEnd: 3, rowStart: 1, rowEnd: 3, backgroundColor: '#667eea' },
      { label: '2', columnStart: 3, columnEnd: 4, rowStart: 1, rowEnd: 2, backgroundColor: '#764ba2' },
      { label: '3', columnStart: 4, columnEnd: 5, rowStart: 1, rowEnd: 2, backgroundColor: '#f093fb' },
      { label: '4', columnStart: 3, columnEnd: 5, rowStart: 2, rowEnd: 3, backgroundColor: '#4facfe' },
      { label: '5', columnStart: 1, columnEnd: 2, rowStart: 3, rowEnd: 4, backgroundColor: '#43e97b' },
      { label: '6', columnStart: 2, columnEnd: 3, rowStart: 3, rowEnd: 5, backgroundColor: '#fa709a' },
      { label: '7', columnStart: 3, columnEnd: 4, rowStart: 3, rowEnd: 4, backgroundColor: '#fee140' },
      { label: '8', columnStart: 4, columnEnd: 5, rowStart: 3, rowEnd: 5, backgroundColor: '#30cfd0' },
      { label: '9', columnStart: 1, columnEnd: 2, rowStart: 4, rowEnd: 5, backgroundColor: '#a8edea' },
      { label: '10', columnStart: 3, columnEnd: 4, rowStart: 4, rowEnd: 5, backgroundColor: '#ff6a88' }
    ]
  },
  {
    id: 'masonry',
    name: 'Masonry Grid',
    columns: 3,
    rows: 6,
    gap: 16,
    columnTemplate: 'equal',
    rowTemplate: 'custom',
    customColumns: '1fr 1fr 1fr',
    customRows: '100px 150px 120px 180px 100px 140px',
    items: [
      { label: 'A', columnStart: 1, columnEnd: 2, rowStart: 1, rowEnd: 3, backgroundColor: '#667eea' },
      { label: 'B', columnStart: 2, columnEnd: 3, rowStart: 1, rowEnd: 2, backgroundColor: '#764ba2' },
      { label: 'C', columnStart: 3, columnEnd: 4, rowStart: 1, rowEnd: 4, backgroundColor: '#f093fb' },
      { label: 'D', columnStart: 2, columnEnd: 3, rowStart: 2, rowEnd: 4, backgroundColor: '#4facfe' },
      { label: 'E', columnStart: 1, columnEnd: 2, rowStart: 3, rowEnd: 5, backgroundColor: '#43e97b' },
      { label: 'F', columnStart: 2, columnEnd: 3, rowStart: 4, rowEnd: 6, backgroundColor: '#fa709a' },
      { label: 'G', columnStart: 3, columnEnd: 4, rowStart: 4, rowEnd: 5, backgroundColor: '#fee140' },
      { label: 'H', columnStart: 1, columnEnd: 2, rowStart: 5, rowEnd: 7, backgroundColor: '#30cfd0' },
      { label: 'I', columnStart: 3, columnEnd: 4, rowStart: 5, rowEnd: 7, backgroundColor: '#a8edea' },
      { label: 'J', columnStart: 2, columnEnd: 3, rowStart: 6, rowEnd: 7, backgroundColor: '#ff6a88' }
    ]
  },
  {
    id: 'sidebar-content',
    name: 'Sidebar & Content',
    columns: 4,
    rows: 3,
    gap: 24,
    columnTemplate: 'custom',
    rowTemplate: 'custom',
    customColumns: '250px 1fr 1fr 1fr',
    customRows: 'auto 1fr auto',
    items: [
      { label: 'Header', columnStart: 1, columnEnd: 5, rowStart: 1, rowEnd: 2, backgroundColor: '#667eea' },
      { label: 'Sidebar', columnStart: 1, columnEnd: 2, rowStart: 2, rowEnd: 3, backgroundColor: '#764ba2' },
      { label: 'Content', columnStart: 2, columnEnd: 5, rowStart: 2, rowEnd: 3, backgroundColor: '#f093fb' },
      { label: 'Footer', columnStart: 1, columnEnd: 5, rowStart: 3, rowEnd: 4, backgroundColor: '#4facfe' }
    ]
  },
  {
    id: 'card-grid',
    name: 'Card Grid',
    columns: 3,
    rows: 3,
    gap: 16,
    columnTemplate: 'equal',
    rowTemplate: 'equal',
    customColumns: '1fr 1fr 1fr',
    customRows: '1fr 1fr 1fr',
    items: [
      { label: 'Card 1', columnStart: 1, columnEnd: 2, rowStart: 1, rowEnd: 2, backgroundColor: '#667eea' },
      { label: 'Card 2', columnStart: 2, columnEnd: 3, rowStart: 1, rowEnd: 2, backgroundColor: '#764ba2' },
      { label: 'Card 3', columnStart: 3, columnEnd: 4, rowStart: 1, rowEnd: 2, backgroundColor: '#f093fb' },
      { label: 'Card 4', columnStart: 1, columnEnd: 2, rowStart: 2, rowEnd: 3, backgroundColor: '#4facfe' },
      { label: 'Card 5', columnStart: 2, columnEnd: 3, rowStart: 2, rowEnd: 3, backgroundColor: '#43e97b' },
      { label: 'Card 6', columnStart: 3, columnEnd: 4, rowStart: 2, rowEnd: 3, backgroundColor: '#fa709a' },
      { label: 'Card 7', columnStart: 1, columnEnd: 2, rowStart: 3, rowEnd: 4, backgroundColor: '#fee140' },
      { label: 'Card 8', columnStart: 2, columnEnd: 3, rowStart: 3, rowEnd: 4, backgroundColor: '#30cfd0' },
      { label: 'Card 9', columnStart: 3, columnEnd: 4, rowStart: 3, rowEnd: 4, backgroundColor: '#a8edea' }
    ]
  },
  {
    id: 'asymmetric',
    name: 'Asymmetric Layout',
    columns: 5,
    rows: 4,
    gap: 12,
    columnTemplate: 'custom',
    rowTemplate: 'custom',
    customColumns: '1fr 2fr 1fr 2fr 1fr',
    customRows: '120px 180px 150px 120px',
    items: [
      { label: 'A', columnStart: 1, columnEnd: 3, rowStart: 1, rowEnd: 2, backgroundColor: '#667eea' },
      { label: 'B', columnStart: 3, columnEnd: 6, rowStart: 1, rowEnd: 3, backgroundColor: '#764ba2' },
      { label: 'C', columnStart: 1, columnEnd: 2, rowStart: 2, rowEnd: 4, backgroundColor: '#f093fb' },
      { label: 'D', columnStart: 2, columnEnd: 3, rowStart: 2, rowEnd: 3, backgroundColor: '#4facfe' },
      { label: 'E', columnStart: 2, columnEnd: 4, rowStart: 3, rowEnd: 4, backgroundColor: '#43e97b' },
      { label: 'F', columnStart: 4, columnEnd: 6, rowStart: 3, rowEnd: 5, backgroundColor: '#fa709a' },
      { label: 'G', columnStart: 1, columnEnd: 3, rowStart: 4, rowEnd: 5, backgroundColor: '#fee140' },
      { label: 'H', columnStart: 3, columnEnd: 4, rowStart: 4, rowEnd: 5, backgroundColor: '#30cfd0' }
    ]
  }
]
