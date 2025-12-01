<template>
  <div class="container">
    <section class="home-tech">
      <div class="home-tech__story">
        <p class="home-tech__eyebrow">{{ t('HOME.TECH_TAG') }}</p>
        <h2 class="home-tech__title">{{ t('HOME.TECH_TITLE') }}</h2>
        <p class="home-tech__description">{{ t('HOME.TECH_DESCRIPTION') }}</p>
      </div>

      <div class="home-tech__stack">
        <h3 class="home-tech__stack-title">{{ t('HOME.TECH_STACK_TITLE') }}</h3>

        <div class="home-tech__scene" ref="sceneContainerRef">
          <canvas ref="canvasRef" class="home-tech__canvas" aria-label="3D showcase of StyleEngine stack"></canvas>
          <div class="home-tech__scene-glow"></div>
        </div>

        <div class="home-tech__legend" aria-hidden="true">
          <div class="home-tech__chip" v-for="tech in technologies" :key="tech.name">
            <Icon :name="tech.icon" :size="20" />
            <span>{{ tech.name }}</span>
          </div>
        </div>
      </div>

      <div class="home-tech__particles">
        <div class="home-tech__particle" v-for="n in 15" :key="n" :style="{ '--particle-index': n }"></div>
      </div>

      <div class="home-tech__glow home-tech__glow_1"></div>
      <div class="home-tech__glow home-tech__glow_2"></div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Icon } from '@/shared/ui'
import { createTechScene, type TechSceneHandle } from '@/three-js/script'

const { t } = useI18n()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const sceneContainerRef = ref<HTMLElement | null>(null)
let sceneHandle: TechSceneHandle | null = null

onMounted(() => {
  if (!canvasRef.value) {
    return
  }

  sceneHandle = createTechScene(canvasRef.value, {
    container: sceneContainerRef.value
  })
})

onUnmounted(() => {
  sceneHandle?.dispose()
  sceneHandle = null
})

const technologies = [
  {
    name: 'Vue 3',
    description: t('HOME.TECH_VUE_DESC'),
    icon: 'icon-vue'
  },
  {
    name: 'TypeScript',
    description: t('HOME.TECH_TS_DESC'),
    icon: 'icon-typescript'
  },
  {
    name: 'Vite',
    description: t('HOME.TECH_VITE_DESC'),
    icon: 'icon-vite'
  },
  {
    name: 'SCSS',
    description: t('HOME.TECH_SCSS_DESC'),
    icon: 'icon-sass'
  },
  {
    name: 'Node.js',
    description: t('HOME.TECH_NODE_DESC'),
    icon: 'icon-nodejs'
  },
  {
    name: 'PostgreSQL',
    description: t('HOME.TECH_POSTGRES_DESC'),
    icon: 'icon-postgresql'
  }
]
</script>

<style lang="scss" scoped src="./home-tech.scss"></style>
