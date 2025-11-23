var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { defineStore, createPinia } from "pinia";
import { ViteSSG } from "vite-ssg";
import { createHead } from "@unhead/vue/server";
import Toast, { useToast, POSITION } from "vue-toastification";
import { defineComponent, mergeProps, useSSRContext, ref, computed, watch, nextTick, onMounted, onBeforeUnmount, resolveComponent, withCtx, renderSlot, unref, createTextVNode, toDisplayString, toRefs, createVNode, resolveDirective } from "vue";
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderAttr, ssrInterpolate, ssrRenderDynamicModel, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderTeleport, ssrGetDirectiveProps } from "vue/server-renderer";
import { useRoute, RouterView, useRouter } from "vue-router";
import { useI18n, createI18n } from "vue-i18n";
import { useHead } from "@unhead/vue";
import { disableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock-upgrade";
import axios from "axios";
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "Button",
  __ssrInlineRender: true,
  props: {
    variant: { default: "primary" },
    size: { default: "md" },
    type: { default: "button" },
    disabled: { type: Boolean, default: false }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: ["button", `button_${__props.variant}`, `button_${__props.size}`, { "button_disabled": __props.disabled }],
        disabled: __props.disabled,
        type: __props.type
      }, _attrs))} data-v-3cda31fe>`);
      if (_ctx.$slots.icon) {
        _push(`<span class="button__icon" data-v-3cda31fe>`);
        ssrRenderSlot(_ctx.$slots, "icon", {}, null, _push, _parent);
        _push(`</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="button__text" data-v-3cda31fe>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</span></button>`);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_setup$s = _sfc_main$s.setup;
_sfc_main$s.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/shared/ui/button/Button.vue");
  return _sfc_setup$s ? _sfc_setup$s(props, ctx) : void 0;
};
const Button = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["__scopeId", "data-v-3cda31fe"]]);
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  __name: "Input",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    type: { default: "text" },
    label: {},
    placeholder: {},
    error: {},
    hint: {},
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false }
  },
  emits: ["update:modelValue", "blur", "focus"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const inputId = ref(`input-${Math.random().toString(36).substr(2, 9)}`);
    const inputValue = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value)
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["input", { "input--error": __props.error, "input--disabled": __props.disabled }]
      }, _attrs))} data-v-212d05f6>`);
      if (__props.label) {
        _push(`<label${ssrRenderAttr("for", inputId.value)} class="input__label" data-v-212d05f6>${ssrInterpolate(__props.label)} `);
        if (__props.required) {
          _push(`<span class="input__required" data-v-212d05f6>*</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="input__wrapper" data-v-212d05f6>`);
      if (_ctx.$slots.prefix) {
        _push(`<span class="input__prefix" data-v-212d05f6>`);
        ssrRenderSlot(_ctx.$slots, "prefix", {}, null, _push, _parent);
        _push(`</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input${ssrRenderDynamicModel(__props.type, inputValue.value, null)}${ssrRenderAttr("id", inputId.value)}${ssrRenderAttr("type", __props.type)}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""}${ssrIncludeBooleanAttr(__props.readonly) ? " readonly" : ""} class="input__field" data-v-212d05f6>`);
      if (_ctx.$slots.suffix) {
        _push(`<span class="input__suffix" data-v-212d05f6>`);
        ssrRenderSlot(_ctx.$slots, "suffix", {}, null, _push, _parent);
        _push(`</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.error) {
        _push(`<span class="input__error" data-v-212d05f6>${ssrInterpolate(__props.error)}</span>`);
      } else if (__props.hint) {
        _push(`<span class="input__hint" data-v-212d05f6>${ssrInterpolate(__props.hint)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$r = _sfc_main$r.setup;
_sfc_main$r.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/shared/ui/input/Input.vue");
  return _sfc_setup$r ? _sfc_setup$r(props, ctx) : void 0;
};
const Input = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__scopeId", "data-v-212d05f6"]]);
const _sfc_main$q = /* @__PURE__ */ defineComponent({
  __name: "Icon",
  __ssrInlineRender: true,
  props: {
    name: {},
    size: { default: 24 },
    className: { default: "" }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<svg${ssrRenderAttrs(mergeProps({
        class: ["icon", __props.className],
        width: __props.size,
        height: __props.size,
        "aria-hidden": "true",
        focusable: "false"
      }, _attrs))} data-v-d5a96073><use${ssrRenderAttr("href", `#${__props.name}`)} data-v-d5a96073></use></svg>`);
    };
  }
});
const _sfc_setup$q = _sfc_main$q.setup;
_sfc_main$q.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/shared/ui/icon/Icon.vue");
  return _sfc_setup$q ? _sfc_setup$q(props, ctx) : void 0;
};
const Icon = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-d5a96073"]]);
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "Select",
  __ssrInlineRender: true,
  props: {
    modelValue: {},
    options: {},
    label: {},
    placeholder: {},
    error: {},
    hint: {},
    disabled: { type: Boolean, default: false },
    required: { type: Boolean, default: false }
  },
  emits: ["update:modelValue", "change"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const selectRef = ref(null);
    const dropdownRef = ref(null);
    const isOpen = ref(false);
    const isDropUp = ref(false);
    const selectedOption = computed(() => {
      return props.options.find((option) => option.value === props.modelValue);
    });
    function closeDropdown() {
      isOpen.value = false;
    }
    function handleClickOutside(event) {
      if (!selectRef.value) return;
      if (!selectRef.value.contains(event.target)) {
        closeDropdown();
      }
    }
    function updateDirection() {
      var _a;
      if (!selectRef.value) return;
      const rect = selectRef.value.getBoundingClientRect();
      const dropdownHeight = ((_a = dropdownRef.value) == null ? void 0 : _a.offsetHeight) ?? 0;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      if (dropdownHeight === 0) {
        isDropUp.value = spaceBelow < 200 && spaceAbove > spaceBelow;
        return;
      }
      isDropUp.value = rect.bottom + dropdownHeight > window.innerHeight && spaceAbove > spaceBelow;
    }
    watch(isOpen, async (open) => {
      if (open) {
        document.addEventListener("click", handleClickOutside);
        await nextTick();
        updateDirection();
      } else {
        document.removeEventListener("click", handleClickOutside);
      }
    });
    onMounted(() => {
      window.addEventListener("resize", updateDirection);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("resize", updateDirection);
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "selectRef",
        ref: selectRef,
        class: [
          "select",
          { "select_error": __props.error, "select_disabled": __props.disabled, "select_open": isOpen.value, "select_drop-up": isDropUp.value }
        ]
      }, _attrs))} data-v-aaabcf99>`);
      if (__props.label) {
        _push(`<label class="select__label" data-v-aaabcf99>${ssrInterpolate(__props.label)} `);
        if (__props.required) {
          _push(`<span class="select__required" data-v-aaabcf99>*</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="select__wrapper" data-v-aaabcf99><button${ssrIncludeBooleanAttr(__props.disabled) ? " disabled" : ""} type="button" class="select__control" data-v-aaabcf99><span class="${ssrRenderClass(["select__value", { "select__value_placeholder": !selectedOption.value }])}" data-v-aaabcf99>${ssrInterpolate(((_a = selectedOption.value) == null ? void 0 : _a.label) ?? __props.placeholder ?? "Выберите значение")}</span>`);
      _push(ssrRenderComponent(Icon, {
        size: 14,
        class: ["select__chevron", { "select__chevron_open": isOpen.value, "select__chevron_drop-up": isDropUp.value }],
        name: "icon-chevron-down"
      }, null, _parent));
      _push(`</button>`);
      if (isOpen.value) {
        _push(`<div class="select__dropdown" data-v-aaabcf99><!--[-->`);
        ssrRenderList(__props.options, (option) => {
          _push(`<button class="${ssrRenderClass(["select__option", { "select__option_active": option.value === __props.modelValue }])}" type="button" data-v-aaabcf99>${ssrInterpolate(option.label)}</button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (__props.error) {
        _push(`<span class="select__error" data-v-aaabcf99>${ssrInterpolate(__props.error)}</span>`);
      } else if (__props.hint) {
        _push(`<span class="select__hint" data-v-aaabcf99>${ssrInterpolate(__props.hint)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$p = _sfc_main$p.setup;
_sfc_main$p.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/shared/ui/select/Select.vue");
  return _sfc_setup$p ? _sfc_setup$p(props, ctx) : void 0;
};
const Select = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["__scopeId", "data-v-aaabcf99"]]);
const _sfc_main$o = /* @__PURE__ */ defineComponent({
  __name: "Card",
  __ssrInlineRender: true,
  props: {
    variant: { default: "default" },
    hoverable: { type: Boolean, default: false }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: ["card", `card--${__props.variant}`, { "card--hoverable": __props.hoverable }]
      }, _attrs))} data-v-6202f32f>`);
      if (_ctx.$slots.header) {
        _push(`<div class="card__header" data-v-6202f32f>`);
        ssrRenderSlot(_ctx.$slots, "header", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="card__body" data-v-6202f32f>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div>`);
      if (_ctx.$slots.footer) {
        _push(`<div class="card__footer" data-v-6202f32f>`);
        ssrRenderSlot(_ctx.$slots, "footer", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$o = _sfc_main$o.setup;
_sfc_main$o.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/shared/ui/card/Card.vue");
  return _sfc_setup$o ? _sfc_setup$o(props, ctx) : void 0;
};
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "NavLink",
  __ssrInlineRender: true,
  props: {
    to: {},
    className: { default: "" }
  },
  emits: ["click"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { locale } = useI18n();
    const localizedPath = computed(() => {
      if (props.to.startsWith("/uk/") || props.to.startsWith("/en/")) {
        return props.to;
      }
      const cleanPath = props.to.startsWith("/") ? props.to : `/${props.to}`;
      return `/${locale.value}${cleanPath}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(ssrRenderComponent(_component_router_link, mergeProps({
        to: localizedPath.value,
        class: ["nav-link", __props.className],
        onClick: ($event) => emit("click")
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent2, _scopeId);
          } else {
            return [
              renderSlot(_ctx.$slots, "default", {}, void 0, true)
            ];
          }
        }),
        _: 3
      }, _parent));
    };
  }
});
const _sfc_setup$n = _sfc_main$n.setup;
_sfc_main$n.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/shared/ui/nav-link/NavLink.vue");
  return _sfc_setup$n ? _sfc_setup$n(props, ctx) : void 0;
};
const NavLink = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-b4518b55"]]);
const _sfc_main$m = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    class: "svg-sprite",
    "aria-hidden": "true",
    focusable: "false"
  }, _attrs))} data-v-5f3c9036><symbol id="icon-menu" viewBox="0 0 24 24" data-v-5f3c9036><path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" data-v-5f3c9036></path></symbol><symbol id="icon-close" viewBox="0 0 24 24" data-v-5f3c9036><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" data-v-5f3c9036></path></symbol><symbol id="icon-arrow-down" viewBox="0 0 16 16" data-v-5f3c9036><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" data-v-5f3c9036></path></symbol><symbol id="icon-chevron-down" viewBox="0 0 12 12" data-v-5f3c9036><path d="M2 4l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" data-v-5f3c9036></path></symbol><symbol id="icon-sun" viewBox="0 0 24 24" data-v-5f3c9036><path d="M12 4V2M12 22V20M4.93 4.93L3.51 3.51M20.49 20.49L19.07 19.07M4 12H2M22 12H20M4.93 19.07L3.51 20.49M20.49 3.51L19.07 4.93" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-5f3c9036></path><circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5" data-v-5f3c9036></circle></symbol><symbol id="icon-moon" viewBox="0 0 24 24" data-v-5f3c9036><path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-v-5f3c9036></path></symbol><symbol id="icon-logo" viewBox="0 0 40 40" data-v-5f3c9036><defs data-v-5f3c9036><linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%" data-v-5f3c9036><stop offset="0%" style="${ssrRenderStyle({ "stop-color": "#667eea", "stop-opacity": "1" })}" data-v-5f3c9036></stop><stop offset="50%" style="${ssrRenderStyle({ "stop-color": "#764ba2", "stop-opacity": "1" })}" data-v-5f3c9036></stop><stop offset="100%" style="${ssrRenderStyle({ "stop-color": "#f093fb", "stop-opacity": "1" })}" data-v-5f3c9036></stop></linearGradient></defs><rect x="4" y="4" width="32" height="32" rx="8" fill="url(#logo-gradient)" data-v-5f3c9036></rect><path d="M12 16 L20 12 L28 16 L28 24 L20 28 L12 24 Z" fill="white" fill-opacity="0.9" data-v-5f3c9036></path><circle cx="20" cy="20" r="4" fill="url(#logo-gradient)" data-v-5f3c9036></circle></symbol><symbol id="icon-user" viewBox="0 0 20 20" data-v-5f3c9036><path d="M10 2a4 4 0 100 8 4 4 0 000-8zM4 14a6 6 0 0112 0v2H4v-2z" fill="currentColor" data-v-5f3c9036></path></symbol><symbol id="icon-logout" viewBox="0 0 20 20" data-v-5f3c9036><path d="M3 3a2 2 0 012-2h6a2 2 0 012 2v4h2V3a4 4 0 00-4-4H5a4 4 0 00-4 4v14a4 4 0 004 4h6a4 4 0 004-4v-4h-2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V3zm11.293 4.707L17.586 11H7v2h10.586l-3.293 3.293 1.414 1.414L21.414 12l-5.707-5.707-1.414 1.414z" fill="currentColor" data-v-5f3c9036></path></symbol><symbol id="icon-search" viewBox="0 0 20 20" data-v-5f3c9036><path d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" fill="currentColor" data-v-5f3c9036></path></symbol><symbol id="icon-crown" viewBox="0 0 24 24" data-v-5f3c9036><path d="M12 2L15 9L22 8L19 15H5L2 8L9 9L12 2Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" data-v-5f3c9036></path><path d="M5 15L5 19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" data-v-5f3c9036></path><circle cx="12" cy="6" r="1.5" fill="currentColor" data-v-5f3c9036></circle><circle cx="7" cy="8.5" r="1.5" fill="currentColor" data-v-5f3c9036></circle><circle cx="17" cy="8.5" r="1.5" fill="currentColor" data-v-5f3c9036></circle></symbol></svg>`);
}
const _sfc_setup$m = _sfc_main$m.setup;
_sfc_main$m.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/shared/ui/sprite/Sprite.vue");
  return _sfc_setup$m ? _sfc_setup$m(props, ctx) : void 0;
};
const Sprite = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-5f3c9036"]]);
const STORAGE_KEY$1 = "style-engine-theme";
const theme = ref("dark");
const isReady = ref(false);
let mediaQuery = null;
let mediaListener = null;
function applyTheme(next, persist = true) {
  if (typeof document === "undefined") return;
  theme.value = next;
  document.documentElement.setAttribute("data-theme", next);
  if (persist && typeof localStorage !== "undefined") {
    localStorage.setItem(STORAGE_KEY$1, next);
  }
}
function detectInitialTheme() {
  if (typeof window === "undefined") {
    return "dark";
  }
  const saved = localStorage.getItem(STORAGE_KEY$1);
  if (saved === "light" || saved === "dark") {
    return saved;
  }
  mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  return mediaQuery.matches ? "dark" : "light";
}
function setupSystemListener() {
  if (mediaListener) return;
  if (typeof window === "undefined") return;
  if (!mediaQuery) {
    mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  }
  mediaListener = (event) => {
    const saved = localStorage.getItem(STORAGE_KEY$1);
    if (saved !== "light" && saved !== "dark") {
      applyTheme(event.matches ? "dark" : "light", false);
    }
  };
  mediaQuery.addEventListener("change", mediaListener);
}
function useTheme() {
  const isDark = computed(() => theme.value === "dark");
  const toggleTheme = () => {
    const next = theme.value === "dark" ? "light" : "dark";
    applyTheme(next);
  };
  const setTheme = (next) => {
    applyTheme(next);
  };
  if (typeof window !== "undefined" && !isReady.value) {
    applyTheme(detectInitialTheme(), true);
  }
  onMounted(() => {
    if (!isReady.value) {
      setupSystemListener();
      isReady.value = true;
    }
  });
  onBeforeUnmount(() => {
    if (mediaQuery && mediaListener) {
      mediaQuery.removeEventListener("change", mediaListener);
    }
  });
  return {
    theme,
    isDark,
    isReady,
    toggleTheme,
    setTheme
  };
}
const CSS_VAR = "--app-vh";
const listeners = [];
let initialized = false;
let teardown = null;
const isIOS = () => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
};
function setViewportVar() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const viewportHeight = window.innerHeight;
  const vh = viewportHeight * 0.01;
  document.documentElement.style.setProperty(CSS_VAR, `${vh}px`);
}
function setup() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  setViewportVar();
  const handler = () => {
    setViewportVar();
    listeners.forEach((fn) => fn());
  };
  if (isIOS()) {
    window.addEventListener("orientationchange", handler);
    teardown = () => {
      window.removeEventListener("orientationchange", handler);
    };
  } else {
    window.addEventListener("resize", handler);
    window.addEventListener("orientationchange", handler);
    teardown = () => {
      window.removeEventListener("resize", handler);
      window.removeEventListener("orientationchange", handler);
    };
  }
}
function useViewportHeight(onUpdate) {
  setup();
  onMounted(() => {
  });
  onBeforeUnmount(() => {
    if (listeners.length === 0 && teardown) {
      teardown();
      teardown = null;
      initialized = false;
    }
  });
}
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "ThemeSwitcher",
  __ssrInlineRender: true,
  setup(__props) {
    const { isDark } = useTheme();
    const { t } = useI18n();
    const lightLabel = computed(() => t("NAV.THEME_LIGHT"));
    const darkLabel = computed(() => t("NAV.THEME_DARK"));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<button${ssrRenderAttrs(mergeProps({
        class: "theme-switcher",
        type: "button"
      }, _attrs))} data-v-798bba19><span class="theme-switcher__icon" data-v-798bba19>`);
      if (unref(isDark)) {
        _push(ssrRenderComponent(Icon, {
          name: "icon-moon",
          size: 16
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(Icon, {
          name: "icon-sun",
          size: 16
        }, null, _parent));
      }
      _push(`</span><span class="theme-switcher__label" data-v-798bba19>${ssrInterpolate(unref(isDark) ? lightLabel.value : darkLabel.value)}</span><span class="${ssrRenderClass([{ "theme-switcher__thumb_dark": unref(isDark) }, "theme-switcher__thumb"])}" data-v-798bba19></span></button>`);
    };
  }
});
const _sfc_setup$l = _sfc_main$l.setup;
_sfc_main$l.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/shared/ui/theme-switcher/ThemeSwitcher.vue");
  return _sfc_setup$l ? _sfc_setup$l(props, ctx) : void 0;
};
const ThemeSwitcher = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-798bba19"]]);
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "Modal",
  __ssrInlineRender: true,
  props: {
    visible: { type: Boolean },
    title: {},
    subtitle: {},
    size: { default: "md" },
    closable: { type: Boolean, default: true },
    closeOnBackdrop: { type: Boolean, default: true },
    showActions: { type: Boolean, default: false },
    showConfirm: { type: Boolean, default: true },
    showCancel: { type: Boolean, default: true },
    confirmText: { default: "Confirm" },
    cancelText: { default: "Cancel" },
    confirmVariant: { default: "primary" },
    confirmDisabled: { type: Boolean, default: false },
    buttonSize: { default: "md" }
  },
  emits: ["confirm", "close", "update:visible"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const modalClass = computed(() => `modal__card_${props.size}`);
    ref(null);
    ref(null);
    function handleConfirm() {
      emit("confirm");
    }
    function handleClose() {
      emit("close");
      emit("update:visible", false);
    }
    watch(
      () => props.visible,
      async (isVisible) => {
        await nextTick();
        const target = document.body;
        if (isVisible) {
          disableBodyScroll(target, { reserveScrollBarGap: true });
        } else {
          clearAllBodyScrollLocks();
        }
      }
    );
    onBeforeUnmount(() => {
      clearAllBodyScrollLocks();
    });
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderTeleport(_push, (_push2) => {
        if (__props.visible) {
          _push2(`<div role="dialog" aria-modal="true" class="modal" data-v-700c01d5><div class="modal__backdrop" data-v-700c01d5></div><div class="${ssrRenderClass([modalClass.value, "modal__card"])}" data-v-700c01d5>`);
          if (__props.closable) {
            _push2(`<button type="button" aria-label="Close" class="modal__close" data-v-700c01d5> × </button>`);
          } else {
            _push2(`<!---->`);
          }
          if (_ctx.$slots.header || __props.title) {
            _push2(`<div class="modal__header" data-v-700c01d5>`);
            ssrRenderSlot(_ctx.$slots, "header", {}, () => {
              _push2(`<h2 class="modal__title" data-v-700c01d5>${ssrInterpolate(__props.title)}</h2>`);
              if (__props.subtitle) {
                _push2(`<p class="modal__subtitle" data-v-700c01d5>${ssrInterpolate(__props.subtitle)}</p>`);
              } else {
                _push2(`<!---->`);
              }
            }, _push2, _parent);
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="modal__body" data-v-700c01d5>`);
          ssrRenderSlot(_ctx.$slots, "default", {}, null, _push2, _parent);
          _push2(`</div>`);
          if (_ctx.$slots.footer || __props.showActions) {
            _push2(`<div class="modal__footer" data-v-700c01d5>`);
            ssrRenderSlot(_ctx.$slots, "footer", {}, () => {
              _push2(`<div class="modal__actions" data-v-700c01d5>`);
              if (__props.showCancel) {
                _push2(ssrRenderComponent(Button, {
                  size: __props.buttonSize,
                  variant: "ghost",
                  onClick: handleClose
                }, {
                  default: withCtx((_, _push3, _parent2, _scopeId) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(__props.cancelText)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(__props.cancelText), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent));
              } else {
                _push2(`<!---->`);
              }
              if (__props.showConfirm) {
                _push2(ssrRenderComponent(Button, {
                  variant: __props.confirmVariant,
                  size: __props.buttonSize,
                  disabled: __props.confirmDisabled,
                  onClick: handleConfirm
                }, {
                  default: withCtx((_, _push3, _parent2, _scopeId) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(__props.confirmText)}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(__props.confirmText), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            }, _push2, _parent);
            _push2(`</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`</div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/shared/ui/modal/Modal.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const Modal = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-700c01d5"]]);
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "Table",
  __ssrInlineRender: true,
  props: {
    columns: {},
    rows: { default: () => [] },
    rowKey: {},
    sortBy: { default: "" },
    sortOrder: { default: "asc" },
    stickyHeader: { type: Boolean, default: false },
    striped: { type: Boolean, default: false },
    hoverable: { type: Boolean, default: false },
    size: { default: "md" },
    emptyText: { default: "No data" }
  },
  emits: ["update:sortBy", "update:sortOrder", "sort-change", "row-click"],
  setup(__props, { emit: __emit }) {
    function getCellValue(row, column) {
      if (typeof column.accessor === "function") {
        return column.accessor(row);
      }
      return row[column.key];
    }
    function formatValue(value) {
      if (value === null || value === void 0) return "";
      if (typeof value === "string" || typeof value === "number") return value;
      return JSON.stringify(value);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: [
          "table",
          `table_size-${__props.size}`,
          { "table_sticky": __props.stickyHeader, "table_striped": __props.striped, "table_hoverable": __props.hoverable }
        ]
      }, _attrs))} data-v-e2cf8e8f><div class="table__wrapper" data-v-e2cf8e8f><table class="table__element" data-v-e2cf8e8f><thead class="table__thead" data-v-e2cf8e8f><tr data-v-e2cf8e8f><!--[-->`);
      ssrRenderList(__props.columns, (column) => {
        _push(`<th style="${ssrRenderStyle(column.width ? { width: column.width } : void 0)}" class="${ssrRenderClass([
          "table__th",
          `table__th_align-${column.align ?? "left"}`,
          { "table__th_sortable": column.sortable, "table__th_active": column.sortable && __props.sortBy === column.key },
          column.headerClass,
          column.hideOnMobile ? "table__th_hide-mobile" : ""
        ])}" data-v-e2cf8e8f><span class="table__th-content" data-v-e2cf8e8f>`);
        ssrRenderSlot(_ctx.$slots, `header-${column.key}`, { column }, () => {
          _push(`<span class="table__label" data-v-e2cf8e8f>${ssrInterpolate(column.label)}</span>`);
        }, _push, _parent);
        if (column.sortable) {
          _push(`<span class="${ssrRenderClass([
            "table__sort",
            {
              "table__sort_active": __props.sortBy === column.key,
              "table__sort_desc": __props.sortBy === column.key && __props.sortOrder === "desc"
            }
          ])}" data-v-e2cf8e8f>`);
          _push(ssrRenderComponent(Icon, {
            name: "icon-chevron-down",
            size: 12
          }, null, _parent));
          _push(`</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</span></th>`);
      });
      _push(`<!--]--></tr></thead><tbody class="table__tbody" data-v-e2cf8e8f><!--[-->`);
      ssrRenderList(__props.rows, (row, rowIndex) => {
        _push(`<tr class="table__tr" data-v-e2cf8e8f><!--[-->`);
        ssrRenderList(__props.columns, (column) => {
          _push(`<td class="${ssrRenderClass([
            "table__td",
            `table__td_align-${column.align ?? "left"}`,
            column.cellClass,
            column.hideOnMobile ? "table__td_hide-mobile" : ""
          ])}" data-v-e2cf8e8f>`);
          ssrRenderSlot(_ctx.$slots, `cell-${column.key}`, {
            row,
            value: getCellValue(row, column),
            column
          }, () => {
            _push(`${ssrInterpolate(formatValue(getCellValue(row, column)))}`);
          }, _push, _parent);
          _push(`</td>`);
        });
        _push(`<!--]--></tr>`);
      });
      _push(`<!--]--></tbody></table>`);
      if (!__props.rows.length) {
        _push(`<div class="table__empty" data-v-e2cf8e8f>`);
        ssrRenderSlot(_ctx.$slots, "empty", {}, () => {
          _push(`${ssrInterpolate(__props.emptyText)}`);
        }, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/shared/ui/table/Table.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const Table = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-e2cf8e8f"]]);
const isBrowser = () => typeof document !== "undefined";
function setCookie(name, value, options = {}) {
  if (!isBrowser()) return;
  const { days, path = "/", sameSite = "Lax", secure } = options;
  const encoded = encodeURIComponent(value);
  let cookie = `${name}=${encoded}; path=${path}; SameSite=${sameSite}`;
  if (days) {
    const expires = /* @__PURE__ */ new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1e3);
    cookie += `; expires=${expires.toUTCString()}`;
  }
  const shouldSecure = secure ?? (typeof window !== "undefined" && window.location.protocol === "https:");
  if (shouldSecure) {
    cookie += "; Secure";
  }
  document.cookie = cookie;
}
function getCookie(name) {
  if (!isBrowser()) return null;
  const cookies = document.cookie ? document.cookie.split("; ") : [];
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }
  return null;
}
function removeCookie(name, path = "/") {
  if (!isBrowser()) return;
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}
const STORAGE_KEY = "style-engine-cookie-accepted-at";
const SESSION_KEY = "style-engine-cookie-dismissed";
const THIRTY_DAYS = 30;
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "CookieConsent",
  __ssrInlineRender: true,
  setup(__props) {
    const visible = ref(false);
    const { t } = useI18n();
    const shouldShow = () => {
      if (typeof window === "undefined") return false;
      const sessionDismissed = getCookie(SESSION_KEY) === "true";
      if (sessionDismissed) return false;
      const acceptedAt = Number(getCookie(STORAGE_KEY) || 0);
      if (acceptedAt && Date.now() - acceptedAt < THIRTY_DAYS * 24 * 60 * 60 * 1e3) return false;
      return true;
    };
    function handleAccept() {
      if (typeof window !== "undefined") {
        setCookie(STORAGE_KEY, String(Date.now()), { days: THIRTY_DAYS, path: "/" });
        removeCookie(SESSION_KEY);
        console.log("Cookies accepted");
      }
      visible.value = false;
    }
    function handleDecline() {
      if (typeof window !== "undefined") {
        setCookie(SESSION_KEY, "true", { path: "/" });
      }
      visible.value = false;
    }
    onMounted(() => {
      visible.value = shouldShow();
    });
    return (_ctx, _push, _parent, _attrs) => {
      if (visible.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({
          class: "cookie-consent",
          role: "dialog",
          "aria-live": "polite"
        }, _attrs))} data-v-1a9977c5><div class="cookie-consent__content" data-v-1a9977c5><div class="cookie-consent__meta" data-v-1a9977c5><span class="cookie-consent__eyebrow" data-v-1a9977c5>${ssrInterpolate(unref(t)("COOKIE_MODAL.TAG"))}</span><h2 class="cookie-consent__title" data-v-1a9977c5>${ssrInterpolate(unref(t)("COOKIE_MODAL.TITLE"))}</h2><p class="cookie-consent__text" data-v-1a9977c5>${ssrInterpolate(unref(t)("COOKIE_MODAL.DESCRIPTION"))}</p><div class="cookie-consent__links" data-v-1a9977c5>`);
        _push(ssrRenderComponent(unref(NavLink), {
          to: "/privacy-policy",
          "class-name": "cookie-consent__link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("PRIVACY.NAV"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("PRIVACY.NAV")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(NavLink), {
          to: "/cookie-policy",
          "class-name": "cookie-consent__link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("COOKIE.NAV"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("COOKIE.NAV")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div><div class="cookie-consent__actions" data-v-1a9977c5>`);
        _push(ssrRenderComponent(unref(Button), {
          size: "md",
          variant: "secondary",
          class: "cookie-consent__btn",
          onClick: handleDecline
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("COOKIE_MODAL.DECLINE"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("COOKIE_MODAL.DECLINE")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(Button), {
          size: "md",
          variant: "primary",
          class: "cookie-consent__btn",
          onClick: handleAccept
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("COOKIE_MODAL.ACCEPT"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("COOKIE_MODAL.ACCEPT")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
});
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/common/cookie-consent/CookieConsent.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const CookieConsent = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-1a9977c5"]]);
const DEFAULT_ROBOTS = "index, follow";
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "App",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { t, locale } = useI18n();
    useTheme();
    useViewportHeight();
    useHead(() => {
      const titleKey = route.meta.titleKey;
      const descriptionKey = route.meta.descriptionKey;
      const title = titleKey ? t(titleKey) : route.meta.title;
      const description = descriptionKey ? t(descriptionKey) : route.meta.description;
      const robots = route.meta.robots || DEFAULT_ROBOTS;
      const url = typeof window !== "undefined" ? `${window.location.origin}${route.fullPath}` : "";
      const meta = [
        description && { name: "description", content: description },
        { name: "robots", content: robots },
        title && { property: "og:title", content: title },
        description && { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        url && { property: "og:url", content: url },
        locale.value && { property: "og:locale", content: locale.value }
      ].filter(Boolean);
      const link = url ? [{ rel: "canonical", href: url }] : [];
      return {
        title,
        meta,
        link
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterView = resolveComponent("RouterView");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "app" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_RouterView, null, null, _parent));
      _push(ssrRenderComponent(CookieConsent, null, null, _parent));
      _push(ssrRenderComponent(unref(Sprite), null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/app/App.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const AUTH_TOKEN_KEY = "style-engine-token";
class ApiClient {
  constructor(config) {
    __publicField(this, "instance");
    __publicField(this, "refreshPromise", null);
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 3e4,
      headers: {
        "Content-Type": "application/json",
        ...config.headers
      }
    });
    const stored = getCookie(AUTH_TOKEN_KEY);
    if (stored) {
      this.setAuthToken(stored);
    }
    this.instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        var _a, _b, _c, _d;
        const status = (_a = error.response) == null ? void 0 : _a.status;
        const originalRequest = error.config;
        if (status === 401 && originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshed = await this.tryRefreshToken();
          if (refreshed) {
            const headers = originalRequest.headers || {};
            headers.Authorization = `Bearer ${refreshed}`;
            originalRequest.headers = headers;
            return this.instance(originalRequest);
          }
        }
        const apiError = {
          message: ((_c = (_b = error.response) == null ? void 0 : _b.data) == null ? void 0 : _c.message) || error.message,
          status,
          data: (_d = error.response) == null ? void 0 : _d.data
        };
        return Promise.reject(apiError);
      }
    );
  }
  setAuthToken(token) {
    if (token) {
      this.instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setCookie(AUTH_TOKEN_KEY, token, { days: 1, path: "/" });
    } else {
      delete this.instance.defaults.headers.common["Authorization"];
      removeCookie(AUTH_TOKEN_KEY);
    }
  }
  removeAuthToken() {
    this.setAuthToken(null);
  }
  async tryRefreshToken() {
    if (this.refreshPromise) return this.refreshPromise;
    this.refreshPromise = this.instance.post("/auth/refresh", void 0, { withCredentials: true }).then((res) => {
      const token = res.data.token;
      if (token) {
        this.setAuthToken(token);
        return token;
      }
      return null;
    }).catch(() => null).finally(() => {
      this.refreshPromise = null;
    });
    return this.refreshPromise;
  }
  async get(url, config) {
    return this.request("GET", url, void 0, config);
  }
  async post(url, data, config) {
    return this.request("POST", url, data, config);
  }
  async put(url, data, config) {
    return this.request("PUT", url, data, config);
  }
  async patch(url, data, config) {
    return this.request("PATCH", url, data, config);
  }
  async delete(url, config) {
    return this.request("DELETE", url, void 0, config);
  }
  async request(method, url, data, config = {}) {
    const response = await this.instance.request({
      method,
      url,
      data,
      ...config
    });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    };
  }
}
const apiClient = new ApiClient({
  baseURL: `${"http://localhost:4000"}/api`
});
const useApi = () => apiClient;
const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const isLoading = ref(false);
  const error = ref(null);
  const token = ref(null);
  const hydrated = ref(false);
  const isAuthenticated = computed(() => user.value !== null);
  const userPlan = computed(() => {
    var _a, _b;
    return ((_a = user.value) == null ? void 0 : _a.isPayment) ? "pro" : ((_b = user.value) == null ? void 0 : _b.plan) || "free";
  });
  const isAdmin = computed(() => {
    var _a;
    return Boolean((_a = user.value) == null ? void 0 : _a.isAdmin);
  });
  const isPaid = computed(() => {
    var _a, _b, _c;
    const tier = (_a = user.value) == null ? void 0 : _a.subscriptionTier;
    const plan = (_b = user.value) == null ? void 0 : _b.plan;
    return tier === "pro" || tier === "premium" || plan === "pro" || plan === "premium" || Boolean((_c = user.value) == null ? void 0 : _c.isPayment);
  });
  function setToken(next) {
    token.value = next;
    if (next) {
      setCookie(AUTH_TOKEN_KEY, next, { days: 1, path: "/" });
      apiClient.setAuthToken(next);
    } else {
      removeCookie(AUTH_TOKEN_KEY);
      apiClient.removeAuthToken();
    }
  }
  function setUser(newUser) {
    user.value = newUser;
  }
  function setLoading(loading) {
    isLoading.value = loading;
  }
  function setError(errorMessage) {
    error.value = errorMessage;
  }
  async function fetchProfile() {
    const response = await apiClient.get("/profile");
    setUser(response.data.user);
    return response.data.user;
  }
  async function ensureSession() {
    if (hydrated.value) return;
    hydrated.value = true;
    const stored = getCookie(AUTH_TOKEN_KEY);
    if (!stored) return;
    setToken(stored);
    try {
      await fetchProfile();
    } catch {
      setToken(null);
      setUser(null);
    }
  }
  async function login(email, password) {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/auth/login", {
        email,
        password
      });
      setToken(response.data.token);
      setUser(response.data.user);
      try {
        const freshUser = await fetchProfile();
        setUser(freshUser);
      } catch (err) {
        console.error("Failed to refresh profile after login", err);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }
  async function register(email, password, name) {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post("/auth/register", {
        email,
        password,
        name
      });
      setToken(response.data.token);
      setUser(response.data.user);
      try {
        const freshUser = await fetchProfile();
        setUser(freshUser);
      } catch (err) {
        console.error("Failed to refresh profile after register", err);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }
  async function logout() {
    try {
      await apiClient.post("/auth/logout");
    } catch {
    } finally {
      setUser(null);
      setError(null);
      setToken(null);
    }
  }
  return {
    user,
    isLoading,
    error,
    token,
    hydrated,
    isAuthenticated,
    userPlan,
    isAdmin,
    isPaid,
    setUser,
    setError,
    setToken,
    ensureSession,
    fetchProfile,
    login,
    register,
    logout
  };
});
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "GradientControls",
  __ssrInlineRender: true,
  props: {
    type: {},
    angle: {},
    colors: {}
  },
  emits: ["update:type", "update:angle", "add-color", "remove-color", "update-color", "update-color-position"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const { t } = useI18n();
    const typeOptions = computed(() => [
      { label: t("GRADIENT.TYPE_LINEAR"), value: "linear" },
      { label: t("GRADIENT.TYPE_RADIAL"), value: "radial" },
      { label: t("GRADIENT.TYPE_CONIC"), value: "conic" }
    ]);
    function handleTypeChange(value) {
      emit("update:type", value);
    }
    function handleColorChange(id, color) {
      const normalized = normalizeHex(color);
      if (normalized) {
        emit("update-color", id, normalized);
      }
    }
    function normalizeHex(input) {
      let value = input.trim();
      if (!value) return null;
      if (!value.startsWith("#")) {
        value = `#${value}`;
      }
      const isValid = /^#([0-9a-fA-F]{6})$/.test(value);
      return isValid ? value.toLowerCase() : null;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "gradient-controls" }, _attrs))} data-v-e71d088f><div class="gradient-controls__group" data-v-e71d088f><label class="gradient-controls__label" data-v-e71d088f>${ssrInterpolate(unref(t)("GRADIENT.TYPE"))}</label>`);
      _push(ssrRenderComponent(unref(Select), {
        "model-value": __props.type,
        options: typeOptions.value,
        onChange: handleTypeChange
      }, null, _parent));
      _push(`</div>`);
      if (__props.type === "linear" || __props.type === "conic") {
        _push(`<div class="gradient-controls__group" data-v-e71d088f><label class="gradient-controls__label" data-v-e71d088f>${ssrInterpolate(unref(t)("GRADIENT.ANGLE"))}: ${ssrInterpolate(__props.angle)}° </label><input${ssrRenderAttr("value", __props.angle)} type="range" min="0" max="360" class="gradient-controls__range" data-v-e71d088f></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="gradient-controls__group" data-v-e71d088f><label class="gradient-controls__label" data-v-e71d088f>${ssrInterpolate(unref(t)("GRADIENT.COLORS"))}</label><div class="gradient-controls__colors" data-v-e71d088f><!--[-->`);
      ssrRenderList(__props.colors, (color) => {
        _push(`<div class="gradient-controls__color-item" data-v-e71d088f><input${ssrRenderAttr("value", color.color)} type="color" class="gradient-controls__color-picker" data-v-e71d088f>`);
        _push(ssrRenderComponent(unref(Input), {
          "model-value": color.color,
          type: "text",
          placeholder: "#000000",
          pattern: "#?[0-9a-fA-F]{6}",
          class: "gradient-controls__color-input",
          "onUpdate:modelValue": (value) => handleColorChange(color.id, value)
        }, null, _parent));
        _push(`<div class="gradient-controls__position-group" data-v-e71d088f><input${ssrRenderAttr("value", color.position)} type="number" min="0" max="100" class="gradient-controls__position-input" data-v-e71d088f><span class="gradient-controls__position-label" data-v-e71d088f>%</span></div>`);
        _push(ssrRenderComponent(unref(Button), {
          disabled: __props.colors.length <= 2,
          size: "sm",
          variant: "danger",
          class: "gradient-controls__remove",
          onClick: ($event) => emit("remove-color", color.id)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ✕ `);
            } else {
              return [
                createTextVNode(" ✕ ")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div>`);
      });
      _push(`<!--]--></div>`);
      _push(ssrRenderComponent(unref(Button), {
        size: "sm",
        variant: "outline",
        onClick: ($event) => emit("add-color")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` + ${ssrInterpolate(unref(t)("GRADIENT.ADD_COLOR"))}`);
          } else {
            return [
              createTextVNode(" + " + toDisplayString(unref(t)("GRADIENT.ADD_COLOR")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/features/gradient/gradient-generator/ui/gradient-controls/GradientControls.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const GradientControls = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-e71d088f"]]);
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "GradientPreview",
  __ssrInlineRender: true,
  props: {
    gradientStyle: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "gradient-preview" }, _attrs))} data-v-8956a45f><div class="gradient-preview__box" style="${ssrRenderStyle(__props.gradientStyle)}" data-v-8956a45f></div></div>`);
    };
  }
});
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/features/gradient/gradient-generator/ui/gradient-preview/GradientPreview.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const GradientPreview = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-8956a45f"]]);
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
function randomHexColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand("copy");
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error("Failed to copy text: ", err);
    return false;
  }
}
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "GradientCodeExport",
  __ssrInlineRender: true,
  props: {
    getCode: {},
    filename: {},
    showSaveButton: { type: Boolean },
    allowExport: { type: Boolean, default: true }
  },
  emits: ["save", "blocked-export"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { t } = useI18n();
    const toast = useToast();
    const selectedFormat = ref("css");
    const copied = ref(false);
    const extensionMap = {
      css: "css",
      scss: "scss",
      sass: "sass",
      stylus: "styl",
      inline: "txt",
      tailwind: "css"
    };
    const formatOptions = [
      { label: "CSS", value: "css" },
      { label: "SCSS", value: "scss" },
      { label: "Sass", value: "sass" },
      { label: "Stylus", value: "stylus" },
      { label: "Inline", value: "inline" }
    ];
    const code = computed(() => {
      return props.getCode(selectedFormat.value);
    });
    async function handleCopy() {
      const success = await copyToClipboard(code.value);
      if (success) {
        copied.value = true;
        toast.success(t("COMMON.COPIED_TO_CLIPBOARD"));
        setTimeout(() => {
          copied.value = false;
        }, 2e3);
      } else {
        toast.error(t("COMMON.COPY_FAILED"));
      }
    }
    function downloadCode() {
      const ext = extensionMap[selectedFormat.value] ?? "txt";
      const filename = `${props.filename ?? "gradient"}.${ext}`;
      const blob = new Blob([code.value], { type: "text/plain" });
      if (!props.allowExport) {
        emit("blocked-export");
        return;
      }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "code-export" }, _attrs))} data-v-97693079><div class="code-export__panel" data-v-97693079><div class="code-export__toolbar" data-v-97693079><h3 class="code-export__title" data-v-97693079>${ssrInterpolate(unref(t)("GRADIENT.EXPORT_TITLE"))}</h3><div class="code-export__actions" data-v-97693079>`);
      _push(ssrRenderComponent(unref(Select), {
        modelValue: selectedFormat.value,
        "onUpdate:modelValue": ($event) => selectedFormat.value = $event,
        options: formatOptions
      }, null, _parent));
      _push(ssrRenderComponent(unref(Button), {
        size: "sm",
        variant: "outline",
        class: "code-export__copy-button",
        onClick: handleCopy
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(copied.value ? `✓ ${unref(t)("GRADIENT.COPIED")}` : unref(t)("GRADIENT.COPY"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(copied.value ? `✓ ${unref(t)("GRADIENT.COPIED")}` : unref(t)("GRADIENT.COPY")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Button), {
        variant: "outline",
        size: "sm",
        class: "code-export__download-button",
        onClick: downloadCode
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("COMMON.DOWNLOAD"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("COMMON.DOWNLOAD")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (props.showSaveButton !== false) {
        _push(ssrRenderComponent(unref(Button), {
          size: "sm",
          variant: "primary",
          onClick: ($event) => emit("save")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("GRADIENT.SAVE"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("GRADIENT.SAVE")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="code-export__code" data-v-97693079><div class="code-export__window-controls" data-v-97693079><span data-v-97693079></span><span data-v-97693079></span><span data-v-97693079></span></div><pre class="code-export__content" data-v-97693079><code data-v-97693079>${ssrInterpolate(code.value)}</code></pre></div></div></div>`);
    };
  }
});
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/features/gradient/gradient-generator/ui/gradient-code-export/GradientCodeExport.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const GradientCodeExport = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-97693079"]]);
const placeholderColors = ["#667eea", "#f97316", "#a855f7", "#14b8a6", "#0ea5e9"];
function normalizeString(value) {
  return value ? String(value).trim() : "";
}
function buildCreatorProfile(item) {
  if (!item) return {};
  return {
    id: item.userId,
    name: normalizeString(item.ownerName) || normalizeString(item.ownerEmail) || void 0,
    email: normalizeString(item.ownerEmail) || void 0,
    avatarUrl: normalizeString(item.ownerAvatar) || void 0
  };
}
function getCreatorLabel(creator) {
  return normalizeString(creator == null ? void 0 : creator.name) || normalizeString(creator == null ? void 0 : creator.email) || "Creator";
}
function getCreatorInitials(creator) {
  const label = normalizeString(creator == null ? void 0 : creator.name) || normalizeString(creator == null ? void 0 : creator.email);
  if (!label) return "CR";
  return label.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
}
function getCreatorAvatarStyle(creator) {
  if (creator == null ? void 0 : creator.avatarUrl) {
    return {
      backgroundImage: `url(${creator.avatarUrl})`
    };
  }
  const seed = (((creator == null ? void 0 : creator.name) ?? (creator == null ? void 0 : creator.email) ?? "default").charCodeAt(0) || 0) % placeholderColors.length;
  return {
    backgroundColor: placeholderColors[seed]
  };
}
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "GradientPresets",
  __ssrInlineRender: true,
  props: {
    presets: {},
    savingId: {},
    isSaved: { type: Function }
  },
  emits: ["apply", "copy", "save"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { presets, savingId, isSaved } = toRefs(props);
    const { t } = useI18n();
    const isPresetSaved = (preset) => ((isSaved == null ? void 0 : isSaved.value) && isSaved.value(preset)) ?? false;
    function getStyle(preset) {
      return {
        background: buildGradient(preset.type, preset.angle, preset.colors)
      };
    }
    function buildGradient(type, angle, colors) {
      const colorStops = colors.map((c) => `${c.color} ${c.position}%`).join(", ");
      switch (type) {
        case "linear":
          return `linear-gradient(${angle}deg, ${colorStops})`;
        case "radial":
          return `radial-gradient(circle, ${colorStops})`;
        case "conic":
          return `conic-gradient(from ${angle}deg, ${colorStops})`;
        default:
          return `linear-gradient(90deg, ${colorStops})`;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "gradient-presets" }, _attrs))} data-v-6c0b5777><div class="gradient-presets__header" data-v-6c0b5777><div data-v-6c0b5777><p class="gradient-presets__tag" data-v-6c0b5777>${ssrInterpolate(unref(t)("GRADIENT.PRESETS_TAG"))}</p><h2 class="gradient-presets__title" data-v-6c0b5777>${ssrInterpolate(unref(t)("GRADIENT.PRESETS_TITLE"))}</h2><p class="gradient-presets__subtitle" data-v-6c0b5777>${ssrInterpolate(unref(t)("GRADIENT.PRESETS_SUBTITLE"))}</p></div></div><div class="gradient-presets__grid" data-v-6c0b5777><!--[-->`);
      ssrRenderList(unref(presets), (preset) => {
        _push(`<article class="gradient-presets__card" style="${ssrRenderStyle(getStyle(preset))}" data-v-6c0b5777><div class="gradient-presets__card-top" data-v-6c0b5777><h3 class="gradient-presets__card-title" data-v-6c0b5777>${ssrInterpolate(preset.name)}</h3><span class="gradient-presets__badge" data-v-6c0b5777>${ssrInterpolate(preset.type)}</span></div>`);
        if (preset.owner) {
          _push(`<div class="gradient-presets__author" data-v-6c0b5777><div class="gradient-presets__avatar" style="${ssrRenderStyle(unref(getCreatorAvatarStyle)(preset.owner))}" data-v-6c0b5777>`);
          if (!preset.owner.avatarUrl) {
            _push(`<span data-v-6c0b5777>${ssrInterpolate(unref(getCreatorInitials)(preset.owner))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div data-v-6c0b5777><span class="gradient-presets__author-name"${ssrRenderAttr("title", unref(getCreatorLabel)(preset.owner))} data-v-6c0b5777>${ssrInterpolate(unref(getCreatorLabel)(preset.owner))}</span>`);
          if (preset.owner.email) {
            _push(`<span class="gradient-presets__author-email" data-v-6c0b5777>${ssrInterpolate(preset.owner.email)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="gradient-presets__colors" data-v-6c0b5777><!--[-->`);
        ssrRenderList(preset.colors, (color) => {
          _push(`<span class="gradient-presets__swatch" style="${ssrRenderStyle({ background: color.color })}"${ssrRenderAttr("aria-label", color.color)} data-v-6c0b5777></span>`);
        });
        _push(`<!--]--></div><div class="gradient-presets__actions" data-v-6c0b5777>`);
        _push(ssrRenderComponent(unref(Button), {
          size: "sm",
          variant: "ghost",
          onClick: ($event) => emit("copy", preset)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("GRADIENT.COPY"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("GRADIENT.COPY")), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(ssrRenderComponent(unref(Button), {
          size: "sm",
          variant: "primary",
          onClick: ($event) => emit("save", preset),
          disabled: unref(savingId) === preset.id || isPresetSaved(preset)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("GRADIENT.SAVE"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("GRADIENT.SAVE")), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></article>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
});
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/features/gradient/gradient-generator/ui/gradient-presets/GradientPresets.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const GradientPresets = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-6c0b5777"]]);
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "ShadowControls",
  __ssrInlineRender: true,
  props: {
    layers: {}
  },
  emits: ["update-layer", "remove-layer", "add-layer"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "shadow-controls" }, _attrs))} data-v-11ea16c7><div class="shadow-controls__header" data-v-11ea16c7><div data-v-11ea16c7><p class="shadow-controls__tag" data-v-11ea16c7>${ssrInterpolate(unref(t)("SHADOW.LAYERS_TAG"))}</p><h2 class="shadow-controls__title" data-v-11ea16c7>${ssrInterpolate(unref(t)("SHADOW.LAYERS_TITLE"))}</h2><p class="shadow-controls__subtitle" data-v-11ea16c7>${ssrInterpolate(unref(t)("SHADOW.LAYERS_SUBTITLE"))}</p></div>`);
      _push(ssrRenderComponent(unref(Button), {
        size: "sm",
        variant: "primary",
        onClick: ($event) => emit("add-layer")
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` + ${ssrInterpolate(unref(t)("SHADOW.ADD_LAYER"))}`);
          } else {
            return [
              createTextVNode(" + " + toDisplayString(unref(t)("SHADOW.ADD_LAYER")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="shadow-controls__list" data-v-11ea16c7><!--[-->`);
      ssrRenderList(__props.layers, (layer) => {
        _push(`<article class="shadow-controls__item" data-v-11ea16c7><header class="shadow-controls__item-head" data-v-11ea16c7><div class="shadow-controls__pill" data-v-11ea16c7><span class="shadow-controls__index" data-v-11ea16c7>#${ssrInterpolate(layer.id)}</span><span class="shadow-controls__pill-text" data-v-11ea16c7>${ssrInterpolate(unref(t)("SHADOW.LAYER_CARD"))}</span></div><div class="shadow-controls__actions" data-v-11ea16c7>`);
        _push(ssrRenderComponent(unref(Button), {
          class: { "shadow-controls__toggle_active": layer.inset },
          size: "sm",
          variant: "ghost",
          onClick: ($event) => emit("update-layer", layer.id, { inset: !layer.inset })
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(layer.inset ? unref(t)("SHADOW.INSET_ON") : unref(t)("SHADOW.INSET_OFF"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(layer.inset ? unref(t)("SHADOW.INSET_ON") : unref(t)("SHADOW.INSET_OFF")), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(ssrRenderComponent(unref(Button), {
          disabled: __props.layers.length <= 1,
          size: "sm",
          variant: "danger",
          onClick: ($event) => emit("remove-layer", layer.id)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` ✕ `);
            } else {
              return [
                createTextVNode(" ✕ ")
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></header><div class="shadow-controls__grid" data-v-11ea16c7><label class="shadow-controls__field" data-v-11ea16c7><span class="shadow-controls__label" data-v-11ea16c7>${ssrInterpolate(unref(t)("SHADOW.OFFSET_X"))}</span><div class="shadow-controls__input-row" data-v-11ea16c7><input${ssrRenderAttr("value", layer.x)} type="range" min="-120" max="120" step="1" class="shadow-controls__range" data-v-11ea16c7>`);
        _push(ssrRenderComponent(unref(Input), {
          "model-value": layer.x,
          type: "number",
          class: "shadow-controls__number",
          "onUpdate:modelValue": (value) => emit("update-layer", layer.id, { x: Number(value) })
        }, null, _parent));
        _push(`</div></label><label class="shadow-controls__field" data-v-11ea16c7><span class="shadow-controls__label" data-v-11ea16c7>${ssrInterpolate(unref(t)("SHADOW.OFFSET_Y"))}</span><div class="shadow-controls__input-row" data-v-11ea16c7><input${ssrRenderAttr("value", layer.y)} type="range" min="-120" max="120" step="1" class="shadow-controls__range" data-v-11ea16c7>`);
        _push(ssrRenderComponent(unref(Input), {
          "model-value": layer.y,
          type: "number",
          class: "shadow-controls__number",
          "onUpdate:modelValue": (value) => emit("update-layer", layer.id, { y: Number(value) })
        }, null, _parent));
        _push(`</div></label><label class="shadow-controls__field" data-v-11ea16c7><span class="shadow-controls__label" data-v-11ea16c7>${ssrInterpolate(unref(t)("SHADOW.SPREAD"))}</span><div class="shadow-controls__input-row" data-v-11ea16c7><input${ssrRenderAttr("value", layer.spread)} type="range" min="-40" max="80" step="1" class="shadow-controls__range" data-v-11ea16c7>`);
        _push(ssrRenderComponent(unref(Input), {
          "model-value": layer.spread,
          type: "number",
          class: "shadow-controls__number",
          "onUpdate:modelValue": (value) => emit("update-layer", layer.id, { spread: Number(value) })
        }, null, _parent));
        _push(`</div></label><label class="shadow-controls__field" data-v-11ea16c7><span class="shadow-controls__label" data-v-11ea16c7>${ssrInterpolate(unref(t)("SHADOW.OPACITY"))} (${ssrInterpolate(Math.round(layer.opacity * 100))}%)</span><div class="shadow-controls__input-row" data-v-11ea16c7><input${ssrRenderAttr("value", layer.opacity)} type="range" min="0" max="1" step="0.01" class="shadow-controls__range" data-v-11ea16c7>`);
        _push(ssrRenderComponent(unref(Input), {
          "model-value": layer.opacity,
          type: "number",
          step: "0.01",
          min: "0",
          max: "1",
          class: "shadow-controls__number",
          "onUpdate:modelValue": (value) => emit("update-layer", layer.id, { opacity: Number(value) })
        }, null, _parent));
        _push(`</div></label><label class="shadow-controls__field shadow-controls__field_full" data-v-11ea16c7><span class="shadow-controls__label" data-v-11ea16c7>${ssrInterpolate(unref(t)("SHADOW.COLOR"))}</span><div class="shadow-controls__color-row" data-v-11ea16c7><input${ssrRenderAttr("value", layer.color)} type="color" class="shadow-controls__color" data-v-11ea16c7>`);
        _push(ssrRenderComponent(unref(Input), {
          "model-value": layer.color,
          type: "text",
          placeholder: "#0b1220",
          class: "shadow-controls__hex",
          "onUpdate:modelValue": (value) => emit("update-layer", layer.id, { color: value })
        }, null, _parent));
        _push(`</div></label></div></article>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
});
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/features/shadow/shadow-generator/ui/shadow-controls/ShadowControls.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const ShadowControls = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-11ea16c7"]]);
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "ShadowPreview",
  __ssrInlineRender: true,
  props: {
    boxShadow: {},
    accent: {}
  },
  setup(__props) {
    const props = __props;
    const { t } = useI18n();
    const previewStyle = computed(() => {
      var _a, _b;
      return {
        "--shadow-value": props.boxShadow,
        "--accent-primary": ((_a = props.accent) == null ? void 0 : _a.primary) ?? "#22d3ee",
        "--accent-secondary": ((_b = props.accent) == null ? void 0 : _b.secondary) ?? "#a855f7"
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "shadow-preview",
        style: previewStyle.value
      }, _attrs))} data-v-3df4891d><div class="shadow-preview__scene" data-v-3df4891d><div class="shadow-preview__grid" data-v-3df4891d></div><div class="shadow-preview__orb shadow-preview__orb_primary" aria-hidden="true" data-v-3df4891d></div><div class="shadow-preview__orb shadow-preview__orb_secondary" aria-hidden="true" data-v-3df4891d></div><div class="shadow-preview__card" data-v-3df4891d><div class="shadow-preview__badge" data-v-3df4891d>${ssrInterpolate(unref(t)("SHADOW.LIVE_BADGE"))}</div><h3 class="shadow-preview__title" data-v-3df4891d>${ssrInterpolate(unref(t)("SHADOW.PREVIEW_TITLE"))}</h3><p class="shadow-preview__subtitle" data-v-3df4891d>${ssrInterpolate(unref(t)("SHADOW.PREVIEW_SUBTITLE"))}</p><div class="shadow-preview__cta" data-v-3df4891d><span class="shadow-preview__dot" data-v-3df4891d></span><span data-v-3df4891d>${ssrInterpolate(unref(t)("SHADOW.PREVIEW_HINT"))}</span></div></div></div></div>`);
    };
  }
});
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/features/shadow/shadow-generator/ui/shadow-preview/ShadowPreview.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const ShadowPreview = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-3df4891d"]]);
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "ShadowCodeExport",
  __ssrInlineRender: true,
  props: {
    getCode: {},
    filename: {},
    showSaveButton: { type: Boolean },
    allowExport: { type: Boolean, default: true }
  },
  emits: ["save", "blocked-export"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { t } = useI18n();
    const toast = useToast();
    const selectedFormat = ref("css");
    const copied = ref(false);
    const extensionMap = {
      css: "css",
      scss: "scss",
      sass: "sass",
      stylus: "styl",
      inline: "txt",
      tailwind: "css"
    };
    const formatOptions = [
      { label: "CSS", value: "css" },
      { label: "SCSS", value: "scss" },
      { label: "Sass", value: "sass" },
      { label: "Stylus", value: "stylus" },
      { label: "Inline", value: "inline" }
    ];
    const code = computed(() => props.getCode(selectedFormat.value));
    async function handleCopy() {
      const success = await copyToClipboard(code.value);
      if (success) {
        copied.value = true;
        toast.success(t("COMMON.COPIED_TO_CLIPBOARD"));
        setTimeout(() => {
          copied.value = false;
        }, 2e3);
      } else {
        toast.error(t("COMMON.COPY_FAILED"));
      }
    }
    function downloadCode() {
      const ext = extensionMap[selectedFormat.value] ?? "txt";
      const filename = `${props.filename ?? "shadow"}.${ext}`;
      const blob = new Blob([code.value], { type: "text/plain" });
      if (!props.allowExport) {
        emit("blocked-export");
        return;
      }
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "code-export" }, _attrs))} data-v-7b2c5485><div class="code-export__panel" data-v-7b2c5485><div class="code-export__toolbar" data-v-7b2c5485><h3 class="code-export__title" data-v-7b2c5485>${ssrInterpolate(unref(t)("SHADOW.EXPORT_TITLE"))}</h3><div class="code-export__actions" data-v-7b2c5485>`);
      _push(ssrRenderComponent(unref(Select), {
        modelValue: selectedFormat.value,
        "onUpdate:modelValue": ($event) => selectedFormat.value = $event,
        options: formatOptions
      }, null, _parent));
      _push(ssrRenderComponent(unref(Button), {
        variant: "outline",
        size: "sm",
        class: "code-export__copy-button",
        onClick: handleCopy
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(copied.value ? `✓ ${unref(t)("SHADOW.COPIED")}` : unref(t)("SHADOW.COPY"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(copied.value ? `✓ ${unref(t)("SHADOW.COPIED")}` : unref(t)("SHADOW.COPY")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Button), {
        variant: "outline",
        size: "sm",
        class: "code-export__download-button",
        onClick: downloadCode
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("COMMON.DOWNLOAD"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("COMMON.DOWNLOAD")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (props.showSaveButton !== false) {
        _push(ssrRenderComponent(unref(Button), {
          variant: "primary",
          size: "sm",
          onClick: ($event) => emit("save")
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("SHADOW.SAVE"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("SHADOW.SAVE")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="code-export__code" data-v-7b2c5485><div class="code-export__window-controls" data-v-7b2c5485><span data-v-7b2c5485></span><span data-v-7b2c5485></span><span data-v-7b2c5485></span></div><pre class="code-export__content" data-v-7b2c5485><code data-v-7b2c5485>${ssrInterpolate(code.value)}</code></pre></div></div></div>`);
    };
  }
});
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/features/shadow/shadow-generator/ui/shadow-code-export/ShadowCodeExport.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const ShadowCodeExport = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-7b2c5485"]]);
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "ShadowPresets",
  __ssrInlineRender: true,
  props: {
    presets: {},
    activeId: {},
    savingId: {},
    isSaved: { type: Function }
  },
  emits: ["apply", "copy", "save"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const { presets, savingId, isSaved } = toRefs(props);
    const { t } = useI18n();
    const isPresetSaved = (preset) => ((isSaved == null ? void 0 : isSaved.value) && isSaved.value(preset)) ?? false;
    function buildShadow(layers) {
      return layers.map((layer) => {
        const rgb = hexToRgb(layer.color);
        const color = rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Number(layer.opacity).toFixed(2)})` : layer.color;
        return `${layer.inset ? "inset " : ""}${layer.x}px ${layer.y}px 0 ${layer.spread}px ${color}`;
      }).join(", ");
    }
    function getStyle(preset) {
      const shadow = buildShadow(preset.layers);
      return {
        boxShadow: shadow,
        "--shadow-value": shadow
      };
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "shadow-presets" }, _attrs))} data-v-08b467a1><div class="shadow-presets__header" data-v-08b467a1><div data-v-08b467a1><p class="shadow-presets__tag" data-v-08b467a1>${ssrInterpolate(unref(t)("SHADOW.PRESETS_TAG"))}</p><h2 class="shadow-presets__title" data-v-08b467a1>${ssrInterpolate(unref(t)("SHADOW.PRESETS_TITLE"))}</h2><p class="shadow-presets__subtitle" data-v-08b467a1>${ssrInterpolate(unref(t)("SHADOW.PRESETS_SUBTITLE"))}</p></div></div><div class="shadow-presets__grid" data-v-08b467a1><!--[-->`);
      ssrRenderList(unref(presets), (preset) => {
        _push(`<article class="${ssrRenderClass([{ "shadow-presets__card_active": preset.id === __props.activeId }, "shadow-presets__card"])}" data-v-08b467a1><div class="shadow-presets__swatch" style="${ssrRenderStyle(getStyle(preset))}" data-v-08b467a1><div class="shadow-presets__inner" data-v-08b467a1><span class="shadow-presets__badge" data-v-08b467a1>${ssrInterpolate(unref(t)("SHADOW.PRESET_BADGE"))}</span></div></div><div class="shadow-presets__content" data-v-08b467a1><div data-v-08b467a1><h3 class="shadow-presets__card-title" data-v-08b467a1>${ssrInterpolate(preset.name)}</h3><p class="shadow-presets__description" data-v-08b467a1>${ssrInterpolate(preset.description)}</p></div>`);
        if (preset.owner) {
          _push(`<div class="shadow-presets__author" data-v-08b467a1><div class="shadow-presets__avatar" style="${ssrRenderStyle(unref(getCreatorAvatarStyle)(preset.owner))}" data-v-08b467a1>`);
          if (!preset.owner.avatarUrl) {
            _push(`<span data-v-08b467a1>${ssrInterpolate(unref(getCreatorInitials)(preset.owner))}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div data-v-08b467a1><span class="shadow-presets__author-name"${ssrRenderAttr("title", unref(getCreatorLabel)(preset.owner))} data-v-08b467a1>${ssrInterpolate(unref(getCreatorLabel)(preset.owner))}</span>`);
          if (preset.owner.email) {
            _push(`<span class="shadow-presets__author-email" data-v-08b467a1>${ssrInterpolate(preset.owner.email)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="shadow-presets__actions" data-v-08b467a1>`);
        _push(ssrRenderComponent(unref(Button), {
          size: "sm",
          variant: "ghost",
          onClick: ($event) => emit("copy", preset)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("SHADOW.COPY"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("SHADOW.COPY")), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(ssrRenderComponent(unref(Button), {
          size: "sm",
          variant: "primary",
          onClick: ($event) => emit("save", preset),
          disabled: unref(savingId) === preset.id || isPresetSaved(preset)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("SHADOW.SAVE"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("SHADOW.SAVE")), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div></article>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/features/shadow/shadow-generator/ui/shadow-presets/ShadowPresets.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const ShadowPresets = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-08b467a1"]]);
function setupRouterGuards(router) {
  router.beforeEach(async (to, _, next) => {
    var _a;
    const authStore = useAuthStore();
    if (!authStore.hydrated) {
      await authStore.ensureSession();
    }
    const pathParts = to.path.split("/").filter(Boolean);
    const localeIndex = pathParts.findIndex((part) => AVAILABLE_LOCALES.includes(part));
    const localeFromPath = localeIndex >= 0 ? pathParts[localeIndex] : null;
    if (!localeFromPath) {
      const defaultLocale2 = i18n.global.locale.value || "en";
      const newPath = `/${defaultLocale2}${to.path === "/" ? "" : to.path}`;
      next({
        path: newPath,
        query: to.query,
        hash: to.hash,
        replace: true
      });
      return;
    }
    const locale = localeFromPath;
    if (i18n.global.locale.value !== locale) {
      setLocale(locale);
    }
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      const currentLocale = i18n.global.locale.value;
      next({ name: `${currentLocale}-login`, query: { redirect: to.fullPath } });
      return;
    }
    if (to.meta.requiresAdmin && !((_a = authStore.user) == null ? void 0 : _a.isAdmin)) {
      const currentLocale = i18n.global.locale.value;
      next({ name: `${currentLocale}-home` });
      return;
    }
    if (to.meta.guestOnly && authStore.isAuthenticated) {
      const currentLocale = i18n.global.locale.value;
      next({ name: `${currentLocale}-home` });
      return;
    }
    next();
  });
}
const uk = {
  NAV: {
    GRADIENTS: "Градієнти",
    SHADOWS: "Тіні",
    ANIMATIONS: "Анімації",
    DOCS: "Документація",
    ABOUT: "Про нас",
    LOGIN: "Увійти",
    LOGOUT: "Вийти",
    PROFILE: "Кабінет",
    THEME_LIGHT: "Світла",
    THEME_DARK: "Темна"
  },
  HOME: {
    TITLE: "Style Engine",
    SUBTITLE: "Генератор CSS-градієнтів, тіней та анімацій з живим превью та експортом коду",
    GRADIENT_BUTTON: "Генератор градієнтів",
    SHADOW_BUTTON: "Генератор тіней",
    ANIMATION_BUTTON: "Генератор анімацій",
    ABOUT_TAG: "Що це",
    ABOUT_TITLE: "Лабораторія дизайну для градієнтів, тіней та анімацій",
    ABOUT_TEXT: "Style Engine допомагає дизайнерам і розробникам створювати готові до продакшену градієнти, тіні та анімації з живим прев'ю і миттєвим експортом коду.",
    ABOUT_POINT_1: "Інтерактивний playground з точним прев'ю",
    ABOUT_POINT_2: "Чистий CSS для сучасних фреймворків",
    ABOUT_POINT_3: "Одне місце для експериментів, опису й шерінгу",
    FEATURES_TAG: "Можливості",
    FEATURES_TITLE: "Все для впевненої роботи зі стилями",
    FEATURES_GRADIENT_TITLE: "Генератор градієнтів",
    FEATURES_GRADIENT_DESCRIPTION: "Створюйте лінійні, радіальні та конічні градієнти з точним контролем. Налаштовуйте кути, додавайте необмежену кількість кольорових точок та експортуйте готовий CSS миттєво.",
    FEATURES_SHADOW_TITLE: "Генератор тіней",
    FEATURES_SHADOW_DESCRIPTION: "Комбінуйте кілька жорстких тіней без розмиття. Контролюйте зміщення, розмах та прозорість кожного шару. Створюйте глибину за допомогою внутрішніх та зовнішніх комбінацій.",
    FEATURES_ANIMATION_TITLE: "Бібліотека анімацій",
    FEATURES_ANIMATION_DESCRIPTION: "Понад 40 готових CSS-анімацій з живим превʼю. Копіюйте повні HTML та CSS сніпети або налаштовуйте тайминг, easing та трансформації в конструкторі.",
    SHOWCASE_TAG: "Живі приклади",
    SHOWCASE_TITLE: "Дивіться, що можна створити",
    SHOWCASE_ANIMATION_LABEL: "Голографічна мрія",
    SHOWCASE_ANIMATION_DESCRIPTION: "Багатошарова анімація з частинками, орбітами та рідинними градієнтами",
    SHOWCASE_GRADIENT_LABEL: "Полярний захід",
    SHOWCASE_GRADIENT_DESCRIPTION: "Складна композиція радіальних і конічних градієнтів з яскравими кольорами",
    SHOWCASE_TRY: "Спробувати самому"
  },
  GRADIENT: {
    TITLE: "Генератор градієнтів",
    SUBTITLE: "Створюйте красиві CSS градієнти з живим превью",
    BACK_TO_HOME: "На головну",
    TYPE: "Тип градієнта",
    TYPE_LINEAR: "Лінійний",
    TYPE_RADIAL: "Радіальний",
    TYPE_CONIC: "Конічний",
    ANGLE: "Кут",
    COLORS: "Кольори",
    CUSTOM_GRADIENT: "Власний градієнт",
    ADD_COLOR: "Додати колір",
    EXPORT_TITLE: "Експорт коду",
    COPY: "Copy",
    COPIED: "Скопійовано",
    SHARE: "Поділитися",
    SAVE: "Зберегти",
    PRESETS_TAG: "Підбірка",
    PRESETS_TITLE: "Готові градієнти",
    PRESETS_SUBTITLE: "Найкрасивіші мікси — застосовуйте в один клік у генераторі"
  },
  SHADOW: {
    EYEBROW: "Лабораторія тіней",
    TITLE: "Генератор тіней",
    SUBTITLE: "Будуйте жорсткі мультитіні без blur. Змінюйте зміщення, spread та прозорість — box-shadow оновлюється миттєво.",
    BACK_TO_HOME: "На головну",
    LAYERS_TAG: "Стек тіней",
    LAYERS_TITLE: "Комбінуйте жорсткі шари",
    LAYERS_SUBTITLE: "Offset задає напрям, spread — товщину, opacity — обʼєм. Inset дає ефект вирізу.",
    ADD_LAYER: "Додати шар",
    LAYER_CARD: "шар",
    CUSTOM_SHADOW: "Власна тінь",
    OFFSET_X: "Зміщення X",
    OFFSET_Y: "Зміщення Y",
    SPREAD: "Spread",
    OPACITY: "Прозорість",
    COLOR: "Колір",
    INSET_ON: "Внутрішня тінь",
    INSET_OFF: "Зовнішня тінь",
    EXPORT_TITLE: "Скопіювати CSS тіні",
    COPY: "Копіювати",
    COPIED: "Скопійовано",
    SHARE: "Поділитися",
    SAVE: "Зберегти",
    PRESETS_TAG: "Готові стеки",
    PRESETS_TITLE: "20 різких пресетів",
    PRESETS_SUBTITLE: "Стеки тіней без blur, які можна одразу вставити або докрутити.",
    PRESET_BADGE: "Тінь",
    LIVE_BADGE: "Жива тінь",
    PREVIEW_TITLE: "Превʼю жорсткої тіні",
    PREVIEW_SUBTITLE: "Комбінація offset + spread додає глибину без розмиття.",
    PREVIEW_HINT: "Box-shadow змінюється під час руху повзунків"
  },
  ANIMATION: {
    EYEBROW: "Style Engine",
    TITLE: "Генератор анімацій",
    SUBTITLE: "Готові патерни CSS-анімацій з превʼю, HTML і стилями, які можна скопіювати в один клік.",
    BACK: "На головну",
    DOCS: "Документація по анімаціям",
    SNIPPETS_TAG: "Шаблони",
    SNIPPETS_TITLE: "Готові анімації з кодом",
    SNIPPETS_SUBTITLE: "Скопіюйте HTML + CSS разом і використовуйте як стартову точку або мікро-анімації для інтерфейсу.",
    HTML_CSS: "HTML + CSS",
    LIVE_PREVIEW: "Живе превʼю",
    KEYFRAMES_READY: "Готові keyframes",
    PREVIEW: "Превʼю",
    COPY_SNIPPET: "Скопіювати код",
    SHARE: "Поділитися",
    SAVE: "Зберегти",
    OPEN: "Відкрити приклад",
    BUILDER_TAG: "Генератор",
    BUILDER_TITLE: "Збирайте власні анімації",
    BUILDER_SUBTITLE: "Налаштуйте тривалість, easing, дистанцію руху, масштаб та прозорість. Готовий CSS-код з keyframes нижче.",
    COMMUNITY_TITLE: "Опубліковані анімації спільноти",
    COMMUNITY_LOADING: "Завантажуємо опубліковані анімації...",
    COMMUNITY_EMPTY: "Поки немає опублікованих анімацій.",
    COMMUNITY_BADGE: "Спільнота",
    COMMUNITY_ANIMATION: "Анімація спільноти",
    COMMUNITY_CREATED_BY: "Створив {user}",
    COMMUNITY_PREVIEW_PLACEHOLDER: "Поділилися спільнотою — відкрийте конструктор для повного перегляду.",
    CODE_VIEW: "Відображення коду",
    CODE_VIEW_VARIABLES: "З CSS-змінними",
    CODE_VIEW_VALUES: "Без змінних",
    DURATION: "Тривалість",
    DELAY: "Затримка",
    EASING: "Easing",
    LOOPS: "Повтори",
    DISTANCE_X: "Зміщення по X",
    DISTANCE_Y: "Зміщення по Y",
    SCALE_FROM: "Масштаб від",
    SCALE_TO: "Масштаб до",
    OPACITY_FROM: "Прозорість від",
    OPACITY_TO: "Прозорість до",
    ROTATION_FROM: "Обертання від",
    ROTATION_TO: "Обертання до",
    SKEW_X_FROM: "Нахил X від",
    SKEW_X_TO: "Нахил X до",
    SKEW_Y_FROM: "Нахил Y від",
    SKEW_Y_TO: "Нахил Y до",
    START_ANIMATION: "Запустити анімацію",
    STOP_ANIMATION: "Зупинити анімацію",
    EXAMPLES: {
      TICKER_TITLE: "Біжучий рядок",
      TICKER_DESCRIPTION: "Безкінечна лінія акцентного тексту — для банерів, статусів чи промо-блоків.",
      ORBITS_TITLE: "Обертання орбіт",
      ORBITS_DESCRIPTION: "Декоративні кільця з маркерами, що обертаються в різні боки.",
      PULSE_LINES_TITLE: "Пульсуючі стовпчики",
      PULSE_LINES_DESCRIPTION: "Залежність висоти від фази анімації — схоже на еквалайзер або завантаження.",
      STAR_TRAIL_TITLE: "Зоряний слід",
      STAR_TRAIL_DESCRIPTION: "Легкий шутинг-ефект для фонових сцен або святкових заставок.",
      BOUNCE_DOTS_TITLE: "Стрибаючі точки",
      BOUNCE_DOTS_DESCRIPTION: "Мінімалістичний лоадер зі стегерними колами.",
      PULSE_RING_TITLE: "Пульсуюче кільце",
      PULSE_RING_DESCRIPTION: "Хвиля, що розходиться від центральної точки.",
      LOADER_BARS_TITLE: "Бар-еквалайзер",
      LOADER_BARS_DESCRIPTION: "Вертикальні стовпчики, що ростуть у ритмічному циклі.",
      ROTATE_SQUARE_TITLE: "Обертання квадрата",
      ROTATE_SQUARE_DESCRIPTION: "Геометрична ротація з мʼяким масштабуванням.",
      FLIP_CARD_TITLE: "Фліп-карта",
      FLIP_CARD_DESCRIPTION: "3D-поворот картки із зворотним боком.",
      GLOW_ORBIT_TITLE: "Неонові орбіти",
      GLOW_ORBIT_DESCRIPTION: "Два кільця світла, що крутяться назустріч.",
      TYPING_TITLE: "Індикація набору",
      TYPING_DESCRIPTION: "Текстовий індикатор з миготливим курсором.",
      RADAR_TITLE: "Радарний промінь",
      RADAR_DESCRIPTION: "Конусний сканер поверх концентричних кіл.",
      WAVE_LINES_TITLE: "Хвильові лінії",
      WAVE_LINES_DESCRIPTION: "Короткі штрихи, що рухаються як мʼяка хвиля.",
      COLOR_SHIFT_TITLE: "Кольоровий шифт",
      COLOR_SHIFT_DESCRIPTION: "Повільне обертання конічного градієнта для амбіенту.",
      SCALE_FADE_TITLE: "Масштаб і прозорість",
      SCALE_FADE_DESCRIPTION: "Пульсуюче коло, що змінює розмір та альфа.",
      SHIMMER_CARD_TITLE: "Карта з шиммером",
      SHIMMER_CARD_DESCRIPTION: "Скелетон-ефект пробігаючого блику.",
      SLIDE_BADGE_TITLE: "Live-бейдж",
      SLIDE_BADGE_DESCRIPTION: "Плашка з активною крапкою, що ковзає.",
      RIPPLE_TITLE: "Кільце хвилі",
      RIPPLE_DESCRIPTION: "Розширюючася хвиля від центру.",
      METEOR_TITLE: "Метеор",
      METEOR_DESCRIPTION: "Швидкий слід із яскравою головою.",
      MORPH_BLOB_TITLE: "Морфінг плями",
      MORPH_BLOB_DESCRIPTION: "Органічна градієнтна форма, що змінює контур.",
      STAGGER_LIST_TITLE: "Стегер-список",
      STAGGER_LIST_DESCRIPTION: "Смуги списку зі зміщенням у часі.",
      LIQUID_TITLE: "Рідинні хвилі",
      LIQUID_DESCRIPTION: "Шари хвиль, що ковзають горизонтально.",
      SPINNER_LINES_TITLE: "Спиці-спінер",
      SPINNER_LINES_DESCRIPTION: "Обертальні “промені” з фазовою прозорістю.",
      GRADIENT_WIPE_TITLE: "Градієнтний вайп",
      GRADIENT_WIPE_DESCRIPTION: "Діагональний градієнт, що проходить крізь плашку.",
      DOTS_CHAIN_TITLE: "Ланцюг точок",
      DOTS_CHAIN_DESCRIPTION: "Послідовна пульсація через з'єднані точки.",
      CIRCLE_LOADER_TITLE: "Круговий лоадер",
      CIRCLE_LOADER_DESCRIPTION: "Класичний обертальний лоадер-кільце.",
      PROGRESS_BAR_TITLE: "Прогрес-бар",
      PROGRESS_BAR_DESCRIPTION: "Анімоване заповнення з градієнтом.",
      TRIPLE_SPINNER_TITLE: "Потрійний спінер",
      TRIPLE_SPINNER_DESCRIPTION: "Три шари кілець з різною швидкістю.",
      CUBE_PULSE_TITLE: "Пульс кубів",
      CUBE_PULSE_DESCRIPTION: "Чотири плитки масштабуються по черзі.",
      LINE_DANCE_TITLE: "Танцюючі лінії",
      LINE_DANCE_DESCRIPTION: "Вертикальні стовпчики як еквалайзер.",
      RING_DASH_TITLE: "Пунктирне кільце",
      RING_DASH_DESCRIPTION: "Два пунктирні кола обертаються у різні боки.",
      BEAM_LOADER_TITLE: "Світловий промінь",
      BEAM_LOADER_DESCRIPTION: "Мерехтливий промінь, що ковзає по доріжці.",
      STACK_BOUNCE_TITLE: "Стек, що стрибає",
      STACK_BOUNCE_DESCRIPTION: "Накладені смужки піднімаються одна за одною.",
      CLOCK_LOADER_TITLE: "Годинниковий лоадер",
      CLOCK_LOADER_DESCRIPTION: "Дві стрілки обертаються незалежно.",
      PULSE_GRID_TITLE: "Пульсуюча сітка",
      PULSE_GRID_DESCRIPTION: "Сітка квадратів пульсує по діагоналі.",
      WAVE_ORB_TITLE: "Хвильове ядро",
      WAVE_ORB_DESCRIPTION: "Хвиляста окантовка навколо світного ядра.",
      DOT_TYPING_LOADER_TITLE: "Три крапки",
      DOT_TYPING_LOADER_DESCRIPTION: "Три крапки підскакують як індикатор набору.",
      BEAT_GRID_TITLE: "Бітова сітка",
      BEAT_GRID_DESCRIPTION: "Компактна сітка, що пульсує у ритмі.",
      VERTICAL_MARQUEE_TITLE: "Вертикальний скрол",
      VERTICAL_MARQUEE_DESCRIPTION: "Плавний вертикальний список, що прокручується.",
      TEXT_REVEAL_TITLE: "Текстовий блиск",
      TEXT_REVEAL_DESCRIPTION: "Анімований градієнтний ефект для тексту.",
      NEWS_SCROLL_TITLE: "Новинна стрічка",
      NEWS_SCROLL_DESCRIPTION: "Горизонтальна стрічка у стилі термінових новин."
    },
    SEARCH_LABEL: "Пошук анімацій",
    SEARCH_PLACEHOLDER: "Шукати за назвою абоописом...",
    FILTER_BY_TYPE: "Фільтр за типом",
    ALL_TYPES: "Всі типи",
    SHOWING_RESULTS: "Показано {count} з {total} анімацій",
    SEARCHING: "Пошук...",
    NO_RESULTS: "Анімації не знайдено",
    NO_RESULTS_HINT: "Спробуйте змінити пошуковий запит або фільтр",
    PREVIOUS: "Попередня",
    NEXT: "Наступна",
    CATEGORY: {
      LOADERS: "Лоадери",
      MARQUEE: "Бігучі строки",
      EFFECTS: "Ефекти",
      TRANSITIONS: "Переходи",
      ORBITAL: "Орбітальні",
      INTERACTIVE: "Інтерактивні",
      COMMUNITY: "Спільнота"
    }
  },
  COMMON: {
    LANGUAGE: "Мова",
    COPIED_TO_CLIPBOARD: "Скопійовано в буфер",
    COPY: "Копіювати",
    COPY_FAILED: "Не вдалося скопіювати",
    SHARED_SUCCESS: "Посилання поділено",
    SHARE_UNAVAILABLE: "Ой, шерінг недоступний на цьому пристрої",
    SAVE_SUCCESS: "Збережено {entity} у вашому профілі",
    SAVE_ERROR: "Не вдалося зберегти {entity}. Спробуйте ще раз",
    AUTH_REQUIRED_TITLE: "Увійдіть, щоб продовжити",
    AUTH_REQUIRED_DESCRIPTION: "Збереження доступне лише авторизованим користувачам.",
    AUTH_REQUIRED_CONFIRM: "Увійти",
    AUTH_REQUIRED_CLOSE: "Закрити",
    ALREADY_SAVED: "{entity} вже збережено",
    SAVE: "Зберегти",
    CANCEL: "Скасувати",
    EXPORT: "Експортувати",
    DOWNLOAD: "Завантажити",
    PRO_EXPORT_TITLE: "Експорт доступний для Pro",
    PRO_EXPORT_MESSAGE: "Експорт коду доступний лише Pro та Premium. Оновіть тариф, щоб завантажувати HTML та інші формати.",
    PRO_EXPORT_ACTION: "Переглянути тарифи"
  },
  FOOTER: {
    NAVIGATION: "Навігація",
    DOCUMENTATION: "Документація",
    SETTINGS: "Налаштування",
    THEME: "Тема",
    LANGUAGE: "Мова",
    DEVELOPED_BY: "Розроблено",
    ALL_RIGHTS_RESERVED: "Всі права захищено"
  },
  DOCS: {
    TOPICS_LABEL: "Підсторінки",
    TOPICS_TITLE: "Теми з живими демо",
    TOPICS_SUBTITLE: "Кожна підсторінка — коротка методичка: чеклист, візуальні приклади і мінімальний код, який можна вставити в Style Engine.",
    OPEN_TOPIC: "Відкрити підсторінку",
    PLAYBOOK_LABEL: "Практика",
    PLAYBOOK_TITLE: "Міні-плейбук",
    PLAYBOOK_SUBTITLE: "Готові патерни — беріть в роботу або експериментуйте в генераторі.",
    CHECKLIST: "Чеклист",
    DEMO: "Демо",
    PATTERNS: "Патерни",
    LINKS: "Швидкі лінки",
    OTHER_TOPICS: "Інші розділи",
    BACK: "Назад до оглавлення",
    COPY: "Скопіювати",
    PRIMER_LABEL: "База"
  },
  META: {
    HOME: "Style Engine - Головна",
    GRADIENT: "Генератор градієнтів",
    SHADOW: "Генератор тіней",
    ANIMATION: "Генератор анімацій",
    ABOUT: "Про Style Engine",
    PRIVACY: "Політика конфіденційності",
    COOKIE: "Політика Cookie",
    DOCS: "CSS-гайд",
    DOCS_GRADIENTS: "Гайд по градієнтах",
    DOCS_SHADOWS: "Гайд по тінях",
    DOCS_ANIMATIONS: "Гайд по анімаціях",
    PROFILE: "Особистий кабінет",
    AUTH: "Авторизація",
    MODERATION: "Модерація",
    NOT_FOUND: "Сторінку не знайдено"
  },
  META_DESCRIPTION: {
    HOME: "Style Engine — лабораторія CSS з генераторами градієнтів, тіней та анімацій, живим прев’ю і чистим кодом для експорту.",
    GRADIENT: "Конструюйте лінійні, радіальні й конічні градієнти, дивіться прев’ю та копіюйте готовий CSS.",
    SHADOW: "Збирайте багатошарові CSS-тіні з контролем блюру, розмаху й кольорів, експортуйте стиль у один клік.",
    ANIMATION: "Прототипуйте CSS-анімації з миттєвим прев’ю та готуйте keyframes для інтерфейсу.",
    ABOUT: "Про Style Engine: плани, преміум-користувачі та наша спільнота з живою статистикою.",
    DOCS: "Зрозумілий CSS-гайд з підсторінками про градієнти, тіні й анімації та анімованими прикладами.",
    DOCS_GRADIENTS: "Рецепти градієнтів з кутами, стопами та багатошаровими фонами, які можна вставити в Style Engine.",
    DOCS_SHADOWS: "Сетки багатошарових тіней з підсвіткою, контуром і hover-мікроухами.",
    DOCS_ANIMATIONS: "Повторно використовувані keyframes із рекомендаціями по easing та стегеру для продакшн інтерфейсу.",
    PROFILE: "Керуйте профілем Style Engine і збереженими пресетами.",
    AUTH: "Увійдіть, щоб синхронізувати пресети Style Engine та персоналізувати досвід.",
    MODERATION: "Перегляд і схвалення робіт користувачів: градієнтів, тіней та анімацій.",
    NOT_FOUND: "Сторінку не знайдено. Поверніться до генераторів і продовжуйте експерименти.",
    PRIVACY: "Політика конфіденційності Style Engine: які дані збираємо, як використовуємо та як зв’язатися з нами.",
    COOKIE: "Політика cookie: як Style Engine використовує cookie, як ними керувати і що це означає для вас."
  },
  NOT_FOUND: {
    TAG: "Загубилися в CSS-тумані",
    TITLE: "Цей маршрут зник",
    HIGHLIGHT: "Повертаємо в лабораторію",
    DESCRIPTION: "Ми не знайшли цю сторінку. Перейдіть у генератори, документацію або на головну й продовжуйте збирати градієнти, тіні та рух.",
    BADGE: "Маршрут відсутній",
    CTA_HOME: "На головну",
    CTA_DOCS: "Відкрити документацію",
    SHORTCUTS: "Швидкі переходи",
    CTA_GRADIENT: "Лабораторія градієнтів",
    CTA_SHADOW: "Лабораторія тіней",
    CTA_ANIMATION: "Бібліотека анімацій"
  },
  PRIVACY: {
    NAV: "Політика конфіденційності",
    TAG: "Політики",
    TITLE: "Політика конфіденційності",
    HIGHLIGHT: "Як ми захищаємо дані",
    SUBTITLE: "Ми збираємо лише мінімум, щоб працювали генератори, збереження і профіль. Нижче — як саме це працює.",
    PILL_CORE: "Які дані",
    PILL_USE: "Як використовуємо",
    PILL_RIGHTS: "Ваші права",
    PILL_SECURITY: "Безпека",
    PILL_CONTACT: "Контакти",
    SECTIONS: {
      DATA_TITLE: "Що ми збираємо",
      DATA_BODY: "Лише необхідне, щоб дати вам досвід акаунта і покращувати інструменти.",
      DATA_POINTS: [
        "Дані акаунта, які ви надаєте: email, ім’я, пароль (хешований).",
        "Сигнали використання: збереження, пресети, мова, тема, неідентифікуюча аналітика.",
        "Контекст підтримки, якщо пишете нам: повідомлення та метадані, що ви надсилаєте."
      ],
      USE_TITLE: "Як ми застосовуємо дані",
      USE_BODY: "Опрацьовуємо інформацію тільки для роботи та розвитку Style Engine — не продаємо й не передаємо рекламодавцям.",
      USE_POINTS: [
        "Синхронізуємо збереження між пристроями і тримаємо пресети в безпеці.",
        "Покращуємо генератори, розуміючи використання функцій у агрегованому вигляді.",
        "Надсилаємо важливі оновлення про зміни, безпеку чи акаунт."
      ],
      RIGHTS_TITLE: "Ваші права і контроль",
      RIGHTS_BODY: "Ви керуєте своїми даними. Дайте знати, і ми допоможемо.",
      RIGHTS_POINTS: [
        "Запросіть копію або видалення ваших даних у будь-який момент.",
        "Оновлюйте email, ім’я та збереження у профілі.",
        "Відмовтеся від несуттєвих листів через посилання Unsubscribe."
      ],
      SECURITY_TITLE: "Як ми захищаємо",
      SECURITY_BODY: "Використовуємо сучасні інструменти та обмежуємо доступ лише необхідним.",
      SECURITY_POINTS: [
        "Паролі хешуються; чутливі дії йдуть через HTTPS.",
        "Доступ до інфраструктури має лише обмежене коло адміністраторів."
      ],
      CONTACT_TITLE: "Питання або запит?",
      CONTACT_BODY: "Напишіть на privacy (at) styleengine.dev — відповімо деталями або виконаємо ваш запит."
    }
  },
  COOKIE: {
    NAV: "Політика Cookie",
    TAG: "Політики",
    TITLE: "Політика Cookie",
    HIGHLIGHT: "Щоб сесії були плавними",
    SUBTITLE: "Ми використовуємо мінімальні cookie, щоб пам’ятати налаштування, тримати вхід і бачити, що справді допомагає.",
    PILL_TYPES: "Типи",
    PILL_CONTROL: "Керування",
    PILL_USAGE: "Навіщо потрібні",
    PILL_CONTACT: "Контакти",
    SECTIONS: {
      TYPES_TITLE: "Які cookie ми ставимо",
      TYPES_BODY: "Фокус на надійності та персоналізації.",
      TYPES_POINTS: [
        "Необхідні: сесія, автентифікація, безпекові токени.",
        "Налаштування: мова, тема, вибір інтерфейсу.",
        "Аналітика: агреговані дані про використання для покращень."
      ],
      CONTROL_TITLE: "Як керувати cookie",
      CONTROL_BODY: "Ви вирішуєте, як cookie працюють на вашому пристрої.",
      CONTROL_POINTS: [
        "Блокуйте або очищайте cookie в налаштуваннях браузера.",
        "Вимикайте не обов’язкову аналітику через браузер чи розширення.",
        "Відмова від cookie може вивести з акаунта або обмежити персоналізацію."
      ],
      USE_TITLE: "Як ми їх використовуємо",
      USE_BODY: "Cookie тримають сесії стабільними і допомагають покращувати продукт.",
      USE_POINTS: [
        "Підтримують ваш вхід, щоб збереження були синхронізовані.",
        "Пам’ятають налаштування, щоб інтерфейс відповідав вашому робочому процесу."
      ],
      CONTACT_TITLE: "Потрібні деталі?",
      CONTACT_BODY: "Напишіть на privacy (at) styleengine.dev з будь-якими питаннями щодо cookie."
    }
  },
  COOKIE_MODAL: {
    TAG: "Cookie",
    TITLE: "Ми використовуємо cookie для стабільної роботи",
    DESCRIPTION: "Вони зберігають вхід, пам’ятають налаштування і показують, що справді допомагає. Ви керуєте, що робити далі.",
    ACCEPT: "Прийняти cookie",
    DECLINE: "Не зараз"
  },
  AUTH: {
    LOGIN_TITLE: "З поверненням",
    LOGIN_SUBTITLE: "Увійдіть, щоб отримати доступ до збережених градієнтів, тіней та анімацій",
    FORGOT_TITLE: "Скинути пароль",
    FORGOT_SUBTITLE: "Введіть email, і ми надішлемо посилання для скидання.",
    RESET_TITLE: "Створіть новий пароль",
    RESET_SUBTITLE: "Встановіть надійний пароль для безпеки акаунта.",
    RESET_SUCCESS: "Пароль оновлено. Тепер можна увійти.",
    RESET_EMAIL_SENT: "Якщо цей email існує, ми надіслали посилання для скидання.",
    EMAIL_NOT_FOUND: "Акаунт з таким email не знайдено. Перевірте адресу і спробуйте ще раз.",
    CHANGE_PASSWORD: "Змінити пароль",
    CURRENT_PASSWORD: "Поточний пароль",
    REGISTER_TITLE: "Створити акаунт",
    REGISTER_SUBTITLE: "Приєднайтесь до Style Engine, щоб зберігати та синхронізувати свої роботи",
    EMAIL: "Email",
    PASSWORD: "Пароль",
    NEW_PASSWORD: "Новий пароль",
    CONFIRM_PASSWORD: "Підтвердіть пароль",
    SEND_RESET: "Надіслати посилання",
    SET_NEW_PASSWORD: "Встановити новий пароль",
    CHANGE_PASSWORD_BUTTON: "Оновити пароль",
    NAME: "Ім'я (необов'язково)",
    LOGIN_BUTTON: "Увійти",
    REGISTER_BUTTON: "Створити акаунт",
    FORGOT_PASSWORD: "Забули пароль?",
    NO_ACCOUNT: "Немає акаунта?",
    HAS_ACCOUNT: "Вже є акаунт?",
    SIGN_UP: "Зареєструватися",
    SIGN_IN: "Увійти",
    OR_CONTINUE: "або продовжити через",
    SIGNING_IN: "Вхід...",
    CREATING_ACCOUNT: "Створення акаунта..."
  },
  VALIDATION: {
    EMAIL_REQUIRED: "Email обов'язковий",
    EMAIL_INVALID: "Будь ласка, введіть дійсну email адресу",
    PASSWORD_REQUIRED: "Пароль обов'язковий",
    PASSWORD_MIN: "Пароль повинен містити мінімум 8 символів",
    PASSWORD_MISMATCH: "Паролі не співпадають",
    NAME_MIN: "Ім'я повинно містити мінімум 1 символ",
    NAME_MAX: "Ім'я повинно бути менше 120 символів",
    SERVER_ERROR: "Щось пішло не так. Спробуйте ще раз",
    USER_EXISTS: "Користувач з таким email вже існує",
    INVALID_CREDENTIALS: "Невірний email або пароль"
  },
  PROFILE: {
    TITLE: "Профіль",
    SUBTITLE: "Керуйте налаштуваннями акаунта та перевагами",
    EDIT_PROFILE: "Редагувати профіль",
    CHANGE_AVATAR: "Змінити аватар",
    UPLOAD_AVATAR: "Завантажити новий аватар",
    REMOVE_AVATAR: "Видалити аватар",
    SAVE_CHANGES: "Зберегти зміни",
    CANCEL: "Скасувати",
    SAVING: "Збереження...",
    NAME_LABEL: "Відображуване ім'я",
    EMAIL_LABEL: "Email",
    MEMBER_SINCE: "Учасник з",
    SAVED_ITEMS: "Збережені елементи",
    SAVED_GRADIENTS: "Градієнти",
    SAVED_SHADOWS: "Тіні",
    SAVED_ANIMATIONS: "Анімації",
    UPLOAD_HINT: "JPG, PNG або GIF (макс. 2МБ)",
    UPLOAD_ERROR: "Не вдалося завантажити зображення. Спробуйте ще раз",
    UPLOAD_SIZE_ERROR: "Зображення завелике. Максимальний розмір 2МБ",
    UPLOAD_FORMAT_ERROR: "Невірний формат файлу. Будь ласка, завантажте JPG, PNG або GIF",
    SAVE_SUCCESS: "Профіль успішно оновлено",
    SAVES_TITLE: "Ваші збереження",
    SAVES_SUBTITLE: "Градієнти, тіні та анімації у вашому акаунті",
    NAV_GRADIENTS: "Збережені градієнти",
    NAV_SHADOWS: "Збережені тіні",
    NAV_ANIMATIONS: "Збережені анімації",
    PLAN_FREE: "Безкоштовний план",
    PLAN_PRO: "Оплачений план",
    TAB_GRADIENTS: "Градієнти",
    TAB_SHADOWS: "Тіні",
    TAB_ANIMATIONS: "Анімації",
    SAVES_LOADING: "Завантажуємо збереження...",
    SAVES_EMPTY: "Поки що нічого не збережено.",
    LOAD_SAVES_ERROR: "Не вдалося завантажити збереження",
    STATUS_PRIVATE: "Чернетка",
    STATUS_PENDING: "На модерації",
    STATUS_APPROVED: "Опубліковано",
    SAVED_AT: "Збережено",
    PUBLISH: "Відправити на публікацію",
    PUBLISHING: "Відправляємо...",
    DUPLICATE_LOCAL: "Вже збережено локально",
    DUPLICATE_PUBLIC: "Вже опубліковано на сервері",
    PENDING_REVIEW: "Очікує схвалення",
    APPROVED: "Опубліковано",
    FREE_LIMIT: "Безкоштовний план: до 3 збережень кожного типу",
    PUBLISH_ERROR: "Не вдалося відправити на модерацію",
    PUBLISH_SUCCESS: "Відправлено на модерацію",
    DUPLICATE_EXISTS: "Цей елемент вже існує в публічній колекції",
    COPY: "Копіювати CSS",
    COPY_CSS: "Скопіювати CSS код у буфер обміну",
    COPIED: "CSS скопійовано в буфер обміну",
    COPY_ERROR: "Не вдалося скопіювати CSS",
    MODERATION_LINK: "Черга модерації",
    USER_MANAGEMENT_LINK: "Керування користувачами",
    SUBSCRIPTION_UNTIL: "Підписка до",
    SUBSCRIPTION_FOREVER: "Безстрокова підписка",
    DELETE: "Видалити",
    DELETING: "Видалення...",
    DELETE_CONFIRM: 'Ви впевнені, що хочете видалити "{name}"? Цю дію неможливо скасувати.',
    DELETE_SUCCESS: "Елемент успішно видалено",
    DELETE_ERROR: "Не вдалося видалити елемент",
    PASSWORD_SECTION_TITLE: "Пароль",
    PASSWORD_SECTION_SUBTITLE: "Оновіть пароль, щоб акаунт залишався захищеним.",
    CHANGE_PASSWORD_SUCCESS: "Пароль успішно оновлено.",
    CHANGE_PASSWORD_ERROR: "Не вдалося оновити пароль. Перевірте поточний пароль і спробуйте знову.",
    PRO_LIMIT_TITLE: "Ліміт Pro досягнуто",
    PRO_LIMIT_MESSAGE: "Користувачі Pro можуть зберігати до {limit} елементів у {entity}. Оновіть до Premium, щоб зняти обмеження.",
    PRO_LIMIT_ACTION: "Оновити до Premium"
  },
  MODERATION: {
    TITLE: "Черга модерації",
    SUBTITLE: "Схвалюйте роботи спільноти: градієнти, тіні та анімації",
    USERS_TAG: "Акаунти спільноти",
    USERS_INTRO: "Сортуйте, фільтруйте та редагуйте тарифи перед змінами.",
    USERS_COUNT: "Завантажено {count} акаунтів",
    USER_MODAL_DURATION: "Термін підписки",
    USER_MODAL_DURATION_MONTH: "1 місяць",
    USER_MODAL_DURATION_FOREVER: "Безстроково",
    REFRESH: "Оновити",
    LOADING: "Завантаження...",
    EMPTY: "Немає елементів, що очікують на перевірку.",
    LOAD_ERROR: "Не вдалося завантажити чергу модерації",
    APPROVE: "Схвалити",
    APPROVING: "Схвалюємо...",
    APPROVE_ERROR: "Не вдалося схвалити елемент",
    SUBMITTED: "Надіслано",
    CATEGORY_GRADIENT: "Градієнт",
    CATEGORY_SHADOW: "Тінь",
    CATEGORY_ANIMATION: "Анімація",
    USERS_TITLE: "Керування користувачами",
    USERS_SUBTITLE: "Оновлюйте акаунти, змінюйте email та тариф.",
    USERS_FILTER_LABEL: "Тариф",
    USERS_FILTER_ALL: "Всі тарифи",
    USERS_TABLE: {
      EMAIL: "Email",
      NAME: "Ім’я",
      PLAN: "Тариф",
      CREATED: "Створено",
      ACTIONS: "Дії"
    },
    EDIT: "Редагувати",
    DELETE: "Видалити",
    UNIT: {
      FREE: "Free",
      PRO: "Pro",
      PREMIUM: "Преміум"
    },
    USER_MODAL_TITLE: "Редагувати користувача",
    USER_MODAL_SUBTITLE: "Оновіть email, ім’я, пароль або тариф.",
    USER_MODAL_PASSWORD: "Новий пароль",
    USER_MODAL_PASSWORD_HINT: "Залиште пустим, щоб не змінювати.",
    USER_MODAL_SAVE: "Зберегти зміни",
    USER_UPDATE_SUCCESS: "Користувача оновлено",
    USER_UPDATE_ERROR: "Не вдалося оновити користувача",
    USER_DELETE_SUCCESS: "Користувача видалено",
    USER_DELETE_ERROR: "Не вдалося видалити користувача",
    DELETE_CONFIRM: "Видалити акаунт {name}? Дії незворотні."
  },
  ABOUT: {
    PAGE_TAG: "Про нас",
    PAGE_TITLE: "Style Engine створюється разом зі спільнотою",
    PAGE_TITLE_HIGHLIGHT: "Святкуємо преміум-креаторів та майстрів руху на кожному екрані.",
    PAGE_SUBTITLE: "Обирайте тариф і дивіться, хто будує з нами.",
    MISSION_TAG: "Навіщо ми існуємо",
    MISSION_TITLE: "Ми робимо Style Engine, щоб дизайнерам і девам було легко працювати з motion",
    MISSION_TEXT: "Цей сайт — лабораторія градієнтів, тіней і motion-рецептів із живими превʼю та копіюванням коду. Прагнемо, щоб експерименти були швидкими, а команда залишалася в потоці.",
    MISSION_POINT_1_TITLE: "Наша мета",
    MISSION_POINT_1_TEXT: "Розвиваємо генератори в спільне полотно для навчання motion-систем, фіксації рішень і публікації готових ефектів.",
    MISSION_POINT_2_TITLE: "Що будуємо далі",
    MISSION_POINT_2_TEXT: "Більше лайв-пресетів, простори для співпраці та нові формати експорту, щоб від дослідження до продакшну було кілька хвилин.",
    MISSION_POINT_3_TITLE: "Чому важлива підтримка",
    MISSION_POINT_3_TEXT: "Кожна підписка тримає пісочницю онлайн, фінансує нові пакети анімацій та дозволяє винагороджувати креаторів спільноти.",
    PLANS_TAG: "Тарифи",
    PLANS_TITLE: "Тарифи під будь-який темп",
    PLANS_SUBTITLE: "Почніть безкоштовно й оновлюйтесь, коли потрібно більше збережень чи експорту.",
    COMMUNITY_TAG: "Спільнота",
    COMMUNITY_TITLE: "Люди, що користуються Style Engine",
    COMMUNITY_SUBTITLE: "Спочатку показуємо преміум, потім Pro, далі безкоштовних користувачів. Фільтруйте, сортуйте та підвантажуйте більше.",
    OUR_COMMUNITY: "Наша спільнота",
    COMMUNITY_DESCRIPTION: "Спершу йдуть преміум-користувачі, потім Pro, далі решта.",
    TOTAL_USERS: "{count} людей всього",
    LOADING_USERS: "Завантажуємо користувачів...",
    LOADING_MORE: "Підвантажуємо ще...",
    NO_USERS: "Ще немає користувачів — запросіть команду!",
    ERROR_LOADING: "Не вдалося завантажити користувачів. Спробуйте ще раз.",
    LOAD_MORE: "Показати ще",
    FILTER: {
      ALL: "Усі",
      FREE: "Безкоштовні",
      PRO: "Pro",
      PREMIUM: "Преміум"
    },
    TABLE: {
      AVATAR: "Фото",
      NAME: "Нік/імʼя",
      EMAIL: "Email",
      JOINED: "Дата приєднання",
      STATUS: "Статус"
    },
    TIER: {
      FREE: "Free",
      PRO: "Pro",
      PREMIUM: "Преміум"
    }
  },
  PRICING: {
    TITLE: "Оберіть тарифний план",
    SUBTITLE: "Відкрийте безмежну креативність з Style Engine Pro",
    MONTHLY: "Щомісяця",
    POPULAR: "Найпопулярніший",
    CURRENT_PLAN: "Поточний план",
    UPGRADE: "Оновити",
    GET_STARTED: "Почати",
    FREE_TEMPLATES: "До 5 збережених шаблонів кожного типу",
    BASIC_GENERATORS: "Доступ до всіх генераторів",
    CSS_EXPORT: "Експорт CSS коду",
    COMMUNITY_SUPPORT: "Підтримка спільноти",
    PRO_TEMPLATES: "До 50 збережених шаблонів кожного типу",
    ALL_GENERATORS: "Всі генератори та функції",
    MULTIPLE_EXPORTS: "Експорт в CSS, SCSS, JSON",
    HISTORY_30_DAYS: "Історія версій за 30 днів",
    AI_GENERATIONS: "100 AI генерацій на місяць",
    PRIORITY_SUPPORT: "Пріоритетна підтримка email",
    UNLIMITED_TEMPLATES: "Необмежена кількість шаблонів",
    ALL_EXPORTS: "Експорт у всі формати",
    UNLIMITED_HISTORY: "Необмежена історія версій",
    UNLIMITED_AI: "Необмежені AI генерації",
    FIGMA_SKETCH_EXPORT: "Експорт в Figma та Sketch",
    TEAM_COLLABORATION: "Командна співпраця",
    PREMIUM_SUPPORT: "Преміум підтримка 24/7",
    EARLY_ACCESS: "Ранній доступ до нових функцій",
    LIMIT_REACHED_TITLE: "Досягнуто ліміт шаблонів",
    LIMIT_REACHED_MESSAGE: "Ви досягли максимуму в {limit} збережених {type} шаблонів на безкоштовному плані.",
    LIMIT_UPGRADE_MESSAGE: "Перейдіть на Pro для збереження до 50 шаблонів, або на Premium для необмеженого сховища.",
    PRO_LIMIT_TITLE: "Ліміт Pro досягнуто",
    PRO_LIMIT_MESSAGE: "Користувачі Pro можуть зберігати до {limit} елементів у {entity}. Оновіть до Premium для необмеженої кількості.",
    PRO_LIMIT_ACTION: "Оновити до Premium",
    DELETE_TEMPLATE: "Видалити шаблон",
    OR: "або",
    VIEW_PLANS: "Переглянути тарифи",
    MANAGE_TEMPLATES: "Керувати шаблонами",
    CLOSE: "Закрити"
  }
};
const en = {
  NAV: {
    GRADIENTS: "Gradients",
    SHADOWS: "Shadows",
    ANIMATIONS: "Animations",
    DOCS: "CSS Docs",
    ABOUT: "About",
    LOGIN: "Sign In",
    LOGOUT: "Sign Out",
    PROFILE: "Profile",
    THEME_LIGHT: "Light",
    THEME_DARK: "Dark"
  },
  HOME: {
    TITLE: "Style Engine",
    SUBTITLE: "CSS gradient, shadow, and animation generator with live preview and code export",
    GRADIENT_BUTTON: "Gradient Generator",
    SHADOW_BUTTON: "Shadow Generator",
    ANIMATION_BUTTON: "Animation Generator",
    ABOUT_TAG: "What is it",
    ABOUT_TITLE: "A design lab for CSS motion, gradients, and shadows",
    ABOUT_TEXT: "Style Engine helps designers and developers craft production-ready gradients, shadows, and animations with live previews and instant code export.",
    ABOUT_POINT_1: "Live playground with pixel-perfect previews",
    ABOUT_POINT_2: "Clean, copy-paste CSS for modern frameworks",
    ABOUT_POINT_3: "One place to experiment, document, and share",
    FEATURES_TAG: "Features",
    FEATURES_TITLE: "Everything you need to style with confidence",
    FEATURES_GRADIENT_TITLE: "Gradient Generator",
    FEATURES_GRADIENT_DESCRIPTION: "Build linear, radial, and conic gradients with precision control. Adjust angles, add unlimited color stops, and export production-ready CSS instantly.",
    FEATURES_SHADOW_TITLE: "Shadow Generator",
    FEATURES_SHADOW_DESCRIPTION: "Layer multiple hard-edge shadows without blur. Control offset, spread, and opacity for each layer. Create depth with inset and outset combinations.",
    FEATURES_ANIMATION_TITLE: "Animation Library",
    FEATURES_ANIMATION_DESCRIPTION: "40+ ready-to-use CSS animations with live preview. Copy complete HTML and CSS snippets, or customize timing, easing, and transforms in the builder.",
    SHOWCASE_TAG: "Live examples",
    SHOWCASE_TITLE: "See what you can build",
    SHOWCASE_ANIMATION_LABEL: "Holographic Dream",
    SHOWCASE_ANIMATION_DESCRIPTION: "Multi-layer animation with particles, orbitals, and liquid gradients",
    SHOWCASE_GRADIENT_LABEL: "Aurora Sunset",
    SHOWCASE_GRADIENT_DESCRIPTION: "Complex radial and conic gradient composition with vibrant colors",
    SHOWCASE_TRY: "Try it yourself"
  },
  GRADIENT: {
    TITLE: "Gradient Generator",
    SUBTITLE: "Create beautiful CSS gradients with live preview",
    BACK_TO_HOME: "Back to Home",
    TYPE: "Gradient Type",
    TYPE_LINEAR: "Linear",
    TYPE_RADIAL: "Radial",
    TYPE_CONIC: "Conic",
    ANGLE: "Angle",
    COLORS: "Colors",
    CUSTOM_GRADIENT: "Custom Gradient",
    ADD_COLOR: "Add Color",
    EXPORT_TITLE: "Code Export",
    COPY: "Copy",
    COPIED: "Copied",
    SHARE: "Share",
    SAVE: "Save",
    PRESETS_TAG: "Signature set",
    PRESETS_TITLE: "Ready-to-use gradients",
    PRESETS_SUBTITLE: "Steal these cinematic mixes and drop them straight into the generator"
  },
  SHADOW: {
    EYEBROW: "Shadow lab",
    TITLE: "Shadow Generator",
    SUBTITLE: "Build hard-edged, multi-layer shadows without blur. Tweak offsets, spreads, and opacity — the box-shadow updates live.",
    BACK_TO_HOME: "Back to Home",
    LAYERS_TAG: "Shadow stack",
    LAYERS_TITLE: "Compose crisp layers",
    LAYERS_SUBTITLE: "Use offsets for direction, spread for thickness, and opacity for volume. Add inset layers for carved surfaces.",
    ADD_LAYER: "Add layer",
    LAYER_CARD: "layer",
    CUSTOM_SHADOW: "Custom Shadow",
    OFFSET_X: "Offset X",
    OFFSET_Y: "Offset Y",
    SPREAD: "Spread",
    OPACITY: "Opacity",
    COLOR: "Color",
    INSET_ON: "Inset layer",
    INSET_OFF: "Outer layer",
    EXPORT_TITLE: "Copy CSS shadows",
    COPY: "Copy",
    COPIED: "Copied",
    SHARE: "Share",
    SAVE: "Save",
    PRESETS_TAG: "Stacks",
    PRESETS_TITLE: "20 sharp presets",
    PRESETS_SUBTITLE: "No-blur shadow recipes you can paste or remix instantly.",
    PRESET_BADGE: "Sharp",
    LIVE_BADGE: "Live shadow",
    PREVIEW_TITLE: "Crisp hard-shadow preview",
    PREVIEW_SUBTITLE: "Stacked offsets and spreads build graphic depth without blur.",
    PREVIEW_HINT: "Box-shadow updates as you drag"
  },
  ANIMATION: {
    EYEBROW: "Style Engine",
    TITLE: "Animation Generator",
    SUBTITLE: "Ready-to-use CSS animation patterns with live preview, HTML and styles you can copy in one click.",
    BACK: "Back to home",
    DOCS: "Animation docs",
    SNIPPETS_TAG: "Snippets",
    SNIPPETS_TITLE: "Animation examples with code",
    SNIPPETS_SUBTITLE: "Copy HTML + CSS together and plug in as a starting point or micro-motion for your UI.",
    HTML_CSS: "HTML + CSS",
    LIVE_PREVIEW: "Live preview",
    KEYFRAMES_READY: "Keyframes ready",
    PREVIEW: "Preview",
    COPY_SNIPPET: "Copy snippet",
    SHARE: "Share",
    SAVE: "Save",
    OPEN: "Open example",
    BUILDER_TAG: "Generator",
    BUILDER_TITLE: "Build your own animation",
    BUILDER_SUBTITLE: "Tune duration, easing, distance, scale, and opacity. Copy ready-to-use keyframes and CSS below.",
    COMMUNITY_TITLE: "Published animations from the community",
    COMMUNITY_LOADING: "Loading published animations...",
    COMMUNITY_EMPTY: "No published animations yet.",
    COMMUNITY_BADGE: "Community",
    COMMUNITY_ANIMATION: "Community animation",
    COMMUNITY_CREATED_BY: "Created by {user}",
    COMMUNITY_PREVIEW_PLACEHOLDER: "Shared by the community — open the builder for a full, interactive preview.",
    CODE_VIEW: "Code view",
    CODE_VIEW_VARIABLES: "CSS variables",
    CODE_VIEW_VALUES: "Static values",
    DURATION: "Duration",
    DELAY: "Delay",
    EASING: "Easing",
    LOOPS: "Loops",
    DISTANCE_X: "Offset X",
    DISTANCE_Y: "Offset Y",
    SCALE_FROM: "Scale from",
    SCALE_TO: "Scale to",
    OPACITY_FROM: "Opacity from",
    OPACITY_TO: "Opacity to",
    ROTATION_FROM: "Rotation from",
    ROTATION_TO: "Rotation to",
    SKEW_X_FROM: "Skew X from",
    SKEW_X_TO: "Skew X to",
    SKEW_Y_FROM: "Skew Y from",
    SKEW_Y_TO: "Skew Y to",
    START_ANIMATION: "Start animation",
    STOP_ANIMATION: "Stop animation",
    EXAMPLES: {
      TICKER_TITLE: "Running line",
      TICKER_DESCRIPTION: "Endless accent stripe — good for banners, status bars or promo blocks.",
      ORBITS_TITLE: "Orbit rings",
      ORBITS_DESCRIPTION: "Decorative rings with markers spinning in opposite directions.",
      PULSE_LINES_TITLE: "Pulsing bars",
      PULSE_LINES_DESCRIPTION: "Height follows the phase of animation — like an equalizer or loading state.",
      STAR_TRAIL_TITLE: "Star trail",
      STAR_TRAIL_DESCRIPTION: "A soft shooting effect for backgrounds or seasonal scenes.",
      BOUNCE_DOTS_TITLE: "Bouncing dots",
      BOUNCE_DOTS_DESCRIPTION: "Minimal loader with staggered bouncing circles.",
      PULSE_RING_TITLE: "Pulse ring",
      PULSE_RING_DESCRIPTION: "Ripple effect radiating from the core.",
      LOADER_BARS_TITLE: "Equalizer bars",
      LOADER_BARS_DESCRIPTION: "Vertical bars growing in a rhythmic loop.",
      ROTATE_SQUARE_TITLE: "Rotating square",
      ROTATE_SQUARE_DESCRIPTION: "Geometric rotation with soft scaling.",
      FLIP_CARD_TITLE: "Flip card",
      FLIP_CARD_DESCRIPTION: "3D card flipping to reveal the backside.",
      GLOW_ORBIT_TITLE: "Glow orbit",
      GLOW_ORBIT_DESCRIPTION: "Two neon rings spinning in opposite directions.",
      TYPING_TITLE: "Typing dots",
      TYPING_DESCRIPTION: "Text typing indicator with blinking caret.",
      RADAR_TITLE: "Radar sweep",
      RADAR_DESCRIPTION: "Conic beam scanning across concentric circles.",
      WAVE_LINES_TITLE: "Wave lines",
      WAVE_LINES_DESCRIPTION: "Short bars moving like a gentle waveform.",
      COLOR_SHIFT_TITLE: "Color shift",
      COLOR_SHIFT_DESCRIPTION: "Slow conic gradient rotation for ambient glow.",
      SCALE_FADE_TITLE: "Scale & fade",
      SCALE_FADE_DESCRIPTION: "Pulsing circle scaling up and down.",
      SHIMMER_CARD_TITLE: "Shimmer card",
      SHIMMER_CARD_DESCRIPTION: "Skeleton shimmer sweeping across a card.",
      SLIDE_BADGE_TITLE: "Live badge",
      SLIDE_BADGE_DESCRIPTION: "Pill badge with sliding active dot.",
      RIPPLE_TITLE: "Ripple ping",
      RIPPLE_DESCRIPTION: "Expanding ripple from the center point.",
      METEOR_TITLE: "Meteor streak",
      METEOR_DESCRIPTION: "A quick shooting line with glowing head.",
      MORPH_BLOB_TITLE: "Morphing blob",
      MORPH_BLOB_DESCRIPTION: "Organic gradient blob changing shape.",
      STAGGER_LIST_TITLE: "Stagger list",
      STAGGER_LIST_DESCRIPTION: "List bars offset in a subtle stagger motion.",
      LIQUID_TITLE: "Liquid waves",
      LIQUID_DESCRIPTION: "Layered waves sliding horizontally.",
      SPINNER_LINES_TITLE: "Spinner lines",
      SPINNER_LINES_DESCRIPTION: "Rotating spokes with phased opacity.",
      GRADIENT_WIPE_TITLE: "Gradient wipe",
      GRADIENT_WIPE_DESCRIPTION: "Diagonal gradient sweep across a label.",
      DOTS_CHAIN_TITLE: "Dots chain",
      DOTS_CHAIN_DESCRIPTION: "Sequential pulse animation through connected dots.",
      CIRCLE_LOADER_TITLE: "Circle loader",
      CIRCLE_LOADER_DESCRIPTION: "Classic spinning ring loader.",
      PROGRESS_BAR_TITLE: "Progress bar",
      PROGRESS_BAR_DESCRIPTION: "Animated progress fill with gradient.",
      TRIPLE_SPINNER_TITLE: "Triple spinner",
      TRIPLE_SPINNER_DESCRIPTION: "Three layered rings rotating with offset speeds.",
      CUBE_PULSE_TITLE: "Pulse cubes",
      CUBE_PULSE_DESCRIPTION: "Four tiles scaling in sequence.",
      LINE_DANCE_TITLE: "Line dance",
      LINE_DANCE_DESCRIPTION: "Equalizer-style vertical bars.",
      RING_DASH_TITLE: "Dashed ring",
      RING_DASH_DESCRIPTION: "Dual dashed circles spinning in opposite directions.",
      BEAM_LOADER_TITLE: "Beam sweep",
      BEAM_LOADER_DESCRIPTION: "Shimmering beam sliding across a track.",
      STACK_BOUNCE_TITLE: "Stack bounce",
      STACK_BOUNCE_DESCRIPTION: "Stacked bars lifting one by one.",
      CLOCK_LOADER_TITLE: "Clock loader",
      CLOCK_LOADER_DESCRIPTION: "Two clock hands spinning independently.",
      PULSE_GRID_TITLE: "Pulse grid",
      PULSE_GRID_DESCRIPTION: "Grid of squares pulsing diagonally.",
      WAVE_ORB_TITLE: "Wave orb",
      WAVE_ORB_DESCRIPTION: "Radiating ring around a glowing orb.",
      DOT_TYPING_LOADER_TITLE: "Dot typing loader",
      DOT_TYPING_LOADER_DESCRIPTION: "Three dots hopping like a typing state.",
      BEAT_GRID_TITLE: "Beat grid",
      BEAT_GRID_DESCRIPTION: "Compact grid pulsing in a rhythm.",
      VERTICAL_MARQUEE_TITLE: "Vertical scroll",
      VERTICAL_MARQUEE_DESCRIPTION: "Smooth vertical scrolling text list.",
      TEXT_REVEAL_TITLE: "Text shine",
      TEXT_REVEAL_DESCRIPTION: "Animated gradient text effect.",
      NEWS_SCROLL_TITLE: "News ticker",
      NEWS_SCROLL_DESCRIPTION: "Breaking news style horizontal scroll."
    },
    SEARCH_LABEL: "Search animations",
    SEARCH_PLACEHOLDER: "Search by name or description...",
    FILTER_BY_TYPE: "Filter by type",
    ALL_TYPES: "All types",
    SHOWING_RESULTS: "Showing {count} of {total} animations",
    SEARCHING: "Searching...",
    NO_RESULTS: "No animations found",
    NO_RESULTS_HINT: "Try adjusting your search or filter to find what you're looking for",
    PREVIOUS: "Previous",
    NEXT: "Next",
    CATEGORY: {
      LOADERS: "Loaders",
      MARQUEE: "Marquee",
      EFFECTS: "Effects",
      TRANSITIONS: "Transitions",
      ORBITAL: "Orbital",
      INTERACTIVE: "Interactive",
      COMMUNITY: "Community"
    }
  },
  COMMON: {
    LANGUAGE: "Language",
    COPIED_TO_CLIPBOARD: "Copied to clipboard",
    COPY: "Copy",
    COPY_FAILED: "Failed to copy",
    SHARED_SUCCESS: "Shared successfully",
    SHARE_UNAVAILABLE: "Sharing is not available on this device",
    SAVE_SUCCESS: "Saved {entity} to your profile",
    SAVE_ERROR: "Failed to save {entity}. Please try again",
    AUTH_REQUIRED_TITLE: "Sign in to continue",
    AUTH_REQUIRED_DESCRIPTION: "Saving to your personal cabinet is only available for signed-in users.",
    AUTH_REQUIRED_CONFIRM: "Sign in",
    AUTH_REQUIRED_CLOSE: "Close",
    ALREADY_SAVED: "{entity} already exists in your profile",
    SAVE: "Save",
    CANCEL: "Cancel",
    EXPORT: "Export",
    DOWNLOAD: "Download",
    PRO_EXPORT_TITLE: "Exporting is Pro-only",
    PRO_EXPORT_MESSAGE: "Exporting code is reserved for Pro and Premium users. Upgrade to access HTML and format downloads.",
    PRO_EXPORT_ACTION: "View plans"
  },
  FOOTER: {
    NAVIGATION: "Navigation",
    DOCUMENTATION: "Documentation",
    SETTINGS: "Settings",
    THEME: "Theme",
    LANGUAGE: "Language",
    DEVELOPED_BY: "Developed by",
    ALL_RIGHTS_RESERVED: "All rights reserved"
  },
  DOCS: {
    TOPICS_LABEL: "Subpages",
    TOPICS_TITLE: "Topics with live demos",
    TOPICS_SUBTITLE: "Each subpage is a concise how-to: a checklist, visual examples, and minimal code you can copy into Style Engine.",
    OPEN_TOPIC: "Open subpage",
    PLAYBOOK_LABEL: "Practice",
    PLAYBOOK_TITLE: "Mini playbook",
    PLAYBOOK_SUBTITLE: "Ready patterns — use as-is or tweak nearby in the generator.",
    CHECKLIST: "Checklist",
    DEMO: "Demo",
    PATTERNS: "Patterns",
    LINKS: "Quick links",
    OTHER_TOPICS: "Other sections",
    BACK: "Back to overview",
    COPY: "Copy code",
    PRIMER_LABEL: "Basics"
  },
  META: {
    HOME: "Style Engine - Home",
    GRADIENT: "Gradient Generator",
    SHADOW: "Shadow Generator",
    ANIMATION: "Animation Generator",
    ABOUT: "About Style Engine",
    PRIVACY: "Privacy Policy",
    COOKIE: "Cookie Policy",
    DOCS: "CSS Guide",
    DOCS_GRADIENTS: "Gradient Guide",
    DOCS_SHADOWS: "Shadow Guide",
    DOCS_ANIMATIONS: "Animation Guide",
    PROFILE: "Profile",
    AUTH: "Sign In",
    MODERATION: "Moderation",
    NOT_FOUND: "Page Not Found"
  },
  META_DESCRIPTION: {
    HOME: "Style Engine is a CSS lab with generators for gradients, shadows, and animations plus live preview and clean code export.",
    GRADIENT: "Design linear, radial, and conic CSS gradients, preview them instantly, and copy production-ready code.",
    SHADOW: "Compose layered CSS drop shadows with full control over blur, spread, and colors, then export the styles.",
    ANIMATION: "Prototype CSS animations with instant preview and prepare keyframes for your UI.",
    ABOUT: "About Style Engine: plans, premium tiers, and community members with live stats.",
    DOCS: "Clear CSS guide with subpages for gradients, shadows, and animations plus animated examples.",
    DOCS_GRADIENTS: "Gradient recipes with angles, stops, and layered backgrounds you can paste into Style Engine.",
    DOCS_SHADOWS: "Layered shadow presets with glow, outline, and hover micro-interactions.",
    DOCS_ANIMATIONS: "Reusable keyframes with easing suggestions and stagger timings for production UI.",
    PROFILE: "Manage your Style Engine profile and saved presets.",
    AUTH: "Sign in to sync your Style Engine presets and get a personalized experience.",
    MODERATION: "Review and approve community submissions for gradients, shadows, and animations.",
    NOT_FOUND: "The page was not found. Jump back to the generators and keep experimenting.",
    PRIVACY: "Style Engine privacy policy: what data we collect, how we use it, and how to contact us.",
    COOKIE: "Cookie policy: how Style Engine uses cookies, how to control them, and what it means for you."
  },
  NOT_FOUND: {
    TAG: "Lost in the CSS nebula",
    TITLE: "This route vanished",
    HIGHLIGHT: "Let’s get you back to the lab",
    DESCRIPTION: "We couldn’t find this page. Jump to the generators, docs, or home to keep building gradients, shadows, and motion.",
    BADGE: "Missing route",
    CTA_HOME: "Back to home",
    CTA_DOCS: "Open docs",
    SHORTCUTS: "Jump to",
    CTA_GRADIENT: "Gradient lab",
    CTA_SHADOW: "Shadow lab",
    CTA_ANIMATION: "Animation library"
  },
  PRIVACY: {
    NAV: "Privacy Policy",
    TAG: "Policies",
    TITLE: "Privacy policy",
    HIGHLIGHT: "How we protect your data",
    SUBTITLE: "We only collect what’s needed to run the generators, save your work, and improve Style Engine. Here’s what that means in practice.",
    PILL_CORE: "Data we collect",
    PILL_USE: "How we use it",
    PILL_RIGHTS: "Your choices",
    PILL_SECURITY: "Security",
    PILL_CONTACT: "Contact",
    SECTIONS: {
      DATA_TITLE: "What we collect",
      DATA_BODY: "We gather minimal data to deliver your account experience and improve our tools.",
      DATA_POINTS: [
        "Account details you provide: email, display name, password (hashed).",
        "Usage signals: saves, presets, language, theme, and non-identifying analytics.",
        "Support context if you contact us: messages and metadata you share."
      ],
      USE_TITLE: "How we use your data",
      USE_BODY: "We only process data to operate and evolve Style Engine—never to sell or share with advertisers.",
      USE_POINTS: [
        "Sync your saves across devices and keep your presets safe.",
        "Improve generators by understanding feature usage in aggregate.",
        "Send essential updates about changes, security, or your account."
      ],
      RIGHTS_TITLE: "Your rights & controls",
      RIGHTS_BODY: "You stay in control of your information. Tell us what you need and we’ll help.",
      RIGHTS_POINTS: [
        "Request a copy or deletion of your data at any time.",
        "Update email, name, and saved work from your profile.",
        "Opt out of non-essential emails via unsubscribe links."
      ],
      SECURITY_TITLE: "How we protect it",
      SECURITY_BODY: "We secure data with modern tooling and limit access to what’s necessary.",
      SECURITY_POINTS: [
        "Passwords are hashed; sensitive actions go over HTTPS.",
        "Access to infrastructure is restricted to authorized maintainers."
      ],
      CONTACT_TITLE: "Questions or requests?",
      CONTACT_BODY: "Email us at privacy (at) styleengine.dev and we’ll respond with the details you need or act on your request."
    }
  },
  COOKIE: {
    NAV: "Cookie Policy",
    TAG: "Policies",
    TITLE: "Cookie policy",
    HIGHLIGHT: "Keeping sessions smooth",
    SUBTITLE: "We use a light set of cookies to remember your preferences, keep you signed in, and measure what helps you most.",
    PILL_TYPES: "Types",
    PILL_CONTROL: "Control",
    PILL_USAGE: "Why we use cookies",
    PILL_CONTACT: "Contact",
    SECTIONS: {
      TYPES_TITLE: "What cookies we set",
      TYPES_BODY: "We keep it focused on reliability and personalization.",
      TYPES_POINTS: [
        "Essential: session, authentication, and security tokens.",
        "Preferences: language, theme, and UI layout choices.",
        "Analytics: aggregated usage to understand what to improve."
      ],
      CONTROL_TITLE: "How to control cookies",
      CONTROL_BODY: "You decide how cookies behave on your device.",
      CONTROL_POINTS: [
        "Use your browser settings to block or clear cookies at any time.",
        "Disable non-essential analytics via your browser or extensions.",
        "Declining cookies may sign you out or limit personalization."
      ],
      USE_TITLE: "What we do with them",
      USE_BODY: "Cookies keep sessions stable and help us improve the product.",
      USE_POINTS: [
        "Maintain your login so saves and presets stay in sync.",
        "Remember preferences so the UI matches your workflow."
      ],
      CONTACT_TITLE: "Need more details?",
      CONTACT_BODY: "Reach us at privacy (at) styleengine.dev for any cookie questions or changes."
    }
  },
  COOKIE_MODAL: {
    TAG: "Cookies",
    TITLE: "We use cookies to keep things smooth",
    DESCRIPTION: "They help keep you signed in, remember your preferences, and measure what features land. You control what happens next.",
    ACCEPT: "Accept cookies",
    DECLINE: "Not now"
  },
  AUTH: {
    LOGIN_TITLE: "Welcome Back",
    LOGIN_SUBTITLE: "Sign in to access your saved gradients, shadows, and animations",
    FORGOT_TITLE: "Reset password",
    FORGOT_SUBTITLE: "Enter your email and we'll send a reset link.",
    RESET_TITLE: "Create a new password",
    RESET_SUBTITLE: "Choose a strong password to secure your account.",
    RESET_SUCCESS: "Password updated. You can now sign in.",
    RESET_EMAIL_SENT: "If that email exists, we sent a reset link.",
    EMAIL_NOT_FOUND: "No account with this email. Please check and try again.",
    CHANGE_PASSWORD: "Change password",
    CURRENT_PASSWORD: "Current password",
    REGISTER_TITLE: "Create Account",
    REGISTER_SUBTITLE: "Join Style Engine to save and sync your creative work",
    EMAIL: "Email",
    PASSWORD: "Password",
    NEW_PASSWORD: "New password",
    CONFIRM_PASSWORD: "Confirm password",
    SEND_RESET: "Send reset link",
    SET_NEW_PASSWORD: "Set new password",
    CHANGE_PASSWORD_BUTTON: "Update password",
    NAME: "Name (optional)",
    LOGIN_BUTTON: "Sign In",
    REGISTER_BUTTON: "Create Account",
    FORGOT_PASSWORD: "Forgot password?",
    NO_ACCOUNT: "Don't have an account?",
    HAS_ACCOUNT: "Already have an account?",
    SIGN_UP: "Sign up",
    SIGN_IN: "Sign in",
    OR_CONTINUE: "or continue with",
    SIGNING_IN: "Signing in...",
    CREATING_ACCOUNT: "Creating account..."
  },
  VALIDATION: {
    EMAIL_REQUIRED: "Email is required",
    EMAIL_INVALID: "Please enter a valid email address",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_MIN: "Password must be at least 8 characters",
    PASSWORD_MISMATCH: "Passwords do not match",
    NAME_MIN: "Name must be at least 1 character",
    NAME_MAX: "Name must be less than 120 characters",
    SERVER_ERROR: "Something went wrong. Please try again",
    USER_EXISTS: "User with this email already exists",
    INVALID_CREDENTIALS: "Invalid email or password"
  },
  PROFILE: {
    TITLE: "Profile",
    SUBTITLE: "Manage your account settings and preferences",
    EDIT_PROFILE: "Edit Profile",
    CHANGE_AVATAR: "Change Avatar",
    UPLOAD_AVATAR: "Upload new avatar",
    REMOVE_AVATAR: "Remove avatar",
    SAVE_CHANGES: "Save Changes",
    CANCEL: "Cancel",
    SAVING: "Saving...",
    NAME_LABEL: "Display Name",
    EMAIL_LABEL: "Email",
    MEMBER_SINCE: "Member since",
    SAVED_ITEMS: "Saved Items",
    SAVED_GRADIENTS: "Gradients",
    SAVED_SHADOWS: "Shadows",
    SAVED_ANIMATIONS: "Animations",
    UPLOAD_HINT: "JPG, PNG or GIF (max. 2MB)",
    UPLOAD_ERROR: "Failed to upload image. Please try again",
    UPLOAD_SIZE_ERROR: "Image is too large. Maximum size is 2MB",
    UPLOAD_FORMAT_ERROR: "Invalid file format. Please upload JPG, PNG or GIF",
    SAVE_SUCCESS: "Profile updated successfully",
    SAVES_TITLE: "Your saved work",
    SAVES_SUBTITLE: "Gradients, shadows, and animations saved to your account",
    PLAN_FREE: "Free plan",
    PLAN_PRO: "Paid plan",
    TAB_GRADIENTS: "Gradients",
    TAB_SHADOWS: "Shadows",
    TAB_ANIMATIONS: "Animations",
    SAVES_LOADING: "Loading saved items...",
    SAVES_EMPTY: "Nothing saved here yet.",
    LOAD_SAVES_ERROR: "Failed to load saved items",
    STATUS_PRIVATE: "Draft",
    STATUS_PENDING: "Pending moderation",
    STATUS_APPROVED: "Published",
    SAVED_AT: "Saved on",
    PUBLISH: "Send to publish",
    PUBLISHING: "Sending...",
    DUPLICATE_LOCAL: "Already saved locally",
    DUPLICATE_PUBLIC: "Already published publicly",
    PENDING_REVIEW: "Waiting for approval",
    APPROVED: "Published",
    FREE_LIMIT: "Free plan: up to 3 saves per type",
    PUBLISH_ERROR: "Failed to send to moderation",
    PUBLISH_SUCCESS: "Sent for moderation",
    DUPLICATE_EXISTS: "This item already exists in public collection",
    COPY: "Copy CSS",
    COPY_CSS: "Copy CSS code to clipboard",
    COPIED: "CSS copied to clipboard",
    COPY_ERROR: "Failed to copy CSS",
    NAV_GRADIENTS: "Saved gradients",
    NAV_SHADOWS: "Saved shadows",
    NAV_ANIMATIONS: "Saved animations",
    MODERATION_LINK: "Moderation queue",
    USER_MANAGEMENT_LINK: "User management",
    SUBSCRIPTION_UNTIL: "Subscription until",
    SUBSCRIPTION_FOREVER: "Lifetime access",
    DELETE: "Delete",
    DELETING: "Deleting...",
    DELETE_CONFIRM: 'Are you sure you want to delete "{name}"? This action cannot be undone.',
    DELETE_SUCCESS: "Item deleted successfully",
    DELETE_ERROR: "Failed to delete item",
    PASSWORD_SECTION_TITLE: "Password",
    PASSWORD_SECTION_SUBTITLE: "Update your password to keep your account secure.",
    CHANGE_PASSWORD_SUCCESS: "Password updated successfully.",
    CHANGE_PASSWORD_ERROR: "Failed to update password. Check your current password and try again.",
    PRO_LIMIT_TITLE: "Pro storage limit reached",
    PRO_LIMIT_MESSAGE: "Pro users can save up to {limit} items within {entity}. Upgrade to Premium for unlimited storage.",
    PRO_LIMIT_ACTION: "Upgrade to Premium"
  },
  MODERATION: {
    TITLE: "Moderation queue",
    SUBTITLE: "Approve community gradients, shadows, and animations",
    USERS_TAG: "Community accounts",
    USERS_INTRO: "Filter and sort every plan tier before editing credentials or revoking access.",
    USERS_COUNT: "{count} accounts loaded",
    USER_MODAL_DURATION: "Subscription duration",
    USER_MODAL_DURATION_MONTH: "1 month",
    USER_MODAL_DURATION_FOREVER: "Lifetime",
    REFRESH: "Refresh",
    LOADING: "Loading...",
    EMPTY: "No items waiting for review.",
    LOAD_ERROR: "Failed to load moderation queue",
    APPROVE: "Approve",
    APPROVING: "Approving...",
    APPROVE_ERROR: "Failed to approve item",
    SUBMITTED: "Submitted",
    CATEGORY_GRADIENT: "Gradient",
    CATEGORY_SHADOW: "Shadow",
    CATEGORY_ANIMATION: "Animation",
    USERS_TITLE: "User management",
    USERS_SUBTITLE: "Update accounts, rename emails, and adjust subscription tiers.",
    USERS_FILTER_LABEL: "Plan",
    USERS_FILTER_ALL: "All plans",
    USERS_TABLE: {
      EMAIL: "Email",
      NAME: "Name",
      PLAN: "Plan",
      CREATED: "Created",
      ACTIONS: "Actions"
    },
    EDIT: "Edit",
    DELETE: "Remove",
    UNIT: {
      FREE: "Free",
      PRO: "Pro",
      PREMIUM: "Premium"
    },
    USER_MODAL_TITLE: "Edit user",
    USER_MODAL_SUBTITLE: "Update email, name, password, or plan for this account.",
    USER_MODAL_PASSWORD: "New password",
    USER_MODAL_PASSWORD_HINT: "Leave blank to keep the current password.",
    USER_MODAL_SAVE: "Save changes",
    USER_UPDATE_SUCCESS: "User updated successfully",
    USER_UPDATE_ERROR: "Failed to update user",
    USER_DELETE_SUCCESS: "User removed",
    USER_DELETE_ERROR: "Failed to remove user",
    DELETE_CONFIRM: "Delete the account for {name}? This cannot be undone."
  },
  ABOUT: {
    PAGE_TAG: "About us",
    PAGE_TITLE: "Style Engine is built with our community",
    PAGE_TITLE_HIGHLIGHT: "Celebrating premium creators and motion designers on every screen.",
    PAGE_SUBTITLE: "Choose a plan that fits and meet the people building with us.",
    MISSION_TAG: "Why this exists",
    MISSION_TITLE: "We ship Style Engine so teams can design motion without friction",
    MISSION_TEXT: "This site is our lab for gradients, shadows, and motion recipes with live previews and copy-paste code. We keep experiments fast so designers and developers can stay in flow together.",
    MISSION_POINT_1_TITLE: "Our goal",
    MISSION_POINT_1_TEXT: "Evolve the generators into a shared canvas for teaching motion systems, documenting styling decisions, and publishing reusable effects.",
    MISSION_POINT_2_TITLE: "What we are building next",
    MISSION_POINT_2_TEXT: "More live presets, collaboration spaces, and export formats so teams can move from exploration to production in minutes.",
    MISSION_POINT_3_TITLE: "Why your support matters",
    MISSION_POINT_3_TEXT: "Every subscription keeps the playground online, funds new animation packs, and lets us reward community creators for their recipes.",
    PLANS_TAG: "Plans",
    PLANS_TITLE: "Plans that scale with you",
    PLANS_SUBTITLE: "Start free and upgrade when you need more saves, exports, and support.",
    COMMUNITY_TAG: "Community",
    COMMUNITY_TITLE: "People using Style Engine",
    COMMUNITY_SUBTITLE: "Premium creators are shown first, then Pro, then everyone else. Filter by tier, sort any column, and keep loading more.",
    OUR_COMMUNITY: "Community spotlight",
    COMMUNITY_DESCRIPTION: "Premium members are highlighted first, then Pro users, then everyone else.",
    TOTAL_USERS: "{count} people total",
    LOADING_USERS: "Loading members...",
    LOADING_MORE: "Loading more people...",
    NO_USERS: "No users yet — invite your team!",
    ERROR_LOADING: "Failed to load users. Try again.",
    LOAD_MORE: "Load more",
    FILTER: {
      ALL: "All users",
      FREE: "Free",
      PRO: "Pro",
      PREMIUM: "Premium"
    },
    TABLE: {
      AVATAR: "Photo",
      NAME: "Name",
      EMAIL: "Email",
      JOINED: "Joined",
      STATUS: "Status"
    },
    TIER: {
      FREE: "Free",
      PRO: "Pro",
      PREMIUM: "Premium"
    }
  },
  PRICING: {
    TITLE: "Choose Your Plan",
    SUBTITLE: "Unlock unlimited creativity with Style Engine Pro",
    MONTHLY: "Monthly",
    POPULAR: "Most Popular",
    CURRENT_PLAN: "Current Plan",
    UPGRADE: "Upgrade",
    GET_STARTED: "Get Started",
    FREE_TEMPLATES: "Up to 5 saved templates per type",
    BASIC_GENERATORS: "Access to all generators",
    CSS_EXPORT: "CSS code export",
    COMMUNITY_SUPPORT: "Community support",
    PRO_TEMPLATES: "Up to 50 saved templates per type",
    ALL_GENERATORS: "All generators & features",
    MULTIPLE_EXPORTS: "Export to CSS, SCSS, JSON",
    HISTORY_30_DAYS: "30 days version history",
    AI_GENERATIONS: "100 AI generations per month",
    PRIORITY_SUPPORT: "Priority email support",
    UNLIMITED_TEMPLATES: "Unlimited saved templates",
    ALL_EXPORTS: "Export to all formats",
    UNLIMITED_HISTORY: "Unlimited version history",
    UNLIMITED_AI: "Unlimited AI generations",
    FIGMA_SKETCH_EXPORT: "Figma & Sketch plugin export",
    TEAM_COLLABORATION: "Team collaboration features",
    PREMIUM_SUPPORT: "Premium 24/7 support",
    EARLY_ACCESS: "Early access to new features",
    LIMIT_REACHED_TITLE: "Template Limit Reached",
    LIMIT_REACHED_MESSAGE: "You have reached the maximum of {limit} saved {type} templates on the Free plan.",
    LIMIT_UPGRADE_MESSAGE: "Upgrade to Pro to save up to 50 templates, or Premium for unlimited storage.",
    PRO_LIMIT_TITLE: "Pro storage limit reached",
    PRO_LIMIT_MESSAGE: "Pro users can save up to {limit} items within {entity}. Upgrade to Premium for unlimited storage.",
    PRO_LIMIT_ACTION: "Upgrade to Premium",
    DELETE_TEMPLATE: "Delete a Template",
    OR: "or",
    VIEW_PLANS: "View Plans",
    MANAGE_TEMPLATES: "Manage Templates",
    CLOSE: "Close"
  }
};
const AVAILABLE_LOCALES = ["uk", "en"];
const hasWindow = typeof window !== "undefined";
function getLocaleFromPath(path) {
  const targetPath = hasWindow ? window.location.pathname : "";
  const pathParts = targetPath.split("/").filter(Boolean);
  const localeFromPath = pathParts.find((part) => AVAILABLE_LOCALES.includes(part));
  return localeFromPath || "en";
}
const pathLocale = getLocaleFromPath();
hasWindow ? localStorage.getItem("locale") ?? void 0 : void 0;
hasWindow ? navigator.language.split("-")[0] : "en";
const defaultLocale = pathLocale;
const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: "en",
  messages: {
    uk,
    en
  }
});
function setLocale(locale) {
  i18n.global.locale.value = locale;
  if (hasWindow) {
    localStorage.setItem("locale", locale);
    document.documentElement.setAttribute("lang", locale);
  }
}
if (hasWindow) {
  document.documentElement.setAttribute("lang", defaultLocale);
}
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "Logo",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_link = resolveComponent("router-link");
      _push(ssrRenderComponent(_component_router_link, mergeProps({
        to: "/",
        class: "logo"
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(Icon, {
              name: "icon-logo",
              size: 40,
              class: "logo__icon"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(Icon, {
                name: "icon-logo",
                size: 40,
                class: "logo__icon"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/shared/ui/logo/Logo.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const Logo = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-b6116d47"]]);
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "Footer",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const currentYear = computed(() => (/* @__PURE__ */ new Date()).getFullYear());
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-1514795e><div class="container" data-v-1514795e><div class="footer__content" data-v-1514795e><div class="footer__brand" data-v-1514795e>`);
      _push(ssrRenderComponent(Logo, { class: "footer__logo" }, null, _parent));
      _push(`<h3 class="footer__brand-title" data-v-1514795e>Style Engine</h3><p class="footer__brand-description" data-v-1514795e>${ssrInterpolate(unref(t)("HOME.SUBTITLE"))}</p></div><div class="footer__section" data-v-1514795e><h4 class="footer__section-title" data-v-1514795e>${ssrInterpolate(unref(t)("FOOTER.NAVIGATION"))}</h4><nav class="footer__nav" data-v-1514795e>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/gradient",
        "class-name": "footer__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("NAV.GRADIENTS"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("NAV.GRADIENTS")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/shadow",
        "class-name": "footer__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("NAV.SHADOWS"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("NAV.SHADOWS")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/animation",
        "class-name": "footer__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("NAV.ANIMATIONS"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("NAV.ANIMATIONS")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/about",
        "class-name": "footer__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("NAV.ABOUT"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("NAV.ABOUT")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div><div class="footer__section" data-v-1514795e><h4 class="footer__section-title" data-v-1514795e>${ssrInterpolate(unref(t)("FOOTER.DOCUMENTATION"))}</h4><nav class="footer__nav" data-v-1514795e>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/docs",
        "class-name": "footer__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("NAV.DOCS"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("NAV.DOCS")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/privacy-policy",
        "class-name": "footer__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("PRIVACY.NAV"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("PRIVACY.NAV")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/cookie-policy",
        "class-name": "footer__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("COOKIE.NAV"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("COOKIE.NAV")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></div><div class="footer__section" data-v-1514795e><h4 class="footer__section-title" data-v-1514795e>${ssrInterpolate(unref(t)("FOOTER.SETTINGS"))}</h4><div class="footer__settings" data-v-1514795e><div class="footer__setting" data-v-1514795e><span class="footer__setting-label" data-v-1514795e>${ssrInterpolate(unref(t)("FOOTER.THEME"))}</span>`);
      _push(ssrRenderComponent(ThemeSwitcher, null, null, _parent));
      _push(`</div><div class="footer__setting" data-v-1514795e><span class="footer__setting-label" data-v-1514795e>${ssrInterpolate(unref(t)("FOOTER.LANGUAGE"))}</span>`);
      _push(ssrRenderComponent(unref(LanguageSwitcher), null, null, _parent));
      _push(`</div></div></div></div><div class="footer__bottom" data-v-1514795e><div class="footer__divider" data-v-1514795e></div><div class="footer__bottom-content" data-v-1514795e><p class="footer__copyright" data-v-1514795e> © ${ssrInterpolate(currentYear.value)} Style Engine. ${ssrInterpolate(unref(t)("FOOTER.ALL_RIGHTS_RESERVED"))}</p><p class="footer__author" data-v-1514795e>${ssrInterpolate(unref(t)("FOOTER.DEVELOPED_BY"))} <a href="https://github.com/dmitriy-hulak" target="_blank" rel="noopener noreferrer" class="footer__author-link" data-v-1514795e> Dmitriy Hulak </a></p></div></div></div></footer>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/common/footer/Footer.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const Footer = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-1514795e"]]);
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "GeneratorLayout",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "generator-layout" }, _attrs))} data-v-e452dfa4>`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(`<main class="generator-layout__content" data-v-e452dfa4>`);
      _push(ssrRenderComponent(unref(RouterView), null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/app/layouts/generator-layout/GeneratorLayout.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const GeneratorLayout = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-e452dfa4"]]);
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "DocsLayout",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "docs-layout" }, _attrs))} data-v-09620c6f>`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(`<main class="docs-layout__content" data-v-09620c6f>`);
      _push(ssrRenderComponent(unref(RouterView), null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/app/layouts/docs-layout/DocsLayout.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const DocsLayout = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-09620c6f"]]);
const mainLayoutChildren = [
  {
    path: "",
    name: "home",
    component: () => import("./assets/HomePage-BrHzv2bj.js"),
    meta: { titleKey: "META.HOME", descriptionKey: "META_DESCRIPTION.HOME" }
  },
  {
    path: "about",
    name: "about",
    component: () => import("./assets/AboutPage-Dp8WRRs2.js"),
    meta: { titleKey: "META.ABOUT", descriptionKey: "META_DESCRIPTION.ABOUT" }
  },
  {
    path: "privacy-policy",
    name: "privacy-policy",
    component: () => import("./assets/PrivacyPolicyPage-D8lwMCbX.js"),
    meta: { titleKey: "META.PRIVACY", descriptionKey: "META_DESCRIPTION.PRIVACY" }
  },
  {
    path: "cookie-policy",
    name: "cookie-policy",
    component: () => import("./assets/CookiePolicyPage-m04RRI05.js"),
    meta: { titleKey: "META.COOKIE", descriptionKey: "META_DESCRIPTION.COOKIE" }
  },
  {
    path: "profile",
    name: "profile",
    component: () => import("./assets/ProfilePage-DpIQjTzL.js"),
    meta: { titleKey: "META.PROFILE", descriptionKey: "META_DESCRIPTION.PROFILE", requiresAuth: true },
    children: [
      {
        path: "gradients",
        name: "profile-gradients",
        component: () => import("./assets/SavedGradientsPage-Nvzd3fgt.js"),
        meta: { requiresAuth: true }
      },
      {
        path: "shadows",
        name: "profile-shadows",
        component: () => import("./assets/SavedShadowsPage-NvErVRTS.js"),
        meta: { requiresAuth: true }
      },
      {
        path: "animations",
        name: "profile-animations",
        component: () => import("./assets/SavedAnimationsPage-Tal0mRl9.js"),
        meta: { requiresAuth: true }
      }
    ]
  }
];
const generatorLayoutRoutes = [
  {
    path: "gradient",
    component: GeneratorLayout,
    children: [
      {
        path: "",
        name: "gradient",
        component: () => import("./assets/GradientPage-BmZP4xcl.js"),
        meta: { titleKey: "META.GRADIENT", descriptionKey: "META_DESCRIPTION.GRADIENT" }
      }
    ]
  },
  {
    path: "shadow",
    component: GeneratorLayout,
    children: [
      {
        path: "",
        name: "shadow",
        component: () => import("./assets/ShadowPage-HC1U95F0.js"),
        meta: { titleKey: "META.SHADOW", descriptionKey: "META_DESCRIPTION.SHADOW" }
      }
    ]
  },
  {
    path: "animation",
    component: GeneratorLayout,
    children: [
      {
        path: "",
        name: "animation",
        component: () => import("./assets/AnimationPage-BCvvLagz.js"),
        meta: { titleKey: "META.ANIMATION", descriptionKey: "META_DESCRIPTION.ANIMATION" }
      },
      {
        path: ":id",
        name: "animation-detail",
        component: () => import("./assets/AnimationDetailPage-BPJgPHLS.js"),
        meta: { titleKey: "META.ANIMATION", descriptionKey: "META_DESCRIPTION.ANIMATION" }
      }
    ]
  }
];
const authLayoutRoutes = [
  {
    path: "login",
    name: "login",
    component: () => import("./assets/LoginPage-CrZyV2-7.js"),
    meta: { titleKey: "META.AUTH", descriptionKey: "META_DESCRIPTION.AUTH", guestOnly: true }
  },
  {
    path: "register",
    name: "register",
    component: () => import("./assets/RegisterPage-DhkHqILd.js"),
    meta: { titleKey: "META.AUTH", descriptionKey: "META_DESCRIPTION.AUTH", guestOnly: true }
  },
  {
    path: "forgot-password",
    name: "forgot-password",
    component: () => import("./assets/ForgotPasswordPage-DeWhwgJm.js"),
    meta: { titleKey: "META.AUTH", descriptionKey: "META_DESCRIPTION.AUTH", guestOnly: true }
  },
  {
    path: "reset-password",
    name: "reset-password",
    component: () => import("./assets/ResetPasswordPage-BvruvV-H.js"),
    meta: { titleKey: "META.AUTH", descriptionKey: "META_DESCRIPTION.AUTH", guestOnly: true }
  }
];
const baseRoutes = [
  { path: "", component: () => Promise.resolve().then(() => MainLayout$1), children: mainLayoutChildren },
  ...generatorLayoutRoutes,
  ...authLayoutRoutes,
  {
    path: "moderation",
    name: "moderation",
    component: () => import("./assets/ModerationPage-FiO74JPT.js"),
    meta: {
      titleKey: "META.MODERATION",
      descriptionKey: "META_DESCRIPTION.MODERATION",
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: "moderation/users",
    name: "moderation-users",
    component: () => import("./assets/UserManagementPage-YOy6eM43.js"),
    meta: {
      titleKey: "MODERATION.USERS_TITLE",
      descriptionKey: "MODERATION.USERS_SUBTITLE",
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: "docs",
    component: DocsLayout,
    children: [
      {
        path: "",
        name: "docs",
        component: () => import("./assets/DocsPage-04Gm-qVy.js"),
        meta: { titleKey: "META.DOCS", descriptionKey: "META_DESCRIPTION.DOCS" }
      },
      {
        path: ":topic",
        name: "docs-topic",
        component: () => import("./assets/DocsTopicPage-Dghz2Y2d.js"),
        props: (route) => ({ topic: route.params.topic }),
        meta: { titleKey: "META.DOCS", descriptionKey: "META_DESCRIPTION.DOCS" }
      }
    ]
  }
];
function localizeChildren(children, locale) {
  return children == null ? void 0 : children.map((child) => {
    const localizedChild = {
      ...child,
      name: child.name ? `${locale}-${String(child.name)}` : void 0
    };
    if (child.children) {
      localizedChild.children = localizeChildren(child.children, locale);
    }
    return localizedChild;
  });
}
function applyLocalePrefix(locale, routes2) {
  const localizedRoutes2 = routes2.map((route) => {
    const basePath = typeof route.path === "string" ? route.path : "";
    return {
      ...route,
      path: `/${locale}/${basePath}`.replace(/\/$/, "") || `/${locale}`,
      name: route.name ? `${locale}-${String(route.name)}` : void 0,
      children: localizeChildren(route.children, locale)
    };
  });
  return localizedRoutes2;
}
const scrollBehavior = (_to, _from, savedPosition) => {
  if (savedPosition) {
    return { ...savedPosition, behavior: "smooth" };
  }
  if (_to.path !== _from.path) {
    return { left: 0, top: 0, behavior: "smooth" };
  }
  return false;
};
const localizedRoutes = AVAILABLE_LOCALES.flatMap((locale) => applyLocalePrefix(locale, baseRoutes));
const notFoundRoute = {
  path: "/:pathMatch(.*)*",
  component: () => Promise.resolve().then(() => MainLayout$1),
  children: [
    {
      path: "",
      name: "not-found",
      component: () => import("./assets/NotFoundPage-B_lF9qO3.js"),
      meta: {
        titleKey: "META.NOT_FOUND",
        descriptionKey: "META_DESCRIPTION.NOT_FOUND",
        robots: "noindex, nofollow"
      }
    }
  ]
};
const appRoutes = [...localizedRoutes, notFoundRoute];
const routes = appRoutes;
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "LanguageSwitcher",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale, t } = useI18n();
    useRouter();
    useRoute();
    const isOpen = ref(false);
    const currentLocale = computed(() => locale.value);
    const languages = [
      { code: "uk", name: "Українська" },
      { code: "en", name: "English" }
    ];
    function closeDropdown() {
      isOpen.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_click_outside = resolveDirective("click-outside");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "language-switcher" }, _attrs))} data-v-a789b5a5><button${ssrRenderAttrs(mergeProps({
        class: "language-switcher__trigger",
        title: unref(t)("COMMON.LANGUAGE")
      }, ssrGetDirectiveProps(_ctx, _directive_click_outside, closeDropdown)))} data-v-a789b5a5><span class="language-switcher__current" data-v-a789b5a5>${ssrInterpolate(currentLocale.value.toUpperCase())}</span>`);
      _push(ssrRenderComponent(unref(Icon), {
        name: "icon-chevron-down",
        size: 12,
        class: ["language-switcher__arrow", { "language-switcher__arrow_open": isOpen.value }]
      }, null, _parent));
      _push(`</button>`);
      if (isOpen.value) {
        _push(`<div class="language-switcher__dropdown" data-v-a789b5a5><!--[-->`);
        ssrRenderList(languages, (lang) => {
          _push(`<button class="${ssrRenderClass([{ "language-switcher__option_active": currentLocale.value === lang.code }, "language-switcher__option"])}" data-v-a789b5a5><span class="language-switcher__option-code" data-v-a789b5a5>${ssrInterpolate(lang.code.toUpperCase())}</span><span class="language-switcher__option-name" data-v-a789b5a5>${ssrInterpolate(lang.name)}</span></button>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/features/common/language-switcher/ui/language-switcher/LanguageSwitcher.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const LanguageSwitcher = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-a789b5a5"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "UserMenu",
  __ssrInlineRender: true,
  props: {
    user: {}
  },
  setup(__props) {
    const props = __props;
    useRouter();
    useAuthStore();
    const { t, locale } = useI18n();
    const isOpen = ref(false);
    const initials = computed(() => {
      const name = props.user.name || props.user.email;
      const names = name.split(" ");
      return names.map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    });
    const isPaidUser = computed(() => {
      return props.user.subscriptionTier === "pro" || props.user.subscriptionTier === "premium" || props.user.plan === "pro" || props.user.plan === "premium" || Boolean(props.user.isPayment);
    });
    const isPremiumUser = computed(() => {
      return props.user.subscriptionTier === "premium" || props.user.plan === "premium";
    });
    function closeMenu() {
      isOpen.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_click_outside = resolveDirective("click-outside");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "user-menu" }, _attrs, ssrGetDirectiveProps(_ctx, _directive_click_outside, closeMenu)))} data-v-fa69807d><button class="user-menu__trigger" data-v-fa69807d><div class="user-menu__avatar-wrapper" data-v-fa69807d><div class="${ssrRenderClass(["user-menu__avatar", { "user-menu__avatar_premium": isPremiumUser.value }])}" data-v-fa69807d>`);
      if (__props.user.avatarUrl) {
        _push(`<img${ssrRenderAttr("src", __props.user.avatarUrl)}${ssrRenderAttr("alt", __props.user.name || "User")} class="user-menu__avatar-img" data-v-fa69807d>`);
      } else {
        _push(`<span class="user-menu__avatar-initials" data-v-fa69807d>${ssrInterpolate(initials.value)}</span>`);
      }
      _push(`</div>`);
      if (isPaidUser.value) {
        _push(ssrRenderComponent(unref(Icon), {
          size: 12,
          class: ["user-menu__crown", { "user-menu__crown_premium": isPremiumUser.value }],
          name: "icon-crown"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><span class="user-menu__name" data-v-fa69807d>${ssrInterpolate(__props.user.name || __props.user.email)}</span>`);
      _push(ssrRenderComponent(unref(Icon), {
        size: 16,
        class: ["user-menu__arrow", { "user-menu__arrow_open": isOpen.value }],
        name: "icon-arrow-down"
      }, null, _parent));
      _push(`</button>`);
      if (isOpen.value) {
        _push(`<div class="user-menu__dropdown" data-v-fa69807d>`);
        _push(ssrRenderComponent(unref(NavLink), {
          to: `/${unref(locale)}/profile`,
          "class-name": "user-menu__item",
          onClick: closeMenu
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Icon), {
                size: 20,
                "class-name": "user-menu__item-icon",
                name: "icon-user"
              }, null, _parent2, _scopeId));
              _push2(`<span data-v-fa69807d${_scopeId}>${ssrInterpolate(unref(t)("NAV.PROFILE"))}</span>`);
            } else {
              return [
                createVNode(unref(Icon), {
                  size: 20,
                  "class-name": "user-menu__item-icon",
                  name: "icon-user"
                }),
                createVNode("span", null, toDisplayString(unref(t)("NAV.PROFILE")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="user-menu__divider" data-v-fa69807d></div><button class="user-menu__item user-menu__item_danger" data-v-fa69807d>`);
        _push(ssrRenderComponent(unref(Icon), {
          size: 20,
          "class-name": "user-menu__item-icon",
          name: "icon-logout"
        }, null, _parent));
        _push(`<span data-v-fa69807d>${ssrInterpolate(unref(t)("NAV.LOGOUT"))}</span></button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/common/user-menu/UserMenu.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const UserMenu = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-fa69807d"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Header",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const authStore = useAuthStore();
    const { t, locale } = useI18n();
    const isMobileMenuOpen = ref(false);
    const mobileMenuRef = ref(null);
    function closeMobileMenu() {
      isMobileMenuOpen.value = false;
    }
    function goToAuth() {
      closeMobileMenu();
      router.push(`/${locale.value}/login`);
    }
    function handleLogout() {
      authStore.logout();
      closeMobileMenu();
      router.push(`/${locale.value}`);
    }
    watch(isMobileMenuOpen, async (isOpen) => {
      if (isOpen) {
        await nextTick();
        if (mobileMenuRef.value) {
          disableBodyScroll(mobileMenuRef.value, {
            reserveScrollBarGap: true
          });
        }
      } else {
        clearAllBodyScrollLocks();
      }
    });
    onBeforeUnmount(() => {
      clearAllBodyScrollLocks();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "header" }, _attrs))} data-v-83b19cba><div class="container" data-v-83b19cba><div class="header__content" data-v-83b19cba>`);
      _push(ssrRenderComponent(Logo, null, null, _parent));
      _push(`<nav class="header__nav" data-v-83b19cba>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: `/${unref(locale)}/gradient`,
        "class-name": "header__nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("NAV.GRADIENTS"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("NAV.GRADIENTS")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(NavLink), {
        to: `/${unref(locale)}/shadow`,
        "class-name": "header__nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("NAV.SHADOWS"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("NAV.SHADOWS")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(NavLink), {
        to: `/${unref(locale)}/animation`,
        "class-name": "header__nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("NAV.ANIMATIONS"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("NAV.ANIMATIONS")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(NavLink), {
        to: `/${unref(locale)}/docs`,
        "class-name": "header__nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("NAV.DOCS"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("NAV.DOCS")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(NavLink), {
        to: `/${unref(locale)}/about`,
        "class-name": "header__nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("NAV.ABOUT"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("NAV.ABOUT")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav><div class="header__actions" data-v-83b19cba>`);
      _push(ssrRenderComponent(unref(ThemeSwitcher), null, null, _parent));
      _push(ssrRenderComponent(unref(LanguageSwitcher), null, null, _parent));
      if (unref(authStore).isAuthenticated && unref(authStore).user) {
        _push(ssrRenderComponent(UserMenu, {
          user: unref(authStore).user
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Button), {
          size: "sm",
          variant: "outline",
          onClick: goToAuth
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("NAV.LOGIN"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("NAV.LOGIN")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`</div><button class="header__mobile-toggle" data-v-83b19cba>`);
      if (!isMobileMenuOpen.value) {
        _push(ssrRenderComponent(unref(Icon), {
          size: 24,
          name: "icon-menu"
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(Icon), {
          size: 24,
          name: "icon-close"
        }, null, _parent));
      }
      _push(`</button></div></div>`);
      if (isMobileMenuOpen.value) {
        _push(`<div class="header__mobile-menu" data-v-83b19cba><nav class="header__mobile-nav" data-v-83b19cba>`);
        _push(ssrRenderComponent(unref(NavLink), {
          to: `/${unref(locale)}/gradient`,
          "class-name": "header__mobile-link",
          onClick: closeMobileMenu
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("NAV.GRADIENTS"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("NAV.GRADIENTS")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(NavLink), {
          to: `/${unref(locale)}/shadow`,
          "class-name": "header__mobile-link",
          onClick: closeMobileMenu
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("NAV.SHADOWS"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("NAV.SHADOWS")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(NavLink), {
          to: `/${unref(locale)}/animation`,
          "class-name": "header__mobile-link",
          onClick: closeMobileMenu
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("NAV.ANIMATIONS"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("NAV.ANIMATIONS")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(NavLink), {
          to: `/${unref(locale)}/docs`,
          "class-name": "header__mobile-link",
          onClick: closeMobileMenu
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("NAV.DOCS"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("NAV.DOCS")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(unref(NavLink), {
          to: `/${unref(locale)}/about`,
          "class-name": "header__mobile-link",
          onClick: closeMobileMenu
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("NAV.ABOUT"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("NAV.ABOUT")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</nav><div class="header__mobile-actions" data-v-83b19cba>`);
        _push(ssrRenderComponent(unref(ThemeSwitcher), null, null, _parent));
        _push(ssrRenderComponent(unref(LanguageSwitcher), null, null, _parent));
        if (unref(authStore).isAuthenticated && unref(authStore).user) {
          _push(`<!--[-->`);
          _push(ssrRenderComponent(unref(NavLink), {
            to: `/${unref(locale)}/profile`,
            "class-name": "header__mobile-link",
            onClick: closeMobileMenu
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("NAV.PROFILE"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("NAV.PROFILE")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(ssrRenderComponent(unref(Button), {
            size: "md",
            variant: "danger",
            style: { "width": "100%" },
            onClick: handleLogout
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("NAV.LOGOUT"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("NAV.LOGOUT")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`<!--]-->`);
        } else {
          _push(ssrRenderComponent(unref(Button), {
            size: "md",
            variant: "primary",
            style: { "width": "100%" },
            onClick: goToAuth
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(t)("NAV.LOGIN"))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(t)("NAV.LOGIN")), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</header>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/common/header/Header.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const Header = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-83b19cba"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MainLayout",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "main-layout" }, _attrs))} data-v-cdea11d0>`);
      _push(ssrRenderComponent(Header, null, null, _parent));
      _push(`<main class="main-layout__content" data-v-cdea11d0>`);
      _push(ssrRenderComponent(unref(RouterView), null, null, _parent));
      _push(`</main>`);
      _push(ssrRenderComponent(Footer, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/app/layouts/main-layout/MainLayout.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const MainLayout = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-cdea11d0"]]);
const MainLayout$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: MainLayout
}, Symbol.toStringTag, { value: "Module" }));
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AuthLayout",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "auth-layout" }, _attrs))} data-v-3eaf3ab0>`);
      _push(ssrRenderComponent(unref(RouterView), null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/app/layouts/auth-layout/AuthLayout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const clickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      var _a;
      if (!(el === event.target || el.contains(event.target))) {
        (_a = binding.value) == null ? void 0 : _a.call(binding);
      }
    };
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    if (el.clickOutsideEvent) {
      document.removeEventListener("click", el.clickOutsideEvent);
    }
  }
};
const SSG_PUBLIC_ROUTES = [
  "/",
  "/about",
  "/docs",
  "/docs/gradients",
  "/docs/shadows",
  "/docs/animations",
  "/gradient",
  "/shadow",
  "/animation",
  "/privacy-policy",
  "/cookie-policy"
];
const localizedSsgRoutes = AVAILABLE_LOCALES.flatMap(
  (locale) => SSG_PUBLIC_ROUTES.map((route) => `/${locale}${route === "/" ? "" : route}`)
);
const createApp = ViteSSG(
  _sfc_main$h,
  {
    routes,
    base: "/css-lab/",
    scrollBehavior
  },
  ({ app, router, head: existingHead }) => {
    const pinia = createPinia();
    const head = existingHead ?? createHead();
    app.use(pinia);
    app.use(i18n);
    if (!existingHead) {
      app.use(head);
    }
    app.use(Toast, {
      position: POSITION.BOTTOM_RIGHT,
      timeout: 2200,
      hideProgressBar: true,
      closeButton: false,
      transition: "Vue-Toastification__fade",
      maxToasts: 4,
      toastClassName: "se-toast",
      bodyClassName: "se-toast__body"
    });
    setupRouterGuards(router);
    app.directive("click-outside", clickOutside);
  }
);
export {
  AUTH_TOKEN_KEY as A,
  Button as B,
  GradientControls as G,
  Icon as I,
  Logo as L,
  Modal as M,
  NavLink as N,
  Select as S,
  Table as T,
  _export_sfc as _,
  Input as a,
  useTheme as b,
  copyToClipboard as c,
  createApp,
  useAuthStore as d,
  GradientPreview as e,
  GradientCodeExport as f,
  getCookie as g,
  GradientPresets as h,
  buildCreatorProfile as i,
  hexToRgb as j,
  ShadowCodeExport as k,
  ShadowControls as l,
  localizedSsgRoutes,
  ShadowPreview as m,
  ShadowPresets as n,
  randomHexColor as o,
  getCreatorAvatarStyle as p,
  getCreatorInitials as q,
  removeCookie as r,
  setCookie as s,
  getCreatorLabel as t,
  useApi as u,
  ThemeSwitcher as v,
  LanguageSwitcher as w
};
