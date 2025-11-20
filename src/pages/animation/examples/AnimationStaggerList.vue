<template>
  <ul class="stagger-list">
    <li v-for="item in items" :key="item" />
  </ul>
</template>

<script setup lang="ts">
const items = Array.from({ length: 5 }).map((_, i) => i)
</script>

<style lang="scss" scoped>
.stagger-list {
  list-style: none;
  padding: $space-md;
  margin: 0;
  display: grid;
  gap: $space-sm;
  background: linear-gradient(145deg, color-var-alpha('color-primary', 0.1), color-var-alpha('color-bg-primary', 0.96));
  border: 1px solid color-var-alpha('panel-border', 0.2);
  border-radius: $border-radius-lg;
}

.stagger-list li {
  height: 10px;
  border-radius: $border-radius-full;
  background: color-var-alpha('color-primary', 0.8);
  animation: stagger 1.4s ease-in-out infinite;
}

.stagger-list li:nth-child(2) { animation-delay: 0.08s; }
.stagger-list li:nth-child(3) { animation-delay: 0.16s; }
.stagger-list li:nth-child(4) { animation-delay: 0.24s; }
.stagger-list li:nth-child(5) { animation-delay: 0.32s; }

@keyframes stagger {
  0%, 100% { transform: translateX(0); opacity: 0.6; }
  50% { transform: translateX(10px); opacity: 1; }
}
</style>
