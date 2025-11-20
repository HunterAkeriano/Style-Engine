<template>
  <div class="pulse-ring">
    <div class="pulse-ring__dot"></div>
    <div class="pulse-ring__wave"></div>
  </div>
</template>

<style lang="scss" scoped>
.pulse-ring {
  position: relative;
  display: grid;
  place-items: center;
  width: 160px;
  height: 160px;
  border-radius: 24px;
  background: radial-gradient(circle at 40% 40%, color-var-alpha('color-secondary', 0.24), color-var-alpha('color-bg-primary', 0.96));
  border: 1px solid color-var-alpha('panel-border', 0.22);
}

.pulse-ring__dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: $color-secondary;
  box-shadow: 0 0 18px color-var-alpha('color-secondary', 0.7);
}

.pulse-ring__wave {
  position: absolute;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 2px solid color-var-alpha('color-secondary', 0.5);
  animation: pulseWave 1.6s ease-out infinite;
}

@keyframes pulseWave {
  0% { transform: scale(0.5); opacity: 0.8; }
  80% { transform: scale(1.6); opacity: 0; }
  100% { opacity: 0; }
}
</style>
