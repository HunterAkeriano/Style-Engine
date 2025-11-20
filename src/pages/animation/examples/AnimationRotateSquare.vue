<template>
  <div class="rotate-square">
    <div class="rotate-square__shape"></div>
  </div>
</template>

<style lang="scss" scoped>
.rotate-square {
  display: grid;
  place-items: center;
  width: 180px;
  height: 180px;
  border-radius: $border-radius-xl;
  background: linear-gradient(135deg, color-var-alpha('color-primary', 0.12), color-var-alpha('color-secondary', 0.1));
  border: 1px solid color-var-alpha('panel-border', 0.22);
}

.rotate-square__shape {
  width: 80px;
  height: 80px;
  background: linear-gradient(145deg, $color-primary, $color-secondary);
  border-radius: $border-radius-md;
  animation: rotateShape 2.4s linear infinite;
  box-shadow: 0 10px 24px color-var-alpha('color-primary', 0.3);
}

@keyframes rotateShape {
  0% { transform: rotate(0) scale(1); }
  50% { transform: rotate(180deg) scale(1.06); }
  100% { transform: rotate(360deg) scale(1); }
}
</style>
