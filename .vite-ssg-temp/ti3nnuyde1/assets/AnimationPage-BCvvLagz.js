import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext, ref, computed, onMounted, createVNode, watch, onBeforeUnmount, resolveDynamicComponent, defineAsyncComponent } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrRenderClass, ssrRenderList, ssrRenderVNode, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { N as NavLink, _ as _export_sfc, d as useAuthStore, a as Input, S as Select, B as Button, M as Modal, c as copyToClipboard, I as Icon, p as getCreatorAvatarStyle, q as getCreatorInitials, t as getCreatorLabel, i as buildCreatorProfile } from "../main.mjs";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { l as listPublicSaves } from "./saves-Czai1rJv.js";
import { r as resolveSubscriptionTier } from "./save-quota-Bgxdrz7t.js";
import { S as SubscriptionTier } from "./pricing-DAHM4Bo5.js";
import { a as animationExamples } from "./examples-data-CLm7QPwV.js";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "@unhead/vue";
import "body-scroll-lock-upgrade";
import "axios";
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AnimationHero",
  __ssrInlineRender: true,
  props: {
    eyebrow: {},
    title: {},
    subtitle: {},
    backText: {},
    docsText: {},
    docsLink: {}
  },
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "animation-hero" }, _attrs))} data-v-6787cc17><div class="animation-hero__orbits" aria-hidden="true" data-v-6787cc17><span class="animation-hero__sun" data-v-6787cc17></span><span class="animation-hero__ring animation-hero__ring_mercury" data-v-6787cc17></span><span class="animation-hero__ring animation-hero__ring_venus" data-v-6787cc17></span><span class="animation-hero__ring animation-hero__ring_earth" data-v-6787cc17></span><span class="animation-hero__ring animation-hero__ring_mars" data-v-6787cc17></span><span class="animation-hero__ring animation-hero__ring_jupiter" data-v-6787cc17></span><span class="animation-hero__ring animation-hero__ring_saturn" data-v-6787cc17></span><span class="animation-hero__ring animation-hero__ring_uranus" data-v-6787cc17></span><span class="animation-hero__ring animation-hero__ring_neptune" data-v-6787cc17></span><span class="animation-hero__planet animation-hero__planet_mercury" data-v-6787cc17></span><span class="animation-hero__planet animation-hero__planet_venus" data-v-6787cc17></span><span class="animation-hero__planet animation-hero__planet_earth" data-v-6787cc17></span><span class="animation-hero__planet animation-hero__planet_mars" data-v-6787cc17></span><span class="animation-hero__planet animation-hero__planet_jupiter" data-v-6787cc17></span><span class="animation-hero__planet animation-hero__planet_saturn" data-v-6787cc17></span><span class="animation-hero__planet animation-hero__planet_uranus" data-v-6787cc17></span><span class="animation-hero__planet animation-hero__planet_neptune" data-v-6787cc17></span></div><p class="animation-hero__eyebrow" data-v-6787cc17>${ssrInterpolate(__props.eyebrow)}</p><h1 class="animation-hero__title" data-v-6787cc17>${ssrInterpolate(__props.title)}</h1><p class="animation-hero__subtitle" data-v-6787cc17>${ssrInterpolate(__props.subtitle)}</p><div class="animation-hero__meta" data-v-6787cc17><span class="animation-hero__chip" data-v-6787cc17>${ssrInterpolate(unref(t)("ANIMATION.HTML_CSS"))}</span><span class="animation-hero__chip" data-v-6787cc17>${ssrInterpolate(unref(t)("ANIMATION.LIVE_PREVIEW"))}</span><span class="animation-hero__chip" data-v-6787cc17>${ssrInterpolate(unref(t)("ANIMATION.KEYFRAMES_READY"))}</span></div><div class="animation-hero__actions" data-v-6787cc17>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/",
        "class-name": "button button_primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.backText)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.backText), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a class="animation-hero__link"${ssrRenderAttr("href", __props.docsLink)} target="_blank" rel="noreferrer" data-v-6787cc17>${ssrInterpolate(__props.docsText)}</a></div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/animation/animation-hero/ui/AnimationHero.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const AnimationHero = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-6787cc17"]]);
const animationName = "style-engine-motion";
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AnimationBuilder",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();
    const authStore = useAuthStore();
    const showAuthModal = ref(false);
    const duration = ref(1200);
    const delay = ref(0);
    const easing = ref("cubic-bezier(0.3, 0.8, 0.4, 1)");
    const iterations = ref("infinite");
    const distanceX = ref(24);
    const distanceY = ref(-16);
    const scaleFrom = ref(0.96);
    const scaleTo = ref(1.06);
    const opacityFrom = ref(0.72);
    const opacityTo = ref(1);
    const rotateFrom = ref(0);
    const rotateTo = ref(6);
    const skewXFrom = ref(0);
    const skewXTo = ref(4);
    const skewYFrom = ref(0);
    const skewYTo = ref(2);
    const useVariables = ref(true);
    const isPlaying = ref(false);
    const timingOptions = [
      { label: "Ease", value: "ease" },
      { label: "Linear", value: "linear" },
      { label: "Ease-in-out", value: "ease-in-out" },
      { label: "Custom (soft)", value: "cubic-bezier(0.3, 0.8, 0.4, 1)" }
    ];
    const iterationOptions = [
      { label: "Infinite", value: "infinite" },
      { label: "1", value: "1" },
      { label: "2", value: "2" },
      { label: "3", value: "3" }
    ];
    const previewPlayState = computed(() => isPlaying.value ? "running" : "paused");
    const communityAnimations = ref([]);
    const communityLoading = ref(false);
    const showExportModal = ref(false);
    const showExportProModal = ref(false);
    const exportFormat = ref("html");
    const animationExportFormats = [
      { label: "HTML", value: "html" },
      { label: "CSS", value: "css" },
      { label: "JSON", value: "json" }
    ];
    const exportCode = computed(() => {
      if (!codeSnippet.value) return "";
      if (exportFormat.value === "css") {
        return codeSnippetWithValues.value;
      }
      if (exportFormat.value === "json") {
        return JSON.stringify(motionValues.value, null, 2);
      }
      return codeSnippet.value;
    });
    const exportFileName = computed(() => `animation-builder-export.${exportFormat.value}`);
    const motionValues = computed(() => ({
      startX: distanceX.value * -1,
      endX: distanceX.value,
      startY: distanceY.value,
      endY: distanceY.value * -1,
      startScale: scaleFrom.value,
      endScale: scaleTo.value,
      startOpacity: opacityFrom.value,
      endOpacity: opacityTo.value,
      startRotate: rotateFrom.value,
      endRotate: rotateTo.value,
      startSkewX: skewXFrom.value,
      endSkewX: skewXTo.value,
      startSkewY: skewYFrom.value,
      endSkewY: skewYTo.value,
      duration: duration.value,
      delay: delay.value,
      easing: easing.value,
      iterations: iterations.value
    }));
    const previewStyle = computed(() => {
      const motion = motionValues.value;
      return {
        "--motion-start-x": `${motion.startX}px`,
        "--motion-end-x": `${motion.endX}px`,
        "--motion-start-y": `${motion.startY}px`,
        "--motion-end-y": `${motion.endY}px`,
        "--motion-start-scale": `${motion.startScale}`,
        "--motion-end-scale": `${motion.endScale}`,
        "--motion-start-opacity": `${motion.startOpacity}`,
        "--motion-end-opacity": `${motion.endOpacity}`,
        "--motion-start-rotate": `${motion.startRotate}deg`,
        "--motion-end-rotate": `${motion.endRotate}deg`,
        "--motion-start-skew-x": `${motion.startSkewX}deg`,
        "--motion-end-skew-x": `${motion.endSkewX}deg`,
        "--motion-start-skew-y": `${motion.startSkewY}deg`,
        "--motion-end-skew-y": `${motion.endSkewY}deg`,
        "--motion-duration": `${motion.duration}ms`,
        "--motion-delay": `${motion.delay}ms`,
        "--motion-easing": motion.easing,
        "--motion-iterations": motion.iterations,
        "--motion-play-state": previewPlayState.value
      };
    });
    function getUserTier() {
      var _a;
      return resolveSubscriptionTier(
        ((_a = authStore.user) == null ? void 0 : _a.subscriptionTier) ?? authStore.userPlan
      );
    }
    async function loadCommunityAnimations() {
      communityLoading.value = true;
      try {
        communityAnimations.value = await listPublicSaves("animation");
      } catch (error) {
        console.warn("Failed to load community animations", error);
      } finally {
        communityLoading.value = false;
      }
    }
    const codeSnippetWithVariables = computed(() => {
      const motion = motionValues.value;
      return `<div class="motion-preview">
  <div class="motion-preview__dot"></div>
  <div class="motion-preview__card">CSS Motion</div>
</div>

.motion-preview {
  --motion-start-x: ${motion.startX}px;
  --motion-end-x: ${motion.endX}px;
  --motion-start-y: ${motion.startY}px;
  --motion-end-y: ${motion.endY}px;
  --motion-start-scale: ${motion.startScale};
  --motion-end-scale: ${motion.endScale};
  --motion-start-opacity: ${motion.startOpacity};
  --motion-end-opacity: ${motion.endOpacity};
  --motion-start-rotate: ${motion.startRotate}deg;
  --motion-end-rotate: ${motion.endRotate}deg;
  --motion-start-skew-x: ${motion.startSkewX}deg;
  --motion-end-skew-x: ${motion.endSkewX}deg;
  --motion-start-skew-y: ${motion.startSkewY}deg;
  --motion-end-skew-y: ${motion.endSkewY}deg;
  --motion-duration: ${motion.duration}ms;
  --motion-delay: ${motion.delay}ms;
  --motion-easing: ${motion.easing};
  --motion-iterations: ${motion.iterations};
  position: relative;
  display: grid;
  place-items: center;
  width: 220px;
  height: 160px;
  border-radius: 16px;
  background: radial-gradient(circle at 30% 30%, rgba(104, 185, 255, 0.14), #0b1120);
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
}

.motion-preview__dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #7dd3fc;
  animation: ${animationName} var(--motion-duration) var(--motion-easing) var(--motion-delay) var(--motion-iterations) alternate;
}

.motion-preview__card {
  padding: 12px 16px;
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #e2e8f0;
  font-weight: 600;
  animation: ${animationName} var(--motion-duration) var(--motion-easing) var(--motion-delay) var(--motion-iterations) alternate;
}

@keyframes ${animationName} {
  0% {
    transform: translate(var(--motion-start-x), var(--motion-start-y)) rotate(var(--motion-start-rotate)) skew(var(--motion-start-skew-x), var(--motion-start-skew-y)) scale(var(--motion-start-scale));
    opacity: var(--motion-start-opacity);
  }
  100% {
    transform: translate(var(--motion-end-x), var(--motion-end-y)) rotate(var(--motion-end-rotate)) skew(var(--motion-end-skew-x), var(--motion-end-skew-y)) scale(var(--motion-end-scale));
    opacity: var(--motion-end-opacity);
  }
}`;
    });
    const codeSnippetWithValues = computed(() => {
      const motion = motionValues.value;
      return `<div class="motion-preview">
  <div class="motion-preview__dot"></div>
  <div class="motion-preview__card">CSS Motion</div>
</div>

.motion-preview {
  position: relative;
  display: grid;
  place-items: center;
  width: 220px;
  height: 160px;
  border-radius: 16px;
  background: radial-gradient(circle at 30% 30%, rgba(104, 185, 255, 0.14), #0b1120);
  border: 1px solid rgba(255, 255, 255, 0.12);
  overflow: hidden;
}

.motion-preview__dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #7dd3fc;
  animation: ${animationName} ${motion.duration}ms ${motion.easing} ${motion.delay}ms ${motion.iterations} alternate;
}

.motion-preview__card {
  padding: 12px 16px;
  border-radius: 14px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.04));
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #e2e8f0;
  font-weight: 600;
  animation: ${animationName} ${motion.duration}ms ${motion.easing} ${motion.delay}ms ${motion.iterations} alternate;
}

@keyframes ${animationName} {
  0% {
    transform: translate(${motion.startX}px, ${motion.startY}px) rotate(${motion.startRotate}deg) skew(${motion.startSkewX}deg, ${motion.startSkewY}deg) scale(${motion.startScale});
    opacity: ${motion.startOpacity};
  }
  100% {
    transform: translate(${motion.endX}px, ${motion.endY}px) rotate(${motion.endRotate}deg) skew(${motion.endSkewX}deg, ${motion.endSkewY}deg) scale(${motion.endScale});
    opacity: ${motion.endOpacity};
  }
}`;
    });
    const codeSnippet = computed(() => useVariables.value ? codeSnippetWithVariables.value : codeSnippetWithValues.value);
    async function handleCopy() {
      const ok = await copyToClipboard(codeSnippet.value);
      if (ok) {
        toast.success(t("COMMON.COPIED_TO_CLIPBOARD"));
      }
    }
    function handleExportRequest() {
      if (!authStore.isAuthenticated) {
        showAuthModal.value = true;
        return;
      }
      const tier = getUserTier();
      if (!tier || tier === SubscriptionTier.FREE) {
        showExportProModal.value = true;
        return;
      }
      showExportModal.value = true;
    }
    function handleExportUpgrade() {
      showExportProModal.value = false;
      router.push({
        path: `/${locale.value}/about`,
        query: { plan: "premium" }
      });
    }
    async function copyExportCode() {
      if (!exportCode.value) return;
      const ok = await copyToClipboard(exportCode.value);
      toast[ok ? "success" : "error"](ok ? t("COMMON.COPIED_TO_CLIPBOARD") : t("COMMON.COPY_FAILED"));
    }
    function downloadExportCode() {
      const blob = new Blob([exportCode.value], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = exportFileName.value;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
    function handleAuthConfirm() {
      showAuthModal.value = false;
      router.push({
        name: `${locale.value}-login`,
        query: { redirect: route.fullPath }
      });
    }
    function togglePlaying() {
      isPlaying.value = !isPlaying.value;
    }
    onMounted(() => {
      loadCommunityAnimations();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="animation-builder" data-v-248ef938><div class="animation-builder__header" data-v-248ef938><p class="animation-builder__tag" data-v-248ef938>${ssrInterpolate(unref(t)("ANIMATION.BUILDER_TAG"))}</p><h2 class="animation-builder__title" data-v-248ef938>${ssrInterpolate(unref(t)("ANIMATION.BUILDER_TITLE"))}</h2><p class="animation-builder__subtitle" data-v-248ef938>${ssrInterpolate(unref(t)("ANIMATION.BUILDER_SUBTITLE"))}</p></div><div class="animation-builder__container" data-v-248ef938><div class="animation-builder__content" data-v-248ef938><div class="animation-builder__controls-section" data-v-248ef938><p class="animation-builder__section-label" data-v-248ef938>Controls</p><div class="animation-builder__controls" data-v-248ef938>`);
      _push(ssrRenderComponent(unref(Input), {
        modelValue: duration.value,
        "onUpdate:modelValue": ($event) => duration.value = $event,
        type: "number",
        label: unref(t)("ANIMATION.DURATION"),
        suffix: "ms"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: delay.value,
        "onUpdate:modelValue": ($event) => delay.value = $event,
        type: "number",
        label: unref(t)("ANIMATION.DELAY"),
        suffix: "ms"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Select), {
        modelValue: easing.value,
        "onUpdate:modelValue": ($event) => easing.value = $event,
        options: timingOptions,
        label: unref(t)("ANIMATION.EASING")
      }, null, _parent));
      _push(ssrRenderComponent(unref(Select), {
        modelValue: iterations.value,
        "onUpdate:modelValue": ($event) => iterations.value = $event,
        options: iterationOptions,
        label: unref(t)("ANIMATION.LOOPS")
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: distanceX.value,
        "onUpdate:modelValue": ($event) => distanceX.value = $event,
        type: "number",
        label: unref(t)("ANIMATION.DISTANCE_X"),
        suffix: "px"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: distanceY.value,
        "onUpdate:modelValue": ($event) => distanceY.value = $event,
        type: "number",
        label: unref(t)("ANIMATION.DISTANCE_Y"),
        suffix: "px"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: scaleFrom.value,
        "onUpdate:modelValue": ($event) => scaleFrom.value = $event,
        type: "number",
        label: unref(t)("ANIMATION.SCALE_FROM"),
        step: "0.01"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: scaleTo.value,
        "onUpdate:modelValue": ($event) => scaleTo.value = $event,
        type: "number",
        label: unref(t)("ANIMATION.SCALE_TO"),
        step: "0.01"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: opacityFrom.value,
        "onUpdate:modelValue": ($event) => opacityFrom.value = $event,
        type: "number",
        label: unref(t)("ANIMATION.OPACITY_FROM"),
        step: "0.05",
        min: "0",
        max: "1"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: opacityTo.value,
        "onUpdate:modelValue": ($event) => opacityTo.value = $event,
        type: "number",
        label: unref(t)("ANIMATION.OPACITY_TO"),
        step: "0.05",
        min: "0",
        max: "1"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: rotateFrom.value,
        "onUpdate:modelValue": ($event) => rotateFrom.value = $event,
        type: "number",
        label: unref(t)("ANIMATION.ROTATION_FROM"),
        suffix: "°"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: rotateTo.value,
        "onUpdate:modelValue": ($event) => rotateTo.value = $event,
        type: "number",
        label: unref(t)("ANIMATION.ROTATION_TO"),
        suffix: "°"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: skewXFrom.value,
        "onUpdate:modelValue": ($event) => skewXFrom.value = $event,
        type: "number",
        label: unref(t)("ANIMATION.SKEW_X_FROM"),
        suffix: "°"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: skewXTo.value,
        "onUpdate:modelValue": ($event) => skewXTo.value = $event,
        type: "number",
        label: unref(t)("ANIMATION.SKEW_X_TO"),
        suffix: "°"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: skewYFrom.value,
        "onUpdate:modelValue": ($event) => skewYFrom.value = $event,
        type: "number",
        label: unref(t)("ANIMATION.SKEW_Y_FROM"),
        suffix: "°"
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: skewYTo.value,
        "onUpdate:modelValue": ($event) => skewYTo.value = $event,
        type: "number",
        label: unref(t)("ANIMATION.SKEW_Y_TO"),
        suffix: "°"
      }, null, _parent));
      _push(`</div></div><div class="animation-builder__right" data-v-248ef938><div class="animation-builder__preview-section" data-v-248ef938><p class="animation-builder__section-label" data-v-248ef938>${ssrInterpolate(unref(t)("ANIMATION.PREVIEW"))}</p><div class="motion-preview" style="${ssrRenderStyle(previewStyle.value)}" data-v-248ef938><div class="motion-preview__dot" data-v-248ef938></div><div class="motion-preview__card" data-v-248ef938>CSS Motion</div></div><div class="animation-builder__preview-actions" data-v-248ef938>`);
      _push(ssrRenderComponent(unref(Button), {
        class: "animation-builder__play-button",
        variant: "primary",
        size: "sm",
        type: "button",
        onClick: togglePlaying
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(isPlaying.value ? unref(t)("ANIMATION.STOP_ANIMATION") : unref(t)("ANIMATION.START_ANIMATION"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(isPlaying.value ? unref(t)("ANIMATION.STOP_ANIMATION") : unref(t)("ANIMATION.START_ANIMATION")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="animation-builder__code-section" data-v-248ef938><p class="animation-builder__section-label" data-v-248ef938>Code</p><div class="animation-builder__code" data-v-248ef938><div class="animation-builder__code-controls" data-v-248ef938><span data-v-248ef938></span><span data-v-248ef938></span><span data-v-248ef938></span></div><div class="animation-builder__code-toolbar" data-v-248ef938><span class="animation-builder__code-mode" data-v-248ef938>${ssrInterpolate(unref(t)("ANIMATION.CODE_VIEW"))}</span><div class="animation-builder__toggle" role="group" aria-label="Code view mode" data-v-248ef938><button type="button" class="${ssrRenderClass([{ "animation-builder__toggle-button_active": useVariables.value }, "animation-builder__toggle-button"])}" data-v-248ef938>${ssrInterpolate(unref(t)("ANIMATION.CODE_VIEW_VARIABLES"))}</button><button type="button" class="${ssrRenderClass([{ "animation-builder__toggle-button_active": !useVariables.value }, "animation-builder__toggle-button"])}" data-v-248ef938>${ssrInterpolate(unref(t)("ANIMATION.CODE_VIEW_VALUES"))}</button></div></div><pre class="code-block" data-v-248ef938>${ssrInterpolate(codeSnippet.value)}</pre><div class="animation-builder__code-actions" data-v-248ef938>`);
      _push(ssrRenderComponent(unref(Button), {
        variant: "primary",
        size: "sm",
        onClick: handleCopy
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("ANIMATION.COPY_SNIPPET"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("ANIMATION.COPY_SNIPPET")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Button), {
        variant: "secondary",
        size: "sm",
        onClick: handleExportRequest
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("COMMON.EXPORT"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("COMMON.EXPORT")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div></div></div></div>`);
      _push(ssrRenderComponent(unref(Modal), {
        visible: showExportModal.value,
        title: unref(t)("COMMON.EXPORT"),
        onClose: ($event) => showExportModal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="animation-export" data-v-248ef938${_scopeId}><div class="animation-export__toolbar" data-v-248ef938${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Select), {
              modelValue: exportFormat.value,
              "onUpdate:modelValue": ($event) => exportFormat.value = $event,
              options: animationExportFormats
            }, null, _parent2, _scopeId));
            _push2(`<div class="animation-export__actions" data-v-248ef938${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Button), {
              variant: "outline",
              size: "sm",
              onClick: copyExportCode
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("COMMON.COPY"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("COMMON.COPY")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Button), {
              variant: "ghost",
              size: "sm",
              onClick: downloadExportCode
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("COMMON.DOWNLOAD"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("COMMON.DOWNLOAD")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="animation-export__code" data-v-248ef938${_scopeId}><pre class="code-block" data-v-248ef938${_scopeId}><code data-v-248ef938${_scopeId}>${ssrInterpolate(exportCode.value)}</code></pre></div></div>`);
          } else {
            return [
              createVNode("div", { class: "animation-export" }, [
                createVNode("div", { class: "animation-export__toolbar" }, [
                  createVNode(unref(Select), {
                    modelValue: exportFormat.value,
                    "onUpdate:modelValue": ($event) => exportFormat.value = $event,
                    options: animationExportFormats
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("div", { class: "animation-export__actions" }, [
                    createVNode(unref(Button), {
                      variant: "outline",
                      size: "sm",
                      onClick: copyExportCode
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(t)("COMMON.COPY")), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Button), {
                      variant: "ghost",
                      size: "sm",
                      onClick: downloadExportCode
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(t)("COMMON.DOWNLOAD")), 1)
                      ]),
                      _: 1
                    })
                  ])
                ]),
                createVNode("div", { class: "animation-export__code" }, [
                  createVNode("pre", { class: "code-block" }, [
                    createVNode("code", null, toDisplayString(exportCode.value), 1)
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Modal), {
        visible: showExportProModal.value,
        title: unref(t)("COMMON.PRO_EXPORT_TITLE"),
        subtitle: unref(t)("COMMON.PRO_EXPORT_MESSAGE"),
        "show-actions": "",
        "confirm-text": unref(t)("COMMON.PRO_EXPORT_ACTION"),
        "cancel-text": unref(t)("COMMON.CANCEL"),
        onConfirm: handleExportUpgrade,
        onClose: ($event) => showExportProModal.value = false
      }, null, _parent));
      _push(ssrRenderComponent(unref(Modal), {
        visible: showAuthModal.value,
        title: unref(t)("COMMON.AUTH_REQUIRED_TITLE"),
        subtitle: unref(t)("COMMON.AUTH_REQUIRED_DESCRIPTION"),
        "show-actions": "",
        "confirm-text": unref(t)("COMMON.AUTH_REQUIRED_CONFIRM"),
        "cancel-text": unref(t)("COMMON.AUTH_REQUIRED_CLOSE"),
        onConfirm: handleAuthConfirm,
        onClose: ($event) => showAuthModal.value = false
      }, null, _parent));
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/animation/animation-builder/ui/AnimationBuilder.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AnimationBuilder = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-248ef938"]]);
const itemsPerPage = 12;
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AnimationExamplesGrid",
  __ssrInlineRender: true,
  props: {
    examples: {}
  },
  setup(__props) {
    const props = __props;
    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const searchQuery = ref(route.query.search ?? "");
    const debouncedSearchQuery = ref(searchQuery.value);
    const isSearching = ref(false);
    const selectedCategory = ref(route.query.category ?? "all");
    const currentPage = ref(Number(route.query.page) > 0 ? Number(route.query.page) : 1);
    let debounceTimeout = null;
    const categoryOptions = computed(() => [
      { label: t("ANIMATION.ALL_TYPES"), value: "all" },
      { label: t("ANIMATION.CATEGORY.LOADERS"), value: "loaders" },
      { label: t("ANIMATION.CATEGORY.MARQUEE"), value: "marquee" },
      { label: t("ANIMATION.CATEGORY.EFFECTS"), value: "effects" },
      { label: t("ANIMATION.CATEGORY.TRANSITIONS"), value: "transitions" },
      { label: t("ANIMATION.CATEGORY.ORBITAL"), value: "orbital" },
      { label: t("ANIMATION.CATEGORY.INTERACTIVE"), value: "interactive" },
      { label: t("ANIMATION.CATEGORY.COMMUNITY"), value: "community" }
    ]);
    const normalizedExamples = computed(
      () => Array.isArray(props.examples.value) ? props.examples.value : props.examples
    );
    const totalCount = computed(() => normalizedExamples.value.length);
    const filteredExamples = computed(() => {
      let filtered = normalizedExamples.value;
      if (selectedCategory.value !== "all") {
        filtered = filtered.filter((example) => example.category === selectedCategory.value);
      }
      if (debouncedSearchQuery.value.trim()) {
        const query = debouncedSearchQuery.value.toLowerCase().trim();
        filtered = filtered.filter((example) => {
          const title = displayTitle(example).toLowerCase();
          const description = displayDescription(example).toLowerCase();
          return title.includes(query) || description.includes(query);
        });
      }
      return filtered;
    });
    const totalPages = computed(() => Math.max(1, Math.ceil(filteredExamples.value.length / itemsPerPage)));
    const paginatedExamples = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return filteredExamples.value.slice(start, end);
    });
    const visiblePages = computed(() => {
      const pages = [];
      const maxVisible = 5;
      let startPage = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
      const endPage = Math.min(totalPages.value, startPage + maxVisible - 1);
      if (endPage - startPage + 1 < maxVisible) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    });
    function displayTitle(example) {
      return example.titleText || t(example.titleKey);
    }
    function displayDescription(example) {
      return example.descriptionText || t(example.descriptionKey);
    }
    function updateRoute() {
      const nextQuery = {
        ...route.query,
        page: currentPage.value,
        category: selectedCategory.value !== "all" ? selectedCategory.value : void 0,
        search: debouncedSearchQuery.value || void 0
      };
      router.replace({ query: nextQuery });
    }
    watch(searchQuery, (next) => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      isSearching.value = true;
      debounceTimeout = setTimeout(() => {
        debouncedSearchQuery.value = next;
        currentPage.value = 1;
        updateRoute();
        isSearching.value = false;
      }, 250);
    });
    watch([selectedCategory, () => currentPage.value], () => {
      updateRoute();
    });
    watch(
      () => route.query.category,
      (category) => {
        selectedCategory.value = category ?? "all";
      }
    );
    watch(
      () => route.query.page,
      (page) => {
        currentPage.value = Number(page) > 0 ? Number(page) : 1;
      }
    );
    watch(
      () => route.query.search,
      (value) => {
        searchQuery.value = value ?? "";
      }
    );
    onBeforeUnmount(() => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animation-examples" }, _attrs))} data-v-541d5a24><div class="animation-page__gallery-header" data-v-541d5a24><div data-v-541d5a24><p class="animation-page__gallery-tag" data-v-541d5a24>${ssrInterpolate(unref(t)("ANIMATION.SNIPPETS_TAG"))}</p><h2 class="animation-page__gallery-title" data-v-541d5a24>${ssrInterpolate(unref(t)("ANIMATION.SNIPPETS_TITLE"))}</h2><p class="animation-page__gallery-subtitle" data-v-541d5a24>${ssrInterpolate(unref(t)("ANIMATION.SNIPPETS_SUBTITLE"))}</p></div><div class="animation-page__legend" data-v-541d5a24><span class="animation-page__dot animation-page__dot_primary" data-v-541d5a24></span><span data-v-541d5a24>${ssrInterpolate(unref(t)("ANIMATION.HTML_CSS"))}</span></div></div><div class="animation-page__controls" data-v-541d5a24><div class="animation-page__search" data-v-541d5a24>`);
      _push(ssrRenderComponent(unref(Input), {
        modelValue: searchQuery.value,
        "onUpdate:modelValue": ($event) => searchQuery.value = $event,
        placeholder: unref(t)("ANIMATION.SEARCH_PLACEHOLDER"),
        label: unref(t)("ANIMATION.SEARCH_LABEL"),
        type: "text"
      }, {
        prefix: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Icon), {
              size: 16,
              name: "icon-search"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Icon), {
                size: 16,
                name: "icon-search"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="animation-page__filter" data-v-541d5a24>`);
      _push(ssrRenderComponent(unref(Select), {
        modelValue: selectedCategory.value,
        "onUpdate:modelValue": ($event) => selectedCategory.value = $event,
        options: categoryOptions.value,
        label: unref(t)("ANIMATION.FILTER_BY_TYPE")
      }, null, _parent));
      _push(`</div><div class="animation-page__results" data-v-541d5a24>${ssrInterpolate(unref(t)("ANIMATION.SHOWING_RESULTS", { count: filteredExamples.value.length, total: totalCount.value }))}</div></div>`);
      if (isSearching.value) {
        _push(`<div class="animation-page__loading" data-v-541d5a24><div class="animation-page__loader" data-v-541d5a24><span data-v-541d5a24></span><span data-v-541d5a24></span><span data-v-541d5a24></span><span data-v-541d5a24></span></div><p class="animation-page__loading-text" data-v-541d5a24>${ssrInterpolate(unref(t)("ANIMATION.SEARCHING"))}</p></div>`);
      } else if (filteredExamples.value.length === 0) {
        _push(`<div class="animation-page__empty" data-v-541d5a24>`);
        _push(ssrRenderComponent(unref(Icon), {
          size: 48,
          class: "animation-page__empty-icon",
          name: "icon-search"
        }, null, _parent));
        _push(`<h3 class="animation-page__empty-title" data-v-541d5a24>${ssrInterpolate(unref(t)("ANIMATION.NO_RESULTS"))}</h3><p class="animation-page__empty-text" data-v-541d5a24>${ssrInterpolate(unref(t)("ANIMATION.NO_RESULTS_HINT"))}</p></div>`);
      } else {
        _push(`<div class="animation-page__cards" data-v-541d5a24><!--[-->`);
        ssrRenderList(paginatedExamples.value, (example) => {
          _push(`<article class="animation-card" data-v-541d5a24><div class="animation-card__head" data-v-541d5a24><div data-v-541d5a24><p class="animation-card__tag" data-v-541d5a24>${ssrInterpolate(unref(t)("ANIMATION.PREVIEW"))}</p><h3 class="animation-card__title" data-v-541d5a24>${ssrInterpolate(displayTitle(example))}</h3><p class="animation-card__description" data-v-541d5a24>${ssrInterpolate(displayDescription(example))}</p></div></div>`);
          if (example.owner) {
            _push(`<div class="animation-card__author" data-v-541d5a24><div class="animation-card__avatar" style="${ssrRenderStyle(unref(getCreatorAvatarStyle)(example.owner))}" data-v-541d5a24>`);
            if (!example.owner.avatarUrl) {
              _push(`<span data-v-541d5a24>${ssrInterpolate(unref(getCreatorInitials)(example.owner))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div data-v-541d5a24><span class="animation-card__author-name"${ssrRenderAttr("title", unref(getCreatorLabel)(example.owner))} data-v-541d5a24>${ssrInterpolate(unref(getCreatorLabel)(example.owner))}</span>`);
            if (example.isCommunity) {
              _push(`<span class="animation-card__author-badge" data-v-541d5a24>${ssrInterpolate(unref(t)("ANIMATION.COMMUNITY_BADGE"))}</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          } else {
            _push(`<!---->`);
          }
          if (example.component) {
            _push(`<div class="animation-card__preview" data-v-541d5a24>`);
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(example.component), null, null), _parent);
            _push(`</div>`);
          } else {
            _push(`<div class="animation-card__preview animation-card__preview_placeholder" data-v-541d5a24><pre class="animation-card__preview-text" data-v-541d5a24>${ssrInterpolate(example.previewText || unref(t)("ANIMATION.COMMUNITY_PREVIEW_PLACEHOLDER"))}</pre></div>`);
          }
          if (!example.isCommunity) {
            _push(ssrRenderComponent(unref(NavLink), {
              to: `/animation/${example.id}`,
              "class-name": "animation-card__link"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(unref(t)("ANIMATION.OPEN"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("ANIMATION.OPEN")), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</article>`);
        });
        _push(`<!--]--></div>`);
      }
      if (totalPages.value > 1) {
        _push(`<div class="animation-page__pagination" data-v-541d5a24><button${ssrIncludeBooleanAttr(currentPage.value === 1) ? " disabled" : ""} class="animation-page__pagination-button" data-v-541d5a24>${ssrInterpolate(unref(t)("ANIMATION.PREVIOUS"))}</button><div class="animation-page__pagination-numbers" data-v-541d5a24><!--[-->`);
        ssrRenderList(visiblePages.value, (page) => {
          _push(`<button class="${ssrRenderClass([{ active: currentPage.value === page }, "animation-page__pagination-number"])}" data-v-541d5a24>${ssrInterpolate(page)}</button>`);
        });
        _push(`<!--]--></div><button${ssrIncludeBooleanAttr(currentPage.value === totalPages.value) ? " disabled" : ""} class="animation-page__pagination-button" data-v-541d5a24>${ssrInterpolate(unref(t)("ANIMATION.NEXT"))}</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/animation/animation-gallery/ui/AnimationExamplesGrid.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AnimationExamplesGrid = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-541d5a24"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AnimationPage",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const communityExamples = ref([]);
    const builtInExamples = computed(
      () => animationExamples.map((example) => ({
        ...example,
        component: defineAsyncComponent(example.component)
      }))
    );
    const examples = computed(() => [...communityExamples.value, ...builtInExamples.value]);
    function mapCommunityAnimation(item) {
      const payload = item.payload || {};
      const html = typeof payload.html === "string" ? payload.html : "";
      const css = typeof payload.css === "string" ? payload.css : "";
      if (!html && !css) {
        return null;
      }
      const owner = buildCreatorProfile(item);
      const ownerLabel = getCreatorLabel(owner);
      return {
        id: `community-${item.id}`,
        titleKey: "ANIMATION.COMMUNITY_ANIMATION",
        descriptionKey: "ANIMATION.COMMUNITY_CREATED_BY",
        titleText: item.name || t("ANIMATION.COMMUNITY_ANIMATION"),
        descriptionText: t("ANIMATION.COMMUNITY_CREATED_BY", { user: ownerLabel }),
        category: "community",
        html,
        css,
        owner,
        previewText: css ? `${css.substring(0, 120)}...` : html.substring(0, 120),
        isCommunity: true
      };
    }
    async function loadCommunityAnimations() {
      try {
        const items = await listPublicSaves("animation");
        communityExamples.value = items.map(mapCommunityAnimation).filter(Boolean);
      } catch (error) {
        console.warn("Failed to load community animations", error);
      }
    }
    onMounted(() => {
      loadCommunityAnimations();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animation-page" }, _attrs))}><div class="animation-page__background"><span class="animation-page__beam animation-page__beam_left"></span><span class="animation-page__beam animation-page__beam_right"></span><span class="animation-page__grid-lines"></span></div><div class="container">`);
      _push(ssrRenderComponent(unref(AnimationHero), {
        eyebrow: unref(t)("ANIMATION.EYEBROW"),
        title: unref(t)("ANIMATION.TITLE"),
        subtitle: unref(t)("ANIMATION.SUBTITLE"),
        "back-text": unref(t)("ANIMATION.BACK"),
        "docs-text": unref(t)("ANIMATION.DOCS"),
        "docs-link": "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations"
      }, null, _parent));
      _push(`<section class="animation-page__builder-section">`);
      _push(ssrRenderComponent(unref(AnimationBuilder), null, null, _parent));
      _push(`</section><section class="animation-page__examples">`);
      _push(ssrRenderComponent(unref(AnimationExamplesGrid), { examples: examples.value }, null, _parent));
      _push(`</section></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/animation/AnimationPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
