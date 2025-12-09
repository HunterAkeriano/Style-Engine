<template>
  <div
    :id="messageAnchorId"
    class="forum-message"
    :style="{ marginLeft: `${depth * 18}px` }"
  >
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
          <span v-if="isModerator(node.author)" class="forum-message__role">
            Admin
          </span>
          <span v-if="isMuted" class="forum-message__muted">
            {{ t("FORUM.MUTED_BADGE") }}
          </span>
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

    <div v-if="parentAuthor" class="forum-message__reply-to">
      <span class="forum-message__reply-label">{{
        t("FORUM.TOPIC.REPLYING_TO")
      }}</span>
      <button
        class="forum-message__reply-link"
        type="button"
        @click="scrollToParent"
      >
        {{ parentAuthor }}
      </button>
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
        :muted-users="mutedUsers"
        :inline-reply-target-id="props.inlineReplyTargetId"
        :inline-reply-form-config="replyConfig"
        :parent-author="node.author?.name || node.author?.email || 'User'"
        :parent-id="node.id"
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
  parentAuthor?: string | null;
  parentId?: string | null;
  mutedUsers?: Record<string, boolean>;
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
const isMuted = computed(() => {
  const authorId = props.node.userId || props.node.author?.id || "";
  if (!authorId || !props.mutedUsers) return false;
  return Boolean(props.mutedUsers[authorId]);
});

const replyConfig = computed(() => props.inlineReplyFormConfig ?? null);
const showInlineReply = computed(
  () => props.inlineReplyTargetId === props.node.id,
);
const messageAnchorId = computed(() => `message-${props.node.id}`);

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
const parentAuthor = computed(() => props.parentAuthor || null);
const isModerator = (user: ForumMessage["author"]) =>
  user?.role === "moderator" || user?.role === "super_admin";

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

function scrollToParent() {
  if (!props.parentId) return;
  const el = document.getElementById(`message-${props.parentId}`);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
</script>

<style scoped lang="scss">
@import "@/app/styles/variables";

.forum-message {
  position: relative;
  border-radius: $border-radius-xl;
  padding: $space-md $space-md $space-lg $space-xl;
  background:
    linear-gradient(
      150deg,
      color-var-alpha("color-bg-secondary", 0.9),
      color-var-alpha("color-bg-primary", 0.8)
    ),
    color-var("color-bg-secondary");
  border: 1px solid color-var-alpha("panel-border", 0.45);
  box-shadow: 0 16px 60px color-var-alpha("color-text-primary", 0.1);
  margin-bottom: $space-md;

  &::before {
    content: "";
    position: absolute;
    left: -18px;
    top: 18px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: linear-gradient(135deg, $color-primary, $color-accent);
    box-shadow:
      0 0 0 6px color-var-alpha("color-primary", 0.16),
      0 10px 25px color-var-alpha("color-primary", 0.35);
  }

  &__header {
    display: flex;
    gap: $space-sm;
    align-items: center;
    flex-wrap: wrap;
  }

  &__avatar {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background:
      radial-gradient(
        circle at 30% 30%,
        color-var-alpha("color-accent", 0.3),
        transparent 55%
      ),
      color-var-alpha("color-bg-secondary", 0.7);
    display: grid;
    place-items: center;
    color: color-var("color-text-primary");
    font-weight: 700;
    overflow: hidden;
    border: 1px solid color-var-alpha("panel-border", 0.3);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }

  &__author {
    display: flex;
    gap: $space-xs;
    align-items: center;
    font-weight: 600;
    color: $color-text-primary;
    flex-wrap: wrap;
  }

  &__role {
    padding: 4px 10px;
    border-radius: 999px;
    background: color-var-alpha("color-primary", 0.12);
    color: color-var("color-primary");
    font-size: $font-size-xs;
    letter-spacing: 0.02em;
  }

  &__muted {
    padding: 4px 10px;
    border-radius: 999px;
    background: color-var-alpha("panel-border", 0.35);
    color: color-var-alpha("color-text-secondary", 0.9);
    font-size: $font-size-xs;
    letter-spacing: 0.02em;
  }

  &__timestamps {
    font-size: $font-size-sm;
    color: color-var-alpha("color-text-secondary", 0.85);
  }

  &__edited {
    color: color-var-alpha("color-text-secondary", 0.7);
  }

  &__body {
    margin-top: $space-sm;
  }

  &__reply-to {
    display: inline-flex;
    align-items: center;
    gap: $space-xs;
    margin-top: $space-sm;
    padding: 6px 10px;
    border-radius: $border-radius-full;
    background: color-var-alpha("color-bg-secondary", 0.6);
    border: 1px solid color-var-alpha("panel-border", 0.35);
    width: fit-content;
  }

  &__reply-label {
    font-size: $font-size-xs;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: color-var-alpha("color-text-secondary", 0.9);
  }

  &__reply-link {
    border: none;
    background: transparent;
    color: $color-primary;
    font-weight: 600;
    cursor: pointer;
    padding: 0;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: color 0.18s ease;

    &:hover {
      color: $color-accent;
      text-decoration: underline;
    }
  }

  &__text {
    margin: 0;
    white-space: pre-wrap;
    color: $color-text-primary;
    line-height: 1.65;
  }

  &__attachments {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: $space-sm;
    margin-top: $space-sm;
  }

  &__attachment {
    border-radius: $border-radius-lg;
    overflow: hidden;
    border: 1px solid color-var-alpha("panel-border", 0.35);
    background: color-var-alpha("color-bg-secondary", 0.55);
    height: 160px;
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease;

    img,
    iframe {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 26px color-var-alpha("color-text-primary", 0.12);
    }
  }

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: $space-md;
    gap: $space-sm;
    flex-wrap: wrap;
    border-top: 1px solid color-var-alpha("panel-border", 0.25);
    padding-top: $space-sm;
  }

  &__actions-row {
    display: flex;
    gap: $space-xs;
    align-items: center;
    flex-wrap: wrap;
  }

  &__edit-actions {
    display: flex;
    gap: $space-xs;
  }

  &__replies {
    margin-top: $space-md;
    padding-left: $space-md;
    border-left: 1px dashed color-var-alpha("panel-border", 0.35);
  }
}

.forum-message__inline-reply {
  margin-top: $space-md;

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
