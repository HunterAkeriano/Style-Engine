import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList } from "vue/server-renderer";
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
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "beat-grid" }, _attrs))} data-v-b86232bb><!--[-->`);
  ssrRenderList(12, (n) => {
    _push(`<span data-v-b86232bb></span>`);
  });
  _push(`<!--]--></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/entities/animation/ui/animation-beat-grid/AnimationBeatGrid.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AnimationBeatGrid = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-b86232bb"]]);
export {
  AnimationBeatGrid as default
};
