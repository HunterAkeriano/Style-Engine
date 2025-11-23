import { ref, onMounted, onUnmounted, watch, defineComponent, computed, mergeProps, unref, withCtx, createVNode, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle, ssrRenderClass, ssrInterpolate } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { useRoute, useRouter } from "vue-router";
import { f as formatGradient, a as formatBoxShadow } from "./css-C6OGq8u0.js";
import { d as useAuthStore, G as GradientControls, e as GradientPreview, f as GradientCodeExport, h as GradientPresets, M as Modal, a as Input, B as Button, c as copyToClipboard, i as buildCreatorProfile, _ as _export_sfc, j as hexToRgb, k as ShadowCodeExport, l as ShadowControls, m as ShadowPreview, n as ShadowPresets, o as randomHexColor } from "../main.mjs";
import { c as createSave, l as listPublicSaves, a as listSaves } from "./saves-Czai1rJv.js";
import { g as getUserLimit, S as SubscriptionTier } from "./pricing-DAHM4Bo5.js";
import { r as resolveSubscriptionTier, e as evaluateSaveQuota } from "./save-quota-Bgxdrz7t.js";
function useFloatingPreview(options) {
  const { containerRef, boundingRef, topOffset = 32, breakpoint = 1024 } = options;
  const previewRef = ref(null);
  const wrapperRef = ref(null);
  const floatingStyle = ref({});
  const wrapperStyle = ref({});
  const isFloating = ref(false);
  let frameId = null;
  let lastMeasuredHeight = 0;
  let resizeObserver = null;
  let observedWrapper = null;
  const updateWrapperStyle = (height) => {
    if (height > 0) {
      lastMeasuredHeight = height;
      wrapperStyle.value = { minHeight: `${height}px` };
    } else if (lastMeasuredHeight > 0) {
      wrapperStyle.value = { minHeight: `${lastMeasuredHeight}px` };
    }
  };
  const resetFloating = () => {
    isFloating.value = false;
    floatingStyle.value = {};
  };
  const updateFloating = () => {
    frameId = null;
    const previewElement = previewRef.value;
    const wrapperElement = wrapperRef.value;
    const containerElement = containerRef.value;
    if (typeof window === "undefined" || !previewElement || !wrapperElement || !containerElement) {
      resetFloating();
      return;
    }
    if (window.innerWidth < breakpoint) {
      resetFloating();
      return;
    }
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const wrapperRect = wrapperElement.getBoundingClientRect();
    const containerRect = containerElement.getBoundingClientRect();
    const containerTopAbs = containerRect.top + scrollTop;
    const containerBottomAbs = containerTopAbs + containerRect.height;
    const wrapperHeight = wrapperRect.height;
    updateWrapperStyle(wrapperHeight);
    const wrapperTopAbs = wrapperRect.top + scrollTop;
    const startScroll = wrapperTopAbs - topOffset;
    const endScroll = containerBottomAbs - wrapperHeight - topOffset;
    const shouldFloat = scrollTop >= startScroll && scrollTop < endScroll;
    const shouldStickBottom = scrollTop >= endScroll && endScroll > startScroll;
    if (!shouldFloat && !shouldStickBottom || startScroll >= endScroll) {
      resetFloating();
      return;
    }
    const boundingElement = (boundingRef == null ? void 0 : boundingRef.value) || document.documentElement;
    const boundingRect = boundingElement.getBoundingClientRect();
    if (shouldStickBottom) {
      const absoluteTop = Math.max(0, containerRect.height - wrapperHeight);
      const absoluteLeft = wrapperRect.left - boundingRect.left;
      isFloating.value = true;
      floatingStyle.value = {
        position: "absolute",
        top: `${absoluteTop}px`,
        left: `${absoluteLeft}px`,
        width: `${wrapperRect.width}px`
      };
      return;
    }
    const floatingTop = topOffset;
    isFloating.value = true;
    floatingStyle.value = {
      position: "fixed",
      top: `${floatingTop}px`,
      left: `${wrapperRect.left}px`,
      width: `${wrapperRect.width}px`,
      zIndex: "var(--z-sticky, 1020)"
    };
  };
  const scheduleUpdate = () => {
    if (frameId) {
      cancelAnimationFrame(frameId);
    }
    frameId = requestAnimationFrame(updateFloating);
  };
  const handleScroll = () => scheduleUpdate();
  const handleResize = () => scheduleUpdate();
  onMounted(() => {
    if (typeof window === "undefined") return;
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(scheduleUpdate);
      if (resizeObserver) {
        observedWrapper = wrapperRef.value;
        if (observedWrapper) {
          resizeObserver.observe(observedWrapper);
        }
      }
    }
    scheduleUpdate();
  });
  onUnmounted(() => {
    if (typeof window === "undefined") return;
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleResize);
    if (resizeObserver && wrapperRef.value) {
      if (observedWrapper) {
        resizeObserver.unobserve(observedWrapper);
        observedWrapper = null;
      }
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (frameId) {
      cancelAnimationFrame(frameId);
    }
  });
  watch(
    wrapperRef,
    (el) => {
      if (resizeObserver) {
        if (observedWrapper) {
          resizeObserver.unobserve(observedWrapper);
        }
        observedWrapper = el;
        if (observedWrapper) {
          resizeObserver.observe(observedWrapper);
        }
      }
      scheduleUpdate();
    },
    { flush: "post" }
  );
  watch(
    containerRef,
    () => {
      scheduleUpdate();
    },
    { flush: "post" }
  );
  if (boundingRef) {
    watch(
      boundingRef,
      () => {
        scheduleUpdate();
      },
      { flush: "post" }
    );
  }
  return {
    previewRef,
    wrapperRef,
    floatingStyle,
    wrapperStyle,
    isFloating
  };
}
function smoothScrollToTop(offset = 0) {
  if (typeof window === "undefined") return;
  window.scrollTo({
    top: Math.max(0, offset),
    left: 0,
    behavior: "smooth"
  });
}
const GRADIENT_PRESETS = [
  {
    id: "aurora",
    name: "Aurora North",
    type: "linear",
    angle: 120,
    colors: [
      { id: "c1", color: "#0f2027", position: 0 },
      { id: "c2", color: "#203a43", position: 48 },
      { id: "c3", color: "#2c5364", position: 100 }
    ]
  },
  {
    id: "candy-glass",
    name: "Candy Glass",
    type: "linear",
    angle: 135,
    colors: [
      { id: "c1", color: "#74ebd5", position: 0 },
      { id: "c2", color: "#acb6e5", position: 45 },
      { id: "c3", color: "#fbc2eb", position: 100 }
    ]
  },
  {
    id: "sunset-punch",
    name: "Sunset Punch",
    type: "linear",
    angle: 110,
    colors: [
      { id: "c1", color: "#ff9a9e", position: 0 },
      { id: "c2", color: "#fad0c4", position: 40 },
      { id: "c3", color: "#fad0c4", position: 65 },
      { id: "c4", color: "#ffdde1", position: 100 }
    ]
  },
  {
    id: "hologram",
    name: "Hologram Flow",
    type: "conic",
    angle: 230,
    colors: [
      { id: "c1", color: "#4158d0", position: 0 },
      { id: "c2", color: "#c850c0", position: 35 },
      { id: "c3", color: "#ffcc70", position: 65 },
      { id: "c4", color: "#84fab0", position: 100 }
    ]
  },
  {
    id: "mojito",
    name: "Mojito Lime",
    type: "radial",
    angle: 90,
    colors: [
      { id: "c1", color: "#0fd850", position: 0 },
      { id: "c2", color: "#f9f047", position: 58 },
      { id: "c3", color: "#fcff9e", position: 100 }
    ]
  },
  {
    id: "infrared",
    name: "Infrared Beam",
    type: "linear",
    angle: 160,
    colors: [
      { id: "c1", color: "#ff416c", position: 0 },
      { id: "c2", color: "#ff4b2b", position: 42 },
      { id: "c3", color: "#ffc371", position: 100 }
    ]
  },
  {
    id: "ultraviolet",
    name: "Ultraviolet",
    type: "linear",
    angle: 95,
    colors: [
      { id: "c1", color: "#200122", position: 0 },
      { id: "c2", color: "#6f0000", position: 34 },
      { id: "c3", color: "#23074d", position: 64 },
      { id: "c4", color: "#cc5333", position: 100 }
    ]
  },
  {
    id: "lagoon",
    name: "Lagoon Mist",
    type: "linear",
    angle: 125,
    colors: [
      { id: "c1", color: "#1a2980", position: 0 },
      { id: "c2", color: "#26d0ce", position: 45 },
      { id: "c3", color: "#38ef7d", position: 100 }
    ]
  },
  {
    id: "nebula",
    name: "Nebula Bloom",
    type: "conic",
    angle: 180,
    colors: [
      { id: "c1", color: "#fc5c7d", position: 0 },
      { id: "c2", color: "#6a82fb", position: 28 },
      { id: "c3", color: "#05dfd7", position: 58 },
      { id: "c4", color: "#f9ea8f", position: 86 },
      { id: "c5", color: "#ffb88c", position: 100 }
    ]
  },
  {
    id: "deepsea",
    name: "Deep Sea",
    type: "linear",
    angle: 140,
    colors: [
      { id: "c1", color: "#0f2027", position: 0 },
      { id: "c2", color: "#203a43", position: 35 },
      { id: "c3", color: "#2c5364", position: 70 },
      { id: "c4", color: "#0b8793", position: 100 }
    ]
  },
  {
    id: "velvet",
    name: "Velvet Night",
    type: "radial",
    angle: 90,
    colors: [
      { id: "c1", color: "#141e30", position: 0 },
      { id: "c2", color: "#243b55", position: 45 },
      { id: "c3", color: "#4b79a1", position: 78 },
      { id: "c4", color: "#283e51", position: 100 }
    ]
  },
  {
    id: "sahara",
    name: "Sahara Heat",
    type: "linear",
    angle: 95,
    colors: [
      { id: "c1", color: "#f83600", position: 0 },
      { id: "c2", color: "#f9d423", position: 50 },
      { id: "c3", color: "#ff7e5f", position: 100 }
    ]
  },
  {
    id: "tropical",
    name: "Tropical Punch",
    type: "conic",
    angle: 260,
    colors: [
      { id: "c1", color: "#f05454", position: 0 },
      { id: "c2", color: "#ffac81", position: 25 },
      { id: "c3", color: "#fffc88", position: 50 },
      { id: "c4", color: "#88e1f2", position: 75 },
      { id: "c5", color: "#6a89cc", position: 100 }
    ]
  },
  {
    id: "forest",
    name: "Forest Mist",
    type: "linear",
    angle: 130,
    colors: [
      { id: "c1", color: "#0b6623", position: 0 },
      { id: "c2", color: "#2eb872", position: 35 },
      { id: "c3", color: "#7dd87d", position: 70 },
      { id: "c4", color: "#c3f584", position: 100 }
    ]
  },
  {
    id: "polar",
    name: "Polar Light",
    type: "radial",
    angle: 90,
    colors: [
      { id: "c1", color: "#8e9eab", position: 0 },
      { id: "c2", color: "#eef2f3", position: 55 },
      { id: "c3", color: "#d7e1ec", position: 100 }
    ]
  },
  {
    id: "dusk",
    name: "Cinematic Dusk",
    type: "linear",
    angle: 155,
    colors: [
      { id: "c1", color: "#536976", position: 0 },
      { id: "c2", color: "#292e49", position: 40 },
      { id: "c3", color: "#e0c3fc", position: 75 },
      { id: "c4", color: "#8ec5fc", position: 100 }
    ]
  },
  {
    id: "iris",
    name: "Iris Beam",
    type: "conic",
    angle: 210,
    colors: [
      { id: "c1", color: "#d9afd9", position: 0 },
      { id: "c2", color: "#97d9e1", position: 35 },
      { id: "c3", color: "#5f72be", position: 65 },
      { id: "c4", color: "#9b23ea", position: 100 }
    ]
  },
  {
    id: "lava",
    name: "Lava Flow",
    type: "linear",
    angle: 175,
    colors: [
      { id: "c1", color: "#f12711", position: 0 },
      { id: "c2", color: "#f5af19", position: 50 },
      { id: "c3", color: "#ff9a44", position: 100 }
    ]
  },
  {
    id: "icefire",
    name: "Ice & Fire",
    type: "linear",
    angle: 120,
    colors: [
      { id: "c1", color: "#2193b0", position: 0 },
      { id: "c2", color: "#6dd5ed", position: 45 },
      { id: "c3", color: "#f85032", position: 75 },
      { id: "c4", color: "#e73827", position: 100 }
    ]
  },
  {
    id: "noir",
    name: "Noir Glow",
    type: "radial",
    angle: 90,
    colors: [
      { id: "c1", color: "#232526", position: 0 },
      { id: "c2", color: "#414345", position: 40 },
      { id: "c3", color: "#6b6b83", position: 75 },
      { id: "c4", color: "#aa4b6b", position: 100 }
    ]
  },
  {
    id: "cobalt",
    name: "Cobalt Circuit",
    type: "linear",
    angle: 200,
    colors: [
      { id: "c1", color: "#283c86", position: 0 },
      { id: "c2", color: "#45a247", position: 55 },
      { id: "c3", color: "#1f4037", position: 100 }
    ]
  },
  {
    id: "plasma",
    name: "Plasma Ring",
    type: "conic",
    angle: 320,
    colors: [
      { id: "c1", color: "#ff6a00", position: 0 },
      { id: "c2", color: "#ee0979", position: 30 },
      { id: "c3", color: "#8e54e9", position: 60 },
      { id: "c4", color: "#4776e6", position: 85 },
      { id: "c5", color: "#00c6ff", position: 100 }
    ]
  },
  {
    id: "sandstorm",
    name: "Sandstorm",
    type: "linear",
    angle: 80,
    colors: [
      { id: "c1", color: "#eacda3", position: 0 },
      { id: "c2", color: "#d6ae7b", position: 40 },
      { id: "c3", color: "#b58563", position: 75 },
      { id: "c4", color: "#805037", position: 100 }
    ]
  },
  {
    id: "mint",
    name: "Mint Soda",
    type: "radial",
    angle: 90,
    colors: [
      { id: "c1", color: "#1cd8d2", position: 0 },
      { id: "c2", color: "#93edc7", position: 60 },
      { id: "c3", color: "#c6ffdd", position: 100 }
    ]
  },
  {
    id: "punch",
    name: "Neon Punch",
    type: "linear",
    angle: 145,
    colors: [
      { id: "c1", color: "#b621fe", position: 0 },
      { id: "c2", color: "#1fd1f9", position: 45 },
      { id: "c3", color: "#76ff7a", position: 100 }
    ]
  },
  {
    id: "amber",
    name: "Amber Glass",
    type: "linear",
    angle: 30,
    colors: [
      { id: "c1", color: "#f8cdda", position: 0 },
      { id: "c2", color: "#1d2b64", position: 55 },
      { id: "c3", color: "#fcb045", position: 100 }
    ]
  },
  {
    id: "zenith",
    name: "Zenith",
    type: "linear",
    angle: 210,
    colors: [
      { id: "c1", color: "#355c7d", position: 0 },
      { id: "c2", color: "#6c5b7b", position: 40 },
      { id: "c3", color: "#c06c84", position: 70 },
      { id: "c4", color: "#f67280", position: 100 }
    ]
  },
  {
    id: "horizon",
    name: "Electric Horizon",
    type: "conic",
    angle: 150,
    colors: [
      { id: "c1", color: "#1fa2ff", position: 0 },
      { id: "c2", color: "#12d8fa", position: 35 },
      { id: "c3", color: "#a6ffcb", position: 70 },
      { id: "c4", color: "#fbd786", position: 100 }
    ]
  },
  {
    id: "orchid",
    name: "Orchid Fade",
    type: "linear",
    angle: 60,
    colors: [
      { id: "c1", color: "#a18cd1", position: 0 },
      { id: "c2", color: "#fbc2eb", position: 50 },
      { id: "c3", color: "#fad0c4", position: 100 }
    ]
  },
  {
    id: "retro",
    name: "Retro Wave",
    type: "linear",
    angle: 115,
    colors: [
      { id: "c1", color: "#ff4b1f", position: 0 },
      { id: "c2", color: "#ff9068", position: 35 },
      { id: "c3", color: "#1fddff", position: 70 },
      { id: "c4", color: "#28c76f", position: 100 }
    ]
  },
  {
    id: "linenight",
    name: "Line Night",
    type: "radial",
    angle: 90,
    colors: [
      { id: "c1", color: "#09203f", position: 0 },
      { id: "c2", color: "#537895", position: 45 },
      { id: "c3", color: "#1e3c72", position: 80 },
      { id: "c4", color: "#2a5298", position: 100 }
    ]
  }
];
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "GradientGenerationProcess",
  __ssrInlineRender: true,
  setup(__props) {
    const type = ref("linear");
    const angle = ref(90);
    const colors = ref([
      { id: "1", color: "#667eea", position: 0 },
      { id: "2", color: "#764ba2", position: 100 }
    ]);
    let colorIdCounter = colors.value.length;
    const communityPresets = ref([]);
    const gradientPresets = GRADIENT_PRESETS;
    const allPresets = computed(() => [...communityPresets.value, ...gradientPresets]);
    const selectedPresetId = ref(null);
    const { t, locale } = useI18n();
    const toast = useToast();
    const route = useRoute();
    const router = useRouter();
    const authStore = useAuthStore();
    const processRef = ref(null);
    const controlsRef = ref(null);
    const {
      floatingStyle: gradientFloatingStyle,
      wrapperStyle: gradientPreviewWrapperStyle,
      isFloating: isGradientPreviewFloating
    } = useFloatingPreview({
      containerRef: controlsRef,
      boundingRef: processRef,
      topOffset: 88,
      breakpoint: 1024
    });
    const showAuthModal = ref(false);
    const showSaveModal = ref(false);
    const showProLimitModal = ref(false);
    const showExportModal = ref(false);
    const showExportProModal = ref(false);
    const saveName = ref("");
    const savingPresetId = ref(null);
    const saveContext = ref(null);
    const proQuota = ref(null);
    const savedGradientHashes = ref(/* @__PURE__ */ new Set());
    const proSaveLimit = getUserLimit(SubscriptionTier.PRO, "savedTemplates");
    function getUserTier() {
      var _a;
      return resolveSubscriptionTier(
        ((_a = authStore.user) == null ? void 0 : _a.subscriptionTier) ?? authStore.userPlan
      );
    }
    const entityLabel = computed(() => t("PROFILE.SAVED_GRADIENTS"));
    const proLimitSubtitle = computed(
      () => {
        var _a;
        return t("PROFILE.PRO_LIMIT_MESSAGE", {
          limit: ((_a = proQuota.value) == null ? void 0 : _a.limit) ?? proSaveLimit,
          entity: entityLabel.value
        });
      }
    );
    const exportFilename = computed(() => selectedPresetId.value ?? "custom-gradient");
    const isExportAllowed = computed(() => {
      const tier = getUserTier();
      return Boolean(tier && tier !== SubscriptionTier.FREE);
    });
    const currentSavePreviewStyle = computed(() => {
      const context = saveContext.value;
      if (!context) return {};
      const payload = context.payload;
      const colors2 = Array.isArray(payload.colors) ? payload.colors : [];
      if (!payload.type) return {};
      return {
        background: buildGradient(payload.type, payload.angle ?? 90, colors2)
      };
    });
    const gradientStyle = computed(() => {
      let gradient = "";
      switch (type.value) {
        case "linear":
          gradient = `linear-gradient(${angle.value}deg, ${colors.value.map((c) => `${c.color} ${c.position}%`).join(", ")})`;
          break;
        case "radial":
          gradient = `radial-gradient(circle, ${colors.value.map((c) => `${c.color} ${c.position}%`).join(", ")})`;
          break;
        case "conic":
          gradient = `conic-gradient(from ${angle.value}deg, ${colors.value.map((c) => `${c.color} ${c.position}%`).join(", ")})`;
          break;
      }
      return { background: gradient };
    });
    function setType(newType) {
      type.value = newType;
    }
    function setAngle(newAngle) {
      angle.value = newAngle;
    }
    function addColor() {
      const newId = getNextColorId();
      const newPosition = colors.value.length > 0 ? Math.round((colors.value[colors.value.length - 1].position + 100) / 2) : 50;
      colors.value.push({
        id: newId,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0"),
        position: newPosition
      });
    }
    function removeColor(id) {
      if (colors.value.length > 2) {
        colors.value = colors.value.filter((c) => c.id !== id);
      }
    }
    function updateColor(id, color) {
      const colorItem = colors.value.find((c) => c.id === id);
      if (colorItem) {
        colorItem.color = color;
      }
    }
    function updateColorPosition(id, position) {
      const colorItem = colors.value.find((c) => c.id === id);
      if (colorItem) {
        colorItem.position = Math.max(0, Math.min(100, position));
      }
    }
    function getCode(format) {
      return formatGradient(type.value, angle.value, colors.value, format);
    }
    function applyPreset(preset) {
      setPresetState(preset);
      updatePresetQuery(preset.id);
      smoothScrollToTop();
    }
    function buildGradient(type2, angle2, colors2) {
      const colorStops = colors2.map((c) => `${c.color} ${c.position}%`).join(", ");
      switch (type2) {
        case "radial":
          return `radial-gradient(circle, ${colorStops})`;
        case "conic":
          return `conic-gradient(from ${angle2}deg, ${colorStops})`;
        default:
          return `linear-gradient(${angle2}deg, ${colorStops})`;
      }
    }
    function presetHash(preset) {
      return JSON.stringify({
        type: preset.type,
        angle: preset.angle,
        colors: preset.colors
      });
    }
    function setPresetState(preset) {
      type.value = preset.type;
      angle.value = preset.angle;
      const sortedColors = [...preset.colors].sort((a, b) => a.position - b.position);
      colorIdCounter = sortedColors.length;
      colors.value = sortedColors.map((color, index) => ({
        id: `${index + 1}`,
        color: color.color,
        position: color.position
      }));
      selectedPresetId.value = preset.id;
    }
    async function copyPreset(preset) {
      const code = formatGradient(preset.type, preset.angle, preset.colors, "css");
      const ok = await copyToClipboard(code);
      toast[ok ? "success" : "error"](ok ? t("COMMON.COPIED_TO_CLIPBOARD") : t("COMMON.COPY_FAILED"));
    }
    async function handleSaveCurrentGradient() {
      if (!authStore.isAuthenticated) {
        showAuthModal.value = true;
        return;
      }
      const currentColors = colors.value.map((c) => ({
        color: c.color,
        position: c.position
      }));
      saveContext.value = {
        preset: {
          id: "custom",
          name: t("GRADIENT.CUSTOM_GRADIENT"),
          type: type.value,
          angle: angle.value,
          colors: currentColors
        },
        payload: {
          type: type.value,
          angle: angle.value,
          colors: currentColors
        },
        defaultName: t("GRADIENT.CUSTOM_GRADIENT")
      };
      saveName.value = t("GRADIENT.CUSTOM_GRADIENT");
      showSaveModal.value = true;
    }
    async function handleSavePreset(preset) {
      if (!authStore.isAuthenticated) {
        showAuthModal.value = true;
        return;
      }
      saveContext.value = {
        preset,
        payload: {
          type: preset.type,
          angle: preset.angle,
          colors: preset.colors
        },
        defaultName: preset.name
      };
      saveName.value = preset.name;
      showSaveModal.value = true;
    }
    function handleExportUpgrade() {
      showExportProModal.value = false;
      router.push({
        path: `/${locale.value}/about`,
        query: { plan: "premium" }
      });
    }
    async function confirmSavePreset(name) {
      const context = saveContext.value;
      if (!context) return;
      const finalName = name || context.defaultName;
      showSaveModal.value = false;
      const allowed = await ensureProQuota("gradient");
      if (!allowed) {
        return;
      }
      savingPresetId.value = context.preset.id;
      try {
        await createSave("gradient", finalName, context.payload);
        toast.success(t("COMMON.SAVE_SUCCESS", { entity: entityLabel.value }));
        savedGradientHashes.value.add(JSON.stringify(context.payload));
      } catch (error) {
        if ((error == null ? void 0 : error.status) === 409) {
          toast.error(t("COMMON.ALREADY_SAVED", { entity: entityLabel.value }));
        } else {
          toast.error(
            (error == null ? void 0 : error.message) || t("COMMON.SAVE_ERROR", { entity: entityLabel.value })
          );
        }
      } finally {
        savingPresetId.value = null;
        saveContext.value = null;
      }
    }
    function closeSaveModal() {
      showSaveModal.value = false;
      saveContext.value = null;
    }
    async function ensureProQuota(category) {
      const quota = await evaluateSaveQuota(category);
      proQuota.value = quota;
      if (!quota.allowed) {
        showProLimitModal.value = true;
        return false;
      }
      return true;
    }
    function handleProLimitConfirm() {
      showProLimitModal.value = false;
      router.push({
        path: `/${locale.value}/about`,
        query: { plan: "premium" }
      });
    }
    function isPresetSaved(preset) {
      return savedGradientHashes.value.has(presetHash(preset));
    }
    function handleAuthConfirm() {
      showAuthModal.value = false;
      router.push({
        name: `${locale.value}-login`,
        query: { redirect: route.fullPath }
      });
    }
    function getNextColorId() {
      colorIdCounter += 1;
      return `${colorIdCounter}`;
    }
    function updatePresetQuery(presetId) {
      const nextQuery = { ...route.query };
      if (presetId) {
        nextQuery.preset = presetId;
      } else {
        delete nextQuery.preset;
      }
      router.replace({ query: nextQuery });
    }
    function applyPresetFromQuery(presetParam) {
      const presetId = normalizePresetId(presetParam);
      if (!presetId || presetId === selectedPresetId.value) return;
      const preset = allPresets.value.find((item) => item.id === presetId);
      if (!preset) return;
      setPresetState(preset);
    }
    function normalizePresetId(value) {
      if (Array.isArray(value)) {
        return typeof value[0] === "string" ? value[0] : null;
      }
      return typeof value === "string" ? value : null;
    }
    function mapCommunityPreset(item) {
      const payload = item.payload || {};
      if (!payload || typeof payload !== "object") return null;
      if (!payload.type || !payload.colors) return null;
      const colors2 = Array.isArray(payload.colors) ? payload.colors.map((color, index) => {
        if (!(color == null ? void 0 : color.color)) return null;
        return {
          id: color.id ?? `${index + 1}`,
          color: color.color,
          position: Number.isFinite(color.position) ? Number(color.position) : index * (100 / Math.max(1, payload.colors.length - 1))
        };
      }).filter(Boolean) : [];
      if (!colors2.length) return null;
      return {
        id: `community-${item.id}`,
        name: item.name,
        type: payload.type,
        angle: Number.isFinite(payload.angle) ? Number(payload.angle) : 90,
        colors: colors2,
        owner: buildCreatorProfile(item)
      };
    }
    async function loadCommunityPresets() {
      try {
        const items = await listPublicSaves("gradient");
        communityPresets.value = items.map(mapCommunityPreset).filter(Boolean);
      } catch (error) {
        console.warn("Failed to load community gradients", error);
      }
    }
    async function loadSavedGradients() {
      if (!authStore.isAuthenticated) {
        savedGradientHashes.value = /* @__PURE__ */ new Set();
        return;
      }
      try {
        const saved = await listSaves("gradient");
        savedGradientHashes.value = new Set(saved.map((item) => JSON.stringify(item.payload)));
      } catch (error) {
        console.warn("Failed to load saved gradients", error);
      }
    }
    onMounted(() => {
      applyPresetFromQuery(route.query.preset);
      loadCommunityPresets();
      loadSavedGradients();
    });
    watch(
      () => route.query.preset,
      (presetId) => {
        applyPresetFromQuery(presetId);
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "gradient-generation-process",
        ref_key: "processRef",
        ref: processRef
      }, _attrs))} data-v-c8858c95><div class="gradient-generation-process__controls" data-v-c8858c95>`);
      _push(ssrRenderComponent(unref(GradientControls), {
        type: type.value,
        angle: angle.value,
        colors: colors.value,
        "onUpdate:type": setType,
        "onUpdate:angle": setAngle,
        onAddColor: addColor,
        onRemoveColor: removeColor,
        onUpdateColor: updateColor,
        onUpdateColorPosition: updateColorPosition
      }, null, _parent));
      _push(`</div><div class="gradient-generation-process__preview" style="${ssrRenderStyle(unref(gradientPreviewWrapperStyle))}" data-v-c8858c95><div class="${ssrRenderClass([{ "gradient-generation-process__preview-inner--floating": unref(isGradientPreviewFloating) }, "gradient-generation-process__preview-inner"])}" style="${ssrRenderStyle(unref(gradientFloatingStyle))}" data-v-c8858c95>`);
      _push(ssrRenderComponent(unref(GradientPreview), { "gradient-style": gradientStyle.value }, null, _parent));
      _push(`</div></div><div class="gradient-generation-process__code" data-v-c8858c95>`);
      _push(ssrRenderComponent(unref(GradientCodeExport), {
        "get-code": getCode,
        onSave: handleSaveCurrentGradient,
        "allow-export": isExportAllowed.value,
        onBlockedExport: ($event) => showExportProModal.value = true
      }, null, _parent));
      _push(`</div><div class="gradient-generation-process__presets" data-v-c8858c95>`);
      _push(ssrRenderComponent(unref(GradientPresets), {
        presets: allPresets.value,
        "saving-id": savingPresetId.value,
        "is-saved": isPresetSaved,
        onApply: applyPreset,
        onCopy: copyPreset,
        onSave: handleSavePreset
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(Modal), {
        visible: showAuthModal.value,
        title: unref(t)("COMMON.AUTH_REQUIRED_TITLE"),
        subtitle: unref(t)("COMMON.AUTH_REQUIRED_DESCRIPTION"),
        "confirm-text": unref(t)("COMMON.AUTH_REQUIRED_CONFIRM"),
        "cancel-text": unref(t)("COMMON.AUTH_REQUIRED_CLOSE"),
        "show-actions": "",
        onConfirm: handleAuthConfirm,
        onClose: ($event) => showAuthModal.value = false
      }, null, _parent));
      _push(ssrRenderComponent(unref(Modal), {
        visible: showSaveModal.value,
        title: unref(t)("PROFILE.SAVES_TITLE"),
        subtitle: unref(t)("PROFILE.SAVES_SUBTITLE"),
        onClose: closeSaveModal
      }, {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="modal__actions" data-v-c8858c95${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Button), {
              size: "md",
              variant: "ghost",
              onClick: closeSaveModal
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("COMMON.CANCEL"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("COMMON.CANCEL")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Button), {
              size: "md",
              variant: "primary",
              onClick: ($event) => confirmSavePreset(saveName.value)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("COMMON.SAVE"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("COMMON.SAVE")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "modal__actions" }, [
                createVNode(unref(Button), {
                  size: "md",
                  variant: "ghost",
                  onClick: closeSaveModal
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("COMMON.CANCEL")), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(Button), {
                  size: "md",
                  variant: "primary",
                  onClick: ($event) => confirmSavePreset(saveName.value)
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("COMMON.SAVE")), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="gradient-generation-process__save-preview" style="${ssrRenderStyle(currentSavePreviewStyle.value)}" data-v-c8858c95${_scopeId}></div>`);
            _push2(ssrRenderComponent(unref(Input), {
              modelValue: saveName.value,
              "onUpdate:modelValue": ($event) => saveName.value = $event,
              label: unref(t)("COMMON.NAME")
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", {
                class: "gradient-generation-process__save-preview",
                style: currentSavePreviewStyle.value
              }, null, 4),
              createVNode(unref(Input), {
                modelValue: saveName.value,
                "onUpdate:modelValue": ($event) => saveName.value = $event,
                label: unref(t)("COMMON.NAME")
              }, null, 8, ["modelValue", "onUpdate:modelValue", "label"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Modal), {
        visible: showProLimitModal.value,
        title: unref(t)("PROFILE.PRO_LIMIT_TITLE"),
        subtitle: proLimitSubtitle.value,
        "show-actions": "",
        "confirm-text": unref(t)("PROFILE.PRO_LIMIT_ACTION"),
        "cancel-text": unref(t)("COMMON.CANCEL"),
        onConfirm: handleProLimitConfirm,
        onClose: ($event) => showProLimitModal.value = false
      }, null, _parent));
      _push(ssrRenderComponent(unref(Modal), {
        visible: showExportModal.value,
        title: unref(t)("COMMON.EXPORT"),
        onClose: ($event) => showExportModal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(GradientCodeExport), {
              "get-code": getCode,
              filename: exportFilename.value,
              "show-save-button": false,
              "allow-export": isExportAllowed.value,
              onBlockedExport: ($event) => showExportProModal.value = true
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(GradientCodeExport), {
                "get-code": getCode,
                filename: exportFilename.value,
                "show-save-button": false,
                "allow-export": isExportAllowed.value,
                onBlockedExport: ($event) => showExportProModal.value = true
              }, null, 8, ["filename", "allow-export", "onBlockedExport"])
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/processes/gradient/gradient-generation/GradientGenerationProcess.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const GradientGenerationProcess = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-c8858c95"]]);
const SHADOW_PRESETS = [
  {
    id: "nocturne-glow",
    name: "Nocturne glow",
    description: "Stacked cyan and violet plates for a crisp neon card.",
    layers: [
      { id: "1", x: 0, y: 18, spread: 22, color: "#0b1224", opacity: 0.42 },
      { id: "2", x: 0, y: 10, spread: 14, color: "#11192f", opacity: 0.32 },
      { id: "3", x: 0, y: 6, spread: 8, color: "#22d3ee", opacity: 0.24 },
      { id: "4", x: 0, y: 0, spread: 4, color: "#a855f7", opacity: 0.2, inset: true }
    ]
  },
  {
    id: "carbon-ridge",
    name: "Carbon ridge",
    description: "Deep charcoal ridges with a thin electric rim.",
    layers: [
      { id: "1", x: 0, y: 16, spread: 18, color: "#0f172a", opacity: 0.45 },
      { id: "2", x: 0, y: 10, spread: 10, color: "#1f2937", opacity: 0.28 },
      { id: "3", x: 0, y: 4, spread: 6, color: "#0ea5e9", opacity: 0.26 },
      { id: "4", x: 0, y: 0, spread: 2, color: "#38bdf8", opacity: 0.2, inset: true }
    ]
  },
  {
    id: "horizon-line",
    name: "Horizon line",
    description: "Wide horizontal press with a subtle sunset rim.",
    layers: [
      { id: "1", x: 0, y: 20, spread: 28, color: "#0b1220", opacity: 0.4 },
      { id: "2", x: 0, y: 12, spread: 18, color: "#0f172a", opacity: 0.3 },
      { id: "3", x: 0, y: 6, spread: 10, color: "#fb7185", opacity: 0.22 },
      { id: "4", x: 0, y: 0, spread: 3, color: "#f472b6", opacity: 0.2, inset: true }
    ]
  },
  {
    id: "mint-chip",
    name: "Mint chip",
    description: "Light edges with icy teal highlights.",
    layers: [
      { id: "1", x: 0, y: 14, spread: 16, color: "#0f172a", opacity: 0.3 },
      { id: "2", x: 0, y: 8, spread: 10, color: "#0ea5e9", opacity: 0.26 },
      { id: "3", x: 0, y: 4, spread: 6, color: "#22d3ee", opacity: 0.22 },
      { id: "4", x: 0, y: 0, spread: 2, color: "#67e8f9", opacity: 0.2, inset: true }
    ]
  },
  {
    id: "ember-plate",
    name: "Ember plate",
    description: "Layered copper warmth without blurry halos.",
    layers: [
      { id: "1", x: 0, y: 18, spread: 20, color: "#0c0f1a", opacity: 0.42 },
      { id: "2", x: 0, y: 12, spread: 12, color: "#f97316", opacity: 0.28 },
      { id: "3", x: 0, y: 6, spread: 8, color: "#fb923c", opacity: 0.22 },
      { id: "4", x: 0, y: 0, spread: 3, color: "#fed7aa", opacity: 0.18, inset: true }
    ]
  },
  {
    id: "ink-wash",
    name: "Ink wash",
    description: "Pressed ink edges with a soft navy halo.",
    layers: [
      { id: "1", x: 0, y: 12, spread: 16, color: "#0b1220", opacity: 0.38 },
      { id: "2", x: 0, y: 8, spread: 10, color: "#111827", opacity: 0.32 },
      { id: "3", x: 0, y: 4, spread: 6, color: "#1d4ed8", opacity: 0.2 },
      { id: "4", x: 0, y: 0, spread: 3, color: "#3b82f6", opacity: 0.18, inset: true }
    ]
  },
  {
    id: "steel-outline",
    name: "Steel outline",
    description: "Crisp steel slabs with inner outline.",
    layers: [
      { id: "1", x: 0, y: 16, spread: 18, color: "#0b1224", opacity: 0.4 },
      { id: "2", x: 0, y: 10, spread: 12, color: "#1f2937", opacity: 0.28 },
      { id: "3", x: 0, y: 4, spread: 6, color: "#93c5fd", opacity: 0.2 },
      { id: "4", x: 0, y: 0, spread: 2, color: "#bfdbfe", opacity: 0.16, inset: true }
    ]
  },
  {
    id: "acid-edges",
    name: "Acid edges",
    description: "Electric lime trims over dark base.",
    layers: [
      { id: "1", x: 0, y: 18, spread: 22, color: "#0f172a", opacity: 0.42 },
      { id: "2", x: 0, y: 12, spread: 12, color: "#1a2b4a", opacity: 0.3 },
      { id: "3", x: 0, y: 6, spread: 8, color: "#a3e635", opacity: 0.2 },
      { id: "4", x: 0, y: 0, spread: 3, color: "#d9f99d", opacity: 0.16, inset: true }
    ]
  },
  {
    id: "ultra-clean",
    name: "Ultra clean",
    description: "Minimal offsets with faint glass overlay.",
    layers: [
      { id: "1", x: 0, y: 10, spread: 14, color: "#0b1220", opacity: 0.28 },
      { id: "2", x: 0, y: 6, spread: 8, color: "#e2e8f0", opacity: 0.26 },
      { id: "3", x: 0, y: 2, spread: 4, color: "#cbd5e1", opacity: 0.18 },
      { id: "4", x: 0, y: 0, spread: 2, color: "#94a3b8", opacity: 0.14, inset: true }
    ]
  },
  {
    id: "signal-blue",
    name: "Signal blue",
    description: "Industrial blue ribs with inner glow.",
    layers: [
      { id: "1", x: 0, y: 14, spread: 18, color: "#0b1220", opacity: 0.36 },
      { id: "2", x: 0, y: 10, spread: 10, color: "#1d4ed8", opacity: 0.26 },
      { id: "3", x: 0, y: 4, spread: 6, color: "#60a5fa", opacity: 0.2 },
      { id: "4", x: 0, y: 0, spread: 2, color: "#93c5fd", opacity: 0.16, inset: true }
    ]
  },
  {
    id: "desert-glint",
    name: "Desert glint",
    description: "Warm sand base with thin amber edging.",
    layers: [
      { id: "1", x: 0, y: 16, spread: 18, color: "#0b1220", opacity: 0.36 },
      { id: "2", x: 0, y: 10, spread: 10, color: "#f59e0b", opacity: 0.26 },
      { id: "3", x: 0, y: 6, spread: 8, color: "#fbbf24", opacity: 0.22 },
      { id: "4", x: 0, y: 0, spread: 3, color: "#fed7aa", opacity: 0.16, inset: true }
    ]
  },
  {
    id: "rose-quartz",
    name: "Rose quartz",
    description: "Pale rose slabs with soft inner rim.",
    layers: [
      { id: "1", x: 0, y: 14, spread: 16, color: "#0f172a", opacity: 0.32 },
      { id: "2", x: 0, y: 8, spread: 8, color: "#ec4899", opacity: 0.24 },
      { id: "3", x: 0, y: 4, spread: 6, color: "#f472b6", opacity: 0.2 },
      { id: "4", x: 0, y: 0, spread: 2, color: "#fecdd3", opacity: 0.16, inset: true }
    ]
  },
  {
    id: "polar-glass",
    name: "Polar glass",
    description: "Frosted cyan edging with inner mint line.",
    layers: [
      { id: "1", x: 0, y: 16, spread: 18, color: "#0b1220", opacity: 0.38 },
      { id: "2", x: 0, y: 10, spread: 12, color: "#22d3ee", opacity: 0.24 },
      { id: "3", x: 0, y: 6, spread: 8, color: "#67e8f9", opacity: 0.2 },
      { id: "4", x: 0, y: 0, spread: 3, color: "#a5f3fc", opacity: 0.16, inset: true }
    ]
  },
  {
    id: "lilac-plate",
    name: "Lilac plate",
    description: "Stacked lavender edges with inner halo.",
    layers: [
      { id: "1", x: 0, y: 16, spread: 18, color: "#0b1220", opacity: 0.38 },
      { id: "2", x: 0, y: 10, spread: 10, color: "#7c3aed", opacity: 0.26 },
      { id: "3", x: 0, y: 6, spread: 8, color: "#a855f7", opacity: 0.22 },
      { id: "4", x: 0, y: 0, spread: 3, color: "#e9d5ff", opacity: 0.16, inset: true }
    ]
  },
  {
    id: "arctic-core",
    name: "Arctic core",
    description: "Dark base with cold cyan rim and inset line.",
    layers: [
      { id: "1", x: 0, y: 18, spread: 20, color: "#0b1220", opacity: 0.4 },
      { id: "2", x: 0, y: 12, spread: 12, color: "#164e63", opacity: 0.28 },
      { id: "3", x: 0, y: 6, spread: 8, color: "#06b6d4", opacity: 0.22 },
      { id: "4", x: 0, y: 0, spread: 3, color: "#67e8f9", opacity: 0.18, inset: true }
    ]
  },
  {
    id: "signal-red",
    name: "Signal red",
    description: "Industrial crimson offsets with crisp inset.",
    layers: [
      { id: "1", x: 0, y: 18, spread: 20, color: "#0b1220", opacity: 0.4 },
      { id: "2", x: 0, y: 12, spread: 12, color: "#ef4444", opacity: 0.26 },
      { id: "3", x: 0, y: 6, spread: 8, color: "#f87171", opacity: 0.22 },
      { id: "4", x: 0, y: 0, spread: 3, color: "#fecdd3", opacity: 0.16, inset: true }
    ]
  },
  {
    id: "circuit-green",
    name: "Circuit green",
    description: "Two-step emerald clamps with inset neon.",
    layers: [
      { id: "1", x: 0, y: 16, spread: 18, color: "#0b1220", opacity: 0.38 },
      { id: "2", x: 0, y: 10, spread: 10, color: "#16a34a", opacity: 0.26 },
      { id: "3", x: 0, y: 6, spread: 8, color: "#22c55e", opacity: 0.22 },
      { id: "4", x: 0, y: 0, spread: 3, color: "#bbf7d0", opacity: 0.16, inset: true }
    ]
  },
  {
    id: "amberglass",
    name: "Amberglass",
    description: "Golden translucent shelves with bright rim.",
    layers: [
      { id: "1", x: 0, y: 18, spread: 20, color: "#0b1220", opacity: 0.36 },
      { id: "2", x: 0, y: 12, spread: 12, color: "#d97706", opacity: 0.26 },
      { id: "3", x: 0, y: 6, spread: 8, color: "#f59e0b", opacity: 0.22 },
      { id: "4", x: 0, y: 0, spread: 3, color: "#fcd34d", opacity: 0.16, inset: true }
    ]
  },
  {
    id: "oxide",
    name: "Oxide",
    description: "Rust tones stacked on matte graphite.",
    layers: [
      { id: "1", x: 0, y: 18, spread: 22, color: "#0c111b", opacity: 0.4 },
      { id: "2", x: 0, y: 12, spread: 12, color: "#ea580c", opacity: 0.26 },
      { id: "3", x: 0, y: 6, spread: 8, color: "#f97316", opacity: 0.22 },
      { id: "4", x: 0, y: 0, spread: 3, color: "#fed7aa", opacity: 0.16, inset: true }
    ]
  },
  {
    id: "aurora",
    name: "Aurora",
    description: "Gradient-inspired cyan + magenta hard shadows.",
    layers: [
      { id: "1", x: 0, y: 18, spread: 22, color: "#0b1220", opacity: 0.4 },
      { id: "2", x: 0, y: 12, spread: 12, color: "#22d3ee", opacity: 0.24 },
      { id: "3", x: 0, y: 6, spread: 8, color: "#a855f7", opacity: 0.22 },
      { id: "4", x: 0, y: 0, spread: 3, color: "#d946ef", opacity: 0.18, inset: true }
    ]
  }
];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ShadowGenerationProcess",
  __ssrInlineRender: true,
  setup(__props) {
    const shadowPresets = SHADOW_PRESETS;
    const communityPresets = ref([]);
    const allPresets = computed(() => [...communityPresets.value, ...shadowPresets]);
    const defaultLayers = [
      { id: "1", x: 0, y: 12, spread: 16, color: "#0b1220", opacity: 0.36, inset: false },
      { id: "2", x: 0, y: 0, spread: 3, color: "#a855f7", opacity: 0.2, inset: true }
    ];
    const layers = ref(normalizeLayers(defaultLayers));
    let layerIdCounter = layers.value.length;
    const selectedPresetId = ref(null);
    const route = useRoute();
    const router = useRouter();
    const { t, locale } = useI18n();
    const toast = useToast();
    const authStore = useAuthStore();
    const processRef = ref(null);
    const controlsRef = ref(null);
    const {
      floatingStyle: shadowFloatingStyle,
      wrapperStyle: shadowPreviewWrapperStyle,
      isFloating: isShadowPreviewFloating
    } = useFloatingPreview({
      containerRef: controlsRef,
      boundingRef: processRef,
      topOffset: 88,
      breakpoint: 1024
    });
    const showAuthModal = ref(false);
    const showSaveModal = ref(false);
    const showProLimitModal = ref(false);
    const showExportModal = ref(false);
    const showExportProModal = ref(false);
    const saveName = ref("");
    const savingPresetId = ref(null);
    const saveContext = ref(null);
    const proQuota = ref(null);
    const savedShadowHashes = ref(/* @__PURE__ */ new Set());
    const entityLabel = computed(() => t("PROFILE.SAVED_SHADOWS"));
    const proSaveLimit = getUserLimit(SubscriptionTier.PRO, "savedTemplates");
    const proLimitSubtitle = computed(
      () => {
        var _a;
        return t("PROFILE.PRO_LIMIT_MESSAGE", {
          limit: ((_a = proQuota.value) == null ? void 0 : _a.limit) ?? proSaveLimit,
          entity: entityLabel.value
        });
      }
    );
    const exportFilename = computed(() => selectedPresetId.value ?? "custom-shadow");
    function getUserTier() {
      var _a;
      return resolveSubscriptionTier(
        ((_a = authStore.user) == null ? void 0 : _a.subscriptionTier) ?? authStore.userPlan
      );
    }
    const isExportAllowed = computed(() => {
      const tier = getUserTier();
      return Boolean(tier && tier !== SubscriptionTier.FREE);
    });
    const currentSavePreviewStyle = computed(() => {
      const context = saveContext.value;
      if (!context) return {};
      const payload = context.payload;
      const layers2 = Array.isArray(payload.layers) ? payload.layers : [];
      if (!layers2.length) return {};
      return {
        boxShadow: buildShadow(layers2)
      };
    });
    const boxShadowValue = computed(() => {
      return layers.value.map(layerToCss).join(", ");
    });
    function layerToCss(layer) {
      return `${layer.inset ? "inset " : ""}${layer.x}px ${layer.y}px 0 ${layer.spread}px ${resolveColor(layer)}`;
    }
    function resolveColor(layer) {
      const rgb = hexToRgb(layer.color);
      const safeOpacity = Math.min(1, Math.max(0, layer.opacity));
      if (!rgb) return layer.color;
      return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Number(safeOpacity).toFixed(2)})`;
    }
    function addLayer() {
      const fallback = layers.value[layers.value.length - 1] || {
        x: 0,
        y: 8,
        spread: 10,
        opacity: 0.32
      };
      layers.value.push({
        id: getNextLayerId(),
        x: fallback.x,
        y: fallback.y + 2,
        spread: fallback.spread,
        color: randomHexColor(),
        opacity: Math.min(1, Math.max(0.12, fallback.opacity)),
        inset: false
      });
    }
    function removeLayer(id) {
      if (layers.value.length <= 1) return;
      layers.value = layers.value.filter((layer) => layer.id !== id);
      if (selectedPresetId.value) {
        updatePresetQuery(null);
        selectedPresetId.value = null;
      }
    }
    function updateLayer(id, patch) {
      const layer = layers.value.find((item) => item.id === id);
      if (!layer) return;
      Object.assign(layer, sanitizePatch(patch));
      selectedPresetId.value = null;
      updatePresetQuery(null);
    }
    function sanitizePatch(patch) {
      const next = {};
      if (typeof patch.x === "number" && Number.isFinite(patch.x)) {
        next.x = clamp(patch.x, -120, 120);
      }
      if (typeof patch.y === "number" && Number.isFinite(patch.y)) {
        next.y = clamp(patch.y, -120, 120);
      }
      if (typeof patch.spread === "number" && Number.isFinite(patch.spread)) {
        next.spread = clamp(patch.spread, -40, 80);
      }
      if (typeof patch.opacity === "number" && Number.isFinite(patch.opacity)) {
        next.opacity = clamp(patch.opacity, 0, 1);
      }
      if (typeof patch.color === "string") {
        const normalized = normalizeHex(patch.color);
        if (normalized) {
          next.color = normalized;
        }
      }
      if (typeof patch.inset === "boolean") {
        next.inset = patch.inset;
      }
      return next;
    }
    function getNextLayerId() {
      layerIdCounter += 1;
      return `${layerIdCounter}`;
    }
    function getCode(format) {
      const exportLayers = layers.value.map((layer) => ({
        x: layer.x,
        y: layer.y,
        blur: 0,
        spread: layer.spread,
        color: resolveColor(layer),
        inset: layer.inset
      }));
      return formatBoxShadow(exportLayers, format);
    }
    function applyPreset(preset) {
      layers.value = normalizeLayers(preset.layers);
      layerIdCounter = layers.value.length;
      selectedPresetId.value = preset.id;
      updatePresetQuery(preset.id);
      smoothScrollToTop();
    }
    async function copyPreset(preset) {
      const code = formatBoxShadow(
        preset.layers.map((layer) => ({
          ...layer,
          blur: 0,
          color: resolveColor(layer)
        })),
        "css"
      );
      const ok = await copyToClipboard(code);
      toast[ok ? "success" : "error"](ok ? t("COMMON.COPIED_TO_CLIPBOARD") : t("COMMON.COPY_FAILED"));
    }
    async function handleSaveCurrentShadow() {
      if (!authStore.isAuthenticated) {
        showAuthModal.value = true;
        return;
      }
      const currentLayers = layers.value.map((layer) => ({
        id: layer.id,
        x: layer.x,
        y: layer.y,
        spread: layer.spread,
        color: layer.color,
        opacity: layer.opacity,
        inset: layer.inset
      }));
      saveContext.value = {
        preset: {
          id: "custom",
          name: t("SHADOW.CUSTOM_SHADOW"),
          description: t("SHADOW.CUSTOM_SHADOW"),
          layers: currentLayers
        },
        payload: {
          layers: currentLayers
        },
        defaultName: t("SHADOW.CUSTOM_SHADOW")
      };
      saveName.value = t("SHADOW.CUSTOM_SHADOW");
      showSaveModal.value = true;
    }
    async function handleSavePreset(preset) {
      if (!authStore.isAuthenticated) {
        showAuthModal.value = true;
        return;
      }
      saveContext.value = {
        preset,
        payload: {
          layers: preset.layers
        },
        defaultName: preset.name
      };
      saveName.value = preset.name;
      showSaveModal.value = true;
    }
    function handleExportUpgrade() {
      showExportProModal.value = false;
      router.push({
        path: `/${locale.value}/about`,
        query: { plan: "premium" }
      });
    }
    async function confirmSavePreset(name) {
      const context = saveContext.value;
      if (!context) return;
      const finalName = name || context.defaultName;
      showSaveModal.value = false;
      const allowed = await ensureProQuota("shadow");
      if (!allowed) {
        return;
      }
      savingPresetId.value = context.preset.id;
      try {
        await createSave("shadow", finalName, context.payload);
        toast.success(t("COMMON.SAVE_SUCCESS", { entity: entityLabel.value }));
        savedShadowHashes.value.add(JSON.stringify(context.payload));
      } catch (error) {
        if ((error == null ? void 0 : error.status) === 409) {
          toast.error(t("COMMON.ALREADY_SAVED", { entity: entityLabel.value }));
        } else {
          toast.error(
            (error == null ? void 0 : error.message) || t("COMMON.SAVE_ERROR", { entity: entityLabel.value })
          );
        }
      } finally {
        savingPresetId.value = null;
        saveContext.value = null;
      }
    }
    function closeSaveModal() {
      showSaveModal.value = false;
      saveContext.value = null;
    }
    async function ensureProQuota(category) {
      const quota = await evaluateSaveQuota(category);
      proQuota.value = quota;
      if (!quota.allowed) {
        showProLimitModal.value = true;
        return false;
      }
      return true;
    }
    function handleProLimitConfirm() {
      showProLimitModal.value = false;
      router.push({
        path: `/${locale.value}/about`,
        query: { plan: "premium" }
      });
    }
    function isPresetSaved(preset) {
      return savedShadowHashes.value.has(shadowPresetHash(preset));
    }
    function handleAuthConfirm() {
      showAuthModal.value = false;
      router.push({
        name: `${locale.value}-login`,
        query: { redirect: route.fullPath }
      });
    }
    function buildShadow(layers2) {
      return layers2.map((layer) => {
        return `${layer.inset ? "inset " : ""}${layer.x}px ${layer.y}px 0 ${layer.spread}px ${layer.color}`;
      }).join(", ");
    }
    function shadowPresetHash(preset) {
      return JSON.stringify({
        layers: preset.layers
      });
    }
    function normalizeLayers(layers2) {
      return layers2.map((layer, index) => ({
        ...layer,
        id: `${index + 1}`
      }));
    }
    function normalizeHex(input) {
      let value = input.trim();
      if (!value.startsWith("#")) {
        value = `#${value}`;
      }
      const isValid = /^#([0-9a-fA-F]{6})$/.test(value);
      return isValid ? value.toLowerCase() : null;
    }
    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }
    function updatePresetQuery(presetId) {
      const nextQuery = { ...route.query };
      if (presetId) {
        nextQuery.preset = presetId;
      } else {
        delete nextQuery.preset;
      }
      router.replace({ query: nextQuery });
    }
    function applyPresetFromQuery(presetParam) {
      const presetId = normalizePresetId(presetParam);
      if (!presetId || presetId === selectedPresetId.value) return;
      const preset = allPresets.value.find((item) => item.id === presetId);
      if (!preset) return;
      applyPreset(preset);
    }
    function normalizePresetId(value) {
      if (Array.isArray(value)) {
        return typeof value[0] === "string" ? value[0] : null;
      }
      return typeof value === "string" ? value : null;
    }
    function mapCommunityPreset(item) {
      const payload = item.payload || {};
      const layers2 = Array.isArray(payload.layers) ? payload.layers.map((layer, index) => {
        if (!layer) return null;
        return {
          id: `${index + 1}`,
          x: Number.isFinite(layer.x) ? Number(layer.x) : 0,
          y: Number.isFinite(layer.y) ? Number(layer.y) : 0,
          spread: Number.isFinite(layer.spread) ? Number(layer.spread) : 0,
          color: typeof layer.color === "string" ? layer.color : "#000000",
          opacity: Number.isFinite(layer.opacity) ? Number(layer.opacity) : 0.35,
          inset: Boolean(layer.inset)
        };
      }).filter(Boolean) : [];
      if (!layers2.length) return null;
      return {
        id: `community-${item.id}`,
        name: item.name,
        description: payload.description || "Community shadow",
        layers: layers2,
        owner: buildCreatorProfile(item)
      };
    }
    async function loadSavedShadows() {
      if (!authStore.isAuthenticated) {
        savedShadowHashes.value = /* @__PURE__ */ new Set();
        return;
      }
      try {
        const saved = await listSaves("shadow");
        savedShadowHashes.value = new Set(saved.map((item) => JSON.stringify(item.payload)));
      } catch (error) {
        console.warn("Failed to load saved shadows", error);
      }
    }
    async function loadCommunityPresets() {
      try {
        const items = await listPublicSaves("shadow");
        communityPresets.value = items.map(mapCommunityPreset).filter(Boolean);
      } catch (error) {
        console.warn("Failed to load community shadows", error);
      }
    }
    onMounted(() => {
      applyPresetFromQuery(route.query.preset);
      loadCommunityPresets();
      loadSavedShadows();
    });
    watch(
      () => route.query.preset,
      (presetId) => {
        applyPresetFromQuery(presetId);
      }
    );
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "shadow-generation",
        ref_key: "processRef",
        ref: processRef
      }, _attrs))} data-v-ef75bb18><div class="shadow-generation__code" data-v-ef75bb18>`);
      _push(ssrRenderComponent(unref(ShadowCodeExport), {
        "get-code": getCode,
        onSave: handleSaveCurrentShadow,
        "allow-export": isExportAllowed.value,
        onBlockedExport: ($event) => showExportProModal.value = true
      }, null, _parent));
      _push(`</div><div class="shadow-generation__controls" data-v-ef75bb18>`);
      _push(ssrRenderComponent(unref(ShadowControls), {
        layers: layers.value,
        onUpdateLayer: updateLayer,
        onRemoveLayer: removeLayer,
        onAddLayer: addLayer
      }, null, _parent));
      _push(`</div><div class="shadow-generation__preview" style="${ssrRenderStyle(unref(shadowPreviewWrapperStyle))}" data-v-ef75bb18><div class="${ssrRenderClass([{ "shadow-generation__preview-inner--floating": unref(isShadowPreviewFloating) }, "shadow-generation__preview-inner"])}" style="${ssrRenderStyle(unref(shadowFloatingStyle))}" data-v-ef75bb18>`);
      _push(ssrRenderComponent(unref(ShadowPreview), {
        "box-shadow": boxShadowValue.value,
        accent: { primary: "#22d3ee", secondary: "#a855f7" }
      }, null, _parent));
      _push(`</div></div><div class="shadow-generation__presets" data-v-ef75bb18>`);
      _push(ssrRenderComponent(unref(ShadowPresets), {
        presets: allPresets.value,
        "active-id": selectedPresetId.value,
        "saving-id": savingPresetId.value,
        "is-saved": isPresetSaved,
        onApply: applyPreset,
        onCopy: copyPreset,
        onSave: handleSavePreset
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(Modal), {
        visible: showAuthModal.value,
        title: unref(t)("COMMON.AUTH_REQUIRED_TITLE"),
        subtitle: unref(t)("COMMON.AUTH_REQUIRED_DESCRIPTION"),
        "confirm-text": unref(t)("COMMON.AUTH_REQUIRED_CONFIRM"),
        "cancel-text": unref(t)("COMMON.AUTH_REQUIRED_CLOSE"),
        "show-actions": "",
        onConfirm: handleAuthConfirm,
        onClose: ($event) => showAuthModal.value = false
      }, null, _parent));
      _push(ssrRenderComponent(unref(Modal), {
        visible: showSaveModal.value,
        title: unref(t)("PROFILE.SAVES_TITLE"),
        subtitle: unref(t)("PROFILE.SAVES_SUBTITLE"),
        onClose: closeSaveModal
      }, {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="modal__actions" data-v-ef75bb18${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Button), {
              size: "md",
              variant: "ghost",
              onClick: closeSaveModal
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("COMMON.CANCEL"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("COMMON.CANCEL")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Button), {
              size: "md",
              variant: "primary",
              onClick: ($event) => confirmSavePreset(saveName.value)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("COMMON.SAVE"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("COMMON.SAVE")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "modal__actions" }, [
                createVNode(unref(Button), {
                  size: "md",
                  variant: "ghost",
                  onClick: closeSaveModal
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("COMMON.CANCEL")), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(Button), {
                  size: "md",
                  variant: "primary",
                  onClick: ($event) => confirmSavePreset(saveName.value)
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("COMMON.SAVE")), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="shadow-generation__save-preview" style="${ssrRenderStyle(currentSavePreviewStyle.value)}" data-v-ef75bb18${_scopeId}></div>`);
            _push2(ssrRenderComponent(unref(Input), {
              modelValue: saveName.value,
              "onUpdate:modelValue": ($event) => saveName.value = $event,
              label: unref(t)("COMMON.NAME")
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("div", {
                class: "shadow-generation__save-preview",
                style: currentSavePreviewStyle.value
              }, null, 4),
              createVNode(unref(Input), {
                modelValue: saveName.value,
                "onUpdate:modelValue": ($event) => saveName.value = $event,
                label: unref(t)("COMMON.NAME")
              }, null, 8, ["modelValue", "onUpdate:modelValue", "label"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Modal), {
        visible: showProLimitModal.value,
        title: unref(t)("PROFILE.PRO_LIMIT_TITLE"),
        subtitle: proLimitSubtitle.value,
        "show-actions": "",
        "confirm-text": unref(t)("PROFILE.PRO_LIMIT_ACTION"),
        "cancel-text": unref(t)("COMMON.CANCEL"),
        onConfirm: handleProLimitConfirm,
        onClose: ($event) => showProLimitModal.value = false
      }, null, _parent));
      _push(ssrRenderComponent(unref(Modal), {
        visible: showExportModal.value,
        title: unref(t)("COMMON.EXPORT"),
        onClose: ($event) => showExportModal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ShadowCodeExport), {
              "get-code": getCode,
              filename: exportFilename.value,
              "show-save-button": false,
              "allow-export": isExportAllowed.value,
              onBlockedExport: ($event) => showExportProModal.value = true
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ShadowCodeExport), {
                "get-code": getCode,
                filename: exportFilename.value,
                "show-save-button": false,
                "allow-export": isExportAllowed.value,
                onBlockedExport: ($event) => showExportProModal.value = true
              }, null, 8, ["filename", "allow-export", "onBlockedExport"])
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
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/processes/shadow/shadow-generation/ShadowGenerationProcess.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ShadowGenerationProcess = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ef75bb18"]]);
export {
  GradientGenerationProcess as G,
  ShadowGenerationProcess as S
};
