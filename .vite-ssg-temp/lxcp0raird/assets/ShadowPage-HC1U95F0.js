import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { N as NavLink, _ as _export_sfc } from "../main.mjs";
import { S as ShadowGenerationProcess } from "./ShadowGenerationProcess-CRCSNJb6.js";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "vue-toastification";
import "vue-router";
import "@unhead/vue";
import "body-scroll-lock-upgrade";
import "axios";
import "./css-C6OGq8u0.js";
import "./saves-Czai1rJv.js";
import "./pricing-DAHM4Bo5.js";
import "./save-quota-Bgxdrz7t.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ShadowPage",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "shadow-page" }, _attrs))} data-v-184653e2><div class="shadow-page__motion" aria-hidden="true" data-v-184653e2></div><div class="shadow-page__waves" aria-hidden="true" data-v-184653e2><div class="shadow-page__wave shadow-page__wave_1" data-v-184653e2></div><div class="shadow-page__wave shadow-page__wave_2" data-v-184653e2></div><div class="shadow-page__wave shadow-page__wave_3" data-v-184653e2></div></div><div class="container" data-v-184653e2><header class="shadow-page__header" data-v-184653e2><div data-v-184653e2><p class="shadow-page__eyebrow" data-v-184653e2>${ssrInterpolate(unref(t)("SHADOW.EYEBROW"))}</p><h1 class="shadow-page__title" data-v-184653e2>${ssrInterpolate(unref(t)("SHADOW.TITLE"))}</h1><p class="shadow-page__subtitle" data-v-184653e2>${ssrInterpolate(unref(t)("SHADOW.SUBTITLE"))}</p></div>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/",
        "class-name": "shadow-page__back-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← ${ssrInterpolate(unref(t)("SHADOW.BACK_TO_HOME"))}`);
          } else {
            return [
              createTextVNode("← " + toDisplayString(unref(t)("SHADOW.BACK_TO_HOME")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</header><div class="shadow-page__content" data-v-184653e2>`);
      _push(ssrRenderComponent(unref(ShadowGenerationProcess), null, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/shadow/ShadowPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ShadowPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-184653e2"]]);
export {
  ShadowPage as default
};
