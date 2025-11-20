<template>
  <div class="radar">
    <div class="radar__circle radar__circle_outer"></div>
    <div class="radar__circle radar__circle_inner"></div>
    <div class="radar__beam"></div>
  </div>
</template>

<style lang="scss" scoped>
.radar {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, color-var-alpha('color-primary', 0.14), color-var-alpha('color-bg-primary', 0.96));
  border: 1px solid color-var-alpha('panel-border', 0.22);
  overflow: hidden;
}

.radar__circle {
  position: absolute;
  inset: 14%;
  border-radius: 50%;
  border: 1px solid color-var-alpha('color-primary', 0.35);
}

.radar__circle_inner { inset: 30%; }

.radar__beam {
  position: absolute;
  inset: -10%;
  background: conic-gradient(from 90deg, color-var-alpha('color-primary', 0.24), transparent 60%);
  animation: radarSpin 3s linear infinite;
}

@keyframes radarSpin {
  to { transform: rotate(360deg); }
}
</style>
