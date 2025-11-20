<template>
  <div class="shimmer-card">
    <div class="shimmer-card__shine"></div>
    <div class="shimmer-card__content"></div>
  </div>
</template>

<style lang="scss" scoped>
.shimmer-card {
  position: relative;
  width: 220px;
  height: 120px;
  border-radius: $border-radius-xl;
  background: linear-gradient(145deg, color-var-alpha('color-bg-primary', 0.94), color-var-alpha('color-bg-primary', 0.98));
  border: 1px solid color-var-alpha('panel-border', 0.2);
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
  background: linear-gradient(145deg, color-var-alpha('color-primary', 0.12), color-var-alpha('color-bg-primary', 0.96));
}

@keyframes shimmer {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
}
</style>
