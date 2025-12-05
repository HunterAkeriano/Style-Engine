import type { GridItem } from '@/shared/types/grid'

export interface GridPreset {
  id: string
  name: string
  subtitle: string
  type: string
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
    subtitle: 'Шапка, сайдбар, контент и футер для типовой страницы',
    type: 'layout',
    columns: 3,
    rows: 3,
    gap: 16,
    columnGap: 16,
    rowGap: 20,
    columnTemplate: 'custom',
    rowTemplate: 'custom',
    customColumns: '220px 1fr 240px',
    customRows: 'auto 1fr auto',
    alignItems: 'stretch',
    justifyItems: 'stretch',
    items: [
      { label: 'Header', columnStart: 1, columnEnd: 4, rowStart: 1, rowEnd: 2, backgroundColor: '#6ee7ff' },
      { label: 'Nav', columnStart: 1, columnEnd: 2, rowStart: 2, rowEnd: 3, backgroundColor: '#a78bfa' },
      { label: 'Main', columnStart: 2, columnEnd: 3, rowStart: 2, rowEnd: 3, backgroundColor: '#34d399' },
      { label: 'Aside', columnStart: 3, columnEnd: 4, rowStart: 2, rowEnd: 3, backgroundColor: '#fbbf24' },
      { label: 'Footer', columnStart: 1, columnEnd: 4, rowStart: 3, rowEnd: 4, backgroundColor: '#f472b6' }
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics Dashboard',
    subtitle: 'Хедер, сайдбар, карточки KPI, график и таблица',
    type: 'dashboard',
    columns: 4,
    rows: 4,
    gap: 18,
    columnGap: 22,
    rowGap: 16,
    columnTemplate: 'equal',
    rowTemplate: 'custom',
    customColumns: '1fr 1fr 1fr 1fr',
    customRows: '80px 210px 190px 1fr',
    justifyItems: 'stretch',
    alignItems: 'stretch',
    items: [
      { label: 'Header', columnStart: 1, columnEnd: 5, rowStart: 1, rowEnd: 2, backgroundColor: '#38bdf8' },
      { label: 'Sidebar', columnStart: 1, columnEnd: 2, rowStart: 2, rowEnd: 5, backgroundColor: '#6366f1' },
      { label: 'KPI 1', columnStart: 2, columnEnd: 3, rowStart: 2, rowEnd: 3, backgroundColor: '#f59e0b' },
      { label: 'KPI 2', columnStart: 3, columnEnd: 4, rowStart: 2, rowEnd: 3, backgroundColor: '#ef4444' },
      { label: 'KPI 3', columnStart: 4, columnEnd: 5, rowStart: 2, rowEnd: 3, backgroundColor: '#22c55e' },
      { label: 'Chart', columnStart: 2, columnEnd: 5, rowStart: 3, rowEnd: 4, backgroundColor: '#0ea5e9' },
      { label: 'Table', columnStart: 2, columnEnd: 5, rowStart: 4, rowEnd: 5, backgroundColor: '#a855f7' }
    ]
  },
  {
    id: 'magazine',
    name: 'Magazine Spread',
    subtitle: 'Большой герой, витрина и сетка статей',
    type: 'editorial',
    columns: 6,
    rows: 4,
    gap: 14,
    columnGap: 14,
    rowGap: 18,
    columnTemplate: 'equal',
    rowTemplate: 'custom',
    customColumns: '1fr 1fr 1fr 1fr 1fr 1fr',
    customRows: '220px 160px 160px 120px',
    items: [
      { label: 'Hero', columnStart: 1, columnEnd: 5, rowStart: 1, rowEnd: 3, backgroundColor: '#10b981' },
      { label: 'Feature', columnStart: 5, columnEnd: 7, rowStart: 1, rowEnd: 2, backgroundColor: '#f97316' },
      { label: 'Ad', columnStart: 5, columnEnd: 7, rowStart: 2, rowEnd: 3, backgroundColor: '#8b5cf6' },
      { label: 'Article 1', columnStart: 1, columnEnd: 3, rowStart: 3, rowEnd: 4, backgroundColor: '#06b6d4' },
      { label: 'Article 2', columnStart: 3, columnEnd: 5, rowStart: 3, rowEnd: 4, backgroundColor: '#facc15' },
      { label: 'Article 3', columnStart: 5, columnEnd: 7, rowStart: 3, rowEnd: 4, backgroundColor: '#ec4899' },
      { label: 'Footer', columnStart: 1, columnEnd: 7, rowStart: 4, rowEnd: 5, backgroundColor: '#14b8a6' }
    ]
  },
  {
    id: 'gallery',
    name: 'Photo Gallery',
    subtitle: 'Акцентный большой блок и сетка превью',
    type: 'gallery',
    columns: 4,
    rows: 4,
    gap: 10,
    columnGap: 10,
    rowGap: 10,
    columnTemplate: 'equal',
    rowTemplate: 'equal',
    customColumns: '1fr 1fr 1fr 1fr',
    customRows: '1fr 1fr 1fr 1fr',
    items: [
      { label: 'Hero', columnStart: 1, columnEnd: 3, rowStart: 1, rowEnd: 3, backgroundColor: '#f87171' },
      { label: '2', columnStart: 3, columnEnd: 4, rowStart: 1, rowEnd: 2, backgroundColor: '#22d3ee' },
      { label: '3', columnStart: 4, columnEnd: 5, rowStart: 1, rowEnd: 2, backgroundColor: '#c084fc' },
      { label: '4', columnStart: 3, columnEnd: 5, rowStart: 2, rowEnd: 3, backgroundColor: '#fbbf24' },
      { label: '5', columnStart: 1, columnEnd: 2, rowStart: 3, rowEnd: 4, backgroundColor: '#34d399' },
      { label: '6', columnStart: 2, columnEnd: 3, rowStart: 3, rowEnd: 5, backgroundColor: '#38bdf8' },
      { label: '7', columnStart: 3, columnEnd: 4, rowStart: 3, rowEnd: 4, backgroundColor: '#fb7185' },
      { label: '8', columnStart: 4, columnEnd: 5, rowStart: 3, rowEnd: 5, backgroundColor: '#2dd4bf' },
      { label: '9', columnStart: 1, columnEnd: 2, rowStart: 4, rowEnd: 5, backgroundColor: '#a3e635' },
      { label: '10', columnStart: 3, columnEnd: 4, rowStart: 4, rowEnd: 5, backgroundColor: '#93c5fd' }
    ]
  },
  {
    id: 'masonry',
    name: 'Masonry Grid',
    subtitle: 'Микс высоких и низких карточек',
    type: 'masonry',
    columns: 3,
    rows: 6,
    gap: 16,
    columnGap: 16,
    rowGap: 14,
    columnTemplate: 'equal',
    rowTemplate: 'custom',
    customColumns: '1fr 1fr 1fr',
    customRows: '110px 160px 120px 180px 110px 150px',
    items: [
      { label: 'A', columnStart: 1, columnEnd: 2, rowStart: 1, rowEnd: 3, backgroundColor: '#22d3ee' },
      { label: 'B', columnStart: 2, columnEnd: 3, rowStart: 1, rowEnd: 2, backgroundColor: '#a855f7' },
      { label: 'C', columnStart: 3, columnEnd: 4, rowStart: 1, rowEnd: 4, backgroundColor: '#fb7185' },
      { label: 'D', columnStart: 2, columnEnd: 3, rowStart: 2, rowEnd: 4, backgroundColor: '#f59e0b' },
      { label: 'E', columnStart: 1, columnEnd: 2, rowStart: 3, rowEnd: 5, backgroundColor: '#34d399' },
      { label: 'F', columnStart: 2, columnEnd: 3, rowStart: 4, rowEnd: 6, backgroundColor: '#0ea5e9' },
      { label: 'G', columnStart: 3, columnEnd: 4, rowStart: 4, rowEnd: 5, backgroundColor: '#f97316' },
      { label: 'H', columnStart: 1, columnEnd: 2, rowStart: 5, rowEnd: 7, backgroundColor: '#c084fc' },
      { label: 'I', columnStart: 3, columnEnd: 4, rowStart: 5, rowEnd: 7, backgroundColor: '#eab308' },
      { label: 'J', columnStart: 2, columnEnd: 3, rowStart: 6, rowEnd: 7, backgroundColor: '#22c55e' }
    ]
  },
  {
    id: 'sidebar-content',
    name: 'Sidebar & Content',
    subtitle: 'Сайдбар плюс широкая контентная область',
    type: 'layout',
    columns: 4,
    rows: 3,
    gap: 24,
    columnGap: 28,
    rowGap: 18,
    columnTemplate: 'custom',
    rowTemplate: 'custom',
    customColumns: '260px 1fr 1fr 1fr',
    customRows: 'auto 1fr auto',
    items: [
      { label: 'Header', columnStart: 1, columnEnd: 5, rowStart: 1, rowEnd: 2, backgroundColor: '#22c55e' },
      { label: 'Sidebar', columnStart: 1, columnEnd: 2, rowStart: 2, rowEnd: 3, backgroundColor: '#14b8a6' },
      { label: 'Content', columnStart: 2, columnEnd: 5, rowStart: 2, rowEnd: 3, backgroundColor: '#4f46e5' },
      { label: 'Footer', columnStart: 1, columnEnd: 5, rowStart: 3, rowEnd: 4, backgroundColor: '#8b5cf6' }
    ]
  },
  {
    id: 'card-grid',
    name: 'Card Grid',
    subtitle: 'Простая равномерная сетка карточек',
    type: 'cards',
    columns: 3,
    rows: 3,
    gap: 16,
    columnGap: 16,
    rowGap: 16,
    columnTemplate: 'equal',
    rowTemplate: 'equal',
    customColumns: '1fr 1fr 1fr',
    customRows: '1fr 1fr 1fr',
    items: [
      { label: 'Card 1', columnStart: 1, columnEnd: 2, rowStart: 1, rowEnd: 2, backgroundColor: '#38bdf8' },
      { label: 'Card 2', columnStart: 2, columnEnd: 3, rowStart: 1, rowEnd: 2, backgroundColor: '#f59e0b' },
      { label: 'Card 3', columnStart: 3, columnEnd: 4, rowStart: 1, rowEnd: 2, backgroundColor: '#ef4444' },
      { label: 'Card 4', columnStart: 1, columnEnd: 2, rowStart: 2, rowEnd: 3, backgroundColor: '#22c55e' },
      { label: 'Card 5', columnStart: 2, columnEnd: 3, rowStart: 2, rowEnd: 3, backgroundColor: '#a855f7' },
      { label: 'Card 6', columnStart: 3, columnEnd: 4, rowStart: 2, rowEnd: 3, backgroundColor: '#0ea5e9' },
      { label: 'Card 7', columnStart: 1, columnEnd: 2, rowStart: 3, rowEnd: 4, backgroundColor: '#f97316' },
      { label: 'Card 8', columnStart: 2, columnEnd: 3, rowStart: 3, rowEnd: 4, backgroundColor: '#10b981' },
      { label: 'Card 9', columnStart: 3, columnEnd: 4, rowStart: 3, rowEnd: 4, backgroundColor: '#22d3ee' }
    ]
  },
  {
    id: 'asymmetric',
    name: 'Asymmetric Landing',
    subtitle: 'Асимметрия для акцентов в лэндинге',
    type: 'editorial',
    columns: 5,
    rows: 4,
    gap: 12,
    columnGap: 16,
    rowGap: 14,
    columnTemplate: 'custom',
    rowTemplate: 'custom',
    customColumns: '1fr 2fr 1fr 1.5fr 1fr',
    customRows: '140px 190px 150px 120px',
    items: [
      { label: 'Hero', columnStart: 1, columnEnd: 3, rowStart: 1, rowEnd: 2, backgroundColor: '#0ea5e9' },
      { label: 'Showcase', columnStart: 3, columnEnd: 6, rowStart: 1, rowEnd: 3, backgroundColor: '#6366f1' },
      { label: 'CTA', columnStart: 1, columnEnd: 2, rowStart: 2, rowEnd: 4, backgroundColor: '#f97316' },
      { label: 'Feature A', columnStart: 2, columnEnd: 3, rowStart: 2, rowEnd: 3, backgroundColor: '#22c55e' },
      { label: 'Feature B', columnStart: 2, columnEnd: 4, rowStart: 3, rowEnd: 4, backgroundColor: '#a855f7' },
      { label: 'Banner', columnStart: 4, columnEnd: 6, rowStart: 3, rowEnd: 5, backgroundColor: '#06b6d4' },
      { label: 'Footer', columnStart: 1, columnEnd: 6, rowStart: 4, rowEnd: 5, backgroundColor: '#f59e0b' }
    ]
  }
]
