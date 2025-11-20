<template>
  <div class="wave-lines">
    <span></span><span></span><span></span><span></span><span></span>
  </div>
</template>

<style lang="scss" scoped>
.wave-lines {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: $space-sm $space-md;
  border-radius: $border-radius-lg;
  background: linear-gradient(90deg, color-var-alpha('color-secondary', 0.12), color-var-alpha('color-primary', 0.08));
  border: 1px solid color-var-alpha('panel-border', 0.2);
}

.wave-lines span {
  width: 26px;
  height: 6px;
  border-radius: $border-radius-full;
  background: $color-secondary;
  animation: waveSlide 1.4s ease-in-out infinite;
}

.wave-lines span:nth-child(2) { animation-delay: 0.1s; }
.wave-lines span:nth-child(3) { animation-delay: 0.2s; }
.wave-lines span:nth-child(4) { animation-delay: 0.3s; }
.wave-lines span:nth-child(5) { animation-delay: 0.4s; }

@keyframes waveSlide {
  0%, 100% { transform: translateY(0); opacity: 0.6; }
  50% { transform: translateY(-8px); opacity: 1; }
}
</style>
