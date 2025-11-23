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
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "stack-bounce" }, _attrs))} data-v-c5b3467e><span data-v-c5b3467e></span><span data-v-c5b3467e></span><span data-v-c5b3467e></span></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/entities/animation/ui/animation-stack-bounce/AnimationStackBounce.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AnimationStackBounce = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-c5b3467e"]]);
export {
  AnimationStackBounce as default
};
