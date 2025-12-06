import { onMounted, onBeforeUnmount, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/entities";
import { useToast } from "./toast";
import {
  getUserOpenTopics,
  openNotificationStream,
  type TopicNotification,
} from "@/shared/api/forum";

export function useForumNotifications() {
  const authStore = useAuthStore();
  const router = useRouter();
  const { t, locale } = useI18n();
  const toast = useToast();

  const hasOpenTopics = ref(false);
  let stopStream: (() => void) | null = null;

  async function checkAndConnect() {
    if (!authStore.isAuthenticated || !authStore.user?.id) {
      disconnect();
      return;
    }

    try {
      const { topics } = await getUserOpenTopics();
      hasOpenTopics.value = topics.length > 0;

      if (hasOpenTopics.value) {
        connect();
      } else {
        disconnect();
      }
    } catch (error) {
      console.error("Failed to check user topics:", error);
      disconnect();
    }
  }

  function connect() {
    if (!authStore.user?.id) return;

    disconnect();

    stopStream = openNotificationStream(authStore.user.id, {
      onTopicReply: handleNotification,
      onError: (error) => {
        console.error("Notification stream error:", error);
      },
    });
  }

  function disconnect() {
    if (stopStream) {
      stopStream();
      stopStream = null;
    }
  }

  function handleNotification(notification: TopicNotification) {
    const authorName = notification.author.name || t("FORUM.ANON");
    const message = t("FORUM.TOPIC.NOTIFICATION_REPLY_FROM", {
      author: authorName,
      title: notification.topicTitle,
    });

    toast.info(message, {
      timeout: 8000,
      onClick: () => {
        router.push(`/${locale.value}/forum/${notification.topicId}`);
      },
    });
  }

  onMounted(() => {
    checkAndConnect();
  });

  onBeforeUnmount(() => {
    disconnect();
  });

  return {
    hasOpenTopics,
    checkAndConnect,
    disconnect,
  };
}
