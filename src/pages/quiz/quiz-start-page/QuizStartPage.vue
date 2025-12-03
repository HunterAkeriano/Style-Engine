<template>
  <div class="quiz-start-page">
    <div class="container">
      <Breadcrumbs />

      <section class="quiz-start-page__hero">
        <h1 class="quiz-start-page__title">{{ t("QUIZ.HERO_TITLE") }}</h1>
        <p class="quiz-start-page__subtitle">{{ t("QUIZ.HERO_SUBTITLE") }}</p>

        <div class="quiz-start-page__hero-content">
          <div class="quiz-start-page__importance">
            <h2 class="quiz-start-page__importance-title">
              {{ t("QUIZ.WHY_TESTING_TITLE") }}
            </h2>
            <ul class="quiz-start-page__importance-list">
              <li class="quiz-start-page__importance-item">
                {{ t("QUIZ.WHY_TESTING_REASONS.REASON1") }}
              </li>
              <li class="quiz-start-page__importance-item">
                {{ t("QUIZ.WHY_TESTING_REASONS.REASON2") }}
              </li>
              <li class="quiz-start-page__importance-item">
                {{ t("QUIZ.WHY_TESTING_REASONS.REASON3") }}
              </li>
              <li class="quiz-start-page__importance-item">
                {{ t("QUIZ.WHY_TESTING_REASONS.REASON4") }}
              </li>
            </ul>
          </div>

          <div
            v-if="limitInfo && !limitInfo.allowed"
            class="quiz-start-page__limit-warning"
          >
            <p>{{ t("QUIZ.LIMIT_REACHED", { limit: limitInfo.limit }) }}</p>
            <p v-if="!authStore.isAuthenticated">
              {{ t("QUIZ.LOGIN_TO_GET_MORE") }}
            </p>
            <p v-else-if="authStore.userPlan === 'free'">
              {{ t("QUIZ.UPGRADE_TO_GET_MORE") }}
            </p>
          </div>

        <div
          v-if="limitInfo && limitInfo.allowed"
          class="quiz-start-page__limit-info"
        >
          {{ attemptsText }}
        </div>

          <Button
            class="quiz-start-page__start-button"
            :disabled="!limitInfo?.allowed"
            @click="showModal = true"
          >
            {{ t("QUIZ.START_TEST") }}
          </Button>
        </div>
      </section>

      <QuizLeaderboardSection
        :title="t('QUIZ.LEADERBOARD_TITLE')"
        :rows="leaderboardRows"
        :loading="loadingLeaderboard"
        :category-options="categoryOptions"
        :selected-category="selectedCategory"
        :page-size="pageSize"
        :page-size-options="pageSizeOptions"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-rows="leaderboard.length"
        :display-from="displayFrom"
        :display-to="displayTo"
        :row-key="rowKey"
        :empty-text="t('QUIZ.NO_RESULTS')"
        :loading-text="t('QUIZ.LOADING')"
        @change-category="handleCategoryChange"
        @page-size-change="handlePageSizeChange"
        @page-change="goToPage"
      />

      <section class="quiz-start-page__support">
        <h2 class="quiz-start-page__section-title">
          {{ t("QUIZ.SUPPORT_TITLE") }}
        </h2>
        <p class="quiz-start-page__support-description">
          {{ t("QUIZ.SUPPORT_DESCRIPTION") }}
        </p>

        <ul class="quiz-start-page__support-list">
          <li class="quiz-start-page__support-item">
            {{ t("QUIZ.SUPPORT_REASONS.REASON1") }}
          </li>
          <li class="quiz-start-page__support-item">
            {{ t("QUIZ.SUPPORT_REASONS.REASON2") }}
          </li>
          <li class="quiz-start-page__support-item">
            {{ t("QUIZ.SUPPORT_REASONS.REASON3") }}
          </li>
        </ul>

        <Button
          class="quiz-start-page__support-button"
          @click="openContactWidget"
        >
          {{ t("QUIZ.CONTACT_US") }}
        </Button>
      </section>
    </div>

    <QuizTestModal
      :is-open="showModal"
      :questions-count="10"
      :time-per-question-prop="60"
      @close="showModal = false"
      @test-completed="handleTestCompleted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { checkQuizLimit, getQuizLeaderboard } from "@/shared/api/quiz";
import { useAuthStore } from "@/entities/user/model/auth-store";
import { Breadcrumbs } from "@/widgets/common";
import Button from "@/shared/ui/Button/Button.vue";
import QuizTestModal from "@/widgets/quiz/QuizTestModal/QuizTestModal.vue";
import QuizLeaderboardSection from "@/widgets/quiz/QuizLeaderboardSection/QuizLeaderboardSection.vue";
import type {
  QuizAttemptLimit,
  QuizResultCategory,
  QuizLeaderboardEntry,
} from "@/shared/types/quiz";

const { t } = useI18n();
const authStore = useAuthStore();

const showModal = ref(false);
const limitInfo = ref<QuizAttemptLimit | null>(null);
const selectedCategory = ref<QuizResultCategory | "all">("all");
const loadingLeaderboard = ref(true);
const leaderboard = ref<QuizLeaderboardEntry[]>([]);
const pageSize = ref<number>(10);
const currentPage = ref(1);
const attemptsText = computed(() => {
  if (!limitInfo.value) return "";
  const { remaining, limit } = limitInfo.value;
  if (remaining === -1 || limit === -1) {
    return t("QUIZ.ATTEMPTS_REMAINING_INFINITE");
  }
  return t("QUIZ.ATTEMPTS_REMAINING", { remaining, limit });
});

const categoryOptions = computed(() => [
  { value: "all", label: t("QUIZ.ALL_CATEGORIES") },
  { value: "css", label: t("QUIZ.CATEGORIES.CSS") },
  { value: "scss", label: t("QUIZ.CATEGORIES.SCSS") },
  { value: "stylus", label: t("QUIZ.CATEGORIES.STYLUS") },
  { value: "mix", label: t("QUIZ.CATEGORIES.MIX") },
]);

const pageSizeOptions = computed(() =>
  [5, 10, 20, 50].map((size) => ({ value: size, label: String(size) })),
);

const leaderboardRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return leaderboard.value.slice(start, end);
});

const totalPages = computed(() => {
  if (!leaderboard.value.length) return 1;
  return Math.max(1, Math.ceil(leaderboard.value.length / pageSize.value));
});

const displayFrom = computed(() => {
  if (!leaderboard.value.length) return 0;
  return (currentPage.value - 1) * pageSize.value + 1;
});

const displayTo = computed(() => {
  if (!leaderboard.value.length) return 0;
  return Math.min(
    displayFrom.value + pageSize.value - 1,
    leaderboard.value.length,
  );
});

onMounted(async () => {
  try {
    limitInfo.value = await checkQuizLimit();
  } catch (error) {
    console.error("Failed to check limit:", error);
  }

  await loadLeaderboard();
});

function handleCategoryChange(value: QuizResultCategory | "all") {
  selectedCategory.value = value;
  loadLeaderboard();
}

async function loadLeaderboard() {
  try {
    loadingLeaderboard.value = true;
    currentPage.value = 1;
    leaderboard.value = await getQuizLeaderboard(selectedCategory.value, 50);
  } catch (error) {
    console.error("Failed to load leaderboard:", error);
  } finally {
    loadingLeaderboard.value = false;
  }
}

async function handleTestCompleted() {
  try {
    limitInfo.value = await checkQuizLimit();
    await loadLeaderboard();
  } catch (error) {
    console.error("Failed to refresh data:", error);
  }
}

function rowKey(row: any, index: number) {
  return `${row.username}-${row.createdAt}-${index}`;
}

function handlePageSizeChange(value: string | number) {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) return;
  pageSize.value = parsed;
  currentPage.value = 1;
}

function goToPage(direction: "prev" | "next") {
  if (!leaderboard.value.length) return;
  const maxPage = totalPages.value;
  const next =
    direction === "prev" ? currentPage.value - 1 : currentPage.value + 1;
  currentPage.value = Math.min(Math.max(1, next), maxPage);
}

watch(leaderboard, () => {
  const maxPage = totalPages.value;
  if (currentPage.value > maxPage) {
    currentPage.value = maxPage;
  }
});

function openContactWidget() {
  const contactTrigger = document.querySelector(
    ".contact-widget__trigger",
  ) as HTMLElement;
  if (contactTrigger) {
    contactTrigger.click();
  }
}
</script>

<style scoped lang="scss" src="./QuizStartPage.scss"></style>
