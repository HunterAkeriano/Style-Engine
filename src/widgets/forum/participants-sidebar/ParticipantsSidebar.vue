<template>
  <div class="participants-sidebar">
    <div class="participants-sidebar__header">
      <h3 class="participants-sidebar__title">{{ topicTitle }}</h3>
    </div>

    <div class="participants-sidebar__list">
      <div
        v-for="participant in participants"
        :key="participant.id"
        class="participant"
      >
        <div class="participant__info">
          <div class="participant__avatar-wrapper">
            <div
              class="participant__avatar"
              :data-initials="getInitials(participant)"
            >
              <img
                v-if="participant.avatarUrl"
                :src="participant.avatarUrl"
                alt=""
              />
              <span v-else>{{ getInitials(participant) }}</span>
            </div>
            <Icon
              v-if="participant.subscriptionTier === 'pro'"
              name="icon-crown"
              class="participant__crown participant__crown_pro"
            />
            <Icon
              v-if="participant.subscriptionTier === 'premium'"
              name="icon-crown"
              class="participant__crown participant__crown_premium"
            />
          </div>
          <div class="participant__details">
            <div class="participant__name">
              {{ participant.name || participant.email || t("FORUM.ANON") }}
            </div>
            <div v-if="isModerator(participant)" class="participant__role">
              {{ t("FORUM.ADMIN") }}
            </div>
            <div v-if="participant.muted" class="participant__muted">
              {{ t("FORUM.MUTED_BADGE") }}
            </div>
          </div>
        </div>

        <div
          v-if="canModerate && participant.id !== currentUserId"
          class="participant__actions"
        >
          <Button
            size="sm"
            variant="outline"
            @click="$emit('mute', participant)"
          >
            {{ t("FORUM.MUTE") }}
          </Button>
          <Button
            size="sm"
            variant="outline"
            @click="$emit('delete-messages', participant)"
          >
            {{ t("FORUM.DELETE") }}
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type ForumUser } from "@/shared/api/forum";
import { Button, Icon } from "@/shared/ui";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps<{
  topicTitle: string;
  participants: ForumUser[];
  canModerate: boolean;
  currentUserId: string;
}>();

defineEmits<{
  (e: "mute", participant: ForumUser): void;
  (e: "delete-messages", participant: ForumUser): void;
}>();

function getInitials(user: ForumUser) {
  if (!user) return "??";
  const name = user.name || user.email || "";
  const parts = name.split(" ");
  if (parts.length >= 2)
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function isModerator(user: ForumUser) {
  return user.role === "moderator" || user.role === "super_admin";
}
</script>

<style scoped lang="scss">
@import "./participants-sidebar.scss";
</style>
