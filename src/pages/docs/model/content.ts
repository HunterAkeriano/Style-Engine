import type { Locale } from '@/app/providers/i18n'

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
          previewClass: 'docs-card__preview--gradients',
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
          previewClass: 'docs-card__preview--shadows',
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
          previewClass: 'docs-card__preview--animations',
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
              'Work in pairs: surface + border + text-contrast token.',
              'Limit gradient steps; if text is on a gradient, add a solid overlay with 0.08–0.14 opacity.',
              'Test contrast on hover/focus states, not only defaults.'
            ]
          },
          {
            title: 'Motion & timing',
            description: 'Animation rules without jank.',
            items: [
              'Use transform/opacity for transitions; avoid properties that trigger layout.',
              'Stick to 180–320ms for hover/focus, 260–420ms for larger blocks.',
              'Provide `prefers-reduced-motion` fallbacks with reduced duration or disabled loops.'
            ]
          },
          {
            title: 'Shadows & depth',
            description: 'Layered shadows that stay sharp.',
            items: [
              'Combine one soft shadow for volume and one thin outline for crisp edges.',
              'Hover shadows should be tighter (shorter blur and offset) than resting state.',
              'On dark backgrounds, add subtle inner light (1px) instead of aggressive outer glow.'
            ]
          }
        ]
      }
    },
    topics: [
      {
        slug: 'gradients',
        eyebrow: 'Color + depth',
        title: 'Gradient guide',
        subtitle: 'Angles, stops, transparency, and combining with overlays.',
        checklist: {
          title: '4 steps to a clean gradient',
          subtitle: 'Works for heroes and cards alike.',
          points: [
            'Start with two tones: accent + shadow with 20-30% opacity.',
            'Use 120-150deg for backgrounds, 30-45deg for highlights.',
            'Spread stops: 0%, 35-45%, 70-85% and mix transparent edges.',
            'Layer gradient + colored overlay + blur(12px) mask.'
          ]
        },
        preview: {
          title: 'Layered gradient',
          subtitle: 'Conic + linear mix',
          className: 'docs-topic__preview--gradients',
          code: `background:
  radial-gradient(circle at 20% 20%, #6ee7ff, transparent 38%),
  linear-gradient(135deg, rgba(124,58,237,.9) 0%, rgba(14,165,233,.6) 55%, rgba(16,185,129,.35) 100%),
  radial-gradient(circle at 80% 60%, rgba(255,255,255,.22), transparent 45%);`,
          layers: 3,
          dots: 0
        },
        patterns: {
          title: 'Quick presets',
          subtitle: 'Drop into the generator and tweak to your palette.',
          items: [
            {
              title: 'Glass + gradient',
              description: 'soft-glass base with outline',
              className: 'docs-topic__mini-preview--glass',
              code: `background: linear-gradient(140deg, rgba(255,255,255,.28), rgba(255,255,255,.04));
box-shadow: 0 16px 40px rgba(0,0,0,.25),
            0 0 0 1px rgba(255,255,255,.08);`
            },
            {
              title: 'Neon band',
              description: 'narrow bar with counter glow',
              className: 'docs-topic__mini-preview--band',
              code: `background: linear-gradient(90deg, #06b6d4, #a855f7 45%, #22d3ee);
box-shadow: 0 0 32px rgba(168,85,247,.6),
            0 12px 30px rgba(10,10,10,.35);`
            },
            {
              title: 'Card sheen',
              description: 'conic highlight with transparency',
              className: 'docs-topic__mini-preview--sheen',
              code: `background: conic-gradient(from 120deg,
  rgba(255,255,255,.32),
  rgba(255,255,255,0) 35%);
mix-blend-mode: screen;`
            }
          ]
        },
        link: '/docs/gradients'
      },
      {
        slug: 'shadows',
        eyebrow: 'Depth',
        title: 'Shadow guide',
        subtitle: 'Assemble clean multi-layer shadows without muddy edges.',
        checklist: {
          title: 'Shadow structure',
          subtitle: 'Blend blur + outline + glow.',
          points: [
            'Soft layer: 0 20px 60px rgba(0,0,0,0.3) for volume.',
            'Inner + border: 0 0 0 1px rgba(255,255,255,0.08) for crisp edges.',
            'Glow layer: 0 0 0 12px rgba(124,58,237,0.12) for rim light.',
            'Hover: reduce blur by 15% and lift the offset a few px.'
          ]
        },
        preview: {
          title: 'Multi-shadow',
          subtitle: '3 layers + outline',
          className: 'docs-topic__preview--shadows',
          code: `box-shadow:
  0 20px 60px rgba(0, 0, 0, 0.28),
  0 8px 18px rgba(0, 0, 0, 0.25),
  0 0 0 1px rgba(255, 255, 255, 0.08),
  0 0 0 14px rgba(124, 58, 237, 0.14);`,
          layers: 0,
          dots: 4
        },
        patterns: {
          title: 'Ready-made stacks',
          subtitle: 'Swap colors and intensity only.',
          items: [
            {
              title: 'Glass card',
              description: 'transparent base + shadow corridor',
              className: 'docs-topic__mini-preview--shadow-card',
              code: `box-shadow:
  0 12px 45px rgba(0, 0, 0, 0.32),
  0 0 0 1px rgba(255, 255, 255, 0.06);`
            },
            {
              title: 'Rim light',
              description: 'outline via inset + glow',
              className: 'docs-topic__mini-preview--outline',
              code: `box-shadow:
  inset 0 1px 0 rgba(255,255,255,.16),
  0 0 0 8px rgba(34,211,238,.18),
  0 16px 40px rgba(0,0,0,.25);`
            },
            {
              title: 'Hover lift',
              description: 'shadow shift on hover',
              className: 'docs-topic__mini-preview--hover',
              code: `.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 50px rgba(0,0,0,.3),
              0 0 0 12px rgba(168,85,247,.16);
  transition: 200ms ease; }`
            }
          ]
        },
        link: '/docs/shadows'
      },
      {
        slug: 'animations',
        eyebrow: 'Motion',
        title: 'Animation guide',
        subtitle: 'Keyframes, easing and staggers: fast micro-motions.',
        checklist: {
          title: 'Stable motion',
          subtitle: 'Timing and delays under control.',
          points: [
            'Set duration precisely: 260–420ms for UI elements.',
            'Prefer cubic-bezier(0.22, 1, 0.36, 1) for smooth exits.',
            'Use will-change: transform/opacity only on active elements.',
            'For staggers: delay = index * 80ms to avoid flashing.'
          ]
        },
        preview: {
          title: 'Motion timeline',
          subtitle: '6-dot stagger',
          className: 'docs-topic__preview--animations',
          code: `@keyframes rise {
  from { transform: translateY(12px); opacity: 0; }
  60% { transform: translateY(-8px); opacity: 1; }
  to { transform: translateY(0); opacity: 1; }
}`,
          layers: 0,
          dots: 6
        },
        patterns: {
          title: 'Keyframe templates',
          subtitle: 'Copy and adjust colors/timing.',
          items: [
            {
              title: 'Shimmer',
              description: 'highlight sweep across a card',
              className: 'docs-topic__mini-preview--shimmer',
              code: `@keyframes shimmer {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
}`
            },
            {
              title: 'Bounce',
              description: 'bounce with slight squish',
              className: 'docs-topic__mini-preview--bounce',
              code: `@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  45% { transform: translateY(-16px) scale(1.02); }
  70% { transform: translateY(2px) scale(.98); }
}`
            },
            {
              title: 'Orbit marker',
              description: 'floating dot on a ring',
              className: 'docs-topic__mini-preview--orbit',
              code: `@keyframes orbit {
  to { transform: rotate(360deg) translateX(52px) rotate(-360deg); }
}`
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
        eyebrow: 'CSS Гайд',
        title: 'Живий гайд про градієнти, тіні та motion',
        subtitle:
          'Документація з копійованими кодами та живими превʼю: видно як працюють градієнти, мульти-тіні й keyframes. Швидкі лінки ведуть на підсторінки для кожного типу ефектів.',
        meta: ['Інтерактивні приклади', 'CSS для копіювання', 'Чеклист + практика'],
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
          description: 'Лінійні, радіальні й конусні мікси з кутами та стопами.',
          badge: 'color + depth',
          previewLabel: 'Слої кольору',
          previewDots: 5,
          previewClass: 'docs-card__preview--gradients',
          points: [
            'Палітра через баланс світла/тіні',
            'Сітки стопів і прозоростей',
            'Двошарові бэкграунди для читабельності'
          ],
          link: '/docs/gradients',
          hint: '5 прикладів + чеклист'
        },
        {
          slug: 'shadows',
          title: 'Тіні',
          description: 'Мульти-тіні без бруду й сірих плям.',
          badge: 'depth',
          previewLabel: 'Багатошарова тінь',
          previewDots: 4,
          previewClass: 'docs-card__preview--shadows',
          points: [
            'Soft-shadow + border-glow',
            'Відділення hover/active',
            'Пресети для glassmorphism'
          ],
          link: '/docs/shadows',
          hint: 'Готові схеми multi-shadow'
        },
        {
          slug: 'animations',
          title: 'Анімації',
          description: 'Keyframes з easing, затримками й стегером.',
          badge: 'motion',
          previewLabel: 'Micro-motion',
          previewDots: 6,
          previewClass: 'docs-card__preview--animations',
          points: [
            'Гачки для затримки та пауз',
            'Стилізація marquee й loaders',
            'Кращі криві easing'
          ],
          link: '/docs/animations',
          hint: 'Keyframes для копіювання'
        }
      ],
      playbook: [
        {
          title: 'Градієнтна карточка',
          description: 'Контрастний фон + мʼякий multi-shadow і легкий blur.',
          code: `background: linear-gradient(135deg, #6ee7ff, #7c3aed);
box-shadow: 0 20px 60px rgba(124, 58, 237, 0.28),
            0 8px 24px rgba(10, 10, 10, 0.25);`,
          preview: 'card'
        },
        {
          title: 'Біжучий рядок',
          description: 'translateX без шва і з налаштуванням швидкості.',
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
          title: 'Пульс для CTA',
          description: 'Два шари (scale + blur) для мʼякого фокуса.',
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
        title: 'Коротка CSS-документація',
        subtitle: 'Нагадування для чистих і передбачуваних стилів у продакшені.',
        sections: [
          {
            title: 'Layout',
            description: 'Стабільний потік без стрибків.',
            items: [
              'Використовуйте logical properties (margin-inline, padding-block) — простіше для RTL.',
              'Резервуйте місце під асинхронний контент через min-height або aspect-ratio.',
              'Віддавайте перевагу gap у grid/flex замість маршинів, щоб уникнути колапсів.'
            ]
          },
          {
            title: 'Колір і контраст',
            description: 'Читабельність у світлій/темній темах.',
            items: [
              'Працюйте в парах: surface + border + текстовий контраст.',
              'Обмежуйте кроки градієнта; для тексту на градієнті — додайте суцільний overlay 0.08–0.14.',
              'Перевіряйте контраст для hover/focus, а не лише дефолту.'
            ]
          },
          {
            title: 'Motion і таймінги',
            description: 'Правила анімацій без джанку.',
            items: [
              'Для переходів використовуйте transform/opacity, не властивості що змінюють layout.',
              'Тримайте 180–320мс для hover/focus, 260–420мс для великих блоків.',
              'Додавайте `prefers-reduced-motion`: менша тривалість або вимкнені цикли.'
            ]
          },
          {
            title: 'Тіні й глибина',
            description: 'Шари тіней, що залишаються чіткими.',
            items: [
              'Поєднуйте один soft-шар для обʼєму і тонкий outline для чіткості.',
              'Hover-тіні робіть компактнішими (менше blur та offset), ніж у спокої.',
              'На темному фоні додайте легкий inner light (1px) замість агресивного зовнішнього glow.'
            ]
          }
        ]
      }
    },
    topics: [
      {
        slug: 'gradients',
        eyebrow: 'Color + depth',
        title: 'Гайд по градієнтах',
        subtitle: 'Кути, стопи, прозорості й робота з overlay.',
        checklist: {
          title: '4 кроки до чистого градієнта',
          subtitle: 'Підійде і для героя, і для карточки.',
          points: [
            'Почніть з двох тонів: акцент + тінь з 20-30% прозорості.',
            '120-150deg для фону, 30-45deg для бликів.',
            'Розносьте стопи: 0%, 35-45%, 70-85% і прозорі межі.',
            'Комбінуйте градієнт + кольоровий overlay + маску blur(12px).'
          ]
        },
        preview: {
          title: 'Слоєний градієнт',
          subtitle: 'Конус + лінійний шар',
          className: 'docs-topic__preview--gradients',
          code: `background:
  radial-gradient(circle at 20% 20%, #6ee7ff, transparent 38%),
  linear-gradient(135deg, rgba(124,58,237,.9) 0%, rgba(14,165,233,.6) 55%, rgba(16,185,129,.35) 100%),
  radial-gradient(circle at 80% 60%, rgba(255,255,255,.22), transparent 45%);`,
          layers: 3,
          dots: 0
        },
        patterns: {
          title: 'Швидкі пресети',
          subtitle: 'Вставляйте в генератор і коригуйте палітру.',
          items: [
            {
              title: 'Glass + градієнт',
              description: 'soft-glass база з контуром',
              className: 'docs-topic__mini-preview--glass',
              code: `background: linear-gradient(140deg, rgba(255,255,255,.28), rgba(255,255,255,.04));
box-shadow: 0 16px 40px rgba(0,0,0,.25),
            0 0 0 1px rgba(255,255,255,.08);`
            },
            {
              title: 'Neon band',
              description: 'вузька смуга з контровим glow',
              className: 'docs-topic__mini-preview--band',
              code: `background: linear-gradient(90deg, #06b6d4, #a855f7 45%, #22d3ee);
box-shadow: 0 0 32px rgba(168,85,247,.6),
            0 12px 30px rgba(10,10,10,.35);`
            },
            {
              title: 'Блік для карточки',
              description: 'конусний хайлайт + прозорість',
              className: 'docs-topic__mini-preview--sheen',
              code: `background: conic-gradient(from 120deg,
  rgba(255,255,255,.32),
  rgba(255,255,255,0) 35%);
mix-blend-mode: screen;`
            }
          ]
        },
        link: '/docs/gradients'
      },
      {
        slug: 'shadows',
        eyebrow: 'Depth',
        title: 'Гайд по тінях',
        subtitle: 'Як скласти чисту multi-shadow без бруду.',
        checklist: {
          title: 'Структура тіні',
          subtitle: 'Поєднуйте blur + контур + glow.',
          points: [
            'Soft-шар: 0 20px 60px rgba(0,0,0,0.3) для обʼєму.',
            'Inner + border: 0 0 0 1px rgba(255,255,255,0.08) для чіткого краю.',
            'Glow-шар: 0 0 0 12px rgba(124,58,237,0.12) для контрового світла.',
            'Hover: зменшуйте blur на 15% і підіймайте offset на пару пікселів.'
          ]
        },
        preview: {
          title: 'Мульти-тінь',
          subtitle: '3 шари + outline',
          className: 'docs-topic__preview--shadows',
          code: `box-shadow:
  0 20px 60px rgba(0, 0, 0, 0.28),
  0 8px 18px rgba(0, 0, 0, 0.25),
  0 0 0 1px rgba(255, 255, 255, 0.08),
  0 0 0 14px rgba(124, 58, 237, 0.14);`,
          layers: 0,
          dots: 4
        },
        patterns: {
          title: 'Готові схеми',
          subtitle: 'Змінюйте лише колір і силу.',
          items: [
            {
              title: 'Glass-карта',
              description: 'прозора база + тіньовий коридор',
              className: 'docs-topic__mini-preview--shadow-card',
              code: `box-shadow:
  0 12px 45px rgba(0, 0, 0, 0.32),
  0 0 0 1px rgba(255, 255, 255, 0.06);`
            },
            {
              title: 'Контрове світло',
              description: 'outline через inset + glow',
              className: 'docs-topic__mini-preview--outline',
              code: `box-shadow:
  inset 0 1px 0 rgba(255,255,255,.16),
  0 0 0 8px rgba(34,211,238,.18),
  0 16px 40px rgba(0,0,0,.25);`
            },
            {
              title: 'Hover-підйом',
              description: 'зміщення тіні при наведенні',
              className: 'docs-topic__mini-preview--hover',
              code: `.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 50px rgba(0,0,0,.3),
              0 0 0 12px rgba(168,85,247,.16);
  transition: 200ms ease; }`
            }
          ]
        },
        link: '/docs/shadows'
      },
      {
        slug: 'animations',
        eyebrow: 'Motion',
        title: 'Гайд по анімаціях',
        subtitle: 'Keyframes, easing і стегер: набір мікрорухів.',
        checklist: {
          title: 'Стабільний motion',
          subtitle: 'Час і затримки під контролем.',
          points: [
            'Тривалість в мс: 260–420 мс для UI-елементів.',
            'cubic-bezier(0.22, 1, 0.36, 1) для плавного виходу.',
            'will-change: transform/opacity лише на активних елементах.',
            'Стегер: затримка = індекс * 80мс, щоб не спалахували.'
          ]
        },
        preview: {
          title: 'Таймлайн руху',
          subtitle: 'стегер з 6 точок',
          className: 'docs-topic__preview--animations',
          code: `@keyframes rise {
  from { transform: translateY(12px); opacity: 0; }
  60% { transform: translateY(-8px); opacity: 1; }
  to { transform: translateY(0); opacity: 1; }
}`,
          layers: 0,
          dots: 6
        },
        patterns: {
          title: 'Keyframe-шаблони',
          subtitle: 'Скопіюйте й підкоригуйте колір/час.',
          items: [
            {
              title: 'Шиммер',
              description: 'блик, що пробігає по карті',
              className: 'docs-topic__mini-preview--shimmer',
              code: `@keyframes shimmer {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
}`
            },
            {
              title: 'Стрибок',
              description: 'bounce з легким стисненням',
              className: 'docs-topic__mini-preview--bounce',
              code: `@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  45% { transform: translateY(-16px) scale(1.02); }
  70% { transform: translateY(2px) scale(.98); }
}`
            },
            {
              title: 'Орбітальний маркер',
              description: 'точка, що рухається по колу',
              className: 'docs-topic__mini-preview--orbit',
              code: `@keyframes orbit {
  to { transform: rotate(360deg) translateX(52px) rotate(-360deg); }
}`
            }
          ]
        },
        link: '/docs/animations'
      }
    ]
  }
}

export function getDocsPageContent(locale: Locale): DocsPageContent {
  return docsContent[locale]?.page ?? docsContent.en.page
}

export function getDocsTopicContent(locale: Locale, topic: DocsTopicKey): {
  topic: DocsTopicContent
  otherTopics: DocsTopicContent[]
} {
  const allTopics = docsContent[locale]?.topics ?? docsContent.en.topics
  const found = allTopics.find(item => item.slug === topic) ?? allTopics[0]
  const others = allTopics.filter(item => item.slug !== found.slug)
  return { topic: found, otherTopics: others }
}
