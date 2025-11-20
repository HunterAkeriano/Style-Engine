import type { GradientColor, GradientType } from '@/shared/types'

export interface GradientPreset {
  id: string
  name: string
  type: GradientType
  angle: number
  colors: GradientColor[]
}

export const GRADIENT_PRESETS: GradientPreset[] = [
  {
    id: 'aurora',
    name: 'Aurora North',
    type: 'linear',
    angle: 120,
    colors: [
      { id: 'c1', color: '#0f2027', position: 0 },
      { id: 'c2', color: '#203a43', position: 48 },
      { id: 'c3', color: '#2c5364', position: 100 }
    ]
  },
  {
    id: 'candy-glass',
    name: 'Candy Glass',
    type: 'linear',
    angle: 135,
    colors: [
      { id: 'c1', color: '#74ebd5', position: 0 },
      { id: 'c2', color: '#acb6e5', position: 45 },
      { id: 'c3', color: '#fbc2eb', position: 100 }
    ]
  },
  {
    id: 'sunset-punch',
    name: 'Sunset Punch',
    type: 'linear',
    angle: 110,
    colors: [
      { id: 'c1', color: '#ff9a9e', position: 0 },
      { id: 'c2', color: '#fad0c4', position: 40 },
      { id: 'c3', color: '#fad0c4', position: 65 },
      { id: 'c4', color: '#ffdde1', position: 100 }
    ]
  },
  {
    id: 'hologram',
    name: 'Hologram Flow',
    type: 'conic',
    angle: 230,
    colors: [
      { id: 'c1', color: '#4158d0', position: 0 },
      { id: 'c2', color: '#c850c0', position: 35 },
      { id: 'c3', color: '#ffcc70', position: 65 },
      { id: 'c4', color: '#84fab0', position: 100 }
    ]
  },
  {
    id: 'mojito',
    name: 'Mojito Lime',
    type: 'radial',
    angle: 90,
    colors: [
      { id: 'c1', color: '#0fd850', position: 0 },
      { id: 'c2', color: '#f9f047', position: 58 },
      { id: 'c3', color: '#fcff9e', position: 100 }
    ]
  },
  {
    id: 'infrared',
    name: 'Infrared Beam',
    type: 'linear',
    angle: 160,
    colors: [
      { id: 'c1', color: '#ff416c', position: 0 },
      { id: 'c2', color: '#ff4b2b', position: 42 },
      { id: 'c3', color: '#ffc371', position: 100 }
    ]
  },
  {
    id: 'ultraviolet',
    name: 'Ultraviolet',
    type: 'linear',
    angle: 95,
    colors: [
      { id: 'c1', color: '#200122', position: 0 },
      { id: 'c2', color: '#6f0000', position: 34 },
      { id: 'c3', color: '#23074d', position: 64 },
      { id: 'c4', color: '#cc5333', position: 100 }
    ]
  },
  {
    id: 'lagoon',
    name: 'Lagoon Mist',
    type: 'linear',
    angle: 125,
    colors: [
      { id: 'c1', color: '#1a2980', position: 0 },
      { id: 'c2', color: '#26d0ce', position: 45 },
      { id: 'c3', color: '#38ef7d', position: 100 }
    ]
  },
  {
    id: 'nebula',
    name: 'Nebula Bloom',
    type: 'conic',
    angle: 180,
    colors: [
      { id: 'c1', color: '#fc5c7d', position: 0 },
      { id: 'c2', color: '#6a82fb', position: 28 },
      { id: 'c3', color: '#05dfd7', position: 58 },
      { id: 'c4', color: '#f9ea8f', position: 86 },
      { id: 'c5', color: '#ffb88c', position: 100 }
    ]
  },
  {
    id: 'deepsea',
    name: 'Deep Sea',
    type: 'linear',
    angle: 140,
    colors: [
      { id: 'c1', color: '#0f2027', position: 0 },
      { id: 'c2', color: '#203a43', position: 35 },
      { id: 'c3', color: '#2c5364', position: 70 },
      { id: 'c4', color: '#0b8793', position: 100 }
    ]
  },
  {
    id: 'velvet',
    name: 'Velvet Night',
    type: 'radial',
    angle: 90,
    colors: [
      { id: 'c1', color: '#141e30', position: 0 },
      { id: 'c2', color: '#243b55', position: 45 },
      { id: 'c3', color: '#4b79a1', position: 78 },
      { id: 'c4', color: '#283e51', position: 100 }
    ]
  },
  {
    id: 'sahara',
    name: 'Sahara Heat',
    type: 'linear',
    angle: 95,
    colors: [
      { id: 'c1', color: '#f83600', position: 0 },
      { id: 'c2', color: '#f9d423', position: 50 },
      { id: 'c3', color: '#ff7e5f', position: 100 }
    ]
  },
  {
    id: 'tropical',
    name: 'Tropical Punch',
    type: 'conic',
    angle: 260,
    colors: [
      { id: 'c1', color: '#f05454', position: 0 },
      { id: 'c2', color: '#ffac81', position: 25 },
      { id: 'c3', color: '#fffc88', position: 50 },
      { id: 'c4', color: '#88e1f2', position: 75 },
      { id: 'c5', color: '#6a89cc', position: 100 }
    ]
  },
  {
    id: 'forest',
    name: 'Forest Mist',
    type: 'linear',
    angle: 130,
    colors: [
      { id: 'c1', color: '#0b6623', position: 0 },
      { id: 'c2', color: '#2eb872', position: 35 },
      { id: 'c3', color: '#7dd87d', position: 70 },
      { id: 'c4', color: '#c3f584', position: 100 }
    ]
  },
  {
    id: 'polar',
    name: 'Polar Light',
    type: 'radial',
    angle: 90,
    colors: [
      { id: 'c1', color: '#8e9eab', position: 0 },
      { id: 'c2', color: '#eef2f3', position: 55 },
      { id: 'c3', color: '#d7e1ec', position: 100 }
    ]
  },
  {
    id: 'dusk',
    name: 'Cinematic Dusk',
    type: 'linear',
    angle: 155,
    colors: [
      { id: 'c1', color: '#536976', position: 0 },
      { id: 'c2', color: '#292e49', position: 40 },
      { id: 'c3', color: '#e0c3fc', position: 75 },
      { id: 'c4', color: '#8ec5fc', position: 100 }
    ]
  },
  {
    id: 'iris',
    name: 'Iris Beam',
    type: 'conic',
    angle: 210,
    colors: [
      { id: 'c1', color: '#d9afd9', position: 0 },
      { id: 'c2', color: '#97d9e1', position: 35 },
      { id: 'c3', color: '#5f72be', position: 65 },
      { id: 'c4', color: '#9b23ea', position: 100 }
    ]
  },
  {
    id: 'lava',
    name: 'Lava Flow',
    type: 'linear',
    angle: 175,
    colors: [
      { id: 'c1', color: '#f12711', position: 0 },
      { id: 'c2', color: '#f5af19', position: 50 },
      { id: 'c3', color: '#ff9a44', position: 100 }
    ]
  },
  {
    id: 'icefire',
    name: 'Ice & Fire',
    type: 'linear',
    angle: 120,
    colors: [
      { id: 'c1', color: '#2193b0', position: 0 },
      { id: 'c2', color: '#6dd5ed', position: 45 },
      { id: 'c3', color: '#f85032', position: 75 },
      { id: 'c4', color: '#e73827', position: 100 }
    ]
  },
  {
    id: 'noir',
    name: 'Noir Glow',
    type: 'radial',
    angle: 90,
    colors: [
      { id: 'c1', color: '#232526', position: 0 },
      { id: 'c2', color: '#414345', position: 40 },
      { id: 'c3', color: '#6b6b83', position: 75 },
      { id: 'c4', color: '#aa4b6b', position: 100 }
    ]
  },
  {
    id: 'cobalt',
    name: 'Cobalt Circuit',
    type: 'linear',
    angle: 200,
    colors: [
      { id: 'c1', color: '#283c86', position: 0 },
      { id: 'c2', color: '#45a247', position: 55 },
      { id: 'c3', color: '#1f4037', position: 100 }
    ]
  },
  {
    id: 'plasma',
    name: 'Plasma Ring',
    type: 'conic',
    angle: 320,
    colors: [
      { id: 'c1', color: '#ff6a00', position: 0 },
      { id: 'c2', color: '#ee0979', position: 30 },
      { id: 'c3', color: '#8e54e9', position: 60 },
      { id: 'c4', color: '#4776e6', position: 85 },
      { id: 'c5', color: '#00c6ff', position: 100 }
    ]
  },
  {
    id: 'sandstorm',
    name: 'Sandstorm',
    type: 'linear',
    angle: 80,
    colors: [
      { id: 'c1', color: '#eacda3', position: 0 },
      { id: 'c2', color: '#d6ae7b', position: 40 },
      { id: 'c3', color: '#b58563', position: 75 },
      { id: 'c4', color: '#805037', position: 100 }
    ]
  },
  {
    id: 'mint',
    name: 'Mint Soda',
    type: 'radial',
    angle: 90,
    colors: [
      { id: 'c1', color: '#1cd8d2', position: 0 },
      { id: 'c2', color: '#93edc7', position: 60 },
      { id: 'c3', color: '#c6ffdd', position: 100 }
    ]
  },
  {
    id: 'punch',
    name: 'Neon Punch',
    type: 'linear',
    angle: 145,
    colors: [
      { id: 'c1', color: '#b621fe', position: 0 },
      { id: 'c2', color: '#1fd1f9', position: 45 },
      { id: 'c3', color: '#76ff7a', position: 100 }
    ]
  },
  {
    id: 'amber',
    name: 'Amber Glass',
    type: 'linear',
    angle: 30,
    colors: [
      { id: 'c1', color: '#f8cdda', position: 0 },
      { id: 'c2', color: '#1d2b64', position: 55 },
      { id: 'c3', color: '#fcb045', position: 100 }
    ]
  },
  {
    id: 'zenith',
    name: 'Zenith',
    type: 'linear',
    angle: 210,
    colors: [
      { id: 'c1', color: '#355c7d', position: 0 },
      { id: 'c2', color: '#6c5b7b', position: 40 },
      { id: 'c3', color: '#c06c84', position: 70 },
      { id: 'c4', color: '#f67280', position: 100 }
    ]
  },
  {
    id: 'horizon',
    name: 'Electric Horizon',
    type: 'conic',
    angle: 150,
    colors: [
      { id: 'c1', color: '#1fa2ff', position: 0 },
      { id: 'c2', color: '#12d8fa', position: 35 },
      { id: 'c3', color: '#a6ffcb', position: 70 },
      { id: 'c4', color: '#fbd786', position: 100 }
    ]
  },
  {
    id: 'orchid',
    name: 'Orchid Fade',
    type: 'linear',
    angle: 60,
    colors: [
      { id: 'c1', color: '#a18cd1', position: 0 },
      { id: 'c2', color: '#fbc2eb', position: 50 },
      { id: 'c3', color: '#fad0c4', position: 100 }
    ]
  },
  {
    id: 'retro',
    name: 'Retro Wave',
    type: 'linear',
    angle: 115,
    colors: [
      { id: 'c1', color: '#ff4b1f', position: 0 },
      { id: 'c2', color: '#ff9068', position: 35 },
      { id: 'c3', color: '#1fddff', position: 70 },
      { id: 'c4', color: '#28c76f', position: 100 }
    ]
  },
  {
    id: 'linenight',
    name: 'Line Night',
    type: 'radial',
    angle: 90,
    colors: [
      { id: 'c1', color: '#09203f', position: 0 },
      { id: 'c2', color: '#537895', position: 45 },
      { id: 'c3', color: '#1e3c72', position: 80 },
      { id: 'c4', color: '#2a5298', position: 100 }
    ]
  }
]
