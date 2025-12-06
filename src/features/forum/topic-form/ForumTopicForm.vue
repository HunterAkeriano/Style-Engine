<template>
  <form class="forum-topic-form" @submit.prevent="handleSubmit">
    <Input v-model="title" :label="titleLabel" />
    <Textarea v-model="description" :rows="6" :label="descriptionLabel" />

    <div class="forum-topic-form__attachments">
      <div class="forum-topic-form__attachments-header">
        <div>
          <p class="forum-topic-form__hint">{{ t('FORUM.CREATE.ATTACH_HINT') }}</p>
          <p class="forum-topic-form__hint">{{ t('FORUM.CREATE.ATTACH_LIMIT', { limit: maxAttachments }) }}</p>
        </div>
        <div class="forum-topic-form__buttons">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            class="forum-topic-form__file-input"
            @change="onFiles"
          />
          <Button size="sm" variant="secondary" :disabled="uploading || disabled" @click.prevent="fileInput?.click()">
            {{ uploading ? t('FORUM.TOPIC.UPLOADING') : t('FORUM.TOPIC.ADD_IMAGE') }}
          </Button>
          <div v-if="allowVideo" class="forum-topic-form__youtube">
            <Input
              v-model="youtube"
              type="url"
              :placeholder="t('FORUM.TOPIC.YOUTUBE_PLACEHOLDER')"
              class="forum-topic-form__youtube-input"
            />
            <Button size="sm" variant="outline" :disabled="uploading || disabled" @click.prevent="addYoutube">
              {{ t('FORUM.TOPIC.ADD_VIDEO') }}
            </Button>
          </div>
        </div>
      </div>

      <div v-if="attachments.length" class="forum-topic-form__attachment-grid">
        <div
          v-for="(item, index) in attachments"
          :key="`${item.url}-${index}`"
          class="forum-topic-form__attachment"
        >
          <div class="forum-topic-form__attachment-preview">
            <img v-if="item.type === 'image'" :src="getAttachmentSrc(item)" :alt="item.url" />
            <div v-else class="forum-topic-form__attachment-video">{{ t('FORUM.CREATE.VIDEO') }}</div>
          </div>
          <button type="button" class="forum-topic-form__remove" @click="removeAttachment(index)">
            {{ t('FORUM.TOPIC.REMOVE') }}
          </button>
        </div>
      </div>
    </div>

    <div class="forum-topic-form__actions">
      <Button type="submit" :disabled="disabled || !title.trim() || !description.trim()">
        {{ submitLabel }}
      </Button>
      <Button v-if="cancelLabel" type="button" variant="ghost" @click="emit('cancel')">
        {{ cancelLabel }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button, Input, Textarea } from '@/shared/ui'
import type { ForumAttachmentDraft } from '@/entities/forum'

const props = withDefaults(
  defineProps<{
    initialTitle?: string
    initialDescription?: string
    initialAttachments?: ForumAttachmentDraft[]
    submitLabel: string
    titleLabel?: string
    descriptionLabel?: string
    cancelLabel?: string
    allowVideo?: boolean
    disabled?: boolean
    maxAttachments?: number
  }>(),
  {
    initialTitle: '',
    initialDescription: '',
    initialAttachments: () => [],
    allowVideo: false,
    disabled: false,
    maxAttachments: 10
  }
)

const emit = defineEmits<{
  (e: 'submit', payload: { title: string; description: string; attachments: ForumAttachmentDraft[] }): void
  (e: 'cancel'): void
  (e: 'change', payload: { title: string; description: string; attachments: ForumAttachmentDraft[] }): void
}>()

const { t } = useI18n()

const title = ref(props.initialTitle)
const description = ref(props.initialDescription)
const attachments = ref<ForumAttachmentDraft[]>([...props.initialAttachments])
const uploading = ref(false)
const youtube = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const titleLabel = computed(() => props.titleLabel || t('FORUM.CREATE.TOPIC_LABEL'))
const descriptionLabel = computed(() => props.descriptionLabel || t('FORUM.CREATE.DESCRIPTION_LABEL'))

watch(
  () => [props.initialTitle, props.initialDescription, props.initialAttachments],
  () => {
    title.value = props.initialTitle
    description.value = props.initialDescription
    attachments.value = [...props.initialAttachments]
  }
)

watch([title, description, attachments], () => {
  emit('change', {
    title: title.value,
    description: description.value,
    attachments: attachments.value
  })
}, { deep: true })

function getAttachmentSrc(item: ForumAttachmentDraft) {
  return item.preview || item.url
}

function removeAttachment(index: number) {
  const item = attachments.value[index]
  if (item?.preview) URL.revokeObjectURL(item.preview)
  attachments.value.splice(index, 1)
}

function addYoutube() {
  if (!youtube.value) return
  const match = youtube.value.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/i)
  if (!match) {
    return
  }
  if (attachments.value.length >= props.maxAttachments) {
    return
  }
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
  uploading.value = true
  const toUpload = Array.from(files).slice(0, remaining)
  for (const file of toUpload) {
    attachments.value.push({
      type: 'image',
      file,
      preview: URL.createObjectURL(file),
      url: ''
    })
  }
  uploading.value = false
  target.value = ''
}

function handleSubmit() {
  emit('submit', {
    title: title.value.trim(),
    description: description.value.trim(),
    attachments: attachments.value
  })
}

function resetForm() {
  title.value = ''
  description.value = ''
  attachments.value = []
  youtube.value = ''
}

defineExpose({ resetForm })
</script>

<style scoped lang="scss" src="./forum-topic-form.scss"></style>
