import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { N as NavLink, _ as _export_sfc } from "../main.mjs";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "vue-toastification";
import "vue-router";
import "@unhead/vue";
import "body-scroll-lock-upgrade";
import "axios";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "NotFoundPage",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "not-found-page" }, _attrs))} data-v-913f121f><div class="not-found-page__bg" aria-hidden="true" data-v-913f121f></div><div class="not-found-page__container" data-v-913f121f><div class="not-found-page__visual" aria-hidden="true" data-v-913f121f><div class="not-found-page__glow not-found-page__glow_primary" data-v-913f121f></div><div class="not-found-page__glow not-found-page__glow_accent" data-v-913f121f></div><div class="not-found-page__grid" data-v-913f121f></div><div class="not-found-page__rings" data-v-913f121f><div class="not-found-page__ring not-found-page__ring_outer" data-v-913f121f></div><div class="not-found-page__ring not-found-page__ring_middle" data-v-913f121f></div><div class="not-found-page__ring not-found-page__ring_inner" data-v-913f121f></div></div><div class="not-found-page__orbit not-found-page__orbit_slow" data-v-913f121f><span class="not-found-page__dot not-found-page__dot_primary" data-v-913f121f></span></div><div class="not-found-page__orbit not-found-page__orbit_fast" data-v-913f121f><span class="not-found-page__dot not-found-page__dot_accent" data-v-913f121f></span></div><div class="not-found-page__holo" data-v-913f121f><span class="not-found-page__code-line" data-v-913f121f></span><span class="not-found-page__code-line not-found-page__code-line_short" data-v-913f121f></span><span class="not-found-page__code-line" data-v-913f121f></span></div><div class="not-found-page__badge" data-v-913f121f><span class="not-found-page__badge-label" data-v-913f121f>404</span><span class="not-found-page__badge-sub" data-v-913f121f>${ssrInterpolate(unref(t)("NOT_FOUND.BADGE"))}</span></div></div><div class="not-found-page__content" data-v-913f121f><p class="not-found-page__eyebrow" data-v-913f121f>${ssrInterpolate(unref(t)("NOT_FOUND.TAG"))}</p><h1 class="not-found-page__title" data-v-913f121f><span class="not-found-page__title-base" data-v-913f121f>${ssrInterpolate(unref(t)("NOT_FOUND.TITLE"))}</span><span class="not-found-page__title-highlight" data-v-913f121f>${ssrInterpolate(unref(t)("NOT_FOUND.HIGHLIGHT"))}</span></h1><p class="not-found-page__subtitle" data-v-913f121f>${ssrInterpolate(unref(t)("NOT_FOUND.DESCRIPTION"))}</p><div class="not-found-page__actions" data-v-913f121f>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/",
        "class-name": "not-found-page__cta not-found-page__cta_primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("NOT_FOUND.CTA_HOME"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("NOT_FOUND.CTA_HOME")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/docs",
        "class-name": "not-found-page__cta not-found-page__cta_ghost"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("NOT_FOUND.CTA_DOCS"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("NOT_FOUND.CTA_DOCS")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="not-found-page__shortcuts" aria-label="Quick links" data-v-913f121f><span class="not-found-page__shortcut-label" data-v-913f121f>${ssrInterpolate(unref(t)("NOT_FOUND.SHORTCUTS"))}</span><div class="not-found-page__chips" data-v-913f121f>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/gradient",
        "class-name": "not-found-page__chip"
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
        "class-name": "not-found-page__chip"
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
        "class-name": "not-found-page__chip"
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
      _push(`</div></div></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/not-found/NotFoundPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const NotFoundPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-913f121f"]]);
export {
  NotFoundPage as default
};
