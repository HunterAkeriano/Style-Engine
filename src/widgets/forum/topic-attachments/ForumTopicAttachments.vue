<template>
  <div v-if="attachments.length" class="forum-topic__attachments">
    <h3>{{ title }}</h3>
    <div class="forum-topic__attachment-grid">
      <div
        v-for="(item, index) in attachments"
        :key="`${item.url}-${index}`"
        class="forum-topic__attachment"
      >
        <img v-if="item.type === 'image'" :src="getAttachmentSrc(item)" :alt="item.url" />
        <iframe v-else :src="item.url" title="YouTube" frameborder="0" allowfullscreen />
        <button
          v-if="removable"
          type="button"
          class="forum-topic__remove-attachment"
          @click="emit('remove', index)"
        >
          {{ removeLabel }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ForumAttachment } from '@/shared/api/forum'
import type { ForumAttachmentDraft } from '@/entities/forum'

withDefaults(
  defineProps<{
    attachments: ForumAttachment[] | ForumAttachmentDraft[]
    title: string
    removable?: boolean
    removeLabel?: string
  }>(),
  {
    removable: false,
    removeLabel: 'Remove'
  }
)

const emit = defineEmits<{
  (e: 'remove', index: number): void
}>()

function getAttachmentSrc(item: ForumAttachment | ForumAttachmentDraft) {
  return (item as ForumAttachmentDraft).preview || item.url
}
</script>

<style scoped lang="scss" src="./forum-topic-attachments.scss"></style>
