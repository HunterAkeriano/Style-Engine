import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderStyle } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { L as Logo, N as NavLink, _ as _export_sfc } from "../main.mjs";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "vue-toastification";
import "vue-router";
import "@unhead/vue";
import "body-scroll-lock-upgrade";
import "axios";
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "HomeHero",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container" }, _attrs))} data-v-5076af70><section class="home-hero" data-v-5076af70><div class="home-hero__title-row" data-v-5076af70>`);
      _push(ssrRenderComponent(Logo, { class: "home-hero__logo" }, null, _parent));
      _push(`<h1 class="home-hero__title" data-v-5076af70>${ssrInterpolate(unref(t)("HOME.TITLE"))}</h1></div><p class="home-hero__subtitle" data-v-5076af70>${ssrInterpolate(unref(t)("HOME.SUBTITLE"))}</p><div class="home-hero__actions" data-v-5076af70>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/gradient",
        "class-name": "home-hero__button home-hero__button_primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("HOME.GRADIENT_BUTTON"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("HOME.GRADIENT_BUTTON")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/shadow",
        "class-name": "home-hero__button home-hero__button_secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("HOME.SHADOW_BUTTON"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("HOME.SHADOW_BUTTON")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/animation",
        "class-name": "home-hero__button home-hero__button_secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("HOME.ANIMATION_BUTTON"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("HOME.ANIMATION_BUTTON")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section></div>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/home/home-hero/ui/HomeHero.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const HomeHero = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-5076af70"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "HomeAbout",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container" }, _attrs))} data-v-bafec91b><section class="home-about" data-v-bafec91b><div class="home-about__text" data-v-bafec91b><p class="home-about__eyebrow" data-v-bafec91b>${ssrInterpolate(unref(t)("HOME.ABOUT_TAG"))}</p><h2 class="home-about__title" data-v-bafec91b>${ssrInterpolate(unref(t)("HOME.ABOUT_TITLE"))}</h2><p class="home-about__description" data-v-bafec91b>${ssrInterpolate(unref(t)("HOME.ABOUT_TEXT"))}</p><ul class="home-about__points" data-v-bafec91b><li data-v-bafec91b>${ssrInterpolate(unref(t)("HOME.ABOUT_POINT_1"))}</li><li data-v-bafec91b>${ssrInterpolate(unref(t)("HOME.ABOUT_POINT_2"))}</li><li data-v-bafec91b>${ssrInterpolate(unref(t)("HOME.ABOUT_POINT_3"))}</li></ul></div><div class="home-about__visual" aria-hidden="true" data-v-bafec91b><div class="home-about__visual-card" data-v-bafec91b><div class="home-about__visual-grid" data-v-bafec91b></div><div class="home-about__visual-planet" data-v-bafec91b></div><div class="home-about__visual-orbit" data-v-bafec91b></div><div class="home-about__visual-core" data-v-bafec91b></div></div></div></section></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/home/home-about/ui/HomeAbout.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const HomeAbout = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-bafec91b"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "HomeFeatures",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container" }, _attrs))} data-v-d751fbb4><section class="home-features" data-v-d751fbb4><p class="home-features__eyebrow" data-v-d751fbb4>${ssrInterpolate(unref(t)("HOME.FEATURES_TAG"))}</p><h2 class="home-features__title" data-v-d751fbb4>${ssrInterpolate(unref(t)("HOME.FEATURES_TITLE"))}</h2><div class="home-features__grid" data-v-d751fbb4><div class="home-features__card" data-v-d751fbb4><h3 class="home-features__card-title" data-v-d751fbb4>${ssrInterpolate(unref(t)("HOME.FEATURES_GRADIENT_TITLE"))}</h3><p class="home-features__card-description" data-v-d751fbb4>${ssrInterpolate(unref(t)("HOME.FEATURES_GRADIENT_DESCRIPTION"))}</p>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/gradient",
        "class-name": "home-features__card-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("HOME.GRADIENT_BUTTON"))} → `);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("HOME.GRADIENT_BUTTON")) + " → ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="home-features__card" data-v-d751fbb4><h3 class="home-features__card-title" data-v-d751fbb4>${ssrInterpolate(unref(t)("HOME.FEATURES_SHADOW_TITLE"))}</h3><p class="home-features__card-description" data-v-d751fbb4>${ssrInterpolate(unref(t)("HOME.FEATURES_SHADOW_DESCRIPTION"))}</p>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/shadow",
        "class-name": "home-features__card-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("HOME.SHADOW_BUTTON"))} → `);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("HOME.SHADOW_BUTTON")) + " → ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="home-features__card" data-v-d751fbb4><h3 class="home-features__card-title" data-v-d751fbb4>${ssrInterpolate(unref(t)("HOME.FEATURES_ANIMATION_TITLE"))}</h3><p class="home-features__card-description" data-v-d751fbb4>${ssrInterpolate(unref(t)("HOME.FEATURES_ANIMATION_DESCRIPTION"))}</p>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/animation",
        "class-name": "home-features__card-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("HOME.ANIMATION_BUTTON"))} → `);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("HOME.ANIMATION_BUTTON")) + " → ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></section></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/home/home-features/ui/HomeFeatures.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const HomeFeatures = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-d751fbb4"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "HomeShowcase",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container" }, _attrs))} data-v-07400ec9><section class="home-showcase" data-v-07400ec9><p class="home-showcase__eyebrow" data-v-07400ec9>${ssrInterpolate(unref(t)("HOME.SHOWCASE_TAG"))}</p><h2 class="home-showcase__title" data-v-07400ec9>${ssrInterpolate(unref(t)("HOME.SHOWCASE_TITLE"))}</h2><div class="home-showcase__grid" data-v-07400ec9><div class="home-showcase__card" data-v-07400ec9><div class="home-showcase__preview home-showcase__preview_animation" data-v-07400ec9><div class="holographic-dream" data-v-07400ec9><div class="holographic-dream__backdrop" data-v-07400ec9></div><div class="holographic-dream__glow" data-v-07400ec9></div><div class="holographic-dream__core" data-v-07400ec9></div><div class="holographic-dream__ring holographic-dream__ring_1" data-v-07400ec9></div><div class="holographic-dream__ring holographic-dream__ring_2" data-v-07400ec9></div><div class="holographic-dream__ring holographic-dream__ring_3" data-v-07400ec9></div><div class="holographic-dream__particles" data-v-07400ec9><!--[-->`);
      ssrRenderList(20, (n) => {
        _push(`<div class="holographic-dream__particle" style="${ssrRenderStyle({ "--particle-index": n })}" data-v-07400ec9></div>`);
      });
      _push(`<!--]--></div><div class="holographic-dream__orbs" data-v-07400ec9><div class="holographic-dream__orb holographic-dream__orb_1" data-v-07400ec9></div><div class="holographic-dream__orb holographic-dream__orb_2" data-v-07400ec9></div><div class="holographic-dream__orb holographic-dream__orb_3" data-v-07400ec9></div></div><div class="holographic-dream__shimmer" data-v-07400ec9></div></div></div><div class="home-showcase__info" data-v-07400ec9><h3 class="home-showcase__label" data-v-07400ec9>${ssrInterpolate(unref(t)("HOME.SHOWCASE_ANIMATION_LABEL"))}</h3><p class="home-showcase__description" data-v-07400ec9>${ssrInterpolate(unref(t)("HOME.SHOWCASE_ANIMATION_DESCRIPTION"))}</p>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/animation",
        "class-name": "home-showcase__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("HOME.SHOWCASE_TRY"))} → `);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("HOME.SHOWCASE_TRY")) + " → ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="home-showcase__card" data-v-07400ec9><div class="home-showcase__preview home-showcase__preview_gradient" data-v-07400ec9><div class="aurora-sunset" data-v-07400ec9><div class="aurora-sunset__base" data-v-07400ec9></div><div class="aurora-sunset__layer aurora-sunset__layer_1" data-v-07400ec9></div><div class="aurora-sunset__layer aurora-sunset__layer_2" data-v-07400ec9></div><div class="aurora-sunset__layer aurora-sunset__layer_3" data-v-07400ec9></div><div class="aurora-sunset__rays" data-v-07400ec9></div><div class="aurora-sunset__shimmer" data-v-07400ec9></div></div></div><div class="home-showcase__info" data-v-07400ec9><h3 class="home-showcase__label" data-v-07400ec9>${ssrInterpolate(unref(t)("HOME.SHOWCASE_GRADIENT_LABEL"))}</h3><p class="home-showcase__description" data-v-07400ec9>${ssrInterpolate(unref(t)("HOME.SHOWCASE_GRADIENT_DESCRIPTION"))}</p>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/gradient",
        "class-name": "home-showcase__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("HOME.SHOWCASE_TRY"))} → `);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("HOME.SHOWCASE_TRY")) + " → ", 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></section></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/home/home-showcase/ui/HomeShowcase.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const HomeShowcase = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-07400ec9"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "HomePage",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "home-page" }, _attrs))} data-v-64d192e8>`);
      _push(ssrRenderComponent(unref(HomeHero), null, null, _parent));
      _push(ssrRenderComponent(unref(HomeAbout), null, null, _parent));
      _push(ssrRenderComponent(unref(HomeFeatures), null, null, _parent));
      _push(ssrRenderComponent(unref(HomeShowcase), null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/home/HomePage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const HomePage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-64d192e8"]]);
export {
  HomePage as default
};
