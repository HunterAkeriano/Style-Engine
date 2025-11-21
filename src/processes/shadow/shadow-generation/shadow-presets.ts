import type { ShadowPreset } from '@/shared/types'

export const SHADOW_PRESETS: ShadowPreset[] = [
  {
    id: 'nocturne-glow',
    name: 'Nocturne glow',
    description: 'Stacked cyan and violet plates for a crisp neon card.',
    layers: [
      { id: '1', x: 0, y: 18, spread: 22, color: '#0b1224', opacity: 0.42 },
      { id: '2', x: 0, y: 10, spread: 14, color: '#11192f', opacity: 0.32 },
      { id: '3', x: 0, y: 6, spread: 8, color: '#22d3ee', opacity: 0.24 },
      { id: '4', x: 0, y: 0, spread: 4, color: '#a855f7', opacity: 0.2, inset: true }
    ]
  },
  {
    id: 'carbon-ridge',
    name: 'Carbon ridge',
    description: 'Deep charcoal ridges with a thin electric rim.',
    layers: [
      { id: '1', x: 0, y: 16, spread: 18, color: '#0f172a', opacity: 0.45 },
      { id: '2', x: 0, y: 10, spread: 10, color: '#1f2937', opacity: 0.28 },
      { id: '3', x: 0, y: 4, spread: 6, color: '#0ea5e9', opacity: 0.26 },
      { id: '4', x: 0, y: 0, spread: 2, color: '#38bdf8', opacity: 0.2, inset: true }
    ]
  },
  {
    id: 'horizon-line',
    name: 'Horizon line',
    description: 'Wide horizontal press with a subtle sunset rim.',
    layers: [
      { id: '1', x: 0, y: 20, spread: 28, color: '#0b1220', opacity: 0.4 },
      { id: '2', x: 0, y: 12, spread: 18, color: '#0f172a', opacity: 0.3 },
      { id: '3', x: 0, y: 6, spread: 10, color: '#fb7185', opacity: 0.22 },
      { id: '4', x: 0, y: 0, spread: 3, color: '#f472b6', opacity: 0.2, inset: true }
    ]
  },
  {
    id: 'mint-chip',
    name: 'Mint chip',
    description: 'Light edges with icy teal highlights.',
    layers: [
      { id: '1', x: 0, y: 14, spread: 16, color: '#0f172a', opacity: 0.3 },
      { id: '2', x: 0, y: 8, spread: 10, color: '#0ea5e9', opacity: 0.26 },
      { id: '3', x: 0, y: 4, spread: 6, color: '#22d3ee', opacity: 0.22 },
      { id: '4', x: 0, y: 0, spread: 2, color: '#67e8f9', opacity: 0.2, inset: true }
    ]
  },
  {
    id: 'ember-plate',
    name: 'Ember plate',
    description: 'Layered copper warmth without blurry halos.',
    layers: [
      { id: '1', x: 0, y: 18, spread: 20, color: '#0c0f1a', opacity: 0.42 },
      { id: '2', x: 0, y: 12, spread: 12, color: '#f97316', opacity: 0.28 },
      { id: '3', x: 0, y: 6, spread: 8, color: '#fb923c', opacity: 0.22 },
      { id: '4', x: 0, y: 0, spread: 3, color: '#fed7aa', opacity: 0.18, inset: true }
    ]
  },
  {
    id: 'ink-wash',
    name: 'Ink wash',
    description: 'Pressed ink edges with a soft navy halo.',
    layers: [
      { id: '1', x: 0, y: 12, spread: 16, color: '#0b1220', opacity: 0.38 },
      { id: '2', x: 0, y: 8, spread: 10, color: '#111827', opacity: 0.32 },
      { id: '3', x: 0, y: 4, spread: 6, color: '#1d4ed8', opacity: 0.2 },
      { id: '4', x: 0, y: 0, spread: 3, color: '#3b82f6', opacity: 0.18, inset: true }
    ]
  },
  {
    id: 'steel-outline',
    name: 'Steel outline',
    description: 'Crisp steel slabs with inner outline.',
    layers: [
      { id: '1', x: 0, y: 16, spread: 18, color: '#0b1224', opacity: 0.4 },
      { id: '2', x: 0, y: 10, spread: 12, color: '#1f2937', opacity: 0.28 },
      { id: '3', x: 0, y: 4, spread: 6, color: '#93c5fd', opacity: 0.2 },
      { id: '4', x: 0, y: 0, spread: 2, color: '#bfdbfe', opacity: 0.16, inset: true }
    ]
  },
  {
    id: 'acid-edges',
    name: 'Acid edges',
    description: 'Electric lime trims over dark base.',
    layers: [
      { id: '1', x: 0, y: 18, spread: 22, color: '#0f172a', opacity: 0.42 },
      { id: '2', x: 0, y: 12, spread: 12, color: '#1a2b4a', opacity: 0.3 },
      { id: '3', x: 0, y: 6, spread: 8, color: '#a3e635', opacity: 0.2 },
      { id: '4', x: 0, y: 0, spread: 3, color: '#d9f99d', opacity: 0.16, inset: true }
    ]
  },
  {
    id: 'ultra-clean',
    name: 'Ultra clean',
    description: 'Minimal offsets with faint glass overlay.',
    layers: [
      { id: '1', x: 0, y: 10, spread: 14, color: '#0b1220', opacity: 0.28 },
      { id: '2', x: 0, y: 6, spread: 8, color: '#e2e8f0', opacity: 0.26 },
      { id: '3', x: 0, y: 2, spread: 4, color: '#cbd5e1', opacity: 0.18 },
      { id: '4', x: 0, y: 0, spread: 2, color: '#94a3b8', opacity: 0.14, inset: true }
    ]
  },
  {
    id: 'signal-blue',
    name: 'Signal blue',
    description: 'Industrial blue ribs with inner glow.',
    layers: [
      { id: '1', x: 0, y: 14, spread: 18, color: '#0b1220', opacity: 0.36 },
      { id: '2', x: 0, y: 10, spread: 10, color: '#1d4ed8', opacity: 0.26 },
      { id: '3', x: 0, y: 4, spread: 6, color: '#60a5fa', opacity: 0.2 },
      { id: '4', x: 0, y: 0, spread: 2, color: '#93c5fd', opacity: 0.16, inset: true }
    ]
  },
  {
    id: 'desert-glint',
    name: 'Desert glint',
    description: 'Warm sand base with thin amber edging.',
    layers: [
      { id: '1', x: 0, y: 16, spread: 18, color: '#0b1220', opacity: 0.36 },
      { id: '2', x: 0, y: 10, spread: 10, color: '#f59e0b', opacity: 0.26 },
      { id: '3', x: 0, y: 6, spread: 8, color: '#fbbf24', opacity: 0.22 },
      { id: '4', x: 0, y: 0, spread: 3, color: '#fed7aa', opacity: 0.16, inset: true }
    ]
  },
  {
    id: 'rose-quartz',
    name: 'Rose quartz',
    description: 'Pale rose slabs with soft inner rim.',
    layers: [
      { id: '1', x: 0, y: 14, spread: 16, color: '#0f172a', opacity: 0.32 },
      { id: '2', x: 0, y: 8, spread: 8, color: '#ec4899', opacity: 0.24 },
      { id: '3', x: 0, y: 4, spread: 6, color: '#f472b6', opacity: 0.2 },
      { id: '4', x: 0, y: 0, spread: 2, color: '#fecdd3', opacity: 0.16, inset: true }
    ]
  },
  {
    id: 'polar-glass',
    name: 'Polar glass',
    description: 'Frosted cyan edging with inner mint line.',
    layers: [
      { id: '1', x: 0, y: 16, spread: 18, color: '#0b1220', opacity: 0.38 },
      { id: '2', x: 0, y: 10, spread: 12, color: '#22d3ee', opacity: 0.24 },
      { id: '3', x: 0, y: 6, spread: 8, color: '#67e8f9', opacity: 0.2 },
      { id: '4', x: 0, y: 0, spread: 3, color: '#a5f3fc', opacity: 0.16, inset: true }
    ]
  },
  {
    id: 'lilac-plate',
    name: 'Lilac plate',
    description: 'Stacked lavender edges with inner halo.',
    layers: [
      { id: '1', x: 0, y: 16, spread: 18, color: '#0b1220', opacity: 0.38 },
      { id: '2', x: 0, y: 10, spread: 10, color: '#7c3aed', opacity: 0.26 },
      { id: '3', x: 0, y: 6, spread: 8, color: '#a855f7', opacity: 0.22 },
      { id: '4', x: 0, y: 0, spread: 3, color: '#e9d5ff', opacity: 0.16, inset: true }
    ]
  },
  {
    id: 'arctic-core',
    name: 'Arctic core',
    description: 'Dark base with cold cyan rim and inset line.',
    layers: [
      { id: '1', x: 0, y: 18, spread: 20, color: '#0b1220', opacity: 0.4 },
      { id: '2', x: 0, y: 12, spread: 12, color: '#164e63', opacity: 0.28 },
      { id: '3', x: 0, y: 6, spread: 8, color: '#06b6d4', opacity: 0.22 },
      { id: '4', x: 0, y: 0, spread: 3, color: '#67e8f9', opacity: 0.18, inset: true }
    ]
  },
  {
    id: 'signal-red',
    name: 'Signal red',
    description: 'Industrial crimson offsets with crisp inset.',
    layers: [
      { id: '1', x: 0, y: 18, spread: 20, color: '#0b1220', opacity: 0.4 },
      { id: '2', x: 0, y: 12, spread: 12, color: '#ef4444', opacity: 0.26 },
      { id: '3', x: 0, y: 6, spread: 8, color: '#f87171', opacity: 0.22 },
      { id: '4', x: 0, y: 0, spread: 3, color: '#fecdd3', opacity: 0.16, inset: true }
    ]
  },
  {
    id: 'circuit-green',
    name: 'Circuit green',
    description: 'Two-step emerald clamps with inset neon.',
    layers: [
      { id: '1', x: 0, y: 16, spread: 18, color: '#0b1220', opacity: 0.38 },
      { id: '2', x: 0, y: 10, spread: 10, color: '#16a34a', opacity: 0.26 },
      { id: '3', x: 0, y: 6, spread: 8, color: '#22c55e', opacity: 0.22 },
      { id: '4', x: 0, y: 0, spread: 3, color: '#bbf7d0', opacity: 0.16, inset: true }
    ]
  },
  {
    id: 'amberglass',
    name: 'Amberglass',
    description: 'Golden translucent shelves with bright rim.',
    layers: [
      { id: '1', x: 0, y: 18, spread: 20, color: '#0b1220', opacity: 0.36 },
      { id: '2', x: 0, y: 12, spread: 12, color: '#d97706', opacity: 0.26 },
      { id: '3', x: 0, y: 6, spread: 8, color: '#f59e0b', opacity: 0.22 },
      { id: '4', x: 0, y: 0, spread: 3, color: '#fcd34d', opacity: 0.16, inset: true }
    ]
  },
  {
    id: 'oxide',
    name: 'Oxide',
    description: 'Rust tones stacked on matte graphite.',
    layers: [
      { id: '1', x: 0, y: 18, spread: 22, color: '#0c111b', opacity: 0.4 },
      { id: '2', x: 0, y: 12, spread: 12, color: '#ea580c', opacity: 0.26 },
      { id: '3', x: 0, y: 6, spread: 8, color: '#f97316', opacity: 0.22 },
      { id: '4', x: 0, y: 0, spread: 3, color: '#fed7aa', opacity: 0.16, inset: true }
    ]
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Gradient-inspired cyan + magenta hard shadows.',
    layers: [
      { id: '1', x: 0, y: 18, spread: 22, color: '#0b1220', opacity: 0.4 },
      { id: '2', x: 0, y: 12, spread: 12, color: '#22d3ee', opacity: 0.24 },
      { id: '3', x: 0, y: 6, spread: 8, color: '#a855f7', opacity: 0.22 },
      { id: '4', x: 0, y: 0, spread: 3, color: '#d946ef', opacity: 0.18, inset: true }
    ]
  }
]
