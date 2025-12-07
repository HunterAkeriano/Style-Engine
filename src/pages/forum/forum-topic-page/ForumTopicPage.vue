<template>
  <div class="forum-topic">
    <div class="forum-topic__background">
      <span class="forum-topic__beam forum-topic__beam_left"></span>
      <span class="forum-topic__beam forum-topic__beam_right"></span>
      <span class="forum-topic__grid-lines"></span>
    </div>

    <div class="container">
      <Breadcrumbs />

      <div class="forum-topic__layout">
        <ParticipantsSidebar
          v-if="topic"
          :topic-title="topic.title"
          :participants="participants"
          :can-moderate="canModerate"
          :current-user-id="authStore.user?.id || ''"
          @mute="handleMuteClick"
          @delete-messages="handleDeleteMessages"
        />

        <div class="forum-topic__main">

      <ForumTopicHeader
        :topic="topic"
        :status-labels="statusLabels"
        :status-options="statusOptions"
        :can-edit="canEditTopic"
        :is-editing="editingTopic"
        :is-admin="authStore.isAdmin"
        :is-super-admin="authStore.isSuperAdmin"
        :pinning="pinningTopic"
        @back="goBack"
        @edit="startTopicEdit"
        @cancel-edit="cancelTopicEdit"
        @update-status="onStatusChange"
        @toggle-pin="togglePin"
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
          allow-video
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
        :reply-target-id="replyParentId"
        :reply-form-config="replyFormConfig"
        :muted-users="mutedUsers"
        @reply="setReplyTarget"
        @edit="handleEditSubmit"
        @inline-reply-submit="sendReply"
        @inline-reply-cancel="clearReply"
      />

      <ForumReplyForm
        v-if="!replyParentId"
        :title="t('FORUM.TOPIC.REPLY_TITLE')"
        :hint="t('FORUM.TOPIC.REPLY_HINT')"
        :total-label="t('FORUM.TOPIC.TOTAL', { count: messages.length })"
        :placeholder="replyPlaceholder"
        :send-label="t('FORUM.TOPIC.SEND')"
        :can-reply="canReply"
        :allow-video="true"
        :sending="sendingReply"
        :replying-to="replyingTo"
        @submit="sendReply"
        @cancel-reply="clearReply"
      />
        </div>
      </div>
    </div>

    <MuteModal
      :visible="showMuteModal"
      :user-name="selectedUser?.name || selectedUser?.email || ''"
      @confirm="handleMuteConfirm"
      @close="showMuteModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { Breadcrumbs } from "@/widgets/common";
import { Card } from "@/shared/ui";
import {
  changeForumTopicStatus,
  editForumMessage,
  getForumTopic,
  muteUser,
  openForumStream,
  pinForumTopic,
  postForumMessage,
  getUserMute,
  unpinForumTopic,
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
import ParticipantsSidebar from "@/widgets/forum/participants-sidebar/ParticipantsSidebar.vue";
import MuteModal from "@/features/forum/mute-modal/MuteModal.vue";
import {
  getTopicParticipants,
  deleteUserMessages,
  type ForumUser,
  checkUserMuteStatus,
} from "@/shared/api/forum";

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();
const checkForumNotifications = inject<(() => void) | null>(
  "checkForumNotifications",
  null,
);

const topic = ref<ForumTopic | null>(null);
const messages = ref<ForumMessage[]>([]);
const loading = ref(false);
const sendingReply = ref(false);
const replyParentId = ref<string | null>(null);
let stopStream: (() => void) | null = null;
const editingTopic = ref(false);
const pinningTopic = ref(false);
const participants = ref<ForumUser[]>([]);
const showMuteModal = ref(false);
const selectedUser = ref<ForumUser | null>(null);
const mutedUsers = ref<Record<string, boolean>>({});
const isSelfMuted = ref(false);

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
  if (authStore.isAdmin) return true;
  return (
    topic.value.status === "open" &&
    topic.value.owner?.id === authStore.user?.id
  );
});

const canReply = computed(() => {
  if (!topic.value) return false;
  if (!authStore.isAuthenticated) return false;
  if (isSelfMuted.value) return false;
  if (topic.value.status === "open") return true;
  return Boolean(authStore.isAdmin);
});

const canModerate = computed(() => {
  return Boolean(authStore.user?.isAdmin || authStore.user?.isSuperAdmin);
});

const replyPlaceholder = computed(() => {
  if (!authStore.isAuthenticated) return t("FORUM.TOPIC.LOGIN_TO_REPLY");
  if (!topic.value) return t("FORUM.TOPIC.REPLY_PLACEHOLDER");
  if (topic.value.status === "closed" && !authStore.isAdmin)
    return t("FORUM.TOPIC.CLOSED_REPLY");
  if (topic.value.status === "in_review" && !authStore.isAdmin)
    return t("FORUM.TOPIC.REVIEW_REPLY");
  return t("FORUM.TOPIC.REPLY_PLACEHOLDER");
});

const replyFormConfig = computed(() => ({
  title: t("FORUM.TOPIC.REPLY_TITLE"),
  hint: t("FORUM.TOPIC.REPLY_HINT"),
  placeholder: replyPlaceholder.value,
  sendLabel: t("FORUM.TOPIC.SEND"),
  cancelLabel: t("FORUM.TOPIC.CANCEL_REPLY"),
  allowVideo: true,
  sending: sendingReply.value,
}));

function applyMuteFlag(userId: string, muted: boolean) {
  participants.value = participants.value.map((p) =>
    p.id === userId ? { ...p, muted } : p,
  );
  mutedUsers.value = { ...mutedUsers.value, [userId]: muted };
}

async function refreshMutedStatuses(usersList: ForumUser[]) {
  const entries = usersList.map((user) => [
    user.id,
    Boolean((user as any).muted),
  ]) as Array<[string, boolean]>;
  mutedUsers.value = Object.fromEntries(entries);

  const currentId = authStore.user?.id;
  if (currentId && mutedUsers.value[currentId] !== undefined) {
    isSelfMuted.value = mutedUsers.value[currentId];
  }
}

async function refreshUserMute(userId: string) {
  if (!canModerate.value && authStore.user?.id !== userId) return;
  try {
    const status = await getUserMute(userId);
    applyMuteFlag(userId, Boolean(status.muted));
    if (authStore.user?.id === userId) {
      isSelfMuted.value = Boolean(status.muted);
    }
  } catch (err) {
    console.error("Failed to refresh mute", err);
  }
}

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
    await loadParticipants();
    await checkSelfMuteStatus();
  } catch (err: any) {
    toast.error(err?.message || t("FORUM.LOAD_ERROR"));
  } finally {
    loading.value = false;
  }
}

async function loadParticipants() {
  try {
  const { participants: participantsList } = await getTopicParticipants(
    route.params.id as string,
  );
  participants.value = participantsList;
  await refreshMutedStatuses(participantsList);
} catch (err: any) {
  console.error("Failed to load participants:", err);
}
}

function handleMuteClick(user: ForumUser) {
  selectedUser.value = user;
  showMuteModal.value = true;
}

async function checkSelfMuteStatus() {
  if (!authStore.user || !topic.value) return;
  try {
    const status = await checkUserMuteStatus(topic.value.id);
    isSelfMuted.value = Boolean(status.muted);
    if (status.muted) {
      applyMuteFlag(authStore.user.id, true);
    }
  } catch (err) {
    console.error("Failed to check mute status", err);
  }
}

async function handleMuteConfirm(payload: {
  durationMinutes: number | null;
  reason: string;
}) {
  if (!selectedUser.value || !topic.value) return;
  try {
    await muteUser(selectedUser.value.id, payload);
    await refreshUserMute(selectedUser.value.id);
    toast.success(t("FORUM.USER_MUTED"));
    showMuteModal.value = false;
    selectedUser.value = null;
  } catch (err: any) {
    toast.error(err?.message || t("FORUM.MUTE_ERROR"));
  }
}

async function handleDeleteMessages(user: ForumUser) {
  if (!topic.value) return;
  if (!confirm(t("FORUM.CONFIRM_DELETE_MESSAGES", { name: user.name || user.email }))) return;

  try {
    const result = await deleteUserMessages(topic.value.id, user.id);
    toast.success(t("FORUM.MESSAGES_DELETED", { count: result.deletedCount }));
    await loadTopic();
  } catch (err: any) {
    toast.error(err?.message || t("FORUM.DELETE_ERROR"));
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
    topic.value = await updateForumTopic(topic.value.id, {
      title: payload.title.trim(),
      description: payload.description.trim(),
      attachments: finalAttachments,
    });
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
    topic.value = await changeForumTopicStatus(topic.value.id, status);
    toast.success(t("FORUM.TOPIC.STATUS_UPDATED"));

    if (checkForumNotifications) {
      checkForumNotifications();
    }
  } catch (err: any) {
    toast.error(err?.message || t("FORUM.TOPIC.STATUS_ERROR"));
  }
}

async function togglePin() {
  if (!topic.value || !authStore.isAdmin || pinningTopic.value) return;
  pinningTopic.value = true;
  try {
    const updated = topic.value.isPinned
      ? await unpinForumTopic(topic.value.id)
      : await pinForumTopic(topic.value.id);
    topic.value = updated;
    toast.success(
      updated.isPinned
        ? t("FORUM.TOPIC.PINNED_SUCCESS")
        : t("FORUM.TOPIC.UNPINNED_SUCCESS"),
    );
  } catch (err: any) {
    toast.error(err?.message || t("FORUM.TOPIC.PIN_ERROR"));
  } finally {
    pinningTopic.value = false;
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
