<template>
  <div class="spinner-lines">
    <span></span><span></span><span></span><span></span><span></span><span></span>
  </div>
</template>

<style lang="scss" scoped>
.spinner-lines {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 1px solid color-var-alpha('panel-border', 0.2);
  display: grid;
  place-items: center;
}

.spinner-lines span {
  position: absolute;
  width: 60%;
  height: 2px;
  background: $color-primary;
  transform-origin: 100% 50%;
  animation: spinLine 1.2s linear infinite;
}

@for $i from 1 through 6 {
  .spinner-lines span:nth-child(#{$i}) {
    transform: rotate(#{60deg * ($i - 1)});
    animation-delay: #{0.1s * ($i - 1)};
  }
}

@keyframes spinLine {
  0% { transform: rotate(0deg) scaleX(0.3); opacity: 0.3; }
  50% { opacity: 1; scale: 1; }
  100% { transform: rotate(0deg) scaleX(0.3); opacity: 0.3; }
}
</style>
