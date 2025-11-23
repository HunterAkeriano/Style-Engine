import { defineComponent, mergeProps, unref, useSSRContext } from "vue";
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
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AnimationStaggerList",
  __ssrInlineRender: true,
  setup(__props) {
    const items = Array.from({ length: 5 }).map((_, i) => i);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<ul${ssrRenderAttrs(mergeProps({ class: "stagger-list" }, _attrs))} data-v-fc367180><!--[-->`);
      ssrRenderList(unref(items), (item) => {
        _push(`<li data-v-fc367180></li>`);
      });
      _push(`<!--]--></ul>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/entities/animation/ui/animation-stagger-list/AnimationStaggerList.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AnimationStaggerList = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fc367180"]]);
export {
  AnimationStaggerList as default
};
