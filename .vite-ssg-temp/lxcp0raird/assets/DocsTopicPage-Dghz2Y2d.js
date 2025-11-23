import { defineComponent, computed, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderStyle } from "vue/server-renderer";
import { useHead } from "@unhead/vue";
import { useI18n } from "vue-i18n";
import { a as getDocsTopicContent } from "./content-CrADctIr.js";
import { useToast } from "vue-toastification";
import { N as NavLink, B as Button, c as copyToClipboard, _ as _export_sfc } from "../main.mjs";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "vue-router";
import "body-scroll-lock-upgrade";
import "axios";
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DocsTopicContent",
  __ssrInlineRender: true,
  props: {
    topic: {},
    otherTopics: {}
  },
  setup(__props) {
    const { t } = useI18n();
    const toast = useToast();
    const checklistLabel = computed(() => t("DOCS.CHECKLIST"));
    const demoLabel = computed(() => t("DOCS.DEMO"));
    const patternsLabel = computed(() => t("DOCS.PATTERNS"));
    const linksLabel = computed(() => t("DOCS.LINKS"));
    const otherLabel = computed(() => t("DOCS.OTHER_TOPICS"));
    const backLabel = computed(() => t("DOCS.BACK"));
    const copyLabel = computed(() => t("DOCS.COPY"));
    async function copy(code) {
      const ok = await copyToClipboard(code);
      toast[ok ? "success" : "error"](t(ok ? "COMMON.COPIED_TO_CLIPBOARD" : "COMMON.COPY_FAILED"));
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "docs-topic" }, _attrs))} data-v-ded7a25e><header class="docs-topic__header" data-v-ded7a25e><div class="docs-topic__breadcrumb" data-v-ded7a25e>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/docs",
        "class-name": "docs-topic__back"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(backLabel.value)}`);
          } else {
            return [
              createTextVNode(toDisplayString(backLabel.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="docs-topic__pill" data-v-ded7a25e>${ssrInterpolate(__props.topic.eyebrow)}</span></div><h1 class="docs-topic__title" data-v-ded7a25e>${ssrInterpolate(__props.topic.title)}</h1><p class="docs-topic__subtitle" data-v-ded7a25e>${ssrInterpolate(__props.topic.subtitle)}</p></header><section class="docs-topic__grid" data-v-ded7a25e><article class="docs-topic__panel" data-v-ded7a25e><div class="docs-topic__panel-head" data-v-ded7a25e><p class="docs-topic__pill docs-topic__pill_ghost" data-v-ded7a25e>${ssrInterpolate(checklistLabel.value)}</p><h2 data-v-ded7a25e>${ssrInterpolate(__props.topic.checklist.title)}</h2><p class="docs-topic__muted" data-v-ded7a25e>${ssrInterpolate(__props.topic.checklist.subtitle)}</p></div><ul class="docs-topic__list" data-v-ded7a25e><!--[-->`);
      ssrRenderList(__props.topic.checklist.points, (point) => {
        _push(`<li data-v-ded7a25e>${ssrInterpolate(point)}</li>`);
      });
      _push(`<!--]--></ul></article><article class="docs-topic__panel" data-v-ded7a25e><div class="docs-topic__panel-head" data-v-ded7a25e><p class="docs-topic__pill docs-topic__pill_ghost" data-v-ded7a25e>${ssrInterpolate(demoLabel.value)}</p><h2 data-v-ded7a25e>${ssrInterpolate(__props.topic.preview.title)}</h2><p class="docs-topic__muted" data-v-ded7a25e>${ssrInterpolate(__props.topic.preview.subtitle)}</p></div><div class="${ssrRenderClass(["docs-topic__preview", __props.topic.preview.className])}" data-v-ded7a25e><!--[-->`);
      ssrRenderList(__props.topic.preview.layers, (layer) => {
        _push(`<div class="docs-topic__layer" data-v-ded7a25e></div>`);
      });
      _push(`<!--]-->`);
      if (__props.topic.preview.dots) {
        _push(`<div class="docs-topic__chips" data-v-ded7a25e><!--[-->`);
        ssrRenderList(__props.topic.preview.dots, (idx) => {
          _push(`<span class="docs-topic__chip" style="${ssrRenderStyle({ animationDelay: `${idx * 0.12}s` })}" data-v-ded7a25e></span>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="docs-topic__code-wrap" data-v-ded7a25e><pre class="docs-topic__code" data-v-ded7a25e><code data-v-ded7a25e>${ssrInterpolate(__props.topic.preview.code)}</code></pre>`);
      _push(ssrRenderComponent(unref(Button), {
        size: "sm",
        variant: "ghost",
        onClick: ($event) => copy(__props.topic.preview.code)
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(copyLabel.value)}`);
          } else {
            return [
              createTextVNode(toDisplayString(copyLabel.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></article><article class="docs-topic__panel docs-topic__panel_wide" data-v-ded7a25e><div class="docs-topic__panel-head" data-v-ded7a25e><p class="docs-topic__pill docs-topic__pill_ghost" data-v-ded7a25e>${ssrInterpolate(patternsLabel.value)}</p><h2 data-v-ded7a25e>${ssrInterpolate(__props.topic.patterns.title)}</h2><p class="docs-topic__muted" data-v-ded7a25e>${ssrInterpolate(__props.topic.patterns.subtitle)}</p></div><div class="docs-topic__pattern-grid" data-v-ded7a25e><!--[-->`);
      ssrRenderList(__props.topic.patterns.items, (pattern) => {
        _push(`<div class="docs-topic__pattern-card" data-v-ded7a25e><div class="${ssrRenderClass(["docs-topic__mini-preview", pattern.className])}" data-v-ded7a25e></div><div class="docs-topic__pattern-body" data-v-ded7a25e><h3 data-v-ded7a25e>${ssrInterpolate(pattern.title)}</h3><p class="docs-topic__muted" data-v-ded7a25e>${ssrInterpolate(pattern.description)}</p><div class="docs-topic__code-wrap" data-v-ded7a25e><pre class="docs-topic__code" data-v-ded7a25e><code data-v-ded7a25e>${ssrInterpolate(pattern.code)}</code></pre>`);
        _push(ssrRenderComponent(unref(Button), {
          size: "sm",
          variant: "ghost",
          onClick: ($event) => copy(pattern.code)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(copyLabel.value)}`);
            } else {
              return [
                createTextVNode(toDisplayString(copyLabel.value), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</div></div></div>`);
      });
      _push(`<!--]--></div></article><aside class="docs-topic__panel docs-topic__panel_aside" data-v-ded7a25e><div class="docs-topic__panel-head" data-v-ded7a25e><p class="docs-topic__pill docs-topic__pill_ghost" data-v-ded7a25e>${ssrInterpolate(linksLabel.value)}</p><h2 data-v-ded7a25e>${ssrInterpolate(otherLabel.value)}</h2></div><div class="docs-topic__links" data-v-ded7a25e><!--[-->`);
      ssrRenderList(__props.otherTopics, (other) => {
        _push(ssrRenderComponent(unref(NavLink), {
          key: other.slug,
          to: other.link,
          "class-name": "docs-topic__link"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="docs-topic__link-dot" data-v-ded7a25e${_scopeId}></span> ${ssrInterpolate(other.title)}`);
            } else {
              return [
                createVNode("span", { class: "docs-topic__link-dot" }),
                createTextVNode(" " + toDisplayString(other.title), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div></aside></section></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/docs/ui/docs-topic-page/components/docs-topic-content/DocsTopicContent.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const DocsTopicContent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-ded7a25e"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DocsTopicPage",
  __ssrInlineRender: true,
  props: {
    topic: {}
  },
  setup(__props) {
    const props = __props;
    const { locale } = useI18n();
    const localized = computed(() => getDocsTopicContent(locale.value, props.topic));
    const topic = computed(() => localized.value.topic);
    const otherTopics = computed(() => localized.value.otherTopics);
    useHead(() => {
      var _a, _b;
      const title = ((_a = topic.value) == null ? void 0 : _a.title) ?? "Docs";
      const description = ((_b = topic.value) == null ? void 0 : _b.subtitle) ?? "";
      const url = typeof window !== "undefined" ? window.location.href : "";
      const metaEntries = [
        description ? { name: "description", content: description } : null,
        { property: "og:title", content: title },
        description ? { property: "og:description", content: description } : null,
        { property: "og:type", content: "article" },
        url ? { property: "og:url", content: url } : null
      ].filter(Boolean);
      return {
        title,
        meta: metaEntries,
        link: url ? [{ rel: "canonical", href: url }] : []
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "docs-topic-page" }, _attrs))} data-v-5c923424><div class="container" data-v-5c923424>`);
      _push(ssrRenderComponent(DocsTopicContent, {
        topic: topic.value,
        "other-topics": otherTopics.value
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/docs/ui/docs-topic-page/DocsTopicPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DocsTopicPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5c923424"]]);
export {
  DocsTopicPage as default
};
