import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { N as NavLink, _ as _export_sfc } from "../main.mjs";
import { G as GradientGenerationProcess } from "./ShadowGenerationProcess-CRCSNJb6.js";
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
  __name: "GradientPage",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "gradient-page" }, _attrs))} data-v-25a95f2d><div class="gradient-page__motion" aria-hidden="true" data-v-25a95f2d></div><div class="container" data-v-25a95f2d><header class="gradient-page__header" data-v-25a95f2d><div data-v-25a95f2d><h1 class="gradient-page__title" data-v-25a95f2d>${ssrInterpolate(unref(t)("GRADIENT.TITLE"))}</h1><p class="gradient-page__subtitle" data-v-25a95f2d>${ssrInterpolate(unref(t)("GRADIENT.SUBTITLE"))}</p></div>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/",
        "class-name": "gradient-page__back-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← ${ssrInterpolate(unref(t)("GRADIENT.BACK_TO_HOME"))}`);
          } else {
            return [
              createTextVNode("← " + toDisplayString(unref(t)("GRADIENT.BACK_TO_HOME")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</header><div class="gradient-page__content" data-v-25a95f2d>`);
      _push(ssrRenderComponent(unref(GradientGenerationProcess), null, null, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/gradient/GradientPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const GradientPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-25a95f2d"]]);
export {
  GradientPage as default
};
