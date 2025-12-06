<template>
  <section class="forum-topic__hero" v-if="topic">
    <div class="forum-topic__hero-row">
      <div>
        <div class="forum-topic__eyebrow">{{ t('FORUM.TOPIC.TAG') }}</div>
        <h1 class="forum-topic__title">{{ topic.title }}</h1>
        <p class="forum-topic__subtitle">{{ topic.description }}</p>
        <div class="forum-topic__meta">
          <span class="forum-topic__status" :class="`forum-topic__status_${topic.status}`">
            {{ statusLabels[topic.status] }}
          </span>
          <span class="forum-topic__meta-item">{{ t('FORUM.TOPIC.CREATED') }}: {{ formatDate(topic.createdAt) }}</span>
          <span class="forum-topic__meta-item">{{ t('FORUM.TOPIC.UPDATED') }}: {{ formatDate(topic.lastActivityAt) }}</span>
          <span v-if="topic.owner" class="forum-topic__meta-item">
            {{ topic.owner.name || topic.owner.email }}
          </span>
        </div>
      </div>
      <div class="forum-topic__controls">
        <Select
          v-if="isSuperAdmin"
          v-model="localStatus"
          :options="statusOptions"
          size="md"
          :label="t('FORUM.TOPIC.STATUS_LABEL')"
          @update:modelValue="emit('update-status', localStatus)"
        />
        <Button v-if="canEdit && !isEditing" size="sm" variant="secondary" @click="emit('edit')">
          {{ t('FORUM.TOPIC.EDIT_TOPIC') }}
        </Button>
        <div v-else-if="isEditing" class="forum-topic__edit-actions">
          <Button size="sm" variant="ghost" @click="emit('cancel-edit')">
            {{ t('FORUM.TOPIC.CANCEL_EDIT') }}
          </Button>
        </div>
        <Button variant="outline" size="sm" @click="emit('back')">
          {{ t('FORUM.TOPIC.BACK') }}
        </Button>
      </div>
    </div>

    <div class="forum-topic__notice" :class="`forum-topic__notice_${topic.status}`">
      <strong>{{ statusLabels[topic.status] }}</strong>
      <span>{{ statusDescription }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { Button, Select } from '@/shared/ui'
import type { ForumStatus, ForumTopic } from '@/shared/api/forum'

const props = defineProps<{
  topic: ForumTopic | null
  statusLabels: Record<ForumStatus, string>
  statusOptions: { value: ForumStatus; label: string }[]
  canEdit: boolean
  isEditing: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
}>()

const emit = defineEmits<{
  (e: 'back'): void
  (e: 'edit'): void
  (e: 'cancel-edit'): void
  (e: 'update-status', value: ForumStatus): void
}>()

const { t, locale } = useI18n()
const localStatus = ref<ForumStatus>('open')

watch(
  () => props.topic?.status,
  (next) => {
    if (next) localStatus.value = next
  },
  { immediate: true }
)

const statusDescription = computed(() => {
  if (!props.topic) return ''
  if (props.topic.status === 'open') return t('FORUM.TOPIC.STATUS_OPEN')
  if (props.topic.status === 'in_review') return t('FORUM.TOPIC.STATUS_REVIEW')
  return t('FORUM.TOPIC.STATUS_CLOSED')
})

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString(locale.value)
  } catch {
    return value
  }
}
</script>

<style scoped lang="scss" src="./forum-topic-header.scss"></style>
