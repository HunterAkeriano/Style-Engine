<template>
  <div class="demo-orbits">
    <div class="demo-orbits__core"></div>
    <div class="demo-orbits__ring demo-orbits__ring_primary"></div>
    <div class="demo-orbits__ring demo-orbits__ring_secondary"></div>
  </div>
</template>

<style lang="scss" scoped>
.demo-orbits {
  position: relative;
  width: 220px;
  height: 220px;
  margin: 0 auto;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(var(--color-primary), 0.18), rgba(var(--color-bg-primary), 0.12));
  border: 1px solid color-var-alpha('panel-border', 0.22);
  display: grid;
  place-items: center;
}

.demo-orbits__core {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(145deg, $color-primary, $color-secondary);
  box-shadow: 0 0 22px color-var-alpha('color-primary', 0.5);
}

.demo-orbits__ring {
  position: absolute;
  inset: 14%;
  border-radius: 50%;
  border: 2px dashed color-var-alpha('panel-border', 0.3);
  animation: demoSpin 12s linear infinite;
}

.demo-orbits__ring_primary {
  inset: 18%;
  border-color: color-var-alpha('color-secondary', 0.6);
}

.demo-orbits__ring_secondary {
  inset: 30%;
  border-color: color-var-alpha('color-primary', 0.58);
  animation-duration: 8s;
  animation-direction: reverse;
}

.demo-orbits__ring::after {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(145deg, $color-accent, $color-secondary);
  box-shadow: 0 0 14px color-var-alpha('color-secondary', 0.6);
  transform: translateX(-6px);
}

@keyframes demoSpin {
  to { transform: rotate(360deg); }
}
</style>
