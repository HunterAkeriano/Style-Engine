import { defineComponent, ref, computed, onMounted, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderComponent } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { useToast } from "vue-toastification";
import { B as Button, c as copyToClipboard, _ as _export_sfc } from "../main.mjs";
import { l as listPublicSaves, a as listSaves, r as requestPublish, d as deleteSave } from "./saves-Czai1rJv.js";
import { f as formatGradient, a as formatBoxShadow } from "./css-C6OGq8u0.js";
function stringifyValue(value, visited) {
  if (value === null) {
    return "null";
  }
  if (value === void 0) {
    return "undefined";
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stringifyValue(item, visited)).join(",")}]`;
  }
  if (typeof value === "object") {
    if (visited.has(value)) {
      return '"[Circular]"';
    }
    visited.add(value);
    const entries = Object.keys(value).sort().map((key) => `${key}:${stringifyValue(value[key], visited)}`);
    visited.delete(value);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value);
}
function stableStringify(value) {
  return stringifyValue(value, /* @__PURE__ */ new Set());
}
const normalizeColorString = (value) => typeof value === "string" ? value.trim().toLowerCase() : "";
const normalizeNumber = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return 0;
};
function normalizeGradientPayload(payload) {
  const colors = Array.isArray(payload.colors) ? payload.colors : [];
  const normalizedColors = colors.map((color) => ({
    color: normalizeColorString(color == null ? void 0 : color.color),
    position: normalizeNumber(color == null ? void 0 : color.position)
  })).sort((a, b) => a.position - b.position);
  return {
    type: typeof payload.type === "string" ? payload.type : "linear",
    angle: normalizeNumber(payload.angle),
    colors: normalizedColors
  };
}
function normalizeShadowPayload(payload) {
  const layers = Array.isArray(payload.layers) ? payload.layers : [];
  const normalizedLayers = layers.map((layer) => ({
    inset: Boolean(layer == null ? void 0 : layer.inset),
    x: normalizeNumber(layer == null ? void 0 : layer.x),
    y: normalizeNumber(layer == null ? void 0 : layer.y),
    blur: normalizeNumber(layer == null ? void 0 : layer.blur),
    spread: normalizeNumber(layer == null ? void 0 : layer.spread),
    color: normalizeColorString(layer == null ? void 0 : layer.color) || "#000"
  })).sort((a, b) => {
    const aValue = `${a.inset}-${a.x}-${a.y}-${a.blur}-${a.spread}-${a.color}`;
    const bValue = `${b.inset}-${b.x}-${b.y}-${b.blur}-${b.spread}-${b.color}`;
    return aValue.localeCompare(bValue);
  });
  return {
    layers: normalizedLayers
  };
}
function normalizeAnimationPayload(payload) {
  return {
    html: typeof payload.html === "string" ? payload.html.trim() : "",
    css: typeof payload.css === "string" ? payload.css.trim() : ""
  };
}
function normalizePayload(category, payload) {
  if (!payload || typeof payload !== "object") {
    return {};
  }
  switch (category) {
    case "gradient":
      return normalizeGradientPayload(payload);
    case "shadow":
      return normalizeShadowPayload(payload);
    case "animation":
      return normalizeAnimationPayload(payload);
    default:
      return payload;
  }
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProfileSavedList",
  __ssrInlineRender: true,
  props: {
    category: {},
    titleKey: {},
    subtitleKey: {}
  },
  setup(__props) {
    const props = __props;
    const items = ref([]);
    const loading = ref(true);
    const error = ref("");
    const publishingId = ref(null);
    const deletingId = ref(null);
    const toast = useToast();
    const { t } = useI18n();
    const serverPayloadHashes = ref(/* @__PURE__ */ new Set());
    const itemHashMap = computed(() => {
      const map = /* @__PURE__ */ new Map();
      items.value.forEach((item) => {
        map.set(item.id, stableStringify(normalizePayload(props.category, item.payload ?? {})));
      });
      return map;
    });
    const localHashCounts = computed(() => {
      const counts = /* @__PURE__ */ new Map();
      itemHashMap.value.forEach((hash) => {
        counts.set(hash, (counts.get(hash) ?? 0) + 1);
      });
      return counts;
    });
    function getItemHash(item) {
      return itemHashMap.value.get(item.id) ?? stableStringify(normalizePayload(props.category, item.payload ?? {}));
    }
    function getDuplicateReason(item) {
      if (item.status !== "private") {
        return null;
      }
      const hash = getItemHash(item);
      if ((localHashCounts.value.get(hash) ?? 0) > 1) {
        return "local";
      }
      if (serverPayloadHashes.value.has(hash)) {
        return "public";
      }
      return null;
    }
    function canPublish(item) {
      return getDuplicateReason(item) === null;
    }
    function getPublishTooltip(item) {
      const reason = getDuplicateReason(item);
      if (!reason) return "";
      return reason === "local" ? t("PROFILE.DUPLICATE_LOCAL") : t("PROFILE.DUPLICATE_PUBLIC");
    }
    async function loadPublicHashes() {
      try {
        const publicItems = await listPublicSaves(props.category);
        serverPayloadHashes.value = new Set(
          publicItems.map((item) => stableStringify(normalizePayload(props.category, item.payload ?? {})))
        );
      } catch (error2) {
        console.warn("Failed to load public saves", error2);
      }
    }
    async function loadItems() {
      loading.value = true;
      error.value = "";
      try {
        items.value = await listSaves(props.category);
      } catch (err) {
        error.value = (err == null ? void 0 : err.message) || t("PROFILE.LOAD_SAVES_ERROR");
      } finally {
        loading.value = false;
      }
    }
    async function publish(item) {
      if (!canPublish(item)) return;
      publishingId.value = item.id;
      try {
        await requestPublish(props.category, item.id);
        toast.success(t("PROFILE.PUBLISH_SUCCESS"));
        await Promise.all([loadItems(), loadPublicHashes()]);
      } catch (err) {
        const errorMessage = (err == null ? void 0 : err.status) === 409 ? t("PROFILE.DUPLICATE_EXISTS") : (err == null ? void 0 : err.message) || t("PROFILE.PUBLISH_ERROR");
        toast.error(errorMessage);
      } finally {
        publishingId.value = null;
      }
    }
    function toLocaleDate(value) {
      return new Date(value).toLocaleDateString();
    }
    function getPreviewStyle(item) {
      const payload = item.payload;
      if (props.category === "gradient") {
        const colors = Array.isArray(payload.colors) ? payload.colors : [];
        const stops = colors.map((c) => `${c.color ?? "#000"} ${c.position ?? 0}%`).join(", ");
        const angle = typeof payload.angle === "number" ? payload.angle : 90;
        switch (payload.type) {
          case "radial":
            return { background: `radial-gradient(circle, ${stops})` };
          case "conic":
            return { background: `conic-gradient(from ${angle}deg, ${stops})` };
          default:
            return { background: `linear-gradient(${angle}deg, ${stops})` };
        }
      }
      if (props.category === "shadow") {
        const layers = Array.isArray(payload.layers) ? payload.layers : [];
        const boxShadow = layers.map((layer) => {
          const color = layer.color ?? "#000";
          return `${layer.inset ? "inset " : ""}${layer.x ?? 0}px ${layer.y ?? 0}px 0 ${layer.spread ?? 0}px ${color}`;
        }).join(", ");
        return {
          boxShadow
        };
      }
      return {};
    }
    function getAnimationHTML(item) {
      const payload = item.payload;
      const html = payload.html || '<div class="animated-element"></div>';
      const css = payload.css || "";
      return `
    <style scoped>
      ${css}
    </style>
    ${html}
  `;
    }
    function generateCSS(item) {
      const payload = item.payload;
      if (props.category === "gradient") {
        const colors = Array.isArray(payload.colors) ? payload.colors : [];
        const angle = typeof payload.angle === "number" ? payload.angle : 90;
        const type = payload.type || "linear";
        return formatGradient(type, angle, colors, "css");
      }
      if (props.category === "shadow") {
        const layers = Array.isArray(payload.layers) ? payload.layers : [];
        return formatBoxShadow(layers, "css");
      }
      if (props.category === "animation") {
        return payload.css || payload.html || "";
      }
      return "";
    }
    async function copyCSS(item) {
      try {
        const css = generateCSS(item);
        await copyToClipboard(css);
        toast.success(t("PROFILE.COPIED"));
      } catch {
        toast.error(t("PROFILE.COPY_ERROR"));
      }
    }
    async function deleteItem(item) {
      if (!confirm(t("PROFILE.DELETE_CONFIRM", { name: item.name }))) {
        return;
      }
      deletingId.value = item.id;
      try {
        await deleteSave(props.category, item.id);
        toast.success(t("PROFILE.DELETE_SUCCESS"));
        await loadItems();
      } catch (err) {
        toast.error((err == null ? void 0 : err.message) || t("PROFILE.DELETE_ERROR"));
      } finally {
        deletingId.value = null;
      }
    }
    onMounted(() => {
      loadItems();
      loadPublicHashes();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "profile-saved-list" }, _attrs))} data-v-42627f94><header class="profile-saved-list__header" data-v-42627f94><div data-v-42627f94><p class="profile-saved-list__tag" data-v-42627f94>${ssrInterpolate(unref(t)(__props.titleKey))}</p><h2 class="profile-saved-list__title" data-v-42627f94>${ssrInterpolate(unref(t)(__props.titleKey))}</h2><p class="profile-saved-list__subtitle" data-v-42627f94>${ssrInterpolate(unref(t)(__props.subtitleKey))}</p></div></header>`);
      if (error.value) {
        _push(`<div class="profile-saved-list__empty" data-v-42627f94>${ssrInterpolate(error.value)}</div>`);
      } else if (loading.value) {
        _push(`<div class="profile-saved-list__empty" data-v-42627f94>${ssrInterpolate(unref(t)("PROFILE.SAVES_LOADING"))}</div>`);
      } else if (!items.value.length) {
        _push(`<div class="profile-saved-list__empty" data-v-42627f94>${ssrInterpolate(unref(t)("PROFILE.SAVES_EMPTY"))}</div>`);
      } else {
        _push(`<div class="profile-saved-list__grid" data-v-42627f94><!--[-->`);
        ssrRenderList(items.value, (item) => {
          _push(`<article class="profile-saved-list__card" data-v-42627f94><div class="${ssrRenderClass([`profile-saved-list__preview_${__props.category}`, "profile-saved-list__preview"])}" data-v-42627f94>`);
          if (__props.category === "gradient") {
            _push(`<div class="profile-saved-list__preview-swatch" style="${ssrRenderStyle(getPreviewStyle(item))}" data-v-42627f94></div>`);
          } else if (__props.category === "shadow") {
            _push(`<div class="profile-saved-list__preview-shadow" style="${ssrRenderStyle(getPreviewStyle(item))}" data-v-42627f94></div>`);
          } else {
            _push(`<div class="profile-saved-list__preview-animation" data-v-42627f94><div class="profile-saved-list__preview-animation-content" data-v-42627f94>${getAnimationHTML(item) ?? ""}</div></div>`);
          }
          _push(`</div><div class="profile-saved-list__body" data-v-42627f94><header class="profile-saved-list__body-head" data-v-42627f94><h3 data-v-42627f94>${ssrInterpolate(item.name)}</h3><span class="${ssrRenderClass([`profile-saved-list__status_${item.status ?? "private"}`, "profile-saved-list__status"])}" data-v-42627f94>${ssrInterpolate(unref(t)(`PROFILE.STATUS_${(item.status ?? "private").toUpperCase()}`))}</span></header><p class="profile-saved-list__meta" data-v-42627f94>${ssrInterpolate(unref(t)("PROFILE.SAVED_AT"))} ${ssrInterpolate(toLocaleDate(item.createdAt))}</p><div class="profile-saved-list__actions" data-v-42627f94>`);
          _push(ssrRenderComponent(unref(Button), {
            variant: "ghost",
            size: "sm",
            title: unref(t)("PROFILE.COPY_CSS"),
            onClick: ($event) => copyCSS(item)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("PROFILE.COPY"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("PROFILE.COPY")), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          if (item.status === "private") {
            _push(ssrRenderComponent(unref(Button), {
              variant: "ghost",
              size: "sm",
              disabled: publishingId.value === item.id || !canPublish(item),
              title: getPublishTooltip(item),
              onClick: ($event) => publish(item)
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`${ssrInterpolate(publishingId.value === item.id ? unref(t)("PROFILE.PUBLISHING") : unref(t)("PROFILE.PUBLISH"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(publishingId.value === item.id ? unref(t)("PROFILE.PUBLISHING") : unref(t)("PROFILE.PUBLISH")), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else if (item.status === "pending") {
            _push(`<span class="profile-saved-list__hint" data-v-42627f94>${ssrInterpolate(unref(t)("PROFILE.PENDING_REVIEW"))}</span>`);
          } else {
            _push(`<span class="profile-saved-list__hint" data-v-42627f94>${ssrInterpolate(unref(t)("PROFILE.APPROVED"))}</span>`);
          }
          _push(ssrRenderComponent(unref(Button), {
            variant: "danger",
            size: "sm",
            disabled: deletingId.value === item.id,
            title: unref(t)("PROFILE.DELETE"),
            onClick: ($event) => deleteItem(item)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(deletingId.value === item.id ? unref(t)("PROFILE.DELETING") : unref(t)("PROFILE.DELETE"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(deletingId.value === item.id ? unref(t)("PROFILE.DELETING") : unref(t)("PROFILE.DELETE")), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</div></div></article>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/profile/ProfileSavedList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ProfileSavedList = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-42627f94"]]);
export {
  ProfileSavedList as P
};
