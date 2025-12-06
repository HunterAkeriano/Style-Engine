<template>
  <div class="forum container">
    <Breadcrumbs />
    <ForumTopicList />
  </div>
</template>

<script setup lang="ts">
import { Breadcrumbs } from '@/widgets/common'
import ForumTopicList from '@/widgets/forum/topic-list/ForumTopicList.vue'
</script>

<style lang="scss" scoped>
.forum {
  margin-top: 50px;
}
</style>
