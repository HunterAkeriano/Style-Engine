<template>
  <Card variant="bordered" class="forum-reply">
    <div class="forum-reply__header">
      <div>
        <h3>{{ title }}</h3>
        <p class="forum-reply__hint">{{ hint }}</p>
      </div>
      <span class="forum-reply__pill">{{ totalLabel }}</span>
    </div>

    <div v-if="replyingTo" class="forum-reply__replying">
      <span>{{ replyingToLabel }}</span>
      <Button size="sm" variant="ghost" @click="emit('cancel-reply')">{{ cancelReplyLabel }}</Button>
    </div>

    <Textarea
      v-model="content"
      :rows="5"
      :disabled="!canReply || sending"
      :placeholder="placeholder"
    />

    <div class="forum-reply__actions">
      <div class="forum-reply__inputs">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          multiple
          class="forum-reply__file-input"
          @change="onFiles"
        />
        <Button size="sm" variant="secondary" :disabled="!canReply || sending" @click.prevent="fileInput?.click()">
          {{ t('FORUM.TOPIC.ADD_IMAGE') }}
        </Button>
        <div v-if="allowVideo" class="forum-reply__youtube">
          <Input
            v-model="youtube"
            type="url"
            :placeholder="t('FORUM.TOPIC.YOUTUBE_PLACEHOLDER')"
            class="forum-reply__youtube-input"
          />
          <Button size="sm" variant="outline" :disabled="!canReply" @click.prevent="addYoutube">
            {{ t('FORUM.TOPIC.ADD_VIDEO') }}
          </Button>
        </div>
      </div>
      <Button :disabled="!canReply || sending || !content.trim()" @click="submit">
        {{ sending ? t('FORUM.TOPIC.SENDING') : sendLabel }}
      </Button>
    </div>

    <div v-if="attachments.length" class="forum-reply__attachment-chips">
      <div
        v-for="(item, index) in attachments"
        :key="`${item.url}-${index}`"
        class="forum-reply__chip"
      >
        <span>{{ item.type === 'image' ? t('FORUM.TOPIC.IMAGE') : t('FORUM.TOPIC.VIDEO') }}</span>
        <button type="button" @click="removeAttachment(index)">{{ t('FORUM.TOPIC.REMOVE') }}</button>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ForumAttachmentDraft } from '@/entities/forum'
import type { ForumMessage } from '@/shared/api/forum'
import { Button, Card, Input, Textarea } from '@/shared/ui'

const props = withDefaults(
  defineProps<{
    canReply: boolean
    sendLabel: string
    title: string
    hint: string
    totalLabel: string
    placeholder: string
    allowVideo?: boolean
    maxAttachments?: number
    sending?: boolean
    replyingTo?: ForumMessage | null
    cancelReplyLabel?: string
  }>(),
  {
    allowVideo: false,
    maxAttachments: 5,
    sending: false,
    replyingTo: null,
    cancelReplyLabel: ''
  }
)

const emit = defineEmits<{
  (e: 'submit', payload: { content: string; attachments: ForumAttachmentDraft[] }): void
  (e: 'cancel-reply'): void
  (e: 'replying-to', payload: ForumMessage | null): void
}>()

const { t } = useI18n()

const content = ref('')
const attachments = ref<ForumAttachmentDraft[]>([])
const youtube = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const cancelReplyLabel = computed(() => props.cancelReplyLabel || t('FORUM.TOPIC.CANCEL_REPLY'))

watch(
  () => props.replyingTo,
  () => emit('replying-to', props.replyingTo)
)

const replyingToLabel = computed(() => {
  if (!props.replyingTo) return ''
  return t('FORUM.TOPIC.REPLYING_TO', { name: props.replyingTo.author?.name || props.replyingTo.author?.email || t('FORUM.ANON') })
})

function addYoutube() {
  if (!youtube.value) return
  const match = youtube.value.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/i)
  if (!match) return
  if (attachments.value.length >= props.maxAttachments) return
  attachments.value.push({ type: 'youtube', url: `https://www.youtube.com/embed/${match[1]}` })
  youtube.value = ''
}

function onFiles(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || !files.length) return
  const remaining = props.maxAttachments - attachments.value.length
  if (remaining <= 0) {
    target.value = ''
    return
  }
  const toUpload = Array.from(files).slice(0, remaining)
  for (const file of toUpload) {
    attachments.value.push({
      type: 'image',
      file,
      preview: URL.createObjectURL(file),
      url: ''
    })
  }
  target.value = ''
}

function removeAttachment(index: number) {
  const item = attachments.value[index]
  if (item?.preview) URL.revokeObjectURL(item.preview)
  attachments.value.splice(index, 1)
}

function submit() {
  emit('submit', {
    content: content.value.trim(),
    attachments: attachments.value
  })
  content.value = ''
  attachments.value = []
  youtube.value = ''
}

defineExpose({ setContent: (value: string) => (content.value = value) })
</script>

<style scoped lang="scss" src="./forum-reply-form.scss"></style>
