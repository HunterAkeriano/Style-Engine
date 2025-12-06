<template>
  <div class="forum-message" :style="{ marginLeft: `${depth * 18}px` }">
    <div class="forum-message__header">
      <div class="forum-message__avatar">
        <img
          v-if="node.author?.avatarUrl"
          :src="node.author.avatarUrl"
          alt=""
        />
        <span v-else>{{ initials }}</span>
      </div>
      <div class="forum-message__meta">
        <div class="forum-message__author">
          <span>{{ node.author?.name || node.author?.email || "User" }}</span>
          <span v-if="node.author?.isAdmin" class="forum-message__role"
            >Admin</span
          >
          <Icon
            v-if="showAuthorPlanIcon"
            name="icon-crown"
            class="forum-message__crown"
            :class="`forum-message__crown_${authorPlanClass}`"
          />
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
          <iframe
            v-else
            :src="item.url"
            title="YouTube"
            frameborder="0"
            allowfullscreen
          />
        </div>
      </div>
    </div>

    <div class="forum-message__actions">
      <div class="forum-message__actions-row">
        <Button
          v-if="canReply"
          size="sm"
          variant="ghost"
          @click="$emit('reply', node)"
        >
          {{ $t("FORUM.TOPIC.REPLY") }}
        </Button>
        <template v-if="canEditThis">
          <Button
            v-if="!isEditing"
            size="sm"
            variant="ghost"
            @click="startEdit"
          >
            {{ $t("FORUM.TOPIC.EDIT") }}
          </Button>
          <div v-else class="forum-message__edit-actions">
            <Button size="sm" variant="primary" @click="saveEdit">
              {{ $t("FORUM.TOPIC.SAVE_EDIT") }}
            </Button>
            <Button size="sm" variant="ghost" @click="cancelEdit">
              {{ $t("FORUM.TOPIC.CANCEL_REPLY") }}
            </Button>
          </div>
        </template>
      </div>
    </div>

    <div v-if="showInlineReply" class="forum-message__inline-reply">
      <ForumReplyForm
        :title="replyConfig?.title ?? t('FORUM.TOPIC.REPLY_TITLE')"
        :hint="replyConfig?.hint ?? t('FORUM.TOPIC.REPLY_HINT')"
        :total-label="t('FORUM.TOPIC.TOTAL', { count: 1 })"
        :placeholder="
          replyConfig?.placeholder ?? t('FORUM.TOPIC.REPLY_PLACEHOLDER')
        "
        :send-label="replyConfig?.sendLabel ?? t('FORUM.TOPIC.SEND')"
        :can-reply="canReply"
        :allow-video="replyConfig?.allowVideo ?? false"
        :sending="replyConfig?.sending ?? false"
        :replying-to="node"
        :cancel-reply-label="replyConfig?.cancelLabel"
        @submit="handleInlineSubmit"
        @cancel-reply="handleInlineCancel"
      />
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
        :inline-reply-target-id="props.inlineReplyTargetId"
        :inline-reply-form-config="replyConfig"
        @reply="$emit('reply', $event)"
        @edit="$emit('edit', $event)"
        @inline-reply-submit="$emit('inline-reply-submit', $event)"
        @inline-reply-cancel="$emit('inline-reply-cancel')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { Button, Icon, Textarea } from "@/shared/ui";
import type { ForumMessage } from "@/shared/api/forum";
import type { ForumAttachmentDraft } from "@/entities/forum";
import ForumReplyForm from "@/features/forum/reply-form/ForumReplyForm.vue";
import { resolvePlanClass, type PlanTier } from "@/shared/lib/plans";

defineOptions({ name: "MessageBlock" });

interface MessageNode extends ForumMessage {
  replies: MessageNode[];
}

const props = defineProps<{
  node: MessageNode;
  depth: number;
  canReply: boolean;
  formatDate: (value: string) => string;
  currentUserId: string;
  topicStatus: "open" | "in_review" | "closed";
  isAdmin: boolean;
  inlineReplyTargetId?: string | null;
  inlineReplyFormConfig?: {
    title: string;
    hint: string;
    placeholder: string;
    sendLabel: string;
    cancelLabel?: string;
    allowVideo?: boolean;
    sending: boolean;
  } | null;
}>();

const emit = defineEmits<{
  (e: "reply", message: MessageNode): void;
  (e: "edit", payload: { id: string; content: string }): void;
  (
    e: "inline-reply-submit",
    payload: { content: string; attachments: ForumAttachmentDraft[] },
  ): void;
  (e: "inline-reply-cancel"): void;
}>();

const { t } = useI18n();
const isEditing = ref(false);
const draft = ref(props.node.content);
const canEditThis = computed(
  () =>
    props.isAdmin ||
    (props.topicStatus === "open" && props.currentUserId === props.node.userId),
);

const authorPlan = computed<PlanTier>(
  () => (props.node.author?.subscriptionTier ?? "free") as PlanTier,
);
const authorPlanClass = computed(() => resolvePlanClass(authorPlan.value));
const showAuthorPlanIcon = computed(() => authorPlan.value !== "free");

const replyConfig = computed(() => props.inlineReplyFormConfig ?? null);
const showInlineReply = computed(
  () => props.inlineReplyTargetId === props.node.id,
);

watch(
  () => props.node.content,
  (val) => {
    if (!isEditing.value) draft.value = val;
  },
);

const initials = computed(() => {
  const name = props.node.author?.name || props.node.author?.email || "";
  return name.slice(0, 2).toUpperCase() || "U";
});

const editedLabel = computed(() => t("FORUM.TOPIC.EDITED"));

function startEdit() {
  if (!canEditThis.value) return;
  isEditing.value = true;
  draft.value = props.node.content;
}

function cancelEdit() {
  isEditing.value = false;
  draft.value = props.node.content;
}

function saveEdit() {
  if (!draft.value.trim()) return;
  emit("edit", { id: props.node.id, content: draft.value.trim() });
  isEditing.value = false;
}

function handleInlineSubmit(payload: {
  content: string;
  attachments: ForumAttachmentDraft[];
}) {
  emit("inline-reply-submit", payload);
}

function handleInlineCancel() {
  emit("inline-reply-cancel");
}
</script>

<style scoped lang="scss">
@import "@/app/styles/variables";

.forum-message {
  border-radius: 14px;
  padding: 14px;
  background: color-var-alpha("color-bg-secondary", 0.65);
  border-color: color-var-alpha("panel-border", 0.3);
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
    background: color-var-alpha("color-bg-secondary", 0.5);
    display: grid;
    place-items: center;
    color: color-var("color-text-secondary");
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
    background: color-var-alpha("color-warning", 0.15);
    color: color-var("color-warning");
    font-size: 12px;
  }

  &__timestamps {
    font-size: 13px;
    color: color-var-alpha("color-text-secondary", 0.8);
  }

  &__edited {
    color: color-var-alpha("color-text-secondary", 0.7);
  }

  &__body {
    margin-top: 10px;
  }

  &__text {
    margin: 0;
    white-space: pre-wrap;
    color: $color-text-primary;
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
    border: 1px solid color-var-alpha("panel-border", 0.25);
    background: color-var-alpha("color-bg-secondary", 0.45);
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

.forum-message__inline-reply {
  margin-top: 14px;

  .forum-reply {
    position: relative;
    bottom: auto;
    margin-top: 0;
    border-radius: $border-radius-2xl;
    box-shadow: 0 10px 30px color-var-alpha("color-text-primary", 0.08);
    padding: $space-xl;
    background:
      linear-gradient(
        135deg,
        color-var-alpha("color-bg-secondary", 0.92),
        color-var-alpha("color-bg-primary", 0.9)
      ),
      color-var-alpha("color-bg-secondary", 0.5);
  }

  .forum-reply__pill {
    display: none;
  }
}
.forum-message__crown {
  margin-left: 6px;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: color-var-alpha("color-text-secondary", 0.7);
}

.forum-message__crown_pro {
  color: color-var("color-primary");
}

.forum-message__crown_premium {
  color: color-var("color-success");
}
</style>
