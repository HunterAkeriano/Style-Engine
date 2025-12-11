<template>
  <div class="forum-create">
    <div class="forum-create__background">
      <span class="forum-create__beam forum-create__beam_left"></span>
      <span class="forum-create__beam forum-create__beam_right"></span>
      <span class="forum-create__grid-lines"></span>
    </div>

    <div class="forum-create__container">
      <Breadcrumbs />

      <section class="forum-create__hero">
        <div class="forum-create__eyebrow">{{ t('FORUM.CREATE.TAG') }}</div>
        <h1 class="forum-create__title">{{ t('FORUM.CREATE.TITLE') }}</h1>
        <p class="forum-create__subtitle">{{ t('FORUM.CREATE.SUBTITLE') }}</p>
      </section>

      <Card variant="bordered" class="forum-create__card">
        <ForumTopicForm
          ref="formRef"
          :submit-label="isSubmitting ? t('FORUM.CREATE.SAVING') : t('FORUM.CREATE.SUBMIT')"
          :cancel-label="t('FORUM.CREATE.CANCEL')"
          :allow-video="true"
          :disabled="isSubmitting"
          @cancel="goBack"
          @submit="handleSubmit"
        />
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Breadcrumbs } from '@/widgets/common'
import { Card } from '@/shared/ui'
import ForumTopicForm from '@/features/forum/topic-form/ForumTopicForm.vue'
import type { ForumAttachmentDraft } from '@/entities/forum'
import { createForumTopic, uploadForumAttachment, type ForumAttachment } from '@/shared/api/forum'
import { useToast } from '@/shared/lib/toast'

const { t, locale } = useI18n()
const router = useRouter()
const toast = useToast()
const isSubmitting = ref(false)
const formRef = ref<InstanceType<typeof ForumTopicForm> | null>(null)

function goBack() {
  router.push(`/${locale.value}/forum`)
}

async function handleSubmit(payload: { title: string; description: string; attachments: ForumAttachmentDraft[] }) {
  if (payload.title.trim().length < 3) {
    toast.error(t('FORUM.CREATE.ERROR_TITLE'))
    return
  }
  if (payload.description.trim().length < 10) {
    toast.error(t('FORUM.CREATE.ERROR_DESCRIPTION'))
    return
  }
  isSubmitting.value = true
  try {
    const finalAttachments: ForumAttachment[] = []
    for (const item of payload.attachments) {
      if (item.file) {
        const url = await uploadForumAttachment(item.file)
        finalAttachments.push({ type: 'image', url })
      } else if (item.url) {
        finalAttachments.push({ type: item.type, url: item.url })
      }
    }
    const topic = await createForumTopic({
      title: payload.title.trim(),
      description: payload.description.trim(),
      attachments: finalAttachments,
    })
    toast.success(t('FORUM.CREATE.SUCCESS'))
    formRef.value?.resetForm()
    router.push(`/${locale.value}/forum/${topic.id}`)
  } catch (err: any) {
    toast.error(err?.message || t('FORUM.CREATE.ERROR'))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped lang="scss" src="./forum-create-page.scss"></style>
