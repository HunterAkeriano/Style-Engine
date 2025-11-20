<template>
  <div class="loader-bars">
    <span></span><span></span><span></span><span></span><span></span>
  </div>
</template>

<style lang="scss" scoped>
.loader-bars {
  display: grid;
  grid-auto-flow: column;
  gap: 6px;
  padding: $space-md;
  background: linear-gradient(180deg, color-var-alpha('color-bg-primary', 0.92), color-var-alpha('color-bg-primary', 0.98));
  border: 1px solid color-var-alpha('panel-border', 0.2);
  border-radius: $border-radius-lg;
}

.loader-bars span {
  width: 8px;
  height: 36px;
  border-radius: $border-radius-sm;
  background: linear-gradient(180deg, $color-primary, $color-secondary);
  animation: bars 1s ease-in-out infinite;
}

.loader-bars span:nth-child(2) { animation-delay: 0.08s; }
.loader-bars span:nth-child(3) { animation-delay: 0.16s; }
.loader-bars span:nth-child(4) { animation-delay: 0.24s; }
.loader-bars span:nth-child(5) { animation-delay: 0.32s; }

@keyframes bars {
  0%, 100% { transform: scaleY(0.5); opacity: 0.6; }
  50% { transform: scaleY(1); opacity: 1; }
}
</style>
