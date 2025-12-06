<template>
  <div class="forum-message" :style="{ marginLeft: `${depth * 18}px` }">
    <div class="forum-message__header">
      <div class="forum-message__avatar">
        <img v-if="node.author?.avatarUrl" :src="node.author.avatarUrl" alt="" />
        <span v-else>{{ initials }}</span>
      </div>
      <div class="forum-message__meta">
        <div class="forum-message__author">
          <span>{{ node.author?.name || node.author?.email || 'User' }}</span>
          <span v-if="node.author?.isAdmin" class="forum-message__role">Admin</span>
        </div>
        <div class="forum-message__timestamps">
          <span>{{ formatDate(node.createdAt) }}</span>
          <span v-if="node.editedAt" class="forum-message__edited">
            · {{ editedLabel }} {{ formatDate(node.editedAt) }}
          </span>
        </div>
      </div>
    </div>

    <div class="forum-message__body">
      <Textarea v-if="isEditing" v-model="draft" :rows="4" />
      <p v-else class="forum-message__text">{{ node.content }}</p>

      <div v-if="node.attachments.length" class="forum-message__attachments">
        <div
          v-for="(item, index) in node.attachments"
          :key="`${item.url}-${index}`"
          class="forum-message__attachment"
        >
          <img v-if="item.type === 'image'" :src="item.url" :alt="item.url" />
          <iframe v-else :src="item.url" title="YouTube" frameborder="0" allowfullscreen />
        </div>
      </div>
    </div>

    <div class="forum-message__actions">
      <div class="forum-message__actions-row">
        <Button v-if="canReply" size="sm" variant="ghost" @click="$emit('reply', node)">
          {{ $t('FORUM.TOPIC.REPLY') }}
        </Button>
        <template v-if="canEditThis">
          <Button v-if="!isEditing" size="sm" variant="ghost" @click="startEdit">
            {{ $t('FORUM.TOPIC.EDIT') }}
          </Button>
          <div v-else class="forum-message__edit-actions">
            <Button size="sm" variant="primary" @click="saveEdit">
              {{ $t('FORUM.TOPIC.SAVE_EDIT') }}
            </Button>
            <Button size="sm" variant="ghost" @click="cancelEdit">
              {{ $t('FORUM.TOPIC.CANCEL_REPLY') }}
            </Button>
          </div>
        </template>
      </div>
    </div>

    <div v-if="node.replies.length" class="forum-message__replies">
      <MessageBlock
        v-for="reply in node.replies"
        :key="reply.id"
        :node="reply"
        :depth="depth + 1"
        :can-reply="canReply"
        :format-date="formatDate"
        :topic-status="topicStatus"
        :is-admin="isAdmin"
        :current-user-id="currentUserId"
        @reply="$emit('reply', $event)"
        @edit="$emit('edit', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button, Textarea } from '@/shared/ui'
import type { ForumMessage } from '@/shared/api/forum'

defineOptions({ name: 'MessageBlock' })

interface MessageNode extends ForumMessage {
  replies: MessageNode[]
}

const props = defineProps<{
  node: MessageNode
  depth: number
  canReply: boolean
  formatDate: (value: string) => string
  currentUserId: string
  topicStatus: 'open' | 'in_review' | 'closed'
  isAdmin: boolean
}>()

const emit = defineEmits<{
  (e: 'reply', message: MessageNode): void
  (e: 'edit', payload: { id: string; content: string }): void
}>()

const { t } = useI18n()
const isEditing = ref(false)
const draft = ref(props.node.content)
const canEditThis = computed(
  () => props.isAdmin || (props.topicStatus === 'open' && props.currentUserId === props.node.userId)
)

watch(
  () => props.node.content,
  (val) => {
    if (!isEditing.value) draft.value = val
  }
)

const initials = computed(() => {
  const name = props.node.author?.name || props.node.author?.email || ''
  return name.slice(0, 2).toUpperCase() || 'U'
})

const editedLabel = computed(() => t('FORUM.TOPIC.EDITED'))

function startEdit() {
  if (!canEditThis.value) return
  isEditing.value = true
  draft.value = props.node.content
}

function cancelEdit() {
  isEditing.value = false
  draft.value = props.node.content
}

function saveEdit() {
  if (!draft.value.trim()) return
  emit('edit', { id: props.node.id, content: draft.value.trim() })
  isEditing.value = false
}
</script>

<style scoped lang="scss">
.forum-message {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.02);
  margin-bottom: 12px;

  &__header {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    display: grid;
    place-items: center;
    color: #cbd5ff;
    font-weight: 700;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__author {
    display: flex;
    gap: 8px;
    align-items: center;
    font-weight: 600;
  }

  &__role {
    padding: 4px 8px;
    border-radius: 999px;
    background: rgba(255, 214, 102, 0.15);
    color: #ffd666;
    font-size: 12px;
  }

  &__timestamps {
    font-size: 13px;
    color: rgba(230, 230, 240, 0.7);
  }

  &__edited {
    color: #9fa8ff;
  }

  &__body {
    margin-top: 10px;
  }

  &__text {
    margin: 0;
    white-space: pre-wrap;
    color: #ffffff;
  }

  &__attachments {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 10px;
    margin-top: 10px;
  }

  &__attachment {
    border-radius: 12px;
    overflow: hidden;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(255, 255, 255, 0.04);
    height: 140px;

    img,
    iframe {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;
    gap: 10px;
    flex-wrap: wrap;
  }

  &__actions-row {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  &__edit-actions {
    display: flex;
    gap: 8px;
  }

  &__replies {
    margin-top: 12px;
  }
}
</style>
