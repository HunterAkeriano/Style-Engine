<template>
  <div class="ripple">
    <div class="ripple__circle ripple__circle_base"></div>
    <div class="ripple__circle ripple__circle_wave"></div>
  </div>
</template>

<style lang="scss" scoped>
.ripple {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: $border-radius-xl;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, color-var-alpha('color-bg-primary', 0.96), color-var-alpha('color-primary', 0.08));
  border: 1px solid color-var-alpha('panel-border', 0.2);
}

.ripple__circle {
  border-radius: 50%;
  border: 2px solid color-var-alpha('color-primary', 0.5);
}

.ripple__circle_base {
  width: 40px;
  height: 40px;
  background: $color-primary;
  box-shadow: 0 0 18px color-var-alpha('color-primary', 0.6);
}

.ripple__circle_wave {
  position: absolute;
  width: 40px;
  height: 40px;
  animation: rippleWave 1.6s ease-out infinite;
}

@keyframes rippleWave {
  0% { transform: scale(0.6); opacity: 0.6; }
  100% { transform: scale(2); opacity: 0; }
}
</style>
