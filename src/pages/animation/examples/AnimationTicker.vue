<template>
  <div class="demo-marquee">
    <div class="demo-marquee__lane">
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
      <span>CSS Motion · Microcopy · Live preview · Copy-ready</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.demo-marquee {
  position: relative;
  overflow: hidden;
  border-radius: $border-radius-lg;
  background: linear-gradient(120deg, rgba(var(--color-primary), 0.14), rgba(var(--color-secondary), 0.08));
  border: 1px solid color-var-alpha('panel-border', 0.2);
}

.demo-marquee::before,
.demo-marquee::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.demo-marquee::before {
  background: linear-gradient(90deg, $color-bg-primary 0%, transparent 14%, transparent 86%, $color-bg-primary 100%);
}

.demo-marquee::after {
  border: 1px solid color-var-alpha('panel-border', 0.24);
  border-radius: inherit;
  inset: 6px;
}

.demo-marquee__lane {
  display: flex;
  gap: 32px;
  padding: $space-md $space-lg;
  font-size: $font-size-sm;
  color: $color-text-primary;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  animation: demoMarqueeSlide 12s linear infinite;
}

.demo-marquee__lane span {
  white-space: nowrap;
  color: color-var-alpha('color-text-secondary', 0.86);
}

@keyframes demoMarqueeSlide {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
</style>
