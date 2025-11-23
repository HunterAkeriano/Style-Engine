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
  __name: "PrivacyPolicyPage",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const sections = computed(() => [
      {
        pill: t("PRIVACY.PILL_CORE"),
        title: t("PRIVACY.SECTIONS.DATA_TITLE"),
        body: t("PRIVACY.SECTIONS.DATA_BODY"),
        items: [
          t("PRIVACY.SECTIONS.DATA_POINTS.0"),
          t("PRIVACY.SECTIONS.DATA_POINTS.1"),
          t("PRIVACY.SECTIONS.DATA_POINTS.2")
        ]
      },
      {
        pill: t("PRIVACY.PILL_USE"),
        title: t("PRIVACY.SECTIONS.USE_TITLE"),
        body: t("PRIVACY.SECTIONS.USE_BODY"),
        items: [
          t("PRIVACY.SECTIONS.USE_POINTS.0"),
          t("PRIVACY.SECTIONS.USE_POINTS.1"),
          t("PRIVACY.SECTIONS.USE_POINTS.2")
        ]
      },
      {
        pill: t("PRIVACY.PILL_RIGHTS"),
        title: t("PRIVACY.SECTIONS.RIGHTS_TITLE"),
        body: t("PRIVACY.SECTIONS.RIGHTS_BODY"),
        items: [
          t("PRIVACY.SECTIONS.RIGHTS_POINTS.0"),
          t("PRIVACY.SECTIONS.RIGHTS_POINTS.1"),
          t("PRIVACY.SECTIONS.RIGHTS_POINTS.2")
        ]
      },
      {
        pill: t("PRIVACY.PILL_SECURITY"),
        title: t("PRIVACY.SECTIONS.SECURITY_TITLE"),
        body: t("PRIVACY.SECTIONS.SECURITY_BODY"),
        items: [
          t("PRIVACY.SECTIONS.SECURITY_POINTS.0"),
          t("PRIVACY.SECTIONS.SECURITY_POINTS.1")
        ]
      },
      {
        pill: t("PRIVACY.PILL_CONTACT"),
        title: t("PRIVACY.SECTIONS.CONTACT_TITLE"),
        body: t("PRIVACY.SECTIONS.CONTACT_BODY")
      }
    ]);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "policy-page" }, _attrs))} data-v-d17c3e46><div class="policy-page__bg" aria-hidden="true" data-v-d17c3e46></div><div class="policy-page__container" data-v-d17c3e46><div class="policy-page__header" data-v-d17c3e46><p class="policy-page__tag" data-v-d17c3e46>${ssrInterpolate(unref(t)("PRIVACY.TAG"))}</p><h1 class="policy-page__title" data-v-d17c3e46><span class="policy-page__title-base" data-v-d17c3e46>${ssrInterpolate(unref(t)("PRIVACY.TITLE"))}</span><span class="policy-page__title-highlight" data-v-d17c3e46>${ssrInterpolate(unref(t)("PRIVACY.HIGHLIGHT"))}</span></h1><p class="policy-page__subtitle" data-v-d17c3e46>${ssrInterpolate(unref(t)("PRIVACY.SUBTITLE"))}</p></div><div class="policy-page__content" data-v-d17c3e46><!--[-->`);
      ssrRenderList(sections.value, (section) => {
        var _a;
        _push(`<div class="policy-page__section" data-v-d17c3e46><div class="policy-page__section-head" data-v-d17c3e46><span class="policy-page__pill" data-v-d17c3e46>${ssrInterpolate(section.pill)}</span><h2 class="policy-page__section-title" data-v-d17c3e46>${ssrInterpolate(section.title)}</h2></div><p class="policy-page__section-text" data-v-d17c3e46>${ssrInterpolate(section.body)}</p>`);
        if ((_a = section.items) == null ? void 0 : _a.length) {
          _push(`<ul class="policy-page__list" data-v-d17c3e46><!--[-->`);
          ssrRenderList(section.items, (item) => {
            _push(`<li data-v-d17c3e46>${ssrInterpolate(item)}</li>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/policy/PrivacyPolicyPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const PrivacyPolicyPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-d17c3e46"]]);
export {
  PrivacyPolicyPage as default
};
