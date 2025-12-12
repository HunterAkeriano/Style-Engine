<template>
  <div class="forum">
    <div class="forum__background">
      <span class="forum__beam forum__beam_left"></span>
      <span class="forum__beam forum__beam_right"></span>
      <span class="forum__grid-lines"></span>
    </div>
    <div class="forum__container container">
      <Breadcrumbs />
      <ForumTopicList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Breadcrumbs } from "@/widgets/common";
import ForumTopicList from "@/widgets/forum/topic-list/ForumTopicList.vue";
</script>

<style lang="scss" scoped>
@import "@/app/styles/variables";

.forum {
  position: relative;
  min-height: 100vh;
  padding: $space-2xl 0;
  isolation: isolate;
  overflow: hidden;

  @media (min-width: $breakpoint-md) {
    padding: $space-3xl 0;
    padding-top: 120px;
  }
}

.forum__background {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.forum__beam {
  position: absolute;
  width: 800px;
  height: 800px;
  border-radius: 50%;
  opacity: 0.2;

  &_left {
    top: -300px;
    left: -300px;
    background: radial-gradient(
      circle,
      color-var-alpha("color-primary", 0.5),
      transparent 70%
    );
  }

  &_right {
    bottom: -300px;
    right: -300px;
    background: radial-gradient(
      circle,
      color-var-alpha("color-secondary", 0.5),
      transparent 70%
    );
  }
}

.forum__grid-lines {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(1400px, 95vw);
  height: 100%;
  border-radius: $border-radius-3xl;
  background-image:
    linear-gradient(
      90deg,
      color-var-alpha("panel-border", 0.08) 1px,
      transparent 1px
    ),
    linear-gradient(
      0deg,
      color-var-alpha("panel-border", 0.08) 1px,
      transparent 1px
    );
  background-size: 80px 80px;
  mask-image: radial-gradient(
    ellipse 100% 100% at 50% 50%,
    black 15%,
    transparent 80%
  );
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
}

.forum__container {
  position: relative;
  z-index: 1;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: $space-xl;
}
</style>
