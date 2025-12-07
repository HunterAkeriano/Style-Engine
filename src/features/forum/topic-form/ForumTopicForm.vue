<template>
  <form class="forum-topic-form" @submit.prevent="handleSubmit">
    <Input
      name="title"
      v-model="titleModel"
      :label="titleLabel"
      :error="titleError"
    />
    <Textarea
      name="description"
      v-model="descriptionModel"
      :rows="6"
      :label="descriptionLabel"
      :error="descriptionError"
    />

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

      <p v-if="attachmentsError" class="forum-topic-form__error">
        {{ attachmentsError }}
      </p>

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
      <Button type="submit" :disabled="disabled || submitting">
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
import { buildTopicFormSchema } from '@/entities/forum/lib/forum-validation'
import { useZodForm } from '@/shared/lib/form/zodForm'

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
    allowVideo: true,
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

const uploading = ref(false)
const submitting = ref(false)
const youtube = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const titleLabel = computed(() => props.titleLabel || t('FORUM.CREATE.TOPIC_LABEL'))
const descriptionLabel = computed(() => props.descriptionLabel || t('FORUM.CREATE.DESCRIPTION_LABEL'))
const topicSchema = computed(() =>
  buildTopicFormSchema({
    allowVideo: props.allowVideo,
    maxAttachments: props.maxAttachments,
    messages: {
      titleMin: t('FORUM.CREATE.ERROR_TITLE_MIN'),
      titleMax: t('FORUM.CREATE.ERROR_TITLE_MAX'),
      descriptionMin: t('FORUM.CREATE.ERROR_DESCRIPTION_MIN'),
      descriptionMax: t('FORUM.CREATE.ERROR_DESCRIPTION_MAX'),
      youtube: t('FORUM.TOPIC.YOUTUBE_INVALID'),
      attachmentsLimit: t('FORUM.TOPIC.ATTACH_LIMIT', { limit: props.maxAttachments }),
      videoNotAllowed: t('FORUM.TOPIC.YOUTUBE_INVALID'),
      contentMin: t('FORUM.TOPIC.ERROR_CONTENT'),
      contentMax: t('FORUM.TOPIC.ERROR_CONTENT')
    }
  })
)
const form = useZodForm(topicSchema, {
  title: props.initialTitle,
  description: props.initialDescription,
  attachments: [...props.initialAttachments]
})
const titleModel = computed({
  get: () => (form.values.title as string) || '',
  set: (val: string) => form.setValue('title', val)
})
const descriptionModel = computed({
  get: () => (form.values.description as string) || '',
  set: (val: string) => form.setValue('description', val)
})
const attachments = computed<ForumAttachmentDraft[]>(() => form.values.attachments || [])
const titleError = computed(() => form.errors.title || '')
const descriptionError = computed(() => form.errors.description || '')
const attachmentsError = computed(() => form.errors.attachments || '')

watch(
  () => [props.initialTitle, props.initialDescription, props.initialAttachments],
  () => {
    form.setValue('title', props.initialTitle)
    form.setValue('description', props.initialDescription)
    form.setValue('attachments', [...props.initialAttachments])
  }
)

watch(
  [() => form.values.title, () => form.values.description, () => form.values.attachments],
  () => {
    emit('change', {
      title: form.values.title,
      description: form.values.description,
      attachments: attachments.value
    })
  },
  { deep: true }
)

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
    form.errors.attachments = t('FORUM.TOPIC.YOUTUBE_INVALID')
    return
  }
  const next = [...attachments.value]
  next.push({ type: 'youtube', url: `https://www.youtube.com/embed/${match[1]}` })
  const parsed = topicSchema.value.shape.attachments.safeParse(next)
  if (!parsed.success) {
    form.errors.attachments = parsed.error.issues[0]?.message || ''
    return
  }
  form.errors.attachments = ''
  form.setValue('attachments', parsed.data)
  youtube.value = ''
}

function onFiles(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files || !files.length) return
  form.errors.attachments = ''
  uploading.value = true
  const toUpload = Array.from(files)
  const next: ForumAttachmentDraft[] = [...attachments.value]
  for (const file of toUpload) {
    next.push({
      type: 'image',
      file,
      preview: URL.createObjectURL(file),
      url: ''
    })
    const parsed = topicSchema.value.shape.attachments.safeParse(next)
    if (!parsed.success) {
      form.errors.attachments = parsed.error.issues[0]?.message || ''
      break
    }
    form.setValue('attachments', parsed.data)
  }
  uploading.value = false
  target.value = ''
  form.validateField('attachments')
}

function handleSubmit() {
  if (submitting.value) return
  submitting.value = true
  const parsed = form.validateAll()
  if (!parsed) {
    submitting.value = false
    return
  }

  emit('submit', {
    title: parsed.title,
    description: parsed.description,
    attachments: parsed.attachments
  })
  submitting.value = false
}

function resetForm() {
  form.setValue('title', '')
  form.setValue('description', '')
  form.setValue('attachments', [])
  youtube.value = ''
}

defineExpose({ resetForm })
</script>

<style scoped lang="scss" src="./forum-topic-form.scss"></style>
