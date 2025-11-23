import { defineComponent, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { _ as _export_sfc } from "../main.mjs";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "vue-toastification";
import "vue-router";
import "@unhead/vue";
import "body-scroll-lock-upgrade";
import "axios";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "CookiePolicyPage",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const sections = computed(() => [
      {
        pill: t("COOKIE.PILL_TYPES"),
        title: t("COOKIE.SECTIONS.TYPES_TITLE"),
        body: t("COOKIE.SECTIONS.TYPES_BODY"),
        items: [
          t("COOKIE.SECTIONS.TYPES_POINTS.0"),
          t("COOKIE.SECTIONS.TYPES_POINTS.1"),
          t("COOKIE.SECTIONS.TYPES_POINTS.2")
        ]
      },
      {
        pill: t("COOKIE.PILL_CONTROL"),
        title: t("COOKIE.SECTIONS.CONTROL_TITLE"),
        body: t("COOKIE.SECTIONS.CONTROL_BODY"),
        items: [
          t("COOKIE.SECTIONS.CONTROL_POINTS.0"),
          t("COOKIE.SECTIONS.CONTROL_POINTS.1"),
          t("COOKIE.SECTIONS.CONTROL_POINTS.2")
        ]
      },
      {
        pill: t("COOKIE.PILL_USAGE"),
        title: t("COOKIE.SECTIONS.USE_TITLE"),
        body: t("COOKIE.SECTIONS.USE_BODY"),
        items: [
          t("COOKIE.SECTIONS.USE_POINTS.0"),
          t("COOKIE.SECTIONS.USE_POINTS.1")
        ]
      },
      {
        pill: t("COOKIE.PILL_CONTACT"),
        title: t("COOKIE.SECTIONS.CONTACT_TITLE"),
        body: t("COOKIE.SECTIONS.CONTACT_BODY")
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "policy-page policy-page--cookie" }, _attrs))} data-v-fc58c3d8><div class="policy-page__bg" aria-hidden="true" data-v-fc58c3d8></div><div class="policy-page__container" data-v-fc58c3d8><div class="policy-page__header" data-v-fc58c3d8><p class="policy-page__tag" data-v-fc58c3d8>${ssrInterpolate(unref(t)("COOKIE.TAG"))}</p><h1 class="policy-page__title" data-v-fc58c3d8><span class="policy-page__title-base" data-v-fc58c3d8>${ssrInterpolate(unref(t)("COOKIE.TITLE"))}</span><span class="policy-page__title-highlight" data-v-fc58c3d8>${ssrInterpolate(unref(t)("COOKIE.HIGHLIGHT"))}</span></h1><p class="policy-page__subtitle" data-v-fc58c3d8>${ssrInterpolate(unref(t)("COOKIE.SUBTITLE"))}</p></div><div class="policy-page__content" data-v-fc58c3d8><!--[-->`);
      ssrRenderList(sections.value, (section) => {
        var _a;
        _push(`<div class="policy-page__section" data-v-fc58c3d8><div class="policy-page__section-head" data-v-fc58c3d8><span class="policy-page__pill" data-v-fc58c3d8>${ssrInterpolate(section.pill)}</span><h2 class="policy-page__section-title" data-v-fc58c3d8>${ssrInterpolate(section.title)}</h2></div><p class="policy-page__section-text" data-v-fc58c3d8>${ssrInterpolate(section.body)}</p>`);
        if ((_a = section.items) == null ? void 0 : _a.length) {
          _push(`<ul class="policy-page__list" data-v-fc58c3d8><!--[-->`);
          ssrRenderList(section.items, (item) => {
            _push(`<li data-v-fc58c3d8>${ssrInterpolate(item)}</li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></section>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/policy/CookiePolicyPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const CookiePolicyPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fc58c3d8"]]);
export {
  CookiePolicyPage as default
};
