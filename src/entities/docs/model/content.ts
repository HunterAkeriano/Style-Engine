import type { Locale } from '@/shared/config/locales'

export type DocsTopicKey = 'gradients' | 'shadows' | 'animations'

export interface DocsHeroContent {
  eyebrow: string
  title: string
  subtitle: string
  meta: string[]
  cta: {
    label: string
    to: string
    variant: 'primary' | 'secondary'
  }[]
}

export interface DocsTopicCard {
  slug: DocsTopicKey
  title: string
  description: string
  badge: string
  previewLabel: string
  previewDots: number
  previewClass: string
  points: string[]
  link: string
  hint: string
}

export interface DocsSnippet {
  title: string
  description: string
  code: string
  preview: 'card' | 'marquee' | 'pulse'
}

export interface DocsTopicContent {
  slug: DocsTopicKey
  eyebrow: string
  title: string
  subtitle: string
  checklist: {
    title: string
    subtitle: string
    points: string[]
  }
  preview: {
    title: string
    subtitle: string
    className: string
    code: string
    layers: number
    dots?: number
  }
  patterns: {
    title: string
    subtitle: string
    items: {
      title: string
      description: string
      code: string
      className: string
    }[]
  }
  link: string
}

export interface DocsPrimerSection {
  title: string
  description: string
  items: string[]
}

interface DocsPageContent {
  hero: DocsHeroContent
  topics: DocsTopicCard[]
  playbook: DocsSnippet[]
  primer: {
    title: string
    subtitle: string
    sections: DocsPrimerSection[]
  }
}

const docsContent: Record<Locale, { page: DocsPageContent; topics: DocsTopicContent[] }> = {
  en: {
    page: {
      hero: {
        eyebrow: 'CSS Guide',
        title: 'Live guide for gradients, shadows, and motion',
        subtitle:
          'Documentation page with copyable snippets and live previews so you can see how gradients, shadow stacks, and keyframes work. Quick links jump into focused subpages for each effect type.',
        meta: ['Interactive examples', 'Copy-paste CSS', 'Checklist + practice'],
        cta: [
          { label: 'Gradient guide', to: '/docs/gradients', variant: 'primary' },
          { label: 'Shadow guide', to: '/docs/shadows', variant: 'secondary' },
          { label: 'Animation guide', to: '/docs/animations', variant: 'secondary' }
        ]
      },
      topics: [
        {
          slug: 'gradients',
          title: 'Gradients',
          description: 'Linear, radial, and conic mixes with angles and stop tips.',
          badge: 'color + depth',
          previewLabel: 'Layered blend',
          previewDots: 5,
          previewClass: 'docs-card__preview_gradients',
          points: [
            'Palette through light/shadow balance',
            'Stop grids with transparency',
            'Dual-layer backgrounds for clarity'
          ],
          link: '/docs/gradients',
          hint: '5 examples + checklist'
        },
        {
          slug: 'shadows',
          title: 'Shadows',
          description: 'Multi-shadow stacks without murky edges.',
          badge: 'depth',
          previewLabel: 'Layered shadow',
          previewDots: 4,
          previewClass: 'docs-card__preview_shadows',
          points: [
            'Soft shadow + border glow',
            'Hover/active separation',
            'Glassmorphism friendly presets'
          ],
          link: '/docs/shadows',
          hint: 'Multi-shadow recipes'
        },
        {
          slug: 'animations',
          title: 'Animations',
          description: 'Keyframes with easing, delays, and stagger notes.',
          badge: 'motion',
          previewLabel: 'Micro-motion',
          previewDots: 6,
          previewClass: 'docs-card__preview_animations',
          points: [
            'Delay hooks and pauses',
            'Marquee and loaders styling',
            'Best easing curves'
          ],
          link: '/docs/animations',
          hint: 'Copyable keyframes'
        }
      ],
      playbook: [
        {
          title: 'Gradient card',
          description: 'Contrast background + soft multi-shadow and subtle depth.',
          code: `background: linear-gradient(135deg, #6ee7ff, #7c3aed);
box-shadow: 0 20px 60px rgba(124, 58, 237, 0.28),
            0 8px 24px rgba(10, 10, 10, 0.25);`,
          preview: 'card'
        },
        {
          title: 'Marquee ticker',
          description: 'TranslateX with seamless repeat and adjustable speed.',
          code: `.marquee {
  display: flex;
  gap: 2rem;
  animation: ticker 14s linear infinite;
}
@keyframes ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}`,
          preview: 'marquee'
        },
        {
          title: 'CTA pulse',
          description: 'Two layers (scale + blur) for a soft focus highlight.',
          code: `@keyframes pulse {
  0% { transform: scale(1); opacity: .9; }
  70% { transform: scale(1.25); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
}
.pulse::after { animation-delay: .6s; }`,
          preview: 'pulse'
        }
      ],
      primer: {
        title: 'CSS mini documentation',
        subtitle: 'Key reminders for clean, predictable styles in production.',
        sections: [
          {
            title: 'Layout',
            description: 'Keep flow stable and avoid layout shifts.',
            items: [
              'Use logical properties (margin-inline, padding-block) to simplify RTL.',
              'Reserve space for async content with min-height or aspect-ratio.',
              'Prefer grid/flex gaps over margin stacks to avoid collapsing surprises.'
            ]
          },
          {
            title: 'Colors & contrast',
            description: 'Readable UI on light/dark themes.',
            items: [
              'Use foreground-on-background contrast of at least 4.5:1 for text.',
              'Pair gradients with solid overlays for text legibility.',
              'Test both light/dark themes for the same component before shipping.'
            ]
          },
          {
            title: 'Performance',
            description: 'Ship smooth motion and avoid layout trashing.',
            items: [
              'Animate transform/opacity only; avoid box-shadow/height transitions.',
              'Cap animation duration for loops (under 1.4s for loaders).',
              'Use will-change sparingly and only on elements that truly animate.'
            ]
          }
        ]
      }
    },
    topics: [
      {
        slug: 'gradients',
        eyebrow: 'Gradients',
        title: 'Layered gradients for depth and clarity',
        subtitle: 'Balance contrast, stop positions, and add subtle radial accents.',
        checklist: {
          title: 'Gradient checklist',
          subtitle: 'Three steps to a clean gradient',
          points: [
            'Pick 2–3 hues; avoid muddy mixes by spacing stops.',
            'Add a radial highlight to guide the eye.',
            'Keep text contrast with overlays or solid backing.'
          ]
        },
        preview: {
          title: 'Layered blend',
          subtitle: 'Linear base + radial glow',
          className: 'docs-topic__preview_gradients',
          code: `background:
  radial-gradient(circle at 30% 20%, rgba(255,255,255,0.16), transparent 45%),
  linear-gradient(135deg, #7c3aed, #6ee7ff);`,
          layers: 2,
          dots: 5
        },
        patterns: {
          title: 'Use cases',
          subtitle: 'Hero backgrounds, CTA cards, avatars',
          items: [
            {
              title: 'Glass header',
              description: 'Gradient + blur + soft border',
              code: `background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
border: 1px solid rgba(255,255,255,0.12);`,
              className: 'docs-topic__pattern docs-topic__pattern_card'
            },
            {
              title: 'Conic accent',
              description: 'Thin sweep for labels',
              code: `background: conic-gradient(from 120deg, #6dd3ff, #ff7ce6, #6dd3ff);
mask: linear-gradient(90deg, transparent 0, black 25%, black 75%, transparent 100%);`,
              className: 'docs-topic__pattern docs-topic__pattern_strip'
            }
          ]
        },
        link: '/docs/gradients'
      },
      {
        slug: 'shadows',
        eyebrow: 'Shadows',
        title: 'Crisp multi-layer shadows for UI',
        subtitle: 'Stacked offsets without blur for sharp depth.',
        checklist: {
          title: 'Shadow checklist',
          subtitle: 'Two layers: lift + contact',
          points: [
            'Layer 1: bigger spread, lower opacity for lift.',
            'Layer 2: tighter spread for contact.',
            'Avoid heavy blur for hard-edge components.'
          ]
        },
        preview: {
          title: 'Layered shadow',
          subtitle: 'Depth without blur',
          className: 'docs-topic__preview_shadows',
          code: `box-shadow:
  0 14px 34px rgba(15,23,42,0.25),
  0 6px 14px rgba(15,23,42,0.16);`,
          layers: 2,
          dots: 4
        },
        patterns: {
          title: 'Use cases',
          subtitle: 'Buttons, cards, floating chips',
          items: [
            {
              title: 'Primary button',
              description: 'Hover lift + inset glow',
              code: `box-shadow:
  0 10px 20px rgba(79,70,229,0.25),
  inset 0 0 0 1px rgba(255,255,255,0.12);`,
              className: 'docs-topic__pattern docs-topic__pattern_button'
            },
            {
              title: 'Floating chip',
              description: 'Two layers, zero blur',
              code: `box-shadow:
  0 16px 30px rgba(0,0,0,0.18),
  0 6px 14px rgba(0,0,0,0.22);`,
              className: 'docs-topic__pattern docs-topic__pattern_chip'
            }
          ]
        },
        link: '/docs/shadows'
      },
      {
        slug: 'animations',
        eyebrow: 'Animations',
        title: 'Micro-motion with keyframes',
        subtitle: 'Transform/opacity only, tuned easing and duration.',
        checklist: {
          title: 'Animation checklist',
          subtitle: 'Smooth, readable motion',
          points: [
            'Animate transform/opacity; avoid layout-affecting props.',
            'Keep loaders under ~1.4s, loops 6–12s.',
            'Stagger lists by 60–120ms for depth.'
          ]
        },
        preview: {
          title: 'Micro float',
          subtitle: 'Y-translate + opacity',
          className: 'docs-topic__preview_animations',
          code: `@keyframes float {
  0%,100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(-12px); opacity: 0.85; }
}`,
          layers: 1,
          dots: 6
        },
        patterns: {
          title: 'Use cases',
          subtitle: 'Badges, loaders, marquee',
          items: [
            {
              title: 'Pill badge',
              description: 'Sliding dot for active state',
              code: `.pill::after { animation: slide 2.4s ease-in-out infinite; }`,
              className: 'docs-topic__pattern docs-topic__pattern_badge'
            },
            {
              title: 'Marquee',
              description: 'Looping translateX',
              code: `.marquee { animation: ticker 14s linear infinite; }`,
              className: 'docs-topic__pattern docs-topic__pattern_marquee'
            }
          ]
        },
        link: '/docs/animations'
      }
    ]
  },
  uk: {
    page: {
      hero: {
        eyebrow: 'CSS гайд',
        title: 'Живий гайд по градієнтам, тіням та анімаціям',
        subtitle:
          'Сторінка з документацією, готовими прикладами та живими прев’ю, щоб ви бачили, як працюють градієнти, стекинг тіней та keyframes. Є швидкі переходи у підрозділи для кожного типу ефектів.',
        meta: ['Інтерактивні приклади', 'CSS для копіювання', 'Чекліст + практика'],
        cta: [
          { label: 'Гайд по градієнтах', to: '/docs/gradients', variant: 'primary' },
          { label: 'Гайд по тінях', to: '/docs/shadows', variant: 'secondary' },
          { label: 'Гайд по анімаціях', to: '/docs/animations', variant: 'secondary' }
        ]
      },
      topics: [
        {
          slug: 'gradients',
          title: 'Градієнти',
          description: 'Лінійні, радіальні та конічні мікси з порадами по стопам.',
          badge: 'колір + глибина',
          previewLabel: 'Багатошаровий мікс',
          previewDots: 5,
          previewClass: 'docs-card__preview_gradients',
          points: [
            'Палітра через баланс світла/тіні',
            'Сітка стопів з прозорістю',
            'Два шари фону для контрасту'
          ],
          link: '/docs/gradients',
          hint: '5 прикладів + чекліст'
        },
        {
          slug: 'shadows',
          title: 'Тіні',
          description: 'Мульті-тіньові стаки без бруду.',
          badge: 'глибина',
          previewLabel: 'Шарована тінь',
          previewDots: 4,
          previewClass: 'docs-card__preview_shadows',
          points: ['М’яка тінь + border glow', 'Розділення hover/active', 'Glass-friendly пресети'],
          link: '/docs/shadows',
          hint: 'Рецепти мульті-тіней'
        },
        {
          slug: 'animations',
          title: 'Анімації',
          description: 'Keyframes з easing, затримками та stagger нотатками.',
          badge: 'motion',
          previewLabel: 'Мікро рух',
          previewDots: 6,
          previewClass: 'docs-card__preview_animations',
          points: ['Хуки затримки', 'Стилі marquee та лоадерів', 'Кращі криві прискорення'],
          link: '/docs/animations',
          hint: 'Keyframes для копіювання'
        }
      ],
      playbook: [
        {
          title: 'Градієнтна картка',
          description: 'Контрастний фон + м’який мульти-shadow і глибина.',
          code: `background: linear-gradient(135deg, #6ee7ff, #7c3aed);
box-shadow: 0 20px 60px rgba(124, 58, 237, 0.28),
            0 8px 24px rgba(10, 10, 10, 0.25);`,
          preview: 'card'
        },
        {
          title: 'Marquee стрічка',
          description: 'TranslateX з безшовним повтором і регульованою швидкістю.',
          code: `.marquee {
  display: flex;
  gap: 2rem;
  animation: ticker 14s linear infinite;
}
@keyframes ticker {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}`,
          preview: 'marquee'
        },
        {
          title: 'CTA pulse',
          description: 'Два шари (scale + blur) для м’якого акценту.',
          code: `@keyframes pulse {
  0% { transform: scale(1); opacity: .9; }
  70% { transform: scale(1.25); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
}
.pulse::after { animation-delay: .6s; }`,
          preview: 'pulse'
        }
      ],
      primer: {
        title: 'Міні-документація CSS',
        subtitle: 'Короткі нагадування для чистих стилів у проді.',
        sections: [
          {
            title: 'Лейаут',
            description: 'Стабільний flow без layout shifts.',
            items: [
              'Логічні властивості (margin-inline, padding-block) для спрощення RTL.',
              'Резервуйте місце під async контент (min-height або aspect-ratio).',
              'Використовуйте gap у grid/flex замість margin stack.'
            ]
          },
          {
            title: 'Контраст',
            description: 'Читабельність у світлій/темній темах.',
            items: [
              'Контраст тексту 4.5:1 і більше.',
              'Градієнти + solid overlay для тексту.',
              'Тестуйте обидві теми перед релізом.'
            ]
          },
          {
            title: 'Перформанс',
            description: 'Плавний motion без трешу.',
            items: [
              'Анімуйте transform/opacity, не чіпайте розміри/тіні.',
              'Обмежуйте тривалість циклів (лоадери <1.4c).',
              'will-change — тільки на реально анімованих елементах.'
            ]
          }
        ]
      }
    },
    topics: [
      {
        slug: 'gradients',
        eyebrow: 'Градієнти',
        title: 'Шарові градієнти з глибиною та читабельністю',
        subtitle: 'Баланс контрасту, позицій стопів і легких радіальних акцентів.',
        checklist: {
          title: 'Чекліст градієнтів',
          subtitle: 'Три кроки до чистого градієнта',
          points: [
            'Обирайте 2–3 відтінки; розводьте стопи, щоб уникнути «бруду».',
            'Додайте радіальний хайлайт, щоб вести погляд.',
            'Тримайте контраст тексту накладкою або суцільним фоном.'
          ]
        },
        preview: {
          title: 'Шарований мікс',
          subtitle: 'Лінійна база + радіальне світло',
          className: 'docs-topic__preview_gradients',
          code: `background:
  radial-gradient(circle at 30% 20%, rgba(255,255,255,0.16), transparent 45%),
  linear-gradient(135deg, #7c3aed, #6ee7ff);`,
          layers: 2,
          dots: 5
        },
        patterns: {
          title: 'Де застосувати',
          subtitle: 'Фони героїв, CTA-картки, аватари',
          items: [
            {
              title: 'Скляний хедер',
              description: 'Градієнт + blur + м’який бордер',
              code: `background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02));
border: 1px solid rgba(255,255,255,0.12);`,
              className: 'docs-topic__pattern docs-topic__pattern_card'
            },
            {
              title: 'Конічний акцент',
              description: 'Тонкий мазок для лейблів',
              code: `background: conic-gradient(from 120deg, #6dd3ff, #ff7ce6, #6dd3ff);
mask: linear-gradient(90deg, transparent 0, black 25%, black 75%, transparent 100%);`,
              className: 'docs-topic__pattern docs-topic__pattern_strip'
            }
          ]
        },
        link: '/docs/gradients'
      },
      {
        slug: 'shadows',
        eyebrow: 'Тіні',
        title: 'Чіткі мульти-тіні для UI',
        subtitle: 'Шаровані зсуви без розмиття, щоб зберегти чіткість.',
        checklist: {
          title: 'Чекліст тіней',
          subtitle: 'Два шари: підйом + контакт',
          points: [
            'Шар 1: більший спред і менша прозорість для підйому.',
            'Шар 2: щільніший спред для контакту.',
            'Уникайте великого blur для гострих компонентів.'
          ]
        },
        preview: {
          title: 'Шарована тінь',
          subtitle: 'Глибина без розмиття',
          className: 'docs-topic__preview_shadows',
          code: `box-shadow:
  0 14px 34px rgba(15,23,42,0.25),
  0 6px 14px rgba(15,23,42,0.16);`,
          layers: 2,
          dots: 4
        },
        patterns: {
          title: 'Де застосувати',
          subtitle: 'Кнопки, картки, «плаваючі» чіпи',
          items: [
            {
              title: 'Кнопка primary',
              description: 'Підйом на hover + inset підсвітка',
              code: `box-shadow:
  0 10px 20px rgba(79,70,229,0.25),
  inset 0 0 0 1px rgba(255,255,255,0.12);`,
              className: 'docs-topic__pattern docs-topic__pattern_button'
            },
            {
              title: 'Плаваючий чіп',
              description: 'Два шари, без blur',
              code: `box-shadow:
  0 16px 30px rgba(0,0,0,0.18),
  0 6px 14px rgba(0,0,0,0.22);`,
              className: 'docs-topic__pattern docs-topic__pattern_chip'
            }
          ]
        },
        link: '/docs/shadows'
      },
      {
        slug: 'animations',
        eyebrow: 'Анімації',
        title: 'Мікро-рух на keyframes',
        subtitle: 'Тільки transform/opacity з відточеним easing і тривалістю.',
        checklist: {
          title: 'Чекліст анімацій',
          subtitle: 'Плавний і зрозумілий рух',
          points: [
            'Анімуйте лише transform/opacity; не рухайте розміри/тіні.',
            'Лоадери тримайте до ~1.4с, цикли — 6–12с.',
            'Списки розносьте на 60–120 мс для глибини.'
          ]
        },
        preview: {
          title: 'Мікро float',
          subtitle: 'Зсув по Y + прозорість',
          className: 'docs-topic__preview_animations',
          code: `@keyframes float {
  0%,100% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(-12px); opacity: 0.85; }
}`,
          layers: 1,
          dots: 6
        },
        patterns: {
          title: 'Де застосувати',
          subtitle: 'Бейджі, лоадери, marquee',
          items: [
            {
              title: 'Pill бейдж',
              description: 'Ковзна крапка для активного стану',
              code: `.pill::after { animation: slide 2.4s ease-in-out infinite; }`,
              className: 'docs-topic__pattern docs-topic__pattern_badge'
            },
            {
              title: 'Marquee',
              description: 'Безкінечний translateX',
              code: `.marquee { animation: ticker 14s linear infinite; }`,
              className: 'docs-topic__pattern docs-topic__pattern_marquee'
            }
          ]
        },
        link: '/docs/animations'
      }
    ]
  }
}

export function getDocsPageContent(locale: Locale) {
  return docsContent[locale]?.page ?? docsContent.en.page
}

export function getDocsTopics(locale: Locale) {
  return docsContent[locale]?.topics ?? docsContent.en.topics
}

export function getDocsTopicContent(locale: Locale, slug: DocsTopicKey) {
  const topics = getDocsTopics(locale)
  const topic = topics.find((t) => t.slug === slug) ?? topics[0]
  const otherTopics = topics.filter((t) => t.slug !== topic.slug)
  return { topic, otherTopics }
}
