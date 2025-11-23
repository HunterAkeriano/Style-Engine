import { defineComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderComponent } from "vue/server-renderer";
import { P as ProfileSavedList } from "./ProfileSavedList-CJO6VKw_.js";
import "vue-i18n";
import "vue-toastification";
import "../main.mjs";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "vue-router";
import "@unhead/vue";
import "body-scroll-lock-upgrade";
import "axios";
import "./saves-Czai1rJv.js";
import "./css-C6OGq8u0.js";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "SavedGradientsPage",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(ProfileSavedList, mergeProps({
        category: "gradient",
        titleKey: "PROFILE.NAV_GRADIENTS",
        subtitleKey: "PROFILE.SAVES_SUBTITLE"
      }, _attrs), null, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/profile/saved/SavedGradientsPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
