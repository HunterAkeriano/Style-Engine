<template>
  <div class="forum-topic">
    <div class="forum-topic__background">
      <span class="forum-topic__beam forum-topic__beam_left"></span>
      <span class="forum-topic__beam forum-topic__beam_right"></span>
      <span class="forum-topic__grid-lines"></span>
    </div>

    <div class="container">
      <Breadcrumbs />

      <ForumTopicHeader
        :topic="topic"
        :status-labels="statusLabels"
        :status-options="statusOptions"
        :can-edit="canEditTopic"
        :is-editing="editingTopic"
        :is-admin="Boolean(authStore.user?.isAdmin)"
        :is-super-admin="Boolean(authStore.user?.isSuperAdmin)"
        @back="goBack"
        @edit="startTopicEdit"
        @cancel-edit="cancelTopicEdit"
        @update-status="onStatusChange"
      />

      <ForumTopicAttachments
        v-if="topic && !editingTopic"
        :attachments="topic.attachments"
        :title="t('FORUM.TOPIC.ATTACHMENTS')"
      />

      <Card
        v-if="topic && editingTopic"
        variant="bordered"
        class="forum-topic__card"
      >
        <ForumTopicForm
          :initial-title="topic.title"
          :initial-description="topic.description"
          :initial-attachments="topic.attachments"
          :submit-label="t('FORUM.TOPIC.SAVE_TOPIC')"
          :cancel-label="t('FORUM.TOPIC.CANCEL_EDIT')"
          :allow-video="Boolean(authStore.user?.isAdmin)"
          @submit="saveTopicEdit"
          @cancel="cancelTopicEdit"
        />
      </Card>

      <ForumMessagesBoard
        :messages="threadedMessages"
        :loading="loading"
        :title="t('FORUM.TOPIC.THREAD_TITLE')"
        :loading-text="t('FORUM.LOADING')"
        :empty-text="t('FORUM.TOPIC.NO_MESSAGES')"
        :can-reply="canReply"
        :topic-status="topic?.status || 'open'"
        :current-user-id="authStore.user?.id || ''"
        :is-admin="Boolean(authStore.user?.isAdmin)"
        :format-date="formatDate"
        @reply="setReplyTarget"
        @edit="handleEditSubmit"
      />

      <ForumReplyForm
        :title="t('FORUM.TOPIC.REPLY_TITLE')"
        :hint="t('FORUM.TOPIC.REPLY_HINT')"
        :total-label="t('FORUM.TOPIC.TOTAL', { count: messages.length })"
        :placeholder="replyPlaceholder"
        :send-label="t('FORUM.TOPIC.SEND')"
        :can-reply="canReply"
        :allow-video="Boolean(authStore.user?.isAdmin)"
        :sending="sendingReply"
        :replying-to="replyingTo"
        @submit="sendReply"
        @cancel-reply="clearReply"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { Breadcrumbs } from "@/widgets/common";
import { Card } from "@/shared/ui";
import {
  changeForumTopicStatus,
  editForumMessage,
  getForumTopic,
  openForumStream,
  postForumMessage,
  updateForumTopic,
  uploadForumAttachment,
  type ForumAttachment,
  type ForumMessage,
  type ForumStatus,
  type ForumTopic,
} from "@/shared/api/forum";
import { useAuthStore } from "@/entities";
import { useToast } from "@/shared/lib/toast";
import ForumTopicHeader from "@/widgets/forum/topic-header/ForumTopicHeader.vue";
import ForumTopicAttachments from "@/widgets/forum/topic-attachments/ForumTopicAttachments.vue";
import ForumMessagesBoard, {
  type MessageNode,
} from "@/widgets/forum/messages-board/ForumMessagesBoard.vue";
import ForumReplyForm from "@/features/forum/reply-form/ForumReplyForm.vue";
import ForumTopicForm from "@/features/forum/topic-form/ForumTopicForm.vue";
import type { ForumAttachmentDraft } from "@/entities/forum";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const topic = ref<ForumTopic | null>(null);
const messages = ref<ForumMessage[]>([]);
const loading = ref(false);
const sendingReply = ref(false);
const replyParentId = ref<string | null>(null);
let stopStream: (() => void) | null = null;
const editingTopic = ref(false);

const statusLabels = computed<Record<ForumStatus, string>>(() => ({
  open: t("FORUM.STATUS.OPEN"),
  in_review: t("FORUM.STATUS.IN_REVIEW"),
  closed: t("FORUM.STATUS.CLOSED"),
}));

const statusOptions = computed<{ value: ForumStatus; label: string }[]>(() => [
  { value: "open", label: t("FORUM.STATUS.OPEN") },
  { value: "in_review", label: t("FORUM.STATUS.IN_REVIEW") },
  { value: "closed", label: t("FORUM.STATUS.CLOSED") },
]);

const threadedMessages = computed<MessageNode[]>(() => {
  const map = new Map<string, MessageNode>();
  messages.value.forEach((msg) => {
    map.set(msg.id, { ...msg, replies: [] });
  });
  const roots: MessageNode[] = [];
  map.forEach((msg) => {
    if (msg.parentId && map.has(msg.parentId)) {
      map.get(msg.parentId)!.replies.push(msg);
    } else {
      roots.push(msg);
    }
  });
  return roots;
});

const canEditTopic = computed(() => {
  if (!topic.value) return false;
  if (authStore.user?.isAdmin) return true;
  return (
    topic.value.status === "open" &&
    topic.value.owner?.id === authStore.user?.id
  );
});

const canReply = computed(() => {
  if (!topic.value) return false;
  if (!authStore.isAuthenticated) return false;
  if (topic.value.status === "open") return true;
  return Boolean(authStore.user?.isAdmin);
});

const replyPlaceholder = computed(() => {
  if (!authStore.isAuthenticated) return t("FORUM.TOPIC.LOGIN_TO_REPLY");
  if (!topic.value) return t("FORUM.TOPIC.REPLY_PLACEHOLDER");
  if (topic.value.status === "closed" && !authStore.user?.isAdmin)
    return t("FORUM.TOPIC.CLOSED_REPLY");
  if (topic.value.status === "in_review" && !authStore.user?.isAdmin)
    return t("FORUM.TOPIC.REVIEW_REPLY");
  return t("FORUM.TOPIC.REPLY_PLACEHOLDER");
});

function goBack() {
  router.push(`/${locale.value}/forum`);
}

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString(locale.value);
  } catch {
    return value;
  }
}

async function loadTopic() {
  loading.value = true;
  try {
    const { topic: topicData, messages: topicMessages } = await getForumTopic(
      route.params.id as string,
    );
    topic.value = topicData;
    messages.value = topicMessages;
  } catch (err: any) {
    toast.error(err?.message || t("FORUM.LOAD_ERROR"));
  } finally {
    loading.value = false;
  }
}

function setReplyTarget(message: ForumMessage) {
  replyParentId.value = message.id;
}

const replyingTo = computed(() => {
  if (!replyParentId.value) return null;
  return messages.value.find((m) => m.id === replyParentId.value) || null;
});

function clearReply() {
  replyParentId.value = null;
}

function startTopicEdit() {
  if (!canEditTopic.value || !topic.value) return;
  editingTopic.value = true;
}

async function saveTopicEdit(payload: {
  title: string;
  description: string;
  attachments: ForumAttachmentDraft[];
}) {
  if (!topic.value) return;
  if (!payload.title.trim() || !payload.description.trim()) {
    toast.error(t("FORUM.TOPIC.EDIT_REQUIRED"));
    return;
  }
  try {
    const finalAttachments: ForumAttachment[] = [];
    for (const item of payload.attachments) {
      if (item.file) {
        const url = await uploadForumAttachment(item.file, topic.value.id);
        finalAttachments.push({ type: "image", url });
      } else if (item.url) {
        finalAttachments.push({ type: item.type, url: item.url });
      }
    }
    const updated = await updateForumTopic(topic.value.id, {
      title: payload.title.trim(),
      description: payload.description.trim(),
      attachments: finalAttachments,
    });
    topic.value = updated;
    editingTopic.value = false;
    toast.success(t("FORUM.TOPIC.TOPIC_UPDATED"));
  } catch (err: any) {
    toast.error(err?.message || t("FORUM.TOPIC.EDIT_ERROR"));
  }
}

function cancelTopicEdit() {
  editingTopic.value = false;
}

async function sendReply(payload: {
  content: string;
  attachments: ForumAttachmentDraft[];
}) {
  if (!topic.value || !canReply.value || !payload.content.trim()) return;
  sendingReply.value = true;
  try {
    const finalAttachments: ForumAttachment[] = [];
    for (const item of payload.attachments) {
      if (item.file) {
        const url = await uploadForumAttachment(item.file, topic.value.id);
        finalAttachments.push({ type: "image", url });
      } else if (item.url) {
        finalAttachments.push({ type: item.type, url: item.url });
      }
    }
    const { topic: updatedTopic, message } = await postForumMessage(
      topic.value.id,
      {
        content: payload.content.trim(),
        parentId: replyParentId.value,
        attachments: finalAttachments,
      },
    );
    topic.value = updatedTopic;
    messages.value = [...messages.value, message];
    replyParentId.value = null;
  } catch (err: any) {
    toast.error(err?.message || t("FORUM.TOPIC.REPLY_ERROR"));
  } finally {
    sendingReply.value = false;
  }
}

async function handleEditSubmit(payload: { id: string; content: string }) {
  if (!topic.value) return;
  try {
    const updated = await editForumMessage(topic.value.id, payload.id, {
      content: payload.content,
    });
    const idx = messages.value.findIndex((m) => m.id === payload.id);
    if (idx !== -1) {
      messages.value.splice(idx, 1, updated);
    }
    toast.success(t("FORUM.TOPIC.EDITED"));
  } catch (err: any) {
    toast.error(err?.message || t("FORUM.TOPIC.EDIT_ERROR"));
  }
}

async function onStatusChange(status: ForumStatus) {
  if (!topic.value) return;
  try {
    const updated = await changeForumTopicStatus(topic.value.id, status);
    topic.value = updated;
    toast.success(t("FORUM.TOPIC.STATUS_UPDATED"));
  } catch (err: any) {
    toast.error(err?.message || t("FORUM.TOPIC.STATUS_ERROR"));
  }
}

function handleIncomingMessage(message: ForumMessage) {
  if (messages.value.some((m) => m.id === message.id)) return;
  if (topic.value) {
    topic.value = { ...topic.value, lastActivityAt: message.createdAt };
  }
  messages.value = [...messages.value, message].sort((a, b) =>
    a.createdAt.localeCompare(b.createdAt),
  );
}

function handleEdit(message: ForumMessage) {
  const idx = messages.value.findIndex((m) => m.id === message.id);
  if (idx !== -1) {
    messages.value.splice(idx, 1, message);
  }
  if (topic.value && message.updatedAt) {
    topic.value = { ...topic.value, lastActivityAt: message.updatedAt };
  }
}

function handleTopicUpdate(next: ForumTopic) {
  if (!topic.value || topic.value.id !== next.id) return;
  topic.value = { ...topic.value, ...next };
}

function subscribe() {
  stopStream?.();
  stopStream = openForumStream(route.params.id as string, {
    onMessage: handleIncomingMessage,
    onStatus: handleTopicUpdate,
    onTopicUpdate: handleTopicUpdate,
    onEdit: handleEdit,
  });
}

watch(
  () => route.params.id,
  () => {
    loadTopic();
    subscribe();
  },
);

onMounted(() => {
  loadTopic();
  subscribe();
});

onBeforeUnmount(() => {
  stopStream?.();
});
</script>

<style scoped lang="scss" src="./forum-topic-page.scss"></style>
