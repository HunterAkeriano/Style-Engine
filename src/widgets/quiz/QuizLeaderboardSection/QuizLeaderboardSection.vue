<template>
  <section class="quiz-leaderboard-section">
    <div class="quiz-leaderboard-section__header">
      <h2 class="quiz-leaderboard-section__title">{{ title }}</h2>
      <Select
        v-model="internalCategory"
        :options="categoryOptions"
        class="quiz-leaderboard-section__category-select"
        @change="handleCategoryChange"
      />
    </div>

    <div
      v-if="loading && !rows.length"
      class="quiz-leaderboard-section__loading"
    >
      {{ loadingText }}
    </div>

    <div
      v-else
      class="quiz-leaderboard-section__table-wrapper"
      :class="{ 'quiz-leaderboard-section__table-wrapper_refreshing': loading }"
    >
      <Table
        :columns="columns"
        :rows="tableRows"
        :row-key="rowKey"
        :empty-text="emptyText"
        hoverable
        striped
      >
        <template #cell-rank="{ row }: { row: any }">
          <span :class="rankClass(row.rank)">{{ row.rank }}</span>
        </template>

        <template #cell-score="{ row }: { row: any }">
          {{ row.score }}/{{ row.totalQuestions }}
        </template>

        <template #cell-username="{ row }: { row: any }">
          <div class="quiz-leaderboard-section__user">
            <div
              class="quiz-leaderboard-section__avatar"
              :class="{
                'quiz-leaderboard-section__avatar_skeleton': !row.avatarUrl,
              }"
            >
              <img
                v-if="row.avatarUrl"
                :src="row.avatarUrl || ''"
                alt=""
                loading="lazy"
              />
              <span v-else class="quiz-leaderboard-section__avatar-initials">{{
                getInitials(row.username)
              }}</span>
            </div>
            <div class="quiz-leaderboard-section__user-meta">
              <div class="quiz-leaderboard-section__username-wrap">
                <Icon
                  v-if="isPaid(row.subscriptionTier)"
                  :size="16"
                  :class="['quiz-leaderboard-section__crown', { 'quiz-leaderboard-section__crown_premium': row.subscriptionTier === 'premium' }]"
                  name="icon-crown"
                />
                <span class="quiz-leaderboard-section__username">{{ row.username }}</span>
              </div>
              <span v-if="row.email" class="quiz-leaderboard-section__email">{{ row.email }}</span>
            </div>
          </div>
        </template>

        <template #cell-category="{ row }: { row: any }">
          {{ categoryLabel(row.category) }}
        </template>

        <template #cell-time="{ row }: { row: any }">
          {{ formatTime(row.timeTaken) }}
        </template>
      </Table>

      <div v-if="loading" class="quiz-leaderboard-section__refreshing-overlay">
        <div class="quiz-leaderboard-section__refreshing-spinner"></div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import Select from "@/shared/ui/Select/Select.vue";
import Table from "@/shared/ui/table/Table.vue";
import type { SelectOption } from "@/shared/ui/Select/types";
import type { TableColumn, RowData } from "@/shared/ui/table/Table.vue";
import type { QuizResultCategory } from "@/shared/types/quiz";
import { Icon } from "@/shared/ui";

interface Props {
  title: string;
  rows: RowData[];
  loading?: boolean;
  categoryOptions?: SelectOption[];
  selectedCategory?: QuizResultCategory | "all";
  pageSize?: number;
  pageSizeOptions?: SelectOption[];
  currentPage?: number;
  totalPages?: number;
  totalRows?: number;
  displayFrom?: number;
  displayTo?: number;
  rowKey: (row: RowData, index: number) => string;
  emptyText?: string;
  loadingText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  categoryOptions: () => [],
  selectedCategory: "all",
  pageSize: 10,
  pageSizeOptions: () => [],
  currentPage: 1,
  totalPages: 1,
  totalRows: 0,
  displayFrom: 0,
  displayTo: 0,
  emptyText: "",
  loadingText: "",
});

const emit = defineEmits<{
  (e: "change-category", value: QuizResultCategory | "all"): void;
  (e: "page-size-change", value: number): void;
  (e: "page-change", direction: "prev" | "next"): void;
}>();

const { t } = useI18n();
const internalCategory = ref<QuizResultCategory | "all">(
  props.selectedCategory,
);
const internalPageSize = ref<number>(props.pageSize);

watch(
  () => props.selectedCategory,
  (value) => {
    internalCategory.value = value;
  },
);

watch(
  () => props.pageSize,
  (value) => {
    internalPageSize.value = value;
  },
);

const columns = computed<TableColumn[]>(() => [
  { key: "rank", label: t("QUIZ.RANK"), width: "80px", align: "center" },
  { key: "username", label: t("QUIZ.USER") },
  { key: "score", label: t("QUIZ.SCORE"), width: "120px" },
  {
    key: "category",
    label: t("QUIZ.CATEGORY"),
    width: "100px",
    hideOnMobile: true,
  },
  { key: "time", label: t("QUIZ.TIME"), width: "100px", hideOnMobile: true },
]);

const tableRows = computed<RowData[]>(() => props.rows);

function handleCategoryChange(value: string | number) {
  emit("change-category", value as QuizResultCategory | "all");
}

function rankClass(rank: number) {
  return {
    "quiz-leaderboard-section__rank_gold": rank === 1,
    "quiz-leaderboard-section__rank_silver": rank === 2,
    "quiz-leaderboard-section__rank_bronze": rank === 3,
  };
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, "0")}`;
}

function getInitials(name: string) {
  if (!name) return "?";
  const namePart = name.includes("@") ? name.split("@")[0] : name;
  const parts = namePart.split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

function categoryLabel(category: string) {
  return t(`QUIZ.CATEGORIES.${category.toUpperCase()}`);
}

function isPaid(tier?: string) {
  return tier && tier !== "free";
}
</script>

<style scoped lang="scss" src="./QuizLeaderboardSection.scss"></style>
