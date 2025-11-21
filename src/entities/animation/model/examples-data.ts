import type { DefineComponent } from 'vue'

export type AnimationCategory = 'loaders' | 'marquee' | 'transitions' | 'effects' | 'interactive' | 'orbital'

export type AnimationExample = {
  id: string
  titleKey: string
  descriptionKey: string
  category: AnimationCategory
  html: string
  css: string
  component: () => Promise<{ default: DefineComponent<any, any, any> }>
}

export const animationExamples: AnimationExample[] = [
  {
    id: 'triple-spinner',
    titleKey: 'ANIMATION.EXAMPLES.TRIPLE_SPINNER_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.TRIPLE_SPINNER_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-triple-spinner/AnimationTripleSpinner.vue'),
    html: `<div class="triple-spinner">
  <span class="triple-spinner__ring triple-spinner__ring_outer"></span>
  <span class="triple-spinner__ring triple-spinner__ring_middle"></span>
  <span class="triple-spinner__ring triple-spinner__ring_inner"></span>
</div>`,
    css: `.triple-spinner {
  position: relative;
  width: 120px;
  height: 120px;
  display: grid;
  place-items: center;
  color: #5b8def;
}

.triple-spinner__ring {
  position: absolute;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: #5b8def;
  border-right-color: rgba(91, 141, 239, 0.5);
  border-left-color: rgba(99, 173, 255, 0.4);
  box-shadow: 0 0 18px rgba(91, 141, 239, 0.25);
}

.triple-spinner__ring_outer { width: 100%; height: 100%; animation: triple-spin 1.6s linear infinite; }
.triple-spinner__ring_middle { width: 78%; height: 78%; animation: triple-spin 1.2s linear infinite reverse; }
.triple-spinner__ring_inner { width: 52%; height: 52%; animation: triple-spin 0.9s linear infinite; }

@keyframes triple-spin { to { transform: rotate(360deg); } }`
  },
  {
    id: 'cube-pulse',
    titleKey: 'ANIMATION.EXAMPLES.CUBE_PULSE_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.CUBE_PULSE_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-cube-pulse/AnimationCubePulse.vue'),
    html: `<div class="cube-pulse">
  <span></span><span></span><span></span><span></span>
</div>`,
    css: `.cube-pulse {
  display: grid;
  grid-template-columns: repeat(2, 22px);
  grid-template-rows: repeat(2, 22px);
  gap: 8px;
  width: max-content;
}
.cube-pulse span {
  width: 22px; height: 22px;
  border-radius: 6px;
  background: linear-gradient(135deg, #5b8def, #9a6bff);
  box-shadow: 0 10px 30px rgba(91, 141, 239, 0.28);
  animation: cube-pulse 1.2s ease-in-out infinite;
}
.cube-pulse span:nth-child(2){animation-delay:.1s;}
.cube-pulse span:nth-child(3){animation-delay:.2s;}
.cube-pulse span:nth-child(4){animation-delay:.3s;}
@keyframes cube-pulse {0%,100%{transform:scale(.9);opacity:.85;}50%{transform:scale(1.15);opacity:1;}}`
  },
  {
    id: 'line-dance',
    titleKey: 'ANIMATION.EXAMPLES.LINE_DANCE_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.LINE_DANCE_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-line-dance/AnimationLineDance.vue'),
    html: `<div class="line-dance">
  <span></span><span></span><span></span><span></span><span></span>
</div>`,
    css: `.line-dance { display:flex; gap:8px; align-items:flex-end; height:64px; }
.line-dance span {
  width:8px; height:32px; border-radius:999px;
  background: linear-gradient(180deg, #5b8def, #9a6bff);
  box-shadow: 0 8px 18px rgba(91, 141, 239, 0.25);
  animation: line-dance 1s ease-in-out infinite;
}
.line-dance span:nth-child(2){animation-delay:.08s;}
.line-dance span:nth-child(3){animation-delay:.16s;}
.line-dance span:nth-child(4){animation-delay:.24s;}
.line-dance span:nth-child(5){animation-delay:.32s;}
@keyframes line-dance {0%,100%{transform:scaleY(.5);opacity:.7;}50%{transform:scaleY(1.2);opacity:1;}}`
  },
  {
    id: 'ring-dash',
    titleKey: 'ANIMATION.EXAMPLES.RING_DASH_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.RING_DASH_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-ring-dash/AnimationRingDash.vue'),
    html: `<div class="ring-dash"></div>`,
    css: `.ring-dash {
  width:96px; height:96px; border-radius:50%;
  border:6px dashed #5b8def;
  box-shadow: 0 0 20px rgba(91, 141, 239, 0.25);
  animation: ring-dash-rotate 1.6s linear infinite; position:relative;
}
.ring-dash::after{
  content:''; position:absolute; inset:16px; border-radius:50%;
  border:4px solid rgba(154,107,255,.65); border-right-color:transparent;
  animation: ring-dash-reverse 1.1s linear infinite;
}
@keyframes ring-dash-rotate{to{transform:rotate(360deg);}}
@keyframes ring-dash-reverse{to{transform:rotate(-360deg);}}`
  },
  {
    id: 'beam-loader',
    titleKey: 'ANIMATION.EXAMPLES.BEAM_LOADER_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.BEAM_LOADER_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-beam-loader/AnimationBeamLoader.vue'),
    html: `<div class="beam-loader"><span class="beam-loader__track"></span></div>`,
    css: `.beam-loader {
  width:180px; height:12px; border-radius:999px;
  background: rgba(91,141,239,0.08); border:1px solid rgba(91,141,239,0.15);
  overflow:hidden; position:relative; box-shadow: inset 0 1px 0 rgba(91,141,239,0.15);
}
.beam-loader__track{
  position:absolute; inset:0; width:60%;
  background: linear-gradient(90deg, transparent, rgba(91,141,239,.65), transparent);
  animation: beam-slide 1.1s ease-in-out infinite;
}
@keyframes beam-slide{0%{transform:translateX(-80%);}100%{transform:translateX(140%);}}`
  },
  {
    id: 'stack-bounce',
    titleKey: 'ANIMATION.EXAMPLES.STACK_BOUNCE_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.STACK_BOUNCE_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-stack-bounce/AnimationStackBounce.vue'),
    html: `<div class="stack-bounce">
  <span></span><span></span><span></span>
</div>`,
    css: `.stack-bounce { display:grid; gap:8px; width:120px; }
.stack-bounce span{
  height:10px; border-radius:8px;
  background: linear-gradient(135deg,#5b8def,#9a6bff);
  box-shadow:0 6px 18px rgba(91,141,239,.2);
  animation: stack-bounce 1s ease-in-out infinite;
}
.stack-bounce span:nth-child(2){animation-delay:.12s;}
.stack-bounce span:nth-child(3){animation-delay:.24s;}
@keyframes stack-bounce{0%,100%{transform:translateY(0);opacity:.85;}50%{transform:translateY(-8px);opacity:1;}}`
  },
  {
    id: 'clock-loader',
    titleKey: 'ANIMATION.EXAMPLES.CLOCK_LOADER_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.CLOCK_LOADER_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-clock-loader/AnimationClockLoader.vue'),
    html: `<div class="clock-loader">
  <span class="clock-loader__hand clock-loader__hand_hour"></span>
  <span class="clock-loader__hand clock-loader__hand_minute"></span>
</div>`,
    css: `.clock-loader{
  position:relative; width:90px; height:90px; border-radius:50%;
  border:3px solid rgba(91,141,239,0.35);
  box-shadow: inset 0 0 0 1px rgba(91,141,239,0.2), 0 10px 24px rgba(91,141,239,0.18);
  display:grid; place-items:center;
}
.clock-loader__hand{
  position:absolute; width:3px; border-radius:999px;
  background: linear-gradient(180deg,#5b8def,#9a6bff);
  transform-origin: bottom center; bottom:50%; left:50%;
}
.clock-loader__hand_hour{height:28px; animation: clock-hour 6s linear infinite;}
.clock-loader__hand_minute{height:38px; animation: clock-minute 2s linear infinite;}
@keyframes clock-hour{to{transform:rotate(360deg);}}
@keyframes clock-minute{to{transform:rotate(720deg);}}`
  },
  {
    id: 'pulse-grid',
    titleKey: 'ANIMATION.EXAMPLES.PULSE_GRID_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.PULSE_GRID_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-pulse-grid/AnimationPulseGrid.vue'),
    html: `<div class="pulse-grid">
  <span></span><span></span><span></span>
  <span></span><span></span><span></span>
  <span></span><span></span><span></span>
</div>`,
    css: `.pulse-grid{width:96px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.pulse-grid span{
  aspect-ratio:1;border-radius:8px;
  background:linear-gradient(135deg,#5b8def,#9a6bff);
  box-shadow:0 8px 18px rgba(91,141,239,.18);
  animation:pulse-grid 1.2s ease-in-out infinite;
}
.pulse-grid span:nth-child(2),.pulse-grid span:nth-child(4){animation-delay:.1s;}
.pulse-grid span:nth-child(3),.pulse-grid span:nth-child(5),.pulse-grid span:nth-child(7){animation-delay:.2s;}
.pulse-grid span:nth-child(6),.pulse-grid span:nth-child(8){animation-delay:.3s;}
.pulse-grid span:nth-child(9){animation-delay:.4s;}
@keyframes pulse-grid{0%,100%{transform:scale(.85);opacity:.8;}50%{transform:scale(1.08);opacity:1;}}`
  },
  {
    id: 'wave-orb',
    titleKey: 'ANIMATION.EXAMPLES.WAVE_ORB_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.WAVE_ORB_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-wave-orb/AnimationWaveOrb.vue'),
    html: `<div class="wave-orb">
  <span class="wave-orb__ring"></span>
  <span class="wave-orb__core"></span>
</div>`,
    css: `.wave-orb{position:relative;width:110px;height:110px;display:grid;place-items:center;}
.wave-orb__ring{
  position:absolute;width:100%;height:100%;border-radius:50%;
  border:2px solid rgba(91,141,239,0.25);animation:wave-orb 2.4s ease-out infinite;
}
.wave-orb__core{
  width:32px;height:32px;border-radius:50%;
  background:radial-gradient(circle at 30% 30%,#5b8def,#9a6bff);
  box-shadow:0 0 20px rgba(91,141,239,.25),0 0 0 6px rgba(91,141,239,.12);
  animation:wave-core 1.6s ease-in-out infinite;
}
@keyframes wave-orb{0%{transform:scale(.65);opacity:.7;}70%{transform:scale(1.2);opacity:0;}100%{opacity:0;}}
@keyframes wave-core{0%,100%{transform:scale(1);}50%{transform:scale(1.12);}}`
  },
  {
    id: 'dot-typing-loader',
    titleKey: 'ANIMATION.EXAMPLES.DOT_TYPING_LOADER_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.DOT_TYPING_LOADER_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-dot-typing/AnimationDotTyping.vue'),
    html: `<div class="dot-typing-loader">
  <span></span><span></span><span></span>
</div>`,
    css: `.dot-typing-loader{display:flex;gap:8px;align-items:center;}
.dot-typing-loader span{
  width:10px;height:10px;border-radius:50%;
  background:#5b8def;box-shadow:0 6px 12px rgba(91,141,239,.22);
  animation:dot-typing 1s ease-in-out infinite;
}
.dot-typing-loader span:nth-child(2){animation-delay:.12s;}
.dot-typing-loader span:nth-child(3){animation-delay:.24s;}
@keyframes dot-typing{0%,100%{transform:translateY(0);opacity:.7;}50%{transform:translateY(-8px);opacity:1;}}`
  },
  {
    id: 'beat-grid',
    titleKey: 'ANIMATION.EXAMPLES.BEAT_GRID_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.BEAT_GRID_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-beat-grid/AnimationBeatGrid.vue'),
    html: `<div class="beat-grid">
  <span></span><span></span><span></span><span></span>
  <span></span><span></span><span></span><span></span>
  <span></span><span></span><span></span><span></span>
</div>`,
    css: `.beat-grid{width:120px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}
.beat-grid span{
  aspect-ratio:1;border-radius:6px;
  background:linear-gradient(180deg,#5b8def,#9a6bff);
  animation:beat-grid 1s ease-in-out infinite;
}
.beat-grid span:nth-child(3n){animation-delay:.08s;}
.beat-grid span:nth-child(4n){animation-delay:.16s;}
.beat-grid span:nth-child(2n){animation-delay:.24s;}
@keyframes beat-grid{0%,100%{transform:scale(.85);opacity:.8;}50%{transform:scale(1.15);opacity:1;}}`
  },
  {
    id: 'ticker',
    titleKey: 'ANIMATION.EXAMPLES.TICKER_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.TICKER_DESCRIPTION',
    category: 'marquee',
    component: () => import('../ui/animation-ticker/AnimationTicker.vue'),
    html: `<div class="marquee">
  <div class="marquee__track">
    <div class="marquee__lane">
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
    </div>
    <div class="marquee__lane" aria-hidden="true">
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
    </div>
  </div>
</div>`,
    css: `.marquee {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  background: linear-gradient(120deg, #0f172a, #0b253f);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.marquee::after,
.marquee::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.marquee::before {
  background: linear-gradient(90deg, #0f172a 0%, transparent 14%, transparent 86%, #0f172a 100%);
}

.marquee::after {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: inherit;
  inset: 6px;
}

.marquee__lane {
  display: flex;
  gap: 32px;
  padding: 16px 22px;
  font-size: 14px;
  color: #e2e8f0;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  width: max-content;
  flex-shrink: 0;
}

.marquee__lane span {
  white-space: nowrap;
  color: rgba(226, 232, 240, 0.86);
}

.marquee__track {
  display: flex;
  width: max-content;
  animation: scroll 28s linear infinite;
  will-change: transform;
}

@keyframes scroll {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}`
  },
  {
    id: 'orbits',
    titleKey: 'ANIMATION.EXAMPLES.ORBITS_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.ORBITS_DESCRIPTION',
    category: 'orbital',
    component: () => import('../ui/animation-orbits/AnimationOrbits.vue'),
    html: `<div class="orbits">
  <div class="orbits__planet">
    <span class="orbits__core"></span>
    <span class="orbits__ring orbits__ring_primary"></span>
    <span class="orbits__ring orbits__ring_secondary"></span>
  </div>
</div>`,
    css: `.orbits {
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 30% 30%, #13213a, #0c1221 68%);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.orbits__planet { position: relative; width: 200px; height: 200px; }
.orbits__core { position: absolute; inset: 50%; width: 22px; height: 22px; margin: -11px; border-radius: 50%; background: linear-gradient(140deg, #66f6ff, #7c6dff); box-shadow: 0 0 22px rgba(108, 226, 255, 0.6); }
.orbits__ring { position: absolute; inset: 10%; border-radius: 50%; border: 2px dashed rgba(255, 255, 255, 0.14); animation: spinRing 12s linear infinite; }
.orbits__ring_primary { inset: 12%; border-color: rgba(120, 119, 255, 0.6); }
.orbits__ring_secondary { inset: 24%; border-color: rgba(102, 246, 255, 0.5); animation-duration: 8s; animation-direction: reverse; }
.orbits__ring::after { content: ''; position: absolute; top: -6px; left: 50%; width: 12px; height: 12px; margin-left: -6px; border-radius: 50%; background: linear-gradient(145deg, #fbc2ff, #7c6dff); box-shadow: 0 0 14px rgba(124, 109, 255, 0.65); }
@keyframes spinRing { to { transform: rotate(360deg); } }`
  },
  {
    id: 'pulse-lines',
    titleKey: 'ANIMATION.EXAMPLES.PULSE_LINES_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.PULSE_LINES_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-pulse-lines/AnimationPulseLines.vue'),
    html: `<div class="pulse-lines">
  <span class="pulse-lines__line"></span>
  <span class="pulse-lines__line"></span>
  <span class="pulse-lines__line"></span>
  <span class="pulse-lines__line"></span>
</div>`,
    css: `.pulse-lines { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; padding: 18px; background: linear-gradient(120deg, #0b2035, #0f172a); border-radius: 14px; border: 1px solid rgba(255, 255, 255, 0.08); }
.pulse-lines__line { width: 100%; height: 68px; border-radius: 10px; background: linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.04)); box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1); animation: rise 1.2s ease-in-out infinite; }
.pulse-lines__line:nth-child(2) { animation-delay: 0.08s; }
.pulse-lines__line:nth-child(3) { animation-delay: 0.16s; }
.pulse-lines__line:nth-child(4) { animation-delay: 0.24s; }
@keyframes rise { 0% { transform: translateY(6px) scaleY(0.9); opacity: 0.8; } 50% { transform: translateY(-10px) scaleY(1.05); opacity: 1; } 100% { transform: translateY(6px) scaleY(0.9); opacity: 0.8; } }`
  },
  {
    id: 'star-trail',
    titleKey: 'ANIMATION.EXAMPLES.STAR_TRAIL_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.STAR_TRAIL_DESCRIPTION',
    category: 'effects',
    component: () => import('../ui/animation-star-trail/AnimationStarTrail.vue'),
    html: `<div class="star-trail">
  <div class="star-trail__dot"></div>
  <div class="star-trail__glow"></div>
  <div class="star-trail__tail"></div>
</div>`,
    css: `.star-trail { position: relative; height: 180px; background: radial-gradient(circle at 20% 30%, #1e3a8a, #0b1021 70%); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.08); overflow: hidden; }
.star-trail__dot { position: absolute; width: 14px; height: 14px; border-radius: 50%; background: #fbbf24; top: 50%; left: -10%; animation: shoot 2.4s ease-in-out infinite; box-shadow: 0 0 18px rgba(251, 191, 36, 0.8); }
.star-trail__glow { position: absolute; top: 50%; left: -10%; width: 60px; height: 60px; margin: -30px 0 0 -30px; border-radius: 50%; background: radial-gradient(circle, rgba(251, 191, 36, 0.28), transparent 70%); animation: fadeGlow 2.4s ease-in-out infinite; }
.star-trail__tail { position: absolute; top: 50%; left: -10%; width: 280px; height: 4px; margin-top: -2px; background: linear-gradient(90deg, rgba(251, 191, 36, 0.65), transparent 70%); animation: stretch 2.4s ease-in-out infinite; }
@keyframes shoot { 0% { transform: translateX(0) translateY(0) scale(0.9); opacity: 0; } 10% { opacity: 1; } 50% { transform: translateX(320px) translateY(-12px) scale(1.1); opacity: 1; } 100% { transform: translateX(520px) translateY(-18px) scale(0.9); opacity: 0; } }
@keyframes fadeGlow { 0% { transform: translateX(0); opacity: 0; } 10% { opacity: 0.9; } 60% { transform: translateX(320px); opacity: 0.5; } 100% { transform: translateX(520px); opacity: 0; } }
@keyframes stretch { 0% { transform: translateX(0) scaleX(0.4); opacity: 0; } 15% { opacity: 0.9; } 50% { transform: translateX(240px) scaleX(1); opacity: 1; } 100% { transform: translateX(440px) scaleX(0.4); opacity: 0; } }`
  },
  {
    id: 'bounce-dots',
    titleKey: 'ANIMATION.EXAMPLES.BOUNCE_DOTS_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.BOUNCE_DOTS_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-bounce-dots/AnimationBounceDots.vue'),
    html: `<div class="bounce-dots">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>`,
    css: `.bounce-dots {
  display: inline-flex;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.92), rgba(59, 130, 246, 0.12));
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.bounce-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3b82f6;
  animation: dotBounce 1s ease-in-out infinite;
}

.bounce-dots span:nth-child(2) {
  animation-delay: 0.1s;
}

.bounce-dots span:nth-child(3) {
  animation-delay: 0.2s;
}

.bounce-dots span:nth-child(4) {
  animation-delay: 0.3s;
}

@keyframes dotBounce {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  50% {
    transform: translateY(-10px);
    opacity: 1;
  }
}`
  },
  {
    id: 'pulse-ring',
    titleKey: 'ANIMATION.EXAMPLES.PULSE_RING_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.PULSE_RING_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-pulse-ring/AnimationPulseRing.vue'),
    html: `<div class="pulse-ring">
  <div class="pulse-ring__dot"></div>
  <div class="pulse-ring__wave"></div>
</div>`,
    css: `.pulse-ring {
  position: relative;
  display: grid;
  place-items: center;
  width: 160px;
  height: 160px;
  border-radius: 24px;
  background: radial-gradient(circle at 40% 40%, rgba(147, 197, 253, 0.24), #0b1120);
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.pulse-ring__dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #a855f7;
  box-shadow: 0 0 18px rgba(168, 85, 247, 0.7);
}

.pulse-ring__wave {
  position: absolute;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid rgba(168, 85, 247, 0.5);
  animation: pulseWave 1.6s ease-out infinite;
}

@keyframes pulseWave {
  0% {
    transform: scale(0.5);
    opacity: 0.8;
  }
  80% {
    transform: scale(1.6);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}`
  },
  {
    id: 'loader-bars',
    titleKey: 'ANIMATION.EXAMPLES.LOADER_BARS_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.LOADER_BARS_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-loader-bars/AnimationLoaderBars.vue'),
    html: `<div class="loader-bars">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>`,
    css: `.loader-bars {
  display: grid;
  grid-auto-flow: column;
  gap: 6px;
  padding: 14px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.98));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.loader-bars span {
  width: 8px;
  height: 36px;
  border-radius: 6px;
  background: linear-gradient(180deg, #3b82f6, #8b5cf6);
  animation: bars 1s ease-in-out infinite;
}

.loader-bars span:nth-child(2) {
  animation-delay: 0.08s;
}

.loader-bars span:nth-child(3) {
  animation-delay: 0.16s;
}

.loader-bars span:nth-child(4) {
  animation-delay: 0.24s;
}

.loader-bars span:nth-child(5) {
  animation-delay: 0.32s;
}

@keyframes bars {
  0%, 100% {
    transform: scaleY(0.5);
    opacity: 0.6;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}`
  },
  {
    id: 'rotate-square',
    titleKey: 'ANIMATION.EXAMPLES.ROTATE_SQUARE_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.ROTATE_SQUARE_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-rotate-square/AnimationRotateSquare.vue'),
    html: `<div class="rotate-square">
  <div class="rotate-square__shape"></div>
</div>`,
    css: `.rotate-square {
  display: grid;
  place-items: center;
  width: 180px;
  height: 180px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.rotate-square__shape {
  width: 80px;
  height: 80px;
  background: linear-gradient(145deg, #3b82f6, #8b5cf6);
  border-radius: 12px;
  animation: rotateShape 2.4s linear infinite;
  box-shadow: 0 10px 24px rgba(59, 130, 246, 0.3);
}

@keyframes rotateShape {
  0% {
    transform: rotate(0) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(1.06);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}`
  },
  {
    id: 'flip-card',
    titleKey: 'ANIMATION.EXAMPLES.FLIP_CARD_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.FLIP_CARD_DESCRIPTION',
    category: 'effects',
    component: () => import('../ui/animation-flip-card/AnimationFlipCard.vue'),
    html: `<div class="flip-card">
  <div class="flip-card__inner">
    <div class="flip-card__face flip-card__face_front">CSS</div>
    <div class="flip-card__face flip-card__face_back">Motion</div>
  </div>
</div>`,
    css: `.flip-card {
  perspective: 800px;
  width: 180px;
  height: 120px;
}

.flip-card__inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  animation: flipCard 2.4s ease-in-out infinite;
}

.flip-card__face {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(59, 130, 246, 0.16), rgba(139, 92, 246, 0.16));
  border: 1px solid rgba(255, 255, 255, 0.2);
  backface-visibility: hidden;
  font-weight: 700;
  color: #e2e8f0;
}

.flip-card__face_back {
  transform: rotateY(180deg);
  background: linear-gradient(145deg, rgba(139, 92, 246, 0.18), rgba(59, 130, 246, 0.14));
}

@keyframes flipCard {
  0%, 100% {
    transform: rotateY(0);
  }
  50% {
    transform: rotateY(180deg);
  }
}`
  },
  {
    id: 'glow-orbit',
    titleKey: 'ANIMATION.EXAMPLES.GLOW_ORBIT_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.GLOW_ORBIT_DESCRIPTION',
    category: 'orbital',
    component: () => import('../ui/animation-glow-orbit/AnimationGlowOrbit.vue'),
    html: `<div class="glow-orbit">
  <div class="glow-orbit__core"></div>
  <div class="glow-orbit__ring glow-orbit__ring_primary"></div>
  <div class="glow-orbit__ring glow-orbit__ring_secondary"></div>
</div>`,
    css: `.glow-orbit {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(236, 72, 153, 0.25), #0b1120);
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.glow-orbit__core {
  position: absolute;
  inset: 50%;
  width: 26px;
  height: 26px;
  margin: -13px;
  border-radius: 50%;
  background: #ec4899;
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.7);
}

.glow-orbit__ring {
  position: absolute;
  inset: 14%;
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.4);
  animation: orbSpin 12s linear infinite;
}

.glow-orbit__ring_primary {
  border-color: rgba(59, 130, 246, 0.7);
}

.glow-orbit__ring_secondary {
  inset: 28%;
  border-color: rgba(139, 92, 246, 0.65);
  animation-direction: reverse;
  animation-duration: 9s;
}

@keyframes orbSpin {
  to {
    transform: rotate(360deg);
  }
}`
  },
  {
    id: 'typing',
    titleKey: 'ANIMATION.EXAMPLES.TYPING_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.TYPING_DESCRIPTION',
    category: 'effects',
    component: () => import('../ui/animation-typing/AnimationTyping.vue'),
    html: `<div class="typing">
  <div class="typing__text"><span>typing...</span></div>
  <div class="typing__cursor"></div>
</div>`,
    css: `.typing {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.typing__text span {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  border-right: 2px solid transparent;
  animation: typing 2.4s steps(12) infinite alternate;
}

.typing__cursor {
  width: 10px;
  height: 18px;
  background: #3b82f6;
  border-radius: 2px;
  animation: blink 1s steps(1) infinite;
}

@keyframes typing {
  0% {
    width: 0;
  }
  100% {
    width: 78px;
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  50.01%, 100% {
    opacity: 0;
  }
}`
  },
  {
    id: 'radar',
    titleKey: 'ANIMATION.EXAMPLES.RADAR_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.RADAR_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-radar/AnimationRadar.vue'),
    html: `<div class="radar">
  <div class="radar__circle radar__circle_outer"></div>
  <div class="radar__circle radar__circle_inner"></div>
  <div class="radar__beam"></div>
</div>`,
    css: `.radar {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.14), #0b1120);
  border: 1px solid rgba(255, 255, 255, 0.22);
  overflow: hidden;
}

.radar__circle {
  position: absolute;
  inset: 14%;
  border-radius: 50%;
  border: 1px solid rgba(59, 130, 246, 0.35);
}

.radar__circle_inner {
  inset: 30%;
}

.radar__beam {
  position: absolute;
  inset: -10%;
  background: conic-gradient(from 90deg, rgba(59, 130, 246, 0.24), transparent 60%);
  animation: radarSpin 3s linear infinite;
}

@keyframes radarSpin {
  to {
    transform: rotate(360deg);
  }
}`
  },
  {
    id: 'wave-lines',
    titleKey: 'ANIMATION.EXAMPLES.WAVE_LINES_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.WAVE_LINES_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-wave-lines/AnimationWaveLines.vue'),
    html: `<div class="wave-lines">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>`,
    css: `.wave-lines {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 12px;
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.12), rgba(59, 130, 246, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.wave-lines span {
  width: 26px;
  height: 6px;
  border-radius: 999px;
  background: #8b5cf6;
  animation: waveSlide 1.4s ease-in-out infinite;
}

.wave-lines span:nth-child(2) {
  animation-delay: 0.1s;
}

.wave-lines span:nth-child(3) {
  animation-delay: 0.2s;
}

.wave-lines span:nth-child(4) {
  animation-delay: 0.3s;
}

.wave-lines span:nth-child(5) {
  animation-delay: 0.4s;
}

@keyframes waveSlide {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-8px);
    opacity: 1;
  }
}`
  },
  {
    id: 'color-shift',
    titleKey: 'ANIMATION.EXAMPLES.COLOR_SHIFT_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.COLOR_SHIFT_DESCRIPTION',
    category: 'effects',
    component: () => import('../ui/animation-color-shift/AnimationColorShift.vue'),
    html: `<div class="color-shift">
  <div class="color-shift__blob"></div>
</div>`,
    css: `.color-shift {
  position: relative;
  width: 200px;
  height: 140px;
  border-radius: 18px;
  background: #0b1120;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.color-shift__blob {
  position: absolute;
  inset: -20% auto auto -20%;
  width: 80%;
  height: 140%;
  background: conic-gradient(from 90deg, #3b82f6, #8b5cf6, #22d3ee, #3b82f6);
  animation: hueSpin 6s linear infinite;
  opacity: 0.7;
}

@keyframes hueSpin {
  to {
    transform: rotate(360deg);
  }
}`
  },
  {
    id: 'scale-fade',
    titleKey: 'ANIMATION.EXAMPLES.SCALE_FADE_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.SCALE_FADE_DESCRIPTION',
    category: 'transitions',
    component: () => import('../ui/animation-scale-fade/AnimationScaleFade.vue'),
    html: `<div class="scale-fade">
  <div class="scale-fade__item"></div>
</div>`,
    css: `.scale-fade {
  display: grid;
  place-items: center;
  width: 160px;
  height: 160px;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.94), rgba(59, 130, 246, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.scale-fade__item {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(145deg, #3b82f6, #8b5cf6);
  animation: scaleFade 1.8s ease-in-out infinite;
}

@keyframes scaleFade {
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(0.85);
    opacity: 0.7;
  }
}`
  },
  {
    id: 'shimmer-card',
    titleKey: 'ANIMATION.EXAMPLES.SHIMMER_CARD_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.SHIMMER_CARD_DESCRIPTION',
    category: 'effects',
    component: () => import('../ui/animation-shimmer-card/AnimationShimmerCard.vue'),
    html: `<div class="shimmer-card">
  <div class="shimmer-card__shine"></div>
  <div class="shimmer-card__content"></div>
</div>`,
    css: `.shimmer-card {
  position: relative;
  width: 220px;
  height: 120px;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.94), rgba(15, 23, 42, 0.98));
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.shimmer-card__shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.25) 40%, transparent 70%);
  transform: translateX(-120%);
  animation: shimmer 1.6s ease-in-out infinite;
}

.shimmer-card__content {
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, rgba(59, 130, 246, 0.12), rgba(15, 23, 42, 0.96));
}

@keyframes shimmer {
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(120%);
  }
}`
  },
  {
    id: 'slide-badge',
    titleKey: 'ANIMATION.EXAMPLES.SLIDE_BADGE_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.SLIDE_BADGE_DESCRIPTION',
    category: 'effects',
    component: () => import('../ui/animation-slide-badge/AnimationSlideBadge.vue'),
    html: `<div class="slide-badge">
  <span class="slide-badge__pill">
    <span class="slide-badge__dot"></span>Live
  </span>
</div>`,
    css: `.slide-badge {
  display: flex;
  justify-content: center;
  align-items: center;
}

.slide-badge__pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: linear-gradient(145deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.18));
  border-radius: 999px;
  color: #e2e8f0;
  font-weight: 600;
  overflow: hidden;
}

.slide-badge__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22d3ee;
  animation: slidePulse 1.2s ease-in-out infinite;
}

@keyframes slidePulse {
  0% {
    transform: translateX(-4px) scale(0.9);
    box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4);
  }
  50% {
    transform: translateX(6px) scale(1.05);
    box-shadow: 0 0 0 6px rgba(34, 211, 238, 0.2);
  }
  100% {
    transform: translateX(-4px) scale(0.92);
    box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4);
  }
}`
  },
  {
    id: 'ripple',
    titleKey: 'ANIMATION.EXAMPLES.RIPPLE_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.RIPPLE_DESCRIPTION',
    category: 'effects',
    component: () => import('../ui/animation-ripple/AnimationRipple.vue'),
    html: `<div class="ripple">
  <div class="ripple__circle ripple__circle_base"></div>
  <div class="ripple__circle ripple__circle_wave"></div>
</div>`,
    css: `.ripple {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.96), rgba(59, 130, 246, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.ripple__circle {
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.5);
}

.ripple__circle_base {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  box-shadow: 0 0 18px rgba(59, 130, 246, 0.6);
}

.ripple__circle_wave {
  position: absolute;
  width: 40px;
  height: 40px;
  animation: rippleWave 1.6s ease-out infinite;
}

@keyframes rippleWave {
  0% {
    transform: scale(0.6);
    opacity: 0.6;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}`
  },
  {
    id: 'meteor',
    titleKey: 'ANIMATION.EXAMPLES.METEOR_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.METEOR_DESCRIPTION',
    category: 'effects',
    component: () => import('../ui/animation-meteor/AnimationMeteor.vue'),
    html: `<div class="meteor">
  <span class="meteor__trail"></span>
  <span class="meteor__head"></span>
</div>`,
    css: `.meteor {
  position: relative;
  width: 220px;
  height: 140px;
  border-radius: 16px;
  background: radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.3), #0b1120);
  border: 1px solid rgba(255, 255, 255, 0.22);
  overflow: hidden;
}

.meteor__trail,
.meteor__head {
  position: absolute;
  top: 40%;
  left: -20%;
  animation: meteorFly 2s ease-in-out infinite;
}

.meteor__trail {
  width: 200px;
  height: 4px;
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.7), transparent 70%);
}

.meteor__head {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #fbbf24;
  box-shadow: 0 0 18px rgba(251, 191, 36, 0.8);
}

@keyframes meteorFly {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  60% {
    transform: translateX(240px) translateY(-20px);
    opacity: 1;
  }
  100% {
    transform: translateX(320px) translateY(-40px);
    opacity: 0;
  }
}`
  },
  {
    id: 'morph-blob',
    titleKey: 'ANIMATION.EXAMPLES.MORPH_BLOB_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.MORPH_BLOB_DESCRIPTION',
    category: 'effects',
    component: () => import('../ui/animation-morph-blob/AnimationMorphBlob.vue'),
    html: `<div class="morph-blob">
  <div class="morph-blob__shape"></div>
</div>`,
    css: `.morph-blob {
  display: grid;
  place-items: center;
  width: 200px;
  height: 160px;
  border-radius: 18px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.96), rgba(139, 92, 246, 0.12));
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.morph-blob__shape {
  width: 90px;
  height: 90px;
  background: linear-gradient(145deg, #8b5cf6, #3b82f6);
  animation: blobMorph 6s ease-in-out infinite;
  border-radius: 36% 64% 42% 58%;
}

@keyframes blobMorph {
  0%, 100% {
    border-radius: 36% 64% 42% 58%;
    transform: rotate(0deg);
  }
  33% {
    border-radius: 52% 48% 60% 40%;
    transform: rotate(6deg);
  }
  66% {
    border-radius: 44% 56% 38% 62%;
    transform: rotate(-6deg);
  }
}`
  },
  {
    id: 'stagger-list',
    titleKey: 'ANIMATION.EXAMPLES.STAGGER_LIST_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.STAGGER_LIST_DESCRIPTION',
    category: 'transitions',
    component: () => import('../ui/animation-stagger-list/AnimationStaggerList.vue'),
    html: `<ul class="stagger-list">
  <li></li>
  <li></li>
  <li></li>
  <li></li>
  <li></li>
</ul>`,
    css: `.stagger-list {
  list-style: none;
  padding: 14px;
  margin: 0;
  display: grid;
  gap: 10px;
  background: linear-gradient(145deg, rgba(59, 130, 246, 0.1), rgba(15, 23, 42, 0.96));
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
}

.stagger-list li {
  height: 10px;
  border-radius: 999px;
  background: rgba(59, 130, 246, 0.8);
  animation: stagger 1.4s ease-in-out infinite;
}

.stagger-list li:nth-child(2) {
  animation-delay: 0.08s;
}

.stagger-list li:nth-child(3) {
  animation-delay: 0.16s;
}

.stagger-list li:nth-child(4) {
  animation-delay: 0.24s;
}

.stagger-list li:nth-child(5) {
  animation-delay: 0.32s;
}

@keyframes stagger {
  0%, 100% {
    transform: translateX(0);
    opacity: 0.6;
  }
  50% {
    transform: translateX(10px);
    opacity: 1;
  }
}`
  },
  {
    id: 'liquid',
    titleKey: 'ANIMATION.EXAMPLES.LIQUID_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.LIQUID_DESCRIPTION',
    category: 'effects',
    component: () => import('../ui/animation-liquid/AnimationLiquid.vue'),
    html: `<div class="liquid">
  <div class="liquid__wave liquid__wave_one"></div>
  <div class="liquid__wave liquid__wave_two"></div>
  <div class="liquid__wave liquid__wave_three"></div>
</div>`,
    css: `.liquid {
  position: relative;
  width: 220px;
  height: 120px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.14), #0b1120);
  border: 1px solid rgba(255, 255, 255, 0.22);
}

.liquid__wave {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 200%;
  height: 60%;
  background: rgba(59, 130, 246, 0.26);
  opacity: 0.8;
  animation: waveMove 6s linear infinite;
}

.liquid__wave_two {
  height: 70%;
  animation-duration: 7s;
  background: rgba(139, 92, 246, 0.18);
  animation-direction: reverse;
}

.liquid__wave_three {
  height: 50%;
  animation-duration: 5s;
  opacity: 0.4;
}

@keyframes waveMove {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}`
  },
  {
    id: 'spinner-lines',
    titleKey: 'ANIMATION.EXAMPLES.SPINNER_LINES_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.SPINNER_LINES_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-spinner-lines/AnimationSpinnerLines.vue'),
    html: `<div class="spinner-lines">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>`,
    css: `.spinner-lines {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: grid;
  place-items: center;
}

.spinner-lines span {
  position: absolute;
  width: 60%;
  height: 2px;
  background: #3b82f6;
  transform-origin: 100% 50%;
  animation: spinLine 1.2s linear infinite;
}

.spinner-lines span:nth-child(1) {
  transform: rotate(0deg);
  animation-delay: 0s;
}

.spinner-lines span:nth-child(2) {
  transform: rotate(60deg);
  animation-delay: 0.1s;
}

.spinner-lines span:nth-child(3) {
  transform: rotate(120deg);
  animation-delay: 0.2s;
}

.spinner-lines span:nth-child(4) {
  transform: rotate(180deg);
  animation-delay: 0.3s;
}

.spinner-lines span:nth-child(5) {
  transform: rotate(240deg);
  animation-delay: 0.4s;
}

.spinner-lines span:nth-child(6) {
  transform: rotate(300deg);
  animation-delay: 0.5s;
}

@keyframes spinLine {
  0% {
    transform: rotate(0deg) scaleX(0.3);
    opacity: 0.3;
  }
  50% {
    opacity: 1;
    scale: 1;
  }
  100% {
    transform: rotate(0deg) scaleX(0.3);
    opacity: 0.3;
  }
}`
  },
  {
    id: 'gradient-wipe',
    titleKey: 'ANIMATION.EXAMPLES.GRADIENT_WIPE_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.GRADIENT_WIPE_DESCRIPTION',
    category: 'effects',
    component: () => import('../ui/animation-gradient-wipe/AnimationGradientWipe.vue'),
    html: `<div class="gradient-wipe">
  <div class="gradient-wipe__bar"></div>
  <p>Gradient wipe</p>
</div>`,
    css: `.gradient-wipe {
  position: relative;
  width: 220px;
  height: 120px;
  border-radius: 16px;
  background: #0b1120;
  border: 1px solid rgba(255, 255, 255, 0.2);
  overflow: hidden;
  display: grid;
  place-items: center;
  color: #e2e8f0;
  font-weight: 600;
}

.gradient-wipe__bar {
  position: absolute;
  inset: -20% -60%;
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.25), rgba(139, 92, 246, 0.25));
  transform: rotate(12deg);
  animation: wipe 2.8s ease-in-out infinite;
}

@keyframes wipe {
  0% {
    transform: translateX(-40%) rotate(12deg);
    opacity: 0;
  }
  20% {
    opacity: 0.9;
  }
  60% {
    transform: translateX(40%) rotate(12deg);
    opacity: 0.8;
  }
  100% {
    opacity: 0;
    transform: translateX(60%) rotate(12deg);
  }
}`
  },
  {
    id: 'dots-chain',
    titleKey: 'ANIMATION.EXAMPLES.DOTS_CHAIN_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.DOTS_CHAIN_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-dots-chain/AnimationDotsChain.vue'),
    html: `<div class="dots-chain">
  <span></span>
  <span></span>
  <span></span>
  <span></span>
  <span></span>
</div>`,
    css: `.dots-chain {
  display: inline-flex;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.92), rgba(139, 92, 246, 0.12));
  border: 1px solid rgba(255, 255, 255, 0.24);
}

.dots-chain span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(145deg, #8b5cf6, #22d3ee);
  animation: chainPulse 1.4s ease-in-out infinite;
}

.dots-chain span:nth-child(1) {
  animation-delay: 0s;
}

.dots-chain span:nth-child(2) {
  animation-delay: 0.1s;
}

.dots-chain span:nth-child(3) {
  animation-delay: 0.2s;
}

.dots-chain span:nth-child(4) {
  animation-delay: 0.3s;
}

.dots-chain span:nth-child(5) {
  animation-delay: 0.4s;
}

@keyframes chainPulse {
  0%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}`
  },
  {
    id: 'circle-loader',
    titleKey: 'ANIMATION.EXAMPLES.CIRCLE_LOADER_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.CIRCLE_LOADER_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-circle-loader/AnimationCircleLoader.vue'),
    html: `<div class="circle-loader">
  <div class="circle-loader__ring"></div>
</div>`,
    css: `.circle-loader {
  display: grid;
  place-items: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.circle-loader__ring {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top-color: #3b82f6;
  animation: ringRotate 1s linear infinite;
}

@keyframes ringRotate {
  to {
    transform: rotate(360deg);
  }
}`
  },
  {
    id: 'progress-bar',
    titleKey: 'ANIMATION.EXAMPLES.PROGRESS_BAR_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.PROGRESS_BAR_DESCRIPTION',
    category: 'loaders',
    component: () => import('../ui/animation-progress-bar/AnimationProgressBar.vue'),
    html: `<div class="progress-bar">
  <div class="progress-bar__fill"></div>
</div>`,
    css: `.progress-bar {
  width: 200px;
  height: 8px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.1);
}

.progress-bar__fill {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #3b82f6, #22d3ee);
  border-radius: 999px;
  transform-origin: left center;
  animation: progressFill 2s ease-in-out infinite;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
}

@keyframes progressFill {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}`
  },
  {
    id: 'vertical-marquee',
    titleKey: 'ANIMATION.EXAMPLES.VERTICAL_MARQUEE_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.VERTICAL_MARQUEE_DESCRIPTION',
    category: 'marquee',
    component: () => import('../ui/animation-vertical-marquee/AnimationVerticalMarquee.vue'),
    html: `<div class="vertical-marquee">
  <div class="vertical-marquee__lane">
    <span>⭐ New Feature</span>
    <span>🚀 Fast</span>
    <span>🎨 Modern</span>
    <span>💡 Intuitive</span>
    <span>⭐ New Feature</span>
    <span>🚀 Fast</span>
  </div>
</div>`,
    css: `.vertical-marquee {
  position: relative;
  width: 180px;
  height: 200px;
  overflow: hidden;
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(139, 92, 246, 0.12));
  border: 1px solid rgba(255, 255, 255, 0.24);
}

.vertical-marquee::before,
.vertical-marquee::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 40px;
  pointer-events: none;
  z-index: 1;
}

.vertical-marquee::before {
  top: 0;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), transparent);
}

.vertical-marquee::after {
  bottom: 0;
  background: linear-gradient(0deg, rgba(15, 23, 42, 0.92), transparent);
}

.vertical-marquee__lane {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px;
  animation: verticalScroll 10s linear infinite;
}

.vertical-marquee__lane span {
  white-space: nowrap;
  font-size: 14px;
  font-weight: 600;
  color: rgba(226, 232, 240, 0.9);
  padding: 8px;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.5);
  text-align: center;
}

@keyframes verticalScroll {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-50%);
  }
}`
  },
  {
    id: 'text-reveal',
    titleKey: 'ANIMATION.EXAMPLES.TEXT_REVEAL_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.TEXT_REVEAL_DESCRIPTION',
    category: 'effects',
    component: () => import('../ui/animation-text-reveal/AnimationTextReveal.vue'),
    html: `<div class="text-reveal">
  <div class="text-reveal__content">
    <span>CSS Animations</span>
  </div>
</div>`,
    css: `.text-reveal {
  display: inline-flex;
  padding: 18px 32px;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.94), rgba(22, 211, 238, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.24);
  overflow: hidden;
}

.text-reveal__content {
  position: relative;
  overflow: hidden;
}

.text-reveal__content span {
  display: inline-block;
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(90deg, #3b82f6, #22d3ee, #3b82f6);
  background-size: 200% auto;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: textShine 3s linear infinite;
}

@keyframes textShine {
  to {
    background-position: 200% center;
  }
}`
  },
  {
    id: 'news-scroll',
    titleKey: 'ANIMATION.EXAMPLES.NEWS_SCROLL_TITLE',
    descriptionKey: 'ANIMATION.EXAMPLES.NEWS_SCROLL_DESCRIPTION',
    category: 'marquee',
    component: () => import('../ui/animation-news-scroll/AnimationNewsScroll.vue'),
    html: `<div class="news-scroll">
  <span class="news-scroll__label">BREAKING</span>
  <div class="news-scroll__content">
    <span>Latest updates from the world of web development</span>
    <span>Latest updates from the world of web development</span>
  </div>
</div>`,
    css: `.news-scroll {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.24);
  overflow: hidden;
  max-width: 350px;
}

.news-scroll__label {
  flex-shrink: 0;
  padding: 4px 12px;
  border-radius: 8px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.news-scroll__content {
  display: flex;
  gap: 32px;
  animation: newsSlide 12s linear infinite;
}

.news-scroll__content span {
  white-space: nowrap;
  font-size: 14px;
  color: rgba(226, 232, 240, 0.9);
}

@keyframes newsSlide {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}`
  }
]
