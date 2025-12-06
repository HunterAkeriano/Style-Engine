<template>
  <div class="forum-page">
    <section class="forum-page__hero">
      <div class="forum-page__eyebrow">{{ t("FORUM.TAG") }}</div>
      <div class="forum-page__header">
        <div>
          <h1 class="forum-page__title">{{ t("FORUM.TITLE") }}</h1>
          <p class="forum-page__subtitle">{{ t("FORUM.SUBTITLE") }}</p>
        </div>
        <div class="forum-page__header-actions">
          <Select
            v-model="pagination.limit"
            :options="pageSizeOptions"
            :label="t('FORUM.PER_PAGE')"
            size="md"
            @update:modelValue="handleLimitChange"
          />
          <Select
            v-model="statusFilter"
            :options="statusOptions"
            :label="t('FORUM.STATUS_FILTER')"
            size="md"
            @update:modelValue="handleStatusChange"
          />
          <Button
            size="md"
            class="forum-page__create"
            @click="handleCreateClick"
          >
            {{ t("FORUM.CREATE_BUTTON") }}
          </Button>
        </div>
      </div>
    </section>

    <Card variant="bordered" class="forum-page__card">
      <div class="forum-page__table-header">
        <div class="forum-page__hint">{{ t("FORUM.TABLE_HINT") }}</div>
        <div class="forum-page__counter">
          {{ t("FORUM.COUNT", { count: pagination.total }) }}
        </div>
      </div>

      <Table
        :columns="columns"
        :rows="topics"
        row-key="id"
        sticky-header
        hoverable
        :empty-text="t(loading ? 'FORUM.LOADING' : 'FORUM.EMPTY')"
        @row-click="handleRowClick"
      >
        <template #cell-title="{ row }">
          <div class="forum-page__topic">
            <div class="forum-page__topic-title">{{ row.title }}</div>
            <p class="forum-page__topic-desc">{{ row.description }}</p>
          </div>
        </template>
        <template #cell-status="{ value }">
          <span :class="['forum-page__status', `forum-page__status_${value}`]">
            {{ statusLabels[value as ForumStatus] }}
          </span>
        </template>
        <template #cell-messagesCount="{ value }">
          <span class="forum-page__badge">{{ value as number }}</span>
        </template>
        <template #cell-lastActivityAt="{ value }">
          {{ formatDate(value as string) }}
        </template>
        <template #cell-owner="{ row }">
          <div class="forum-page__owner">
            <div
              class="forum-page__avatar"
              :data-initials="getInitials(getOwner(row))"
            >
              <img
                v-if="getOwner(row)?.avatarUrl"
                :src="getOwner(row)?.avatarUrl || ''"
                alt=""
              />
              <span v-else>{{ getInitials(getOwner(row)) }}</span>
            </div>
            <div>
              <div class="forum-page__owner-name">
                {{
                  getOwner(row)?.name || getOwner(row)?.email || t("FORUM.ANON")
                }}
              </div>
              <div v-if="getOwner(row)?.isAdmin" class="forum-page__owner-role">
                {{ t("FORUM.ADMIN") }}
              </div>
              <Icon
                v-if="planTier(getOwner(row)) !== 'free'"
                name="icon-crown"
                class="forum-page__owner-crown"
                :class="`forum-page__owner-crown_${planClass(
                  planTier(getOwner(row)),
                )}`"
              />
            </div>
          </div>
        </template>
      </Table>

      <div v-if="pagination.totalPages > 1" class="forum-page__pagination">
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page === 1 || loading"
          @click="changePage(pagination.page - 1)"
        >
          {{ t("FORUM.PREV") }}
        </Button>
        <div class="forum-page__page-info">
          {{
            t("FORUM.PAGE_OF", {
              page: pagination.page,
              total: pagination.totalPages,
            })
          }}
        </div>
        <Button
          variant="outline"
          size="sm"
          :disabled="pagination.page >= pagination.totalPages || loading"
          @click="changePage(pagination.page + 1)"
        >
          {{ t("FORUM.NEXT") }}
        </Button>
      </div>
    </Card>

    <Modal
      :visible="showAuthModal"
      :title="t('FORUM.AUTH_REQUIRED_TITLE')"
      :subtitle="t('FORUM.AUTH_REQUIRED_TEXT')"
      show-actions
      :confirm-text="t('FORUM.GO_TO_LOGIN')"
      :cancel-text="t('COMMON.CANCEL')"
      @confirm="goToLogin"
      @close="showAuthModal = false"
    >
      <p class="forum-page__modal-text">{{ t("FORUM.AUTH_REQUIRED_BODY") }}</p>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  Button,
  Card,
  Icon,
  Modal,
  Select,
  Table,
  type TableColumn,
} from "@/shared/ui";
import { useAuthStore } from "@/entities";
import {
  getForumTopics,
  type ForumStatus,
  type ForumTopic,
} from "@/shared/api/forum";
import { useToast } from "@/shared/lib/toast";
import {
  resolvePlanClass,
  type PlanTier,
} from "@/shared/lib/plans";

const { t, locale } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const topics = ref<ForumTopic[]>([]);
const loading = ref(false);
const statusFilter = ref<"all" | ForumStatus>("all");
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasMore: false,
});
const showAuthModal = ref(false);

const statusLabels = computed<Record<ForumStatus, string>>(() => ({
  open: t("FORUM.STATUS.OPEN"),
  in_review: t("FORUM.STATUS.IN_REVIEW"),
  closed: t("FORUM.STATUS.CLOSED"),
}));

const columns = computed<TableColumn[]>(() => [
  { key: "title", label: t("FORUM.TABLE.TOPIC") },
  { key: "status", label: t("FORUM.TABLE.STATUS"), width: "210px" },
  {
    key: "messagesCount",
    label: t("FORUM.TABLE.REPLIES"),
    align: "center",
    width: "120px",
  },
  { key: "lastActivityAt", label: t("FORUM.TABLE.ACTIVITY"), width: "200px" },
  { key: "owner", label: t("FORUM.TABLE.AUTHOR"), width: "220px" },
]);

const pageSizeOptions = computed(() => [
  { value: 5, label: "5" },
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
]);

const statusOptions = computed(() => [
  { value: "all", label: t("FORUM.STATUS.ALL") },
  { value: "open", label: t("FORUM.STATUS.OPEN") },
  { value: "in_review", label: t("FORUM.STATUS.IN_REVIEW") },
  { value: "closed", label: t("FORUM.STATUS.CLOSED") },
]);

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString(locale.value);
  } catch {
    return value;
  }
}

function getInitials(owner: ForumTopic["owner"]) {
  if (!owner) return "??";
  const name = owner.name || owner.email || "";
  const parts = name.split(" ");
  if (parts.length >= 2)
    return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

function getOwner(
  row: ForumTopic | Record<string, unknown>,
): ForumTopic["owner"] {
  return (row as ForumTopic).owner || null;
}

function planTier(owner?: ForumTopic["owner"]): PlanTier {
  return (owner?.subscriptionTier ?? "free") as PlanTier;
}

function planClass(tier?: PlanTier) {
  return resolvePlanClass(tier);
}

async function loadTopics() {
  loading.value = true;
  try {
    const response = await getForumTopics({
      page: pagination.value.page,
      limit: pagination.value.limit,
      status: statusFilter.value === "all" ? undefined : statusFilter.value,
    });
    topics.value = response.topics;
    pagination.value = response.pagination;
  } catch (err: any) {
    toast.error(err?.message || t("FORUM.LOAD_ERROR"));
  } finally {
    loading.value = false;
  }
}

function changePage(page: number) {
  pagination.value.page = page;
  loadTopics();
}

function handleLimitChange() {
  pagination.value.page = 1;
  loadTopics();
}

function handleStatusChange() {
  pagination.value.page = 1;
  loadTopics();
}

function handleRowClick(payload: {
  row: Record<string, unknown>;
  index: number;
}) {
  const topic = payload.row as unknown as ForumTopic;
  if (topic?.id) {
    router.push(`/${locale.value}/forum/${topic.id}`);
  }
}

function handleCreateClick() {
  if (!authStore.isAuthenticated) {
    showAuthModal.value = true;
    return;
  }
  router.push(`/${locale.value}/forum/create`);
}

function goToLogin() {
  showAuthModal.value = false;
  router.push(`/${locale.value}/login?redirect=/${locale.value}/forum/create`);
}

onMounted(() => {
  loadTopics();
});
</script>

<style scoped lang="scss" src="./forum-topic-list.scss"></style>
