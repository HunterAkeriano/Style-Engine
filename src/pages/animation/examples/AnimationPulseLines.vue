<template>
  <div class="demo-pulse-lines">
    <span class="demo-pulse-lines__line"></span>
    <span class="demo-pulse-lines__line"></span>
    <span class="demo-pulse-lines__line"></span>
    <span class="demo-pulse-lines__line"></span>
  </div>
</template>

<style lang="scss" scoped>
.demo-pulse-lines {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-sm;
  padding: $space-md;
  background: linear-gradient(120deg, rgba(var(--color-secondary), 0.14), rgba(var(--color-bg-primary), 0.08));
  border-radius: $border-radius-lg;
  border: 1px solid color-var-alpha('panel-border', 0.22);
}

.demo-pulse-lines__line {
  display: block;
  width: 100%;
  height: 72px;
  border-radius: $border-radius-md;
  background: linear-gradient(180deg, color-var-alpha('color-text-primary', 0.14), color-var-alpha('color-text-primary', 0.04));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  animation: demoRise 1.2s ease-in-out infinite;
}

.demo-pulse-lines__line:nth-child(2) { animation-delay: 0.08s; }
.demo-pulse-lines__line:nth-child(3) { animation-delay: 0.16s; }
.demo-pulse-lines__line:nth-child(4) { animation-delay: 0.24s; }

@keyframes demoRise {
  0% { transform: translateY(6px) scaleY(0.9); opacity: 0.85; }
  50% { transform: translateY(-12px) scaleY(1.05); opacity: 1; }
  100% { transform: translateY(6px) scaleY(0.9); opacity: 0.85; }
}
</style>
