<template>
  <div class="morph-blob">
    <div class="morph-blob__shape"></div>
  </div>
</template>

<style lang="scss" scoped>
.morph-blob {
  display: grid;
  place-items: center;
  width: 200px;
  height: 160px;
  border-radius: $border-radius-xl;
  background: linear-gradient(135deg, color-var-alpha('color-bg-primary', 0.96), color-var-alpha('color-secondary', 0.12));
  border: 1px solid color-var-alpha('panel-border', 0.2);
}

.morph-blob__shape {
  width: 90px;
  height: 90px;
  background: linear-gradient(145deg, $color-secondary, $color-primary);
  animation: blobMorph 6s ease-in-out infinite;
  border-radius: 36% 64% 42% 58%;
}

@keyframes blobMorph {
  0%, 100% { border-radius: 36% 64% 42% 58%; transform: rotate(0deg); }
  33% { border-radius: 52% 48% 60% 40%; transform: rotate(6deg); }
  66% { border-radius: 44% 56% 38% 62%; transform: rotate(-6deg); }
}
</style>
