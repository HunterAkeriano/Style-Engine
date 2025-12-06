<template>
  <Card variant="bordered" class="forum-topic__card">
    <div class="forum-topic__messages-header">
      <h3>{{ title }}</h3>
    </div>

    <div v-if="loading" class="forum-topic__empty">{{ loadingText }}</div>

    <div v-else-if="!messages.length" class="forum-topic__empty">
      {{ emptyText }}
    </div>

    <div v-else class="forum-topic__messages">
      <div v-for="node in messages" :key="node.id" class="forum-topic__message">
        <MessageBlock
          :node="node"
          :depth="0"
          :can-reply="canReply"
          :format-date="formatDate"
          :current-user-id="currentUserId"
          :topic-status="topicStatus"
          :is-admin="isAdmin"
          @reply="(m) => emit('reply', m)"
          @edit="(payload) => emit('edit', payload)"
        />
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import type { ForumMessage, ForumStatus } from '@/shared/api/forum'
import MessageBlock from '@/widgets/forum/message-thread/MessageBlock.vue'
import { Card } from '@/shared/ui'

export interface MessageNode extends ForumMessage {
  replies: MessageNode[]
}

defineProps<{
  messages: MessageNode[]
  loading: boolean
  title: string
  loadingText: string
  emptyText: string
  canReply: boolean
  topicStatus: ForumStatus
  currentUserId: string
  isAdmin: boolean
  formatDate: (value: string) => string
}>()

const emit = defineEmits<{
  (e: 'reply', payload: ForumMessage): void
  (e: 'edit', payload: { id: string; content: string }): void
}>()
</script>

<style scoped lang="scss" src="./forum-messages-board.scss"></style>
