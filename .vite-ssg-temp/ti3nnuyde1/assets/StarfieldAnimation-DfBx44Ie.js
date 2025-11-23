import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
import { _ as _export_sfc } from "../main.mjs";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "starfield" }, _attrs))} data-v-155476aa><div class="starfield__layer starfield__layer_1" data-v-155476aa></div><div class="starfield__layer starfield__layer_2" data-v-155476aa></div><div class="starfield__layer starfield__layer_3" data-v-155476aa></div><div class="starfield__comet starfield__comet_1" data-v-155476aa></div><div class="starfield__comet starfield__comet_2" data-v-155476aa></div><div class="starfield__glow" data-v-155476aa></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/shared/ui/StarfieldAnimation/StarfieldAnimation.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const StarfieldAnimation = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-155476aa"]]);
export {
  StarfieldAnimation as S
};
