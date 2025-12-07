<template>
  <div class="christmas-gift-widget">
    <ChristmasTree v-if="treeVisible" @click="handleTreeClick" />

    <Modal
      :visible="isModalOpen"
      size="md"
      :closable="true"
      :close-on-backdrop="true"
      @close="closeModal"
    >
      <div class="christmas-gift-modal">
        <div class="christmas-gift-modal__icon">🎄🎁</div>

        <h2 class="christmas-gift-modal__title">
          {{ isAuthenticated ? t('CHRISTMAS_GIFT.MODAL_TITLE_AUTHENTICATED') : t('CHRISTMAS_GIFT.MODAL_TITLE_UNAUTHENTICATED') }}
        </h2>

        <p class="christmas-gift-modal__message" v-if="!alreadyClaimed">
          {{ isAuthenticated ? t('CHRISTMAS_GIFT.MODAL_MESSAGE_AUTHENTICATED') : t('CHRISTMAS_GIFT.MODAL_MESSAGE_UNAUTHENTICATED') }}
        </p>

        <div class="christmas-gift-modal__success" v-if="isAuthenticated && premiumGrantedDate && !alreadyClaimed">
          <div class="christmas-gift-modal__success-icon">✨</div>
          <p class="christmas-gift-modal__success-text">
            {{ t('CHRISTMAS_GIFT.MODAL_PREMIUM_GRANTED', { date: formattedDate }) }}
          </p>
        </div>

        <div class="christmas-gift-modal__warning" v-if="alreadyClaimed">
          <p class="christmas-gift-modal__warning-text">
            {{ t('CHRISTMAS_GIFT.MODAL_ALREADY_CLAIMED') }}
          </p>
        </div>

        <div class="christmas-gift-modal__actions">
          <Button
            v-if="!isAuthenticated"
            variant="primary"
            size="md"
            @click="handleSignIn"
          >
            {{ t('CHRISTMAS_GIFT.MODAL_SIGN_IN') }}
          </Button>
          <Button
            variant="outline"
            size="md"
            @click="closeModal"
          >
            {{ t('CHRISTMAS_GIFT.MODAL_CLOSE') }}
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ChristmasTree from '../christmas-tree/ChristmasTree.vue'
import { Modal, Button } from '@/shared/ui'
import { useChristmasGift } from '../../model/use-christmas-gift'

const { t, locale } = useI18n()
const router = useRouter()

const {
  isModalOpen,
  premiumGrantedDate,
  alreadyClaimed,
  isAuthenticated,
  treeVisible,
  handleTreeClick,
  closeModal
} = useChristmasGift()

const formattedDate = computed(() => {
  if (!premiumGrantedDate.value) return ''
  const date = new Date(premiumGrantedDate.value)
  return date.toLocaleDateString(locale.value === 'uk' ? 'uk-UA' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

function handleSignIn() {
  closeModal()
  router.push(`/${locale.value}/login`)
}
</script>

<style lang="scss" scoped src="./christmas-gift-widget.scss"></style>
