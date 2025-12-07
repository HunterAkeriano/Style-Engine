<template>
  <Card v-if="canReply" variant="bordered" class="forum-reply">
    <div class="forum-reply__header">
      <div>
        <h3>{{ title }}</h3>
        <p class="forum-reply__hint">{{ hint }}</p>
      </div>
      <span class="forum-reply__pill">{{ totalLabel }}</span>
    </div>

    <div v-if="replyingTo" class="forum-reply__replying">
      <span>{{ replyingToLabel }}</span>
      <Button size="sm" variant="ghost" @click="emit('cancel-reply')">{{
        cancelReplyLabel
      }}</Button>
    </div>

    <Textarea
      name="content"
      v-model="contentModel"
      :rows="5"
      :disabled="!canReply || sending"
      :placeholder="placeholder"
      :error="contentError"
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
        <Button
          size="sm"
          variant="secondary"
          :disabled="!canReply || sending"
          @click.prevent="fileInput?.click()"
        >
          {{ t("FORUM.TOPIC.ADD_IMAGE") }}
        </Button>
        <div v-if="allowVideo" class="forum-reply__youtube">
          <Input
            v-model="youtube"
            type="url"
            :placeholder="t('FORUM.TOPIC.YOUTUBE_PLACEHOLDER')"
            class="forum-reply__youtube-input"
          />
          <Button
            size="sm"
            variant="outline"
            :disabled="!canReply"
            @click.prevent="addYoutube"
          >
            {{ t("FORUM.TOPIC.ADD_VIDEO") }}
          </Button>
        </div>
      </div>
      <Button :disabled="!canReply || sending" size="sm" @click="submit">
        {{ sending ? t("FORUM.TOPIC.SENDING") : sendLabel }}
      </Button>
    </div>

    <div v-if="attachments.length" class="forum-reply__attachment-chips">
      <div
        v-for="(item, index) in attachments"
        :key="`${item.url}-${index}`"
        class="forum-reply__chip"
      >
        <span>{{
          item.type === "image"
            ? t("FORUM.TOPIC.IMAGE")
            : t("FORUM.TOPIC.VIDEO")
        }}</span>
        <button type="button" @click="removeAttachment(index)">
          {{ t("FORUM.TOPIC.REMOVE") }}
        </button>
      </div>
    </div>
    <p v-if="attachmentsError" class="forum-reply__error">
      {{ attachmentsError }}
    </p>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import type { ForumAttachmentDraft } from "@/entities/forum";
import type { ForumMessage } from "@/shared/api/forum";
import { Button, Card, Input, Textarea } from "@/shared/ui";
import { buildReplyFormSchema } from "@/entities/forum/lib/forum-validation";
import { useZodForm } from "@/shared/lib/form/zodForm";

const props = withDefaults(
  defineProps<{
    canReply: boolean;
    sendLabel: string;
    title: string;
    hint: string;
    totalLabel: string;
    placeholder: string;
    allowVideo?: boolean;
    maxAttachments?: number;
    sending?: boolean;
    replyingTo?: ForumMessage | null;
    cancelReplyLabel?: string;
  }>(),
  {
    allowVideo: false,
    maxAttachments: 5,
    sending: false,
    replyingTo: null,
    cancelReplyLabel: "",
  },
);

const emit = defineEmits<{
  (
    e: "submit",
    payload: { content: string; attachments: ForumAttachmentDraft[] },
  ): void;
  (e: "cancel-reply"): void;
  (e: "replying-to", payload: ForumMessage | null): void;
}>();

const { t } = useI18n();

const youtube = ref("");
const fileInput = ref<HTMLInputElement | null>(null);
const cancelReplyLabel = computed(
  () => props.cancelReplyLabel || t("FORUM.TOPIC.CANCEL_REPLY"),
);
const replySchema = computed(() =>
  buildReplyFormSchema({
    allowVideo: props.allowVideo,
    maxAttachments: props.maxAttachments,
    messages: {
      contentMin: t("FORUM.TOPIC.REPLY_REQUIRED"),
      contentMax: t("FORUM.TOPIC.REPLY_TOO_LONG"),
      youtube: t("FORUM.TOPIC.YOUTUBE_INVALID"),
      attachmentsLimit: t("FORUM.TOPIC.ATTACH_LIMIT", {
        limit: props.maxAttachments,
      }),
      videoNotAllowed: t("FORUM.TOPIC.YOUTUBE_INVALID"),
      titleMin: t("FORUM.TOPIC.REPLY_REQUIRED"),
      titleMax: t("FORUM.TOPIC.REPLY_REQUIRED"),
      descriptionMin: t("FORUM.TOPIC.REPLY_REQUIRED"),
      descriptionMax: t("FORUM.TOPIC.REPLY_REQUIRED"),
    },
  }),
);
const form = useZodForm(replySchema, {
  content: "",
  attachments: [],
});
const contentModel = computed({
  get: () => (form.values.content as string) || "",
  set: (val: string) => form.setValue("content", val),
});
const attachments = computed<ForumAttachmentDraft[]>(
  () => form.values.attachments || [],
);
const contentError = computed(() => form.errors.content || "");
const attachmentsError = computed(() => form.errors.attachments || "");

watch(
  () => props.replyingTo,
  () => emit("replying-to", props.replyingTo),
);

watch(
  [() => form.values.content, () => form.values.attachments],
  () => {
    validateField("content");
    validateField("attachments");
  },
  { deep: true },
);

const replyingToLabel = computed(() => {
  if (!props.replyingTo) return "";
  return t("FORUM.TOPIC.REPLYING_TO", {
    name:
      props.replyingTo.author?.name ||
      props.replyingTo.author?.email ||
      t("FORUM.ANON"),
  });
});

function addYoutube() {
  if (!youtube.value) return;
  const match = youtube.value.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{6,})/i);
  if (!match) {
    form.errors.attachments = t("FORUM.TOPIC.YOUTUBE_INVALID");
    return;
  }
  const next = [...attachments.value];
  next.push({
    type: "youtube",
    url: `https://www.youtube.com/embed/${match[1]}`,
  });
  const parsed = replySchema.value.shape.attachments.safeParse(next);
  if (!parsed.success) {
    form.errors.attachments = parsed.error.issues[0]?.message || "";
    return;
  }
  form.errors.attachments = "";
  form.setValue("attachments", parsed.data);
  youtube.value = "";
}

function onFiles(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files || !files.length) return;
  form.errors.attachments = "";
  const toUpload = Array.from(files);
  const next: ForumAttachmentDraft[] = [...attachments.value];
  for (const file of toUpload) {
    next.push({
      type: "image",
      file,
      preview: URL.createObjectURL(file),
      url: "",
    });
    const parsed = replySchema.value.shape.attachments.safeParse(next);
    if (!parsed.success) {
      form.errors.attachments = parsed.error.issues[0]?.message || "";
      break;
    }
    form.setValue("attachments", parsed.data);
  }
  target.value = "";
  validateField("attachments");
}

function removeAttachment(index: number) {
  const item = attachments.value[index];
  if (item?.preview) URL.revokeObjectURL(item.preview);
  attachments.value.splice(index, 1);
}

function submit() {
  form.errors.content = "";
  form.errors.attachments = "";
  const parsed = validateAll();
  if (!parsed) return;

  emit("submit", parsed);
  form.setValue("content", "");
  form.setValue("attachments", []);
  youtube.value = "";
}

function validateField(field: "content" | "attachments") {
  form.errors.content = "";
  form.errors.attachments = "";
  const parsed = replySchema.value.safeParse({
    content: form.values.content,
    attachments: form.values.attachments,
  });
  if (!parsed.success) {
    if (field === "content") {
      form.errors.content =
        parsed.error.issues.find((i) => i.path[0] === "content")?.message || "";
    }
    if (field === "attachments") {
      form.errors.attachments =
        parsed.error.issues.find((i) => i.path[0] === "attachments")?.message ||
        "";
    }
    return null;
  }
  if (field === "content") form.errors.content = "";
  if (field === "attachments") form.errors.attachments = "";
  return parsed.data;
}

function validateAll() {
  const parsed = replySchema.value.safeParse({
    content: form.values.content,
    attachments: form.values.attachments,
  });
  if (!parsed.success) {
    validateField("content");
    validateField("attachments");
    return null;
  }
  form.errors.content = "";
  form.errors.attachments = "";
  return parsed.data;
}

defineExpose({
  setContent: (value: string) => form.setValue("content", value),
});
</script>

<style scoped lang="scss" src="./forum-reply-form.scss"></style>
