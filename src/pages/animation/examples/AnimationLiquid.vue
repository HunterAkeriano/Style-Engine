<template>
  <div class="liquid">
    <div class="liquid__wave liquid__wave_one"></div>
    <div class="liquid__wave liquid__wave_two"></div>
    <div class="liquid__wave liquid__wave_three"></div>
  </div>
</template>

<style lang="scss" scoped>
.liquid {
  position: relative;
  width: 220px;
  height: 120px;
  border-radius: $border-radius-xl;
  overflow: hidden;
  background: linear-gradient(180deg, color-var-alpha('color-primary', 0.14), color-var-alpha('color-bg-primary', 0.98));
  border: 1px solid color-var-alpha('panel-border', 0.22);
}

.liquid__wave {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 200%;
  height: 60%;
  background: color-var-alpha('color-primary', 0.26);
  opacity: 0.8;
  animation: waveMove 6s linear infinite;
}

.liquid__wave_two {
  height: 70%;
  animation-duration: 7s;
  background: color-var-alpha('color-secondary', 0.18);
  animation-direction: reverse;
}

.liquid__wave_three {
  height: 50%;
  animation-duration: 5s;
  opacity: 0.4;
}

@keyframes waveMove {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
