import type { FaviconPreset } from '@/shared/types/favicon'

export const FAVICON_PRESETS: FaviconPreset[] = [
  {
    id: 'gradient-orb',
    name: 'Gradient Orb',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#grad1)"/>
    </svg>`,
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 20
  },
  {
    id: 'neon-triangle',
    name: 'Neon Triangle',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="neon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f857a6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ff5858;stop-opacity:1" />
        </linearGradient>
      </defs>
      <polygon points="50,20 80,75 20,75" fill="url(#neon)"/>
    </svg>`,
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 15
  },
  {
    id: 'geometric-hex',
    name: 'Geometric Hexagon',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="hex-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#00f2fe;stop-opacity:1" />
        </linearGradient>
      </defs>
      <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" fill="url(#hex-grad)"/>
    </svg>`,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 25
  },
  {
    id: 'abstract-waves',
    name: 'Abstract Waves',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="wave-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#fa709a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fee140;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="M0,30 Q25,10 50,30 T100,30 L100,100 L0,100 Z" fill="url(#wave-grad)" opacity="0.8"/>
      <path d="M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z" fill="url(#wave-grad)"/>
    </svg>`,
    backgroundColor: '#2d3561',
    padding: 8,
    borderRadius: 20
  },
  {
    id: 'minimal-letter',
    name: 'Minimal Letter S',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="letter-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f093fb;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f5576c;stop-opacity:1" />
        </linearGradient>
      </defs>
      <text x="50" y="75" font-family="Arial, sans-serif" font-size="70" font-weight="bold" text-anchor="middle" fill="url(#letter-grad)">S</text>
    </svg>`,
    backgroundColor: '#ffffff',
    padding: 5,
    borderRadius: 30
  },
  {
    id: 'cosmic-star',
    name: 'Cosmic Star',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="star-grad">
          <stop offset="0%" style="stop-color:#ffecd2;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fcb69f;stop-opacity:1" />
        </radialGradient>
      </defs>
      <polygon points="50,15 61,45 92,45 67,63 78,93 50,75 22,93 33,63 8,45 39,45" fill="url(#star-grad)"/>
    </svg>`,
    backgroundColor: '#2c3e50',
    padding: 10,
    borderRadius: 15
  },
  {
    id: 'rainbow-circle',
    name: 'Rainbow Circle',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ff0844;stop-opacity:1" />
          <stop offset="33%" style="stop-color:#ffb199;stop-opacity:1" />
          <stop offset="66%" style="stop-color:#00f2fe;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#4facfe;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="35" fill="none" stroke="url(#rainbow)" stroke-width="10"/>
      <circle cx="50" cy="50" r="20" fill="url(#rainbow)"/>
    </svg>`,
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 50
  },
  {
    id: 'tech-cube',
    name: 'Tech Cube',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="cube-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#43e97b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#38f9d7;stop-opacity:1" />
        </linearGradient>
      </defs>
      <polygon points="50,20 80,35 80,65 50,80 20,65 20,35" fill="url(#cube-grad)" opacity="0.9"/>
      <polygon points="50,20 80,35 50,50 20,35" fill="url(#cube-grad)" opacity="1"/>
      <polygon points="50,50 50,80 20,65 20,35" fill="url(#cube-grad)" opacity="0.7"/>
    </svg>`,
    backgroundColor: '#16213e',
    padding: 12,
    borderRadius: 18
  },
  {
    id: 'fire-diamond',
    name: 'Fire Diamond',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="fire-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ff9a56;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ff1744;stop-opacity:1" />
        </linearGradient>
      </defs>
      <polygon points="50,10 90,50 50,90 10,50" fill="url(#fire-grad)"/>
    </svg>`,
    backgroundColor: '#2d1b69',
    padding: 15,
    borderRadius: 22
  },
  {
    id: 'ocean-droplet',
    name: 'Ocean Droplet',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="ocean-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#30cfd0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#330867;stop-opacity:1" />
        </linearGradient>
      </defs>
      <path d="M50,10 C30,40 20,55 20,70 C20,85 33,95 50,95 C67,95 80,85 80,70 C80,55 70,40 50,10 Z" fill="url(#ocean-grad)"/>
    </svg>`,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 25
  },
  {
    id: 'sunset-layers',
    name: 'Sunset Layers',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="sunset1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#feca57;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="sunset2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#ee5a6f;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f29263;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="40" fill="url(#sunset1)"/>
      <circle cx="50" cy="50" r="25" fill="url(#sunset2)"/>
      <circle cx="50" cy="50" r="12" fill="#fff" opacity="0.8"/>
    </svg>`,
    backgroundColor: '#1e3a8a',
    padding: 8,
    borderRadius: 50
  },
  {
    id: 'crystal-gem',
    name: 'Crystal Gem',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="crystal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#a8edea;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fed6e3;stop-opacity:1" />
        </linearGradient>
      </defs>
      <polygon points="50,15 75,40 60,85 40,85 25,40" fill="url(#crystal-grad)"/>
      <polygon points="50,15 75,40 50,50" fill="url(#crystal-grad)" opacity="0.7"/>
      <polygon points="25,40 50,50 40,85" fill="url(#crystal-grad)" opacity="0.8"/>
    </svg>`,
    backgroundColor: '#2d3748',
    padding: 12,
    borderRadius: 20
  },
  {
    id: 'lightning-bolt',
    name: 'Lightning Bolt',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="lightning-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#f7ff00;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#db36a4;stop-opacity:1" />
        </linearGradient>
      </defs>
      <polygon points="55,10 35,50 50,50 45,90 75,45 55,45" fill="url(#lightning-grad)"/>
    </svg>`,
    backgroundColor: '#0f0e17',
    padding: 15,
    borderRadius: 15
  },
  {
    id: 'moon-phases',
    name: 'Moon Phases',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <radialGradient id="moon-grad">
          <stop offset="0%" style="stop-color:#fdfbfb;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#ebedee;stop-opacity:1" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="35" fill="url(#moon-grad)"/>
      <ellipse cx="60" cy="50" rx="25" ry="35" fill="#1a1a2e" opacity="0.6"/>
    </svg>`,
    backgroundColor: '#16213e',
    padding: 10,
    borderRadius: 50
  },
  {
    id: 'gradient-square',
    name: 'Gradient Square',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="square-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#12c2e9;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#c471ed;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#f64f59;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect x="20" y="20" width="60" height="60" rx="12" fill="url(#square-grad)"/>
    </svg>`,
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 28
  }
]
