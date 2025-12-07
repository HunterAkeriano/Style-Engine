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
      <MessageBlock
        v-for="node in messages"
        :key="node.id"
        :node="node"
        :depth="0"
        :can-reply="canReply"
        :format-date="formatDate"
        :current-user-id="currentUserId"
        :topic-status="topicStatus"
        :is-admin="isAdmin"
        :muted-users="mutedUsers"
        :inline-reply-target-id="replyTargetId"
        :inline-reply-form-config="replyFormConfig"
        @reply="(m) => emit('reply', m)"
        @edit="(payload) => emit('edit', payload)"
        @inline-reply-submit="(payload) => emit('inline-reply-submit', payload)"
        @inline-reply-cancel="() => emit('inline-reply-cancel')"
      />
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ForumMessage, ForumStatus } from '@/shared/api/forum'
import type { ForumAttachmentDraft } from '@/entities/forum'
import MessageBlock from '@/widgets/forum/message-thread/MessageBlock.vue'
import { Card } from '@/shared/ui'

export interface MessageNode extends ForumMessage {
  replies: MessageNode[]
}

export type InlineReplyFormConfig = {
  title: string
  hint: string
  placeholder: string
  sendLabel: string
  cancelLabel?: string
  allowVideo?: boolean
  sending: boolean
}

const props = defineProps<{
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
  replyTargetId?: string | null
  replyFormConfig?: InlineReplyFormConfig | null
  mutedUsers?: Record<string, boolean>
}>()

const emit = defineEmits<{
  (e: 'reply', payload: ForumMessage): void
  (e: 'edit', payload: { id: string; content: string }): void
  (e: 'inline-reply-submit', payload: { content: string; attachments: ForumAttachmentDraft[] }): void
  (e: 'inline-reply-cancel'): void
}>()

const replyTargetId = computed(() => props.replyTargetId)
const replyFormConfig = computed(() => props.replyFormConfig ?? null)
</script>

<style scoped lang="scss" src="./forum-messages-board.scss"></style>
