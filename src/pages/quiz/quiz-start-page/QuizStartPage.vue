<template>
  <div class="quiz-start-page">
    <div class="quiz-start-page__background">
      <span class="quiz-start-page__beam quiz-start-page__beam_left"></span>
      <span class="quiz-start-page__beam quiz-start-page__beam_right"></span>
      <span class="quiz-start-page__grid-lines"></span>
    </div>

    <div class="container">
      <Breadcrumbs />

      <section class="quiz-start-page__hero">
        <div class="quiz-start-page__hero-badge">
          {{ t("QUIZ.HERO_BADGE") }}
        </div>
        <h1 class="quiz-start-page__title">{{ t("QUIZ.HERO_TITLE") }}</h1>
        <p class="quiz-start-page__subtitle">{{ t("QUIZ.HERO_SUBTITLE") }}</p>

        <div class="quiz-start-page__hero-content">
          <div class="quiz-start-page__stats">
            <div class="quiz-start-page__stat-card">
              <div class="quiz-start-page__stat-value">{{ t("QUIZ.STATS_QUESTIONS") }}</div>
              <div class="quiz-start-page__stat-label">{{ t("QUIZ.STATS_QUESTIONS_LABEL") }}</div>
            </div>
            <div class="quiz-start-page__stat-card">
              <div class="quiz-start-page__stat-value">{{ t("QUIZ.STATS_CATEGORIES") }}</div>
              <div class="quiz-start-page__stat-label">{{ t("QUIZ.STATS_CATEGORIES_LABEL") }}</div>
            </div>
            <div class="quiz-start-page__stat-card">
              <div class="quiz-start-page__stat-value">{{ t("QUIZ.STATS_TIME") }}</div>
              <div class="quiz-start-page__stat-label">{{ t("QUIZ.STATS_TIME_LABEL") }}</div>
            </div>
          </div>

          <div
            v-if="limitInfo && !limitInfo.allowed"
            class="quiz-start-page__limit-warning"
          >
            <div class="quiz-start-page__limit-icon">⚠</div>
            <div class="quiz-start-page__limit-content">
              <p class="quiz-start-page__limit-text">
                {{ t("QUIZ.LIMIT_REACHED", { limit: limitInfo.limit }) }}
              </p>
              <p v-if="!authStore.isAuthenticated" class="quiz-start-page__limit-action">
                {{ t("QUIZ.LOGIN_TO_GET_MORE") }}
              </p>
              <p v-else-if="authStore.userPlan === 'free'" class="quiz-start-page__limit-action">
                {{ t("QUIZ.UPGRADE_TO_GET_MORE") }}
              </p>
            </div>
          </div>

          <div
            v-if="limitInfo && limitInfo.allowed"
            class="quiz-start-page__limit-info"
          >
            <div class="quiz-start-page__limit-icon-success">✓</div>
            <span>{{ attemptsText }}</span>
          </div>

          <Button
            class="quiz-start-page__start-button"
            :disabled="!limitInfo?.allowed"
            @click="showModal = true"
          >
            <span class="quiz-start-page__button-text">{{ t("QUIZ.START_TEST") }}</span>
            <span class="quiz-start-page__button-icon">→</span>
          </Button>
        </div>
      </section>

      <section class="quiz-start-page__features">
        <div class="quiz-start-page__features-header">
          <span class="quiz-start-page__features-tag">{{ t("QUIZ.FEATURES_TAG") }}</span>
          <h2 class="quiz-start-page__features-title">{{ t("QUIZ.FEATURES_TITLE") }}</h2>
        </div>
        <div class="quiz-start-page__features-grid">
          <div class="quiz-start-page__feature-card">
            <div class="quiz-start-page__feature-icon">⚡</div>
            <h3 class="quiz-start-page__feature-title">{{ t("QUIZ.FEATURE_1_TITLE") }}</h3>
            <p class="quiz-start-page__feature-description">{{ t("QUIZ.FEATURE_1_DESC") }}</p>
          </div>
          <div class="quiz-start-page__feature-card">
            <div class="quiz-start-page__feature-icon">🎯</div>
            <h3 class="quiz-start-page__feature-title">{{ t("QUIZ.FEATURE_2_TITLE") }}</h3>
            <p class="quiz-start-page__feature-description">{{ t("QUIZ.FEATURE_2_DESC") }}</p>
          </div>
          <div class="quiz-start-page__feature-card">
            <div class="quiz-start-page__feature-icon">📊</div>
            <h3 class="quiz-start-page__feature-title">{{ t("QUIZ.FEATURE_3_TITLE") }}</h3>
            <p class="quiz-start-page__feature-description">{{ t("QUIZ.FEATURE_3_DESC") }}</p>
          </div>
          <div class="quiz-start-page__feature-card">
            <div class="quiz-start-page__feature-icon">🏆</div>
            <h3 class="quiz-start-page__feature-title">{{ t("QUIZ.FEATURE_4_TITLE") }}</h3>
            <p class="quiz-start-page__feature-description">{{ t("QUIZ.FEATURE_4_DESC") }}</p>
          </div>
        </div>
      </section>

      <section class="quiz-start-page__leaderboard">
        <div class="quiz-start-page__leaderboard-header">
          <div>
            <span class="quiz-start-page__leaderboard-tag">{{ t("QUIZ.LEADERBOARD_TAG") }}</span>
            <h2 class="quiz-start-page__section-title">
              {{ t("QUIZ.LEADERBOARD_TITLE") }}
            </h2>
          </div>
        </div>
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
      </section>

      <section class="quiz-start-page__support">
        <div class="quiz-start-page__support-content">
          <span class="quiz-start-page__support-tag">{{ t("QUIZ.SUPPORT_TAG") }}</span>
          <h2 class="quiz-start-page__section-title">
            {{ t("QUIZ.SUPPORT_TITLE") }}
          </h2>
          <p class="quiz-start-page__support-description">
            {{ t("QUIZ.SUPPORT_DESCRIPTION") }}
          </p>
          <Button
            class="quiz-start-page__support-button"
            @click="openContactWidget"
          >
            {{ t("QUIZ.CONTACT_US") }}
          </Button>
        </div>
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
