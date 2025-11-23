import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
import { _ as _export_sfc } from "../main.mjs";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "vue-toastification";
import "vue-router";
import "vue-i18n";
import "@unhead/vue";
import "body-scroll-lock-upgrade";
import "axios";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "liquid" }, _attrs))} data-v-a2843315><div class="liquid__wave liquid__wave_one" data-v-a2843315></div><div class="liquid__wave liquid__wave_two" data-v-a2843315></div><div class="liquid__wave liquid__wave_three" data-v-a2843315></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/entities/animation/ui/animation-liquid/AnimationLiquid.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AnimationLiquid = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-a2843315"]]);
export {
  AnimationLiquid as default
};
