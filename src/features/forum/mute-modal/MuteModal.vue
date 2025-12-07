<template>
  <Modal
    :visible="visible"
    :title="t('FORUM.MUTE_USER', { name: userName })"
    show-actions
    :confirm-text="t('FORUM.APPLY_MUTE')"
    :cancel-text="t('COMMON.CANCEL')"
    @confirm="handleConfirm"
    @close="$emit('close')"
  >
    <div class="mute-modal">
      <div class="mute-modal__field">
        <label class="mute-modal__label">{{ t("FORUM.MUTE_DURATION") }}</label>
        <Select
          v-model="selectedDuration"
          :options="durationOptions"
          :label="t('FORUM.SELECT_DURATION')"
          size="md"
        />
      </div>

      <Textarea
        v-model="reason"
        :label="t('FORUM.MUTE_REASON')"
        :placeholder="t('FORUM.MUTE_REASON_PLACEHOLDER')"
        :rows="4"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Modal, Select, Textarea } from "@/shared/ui";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const { visible, userName } = defineProps<{
  visible: boolean;
  userName: string;
}>();

const emit = defineEmits<{
  (
    e: "confirm",
    payload: { durationMinutes: number | null; reason: string },
  ): void;
  (e: "close"): void;
}>();

const PERMANENT_VALUE = "permanent";

const selectedDuration = ref<number | string>(15);
const reason = ref("");

const durationOptions = computed(() => [
  { value: 15, label: t("FORUM.DURATION_15_MIN") },
  { value: 30, label: t("FORUM.DURATION_30_MIN") },
  { value: 60, label: t("FORUM.DURATION_1_HOUR") },
  { value: 180, label: t("FORUM.DURATION_3_HOURS") },
  { value: 720, label: t("FORUM.DURATION_12_HOURS") },
  { value: 1440, label: t("FORUM.DURATION_1_DAY") },
  { value: 10080, label: t("FORUM.DURATION_1_WEEK") },
  { value: 43200, label: t("FORUM.DURATION_1_MONTH") },
  { value: PERMANENT_VALUE, label: t("FORUM.DURATION_PERMANENT") },
]);

function handleConfirm() {
  emit("confirm", {
    durationMinutes:
      selectedDuration.value === PERMANENT_VALUE
        ? null
        : Number(selectedDuration.value),
    reason: reason.value.trim(),
  });
}
</script>

<style scoped lang="scss">
.mute-modal {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 4px;

  &__field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__label {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary);
  }
}
</style>
