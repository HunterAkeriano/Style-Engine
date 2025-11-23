import { defineComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext, computed } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderClass } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { useHead } from "@unhead/vue";
import { g as getDocsPageContent } from "./content-CrADctIr.js";
import { N as NavLink, _ as _export_sfc, B as Button, c as copyToClipboard } from "../main.mjs";
import { useToast } from "vue-toastification";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "vue-router";
import "body-scroll-lock-upgrade";
import "axios";
const defaultCode = `@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}`;
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "DocsHero",
  __ssrInlineRender: true,
  props: {
    content: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "docs-hero" }, _attrs))} data-v-1b5bfd8d><div class="docs-hero__text" data-v-1b5bfd8d><p class="docs-hero__eyebrow" data-v-1b5bfd8d>${ssrInterpolate(__props.content.eyebrow)}</p><h1 class="docs-hero__title" data-v-1b5bfd8d>${ssrInterpolate(__props.content.title)}</h1><p class="docs-hero__subtitle" data-v-1b5bfd8d>${ssrInterpolate(__props.content.subtitle)}</p><div class="docs-hero__cta" data-v-1b5bfd8d><!--[-->`);
      ssrRenderList(__props.content.cta, (action) => {
        _push(ssrRenderComponent(unref(NavLink), {
          key: action.to,
          to: action.to,
          "class-name": `button ${action.variant === "primary" ? "button_primary" : "button_secondary"}`
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(action.label)}`);
            } else {
              return [
                createTextVNode(toDisplayString(action.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></div><div class="docs-hero__meta" data-v-1b5bfd8d><!--[-->`);
      ssrRenderList(__props.content.meta, (label) => {
        _push(`<span data-v-1b5bfd8d>${ssrInterpolate(label)}</span>`);
      });
      _push(`<!--]--></div></div><div class="docs-hero__visual" aria-hidden="true" data-v-1b5bfd8d><div class="docs-hero__gradient" data-v-1b5bfd8d></div><div class="docs-hero__rings" data-v-1b5bfd8d><span class="docs-hero__ring docs-hero__ring_accent" data-v-1b5bfd8d></span><span class="docs-hero__ring docs-hero__ring_soft" data-v-1b5bfd8d></span><span class="docs-hero__ring docs-hero__ring_glow" data-v-1b5bfd8d></span></div><div class="docs-hero__orbit" data-v-1b5bfd8d><span class="docs-hero__dot" data-v-1b5bfd8d></span><span class="docs-hero__dot docs-hero__dot_lag" data-v-1b5bfd8d></span><span class="docs-hero__dot docs-hero__dot_tiny" data-v-1b5bfd8d></span></div><div class="docs-hero__panel" data-v-1b5bfd8d><p class="docs-hero__panel-title" data-v-1b5bfd8d>pattern.css</p><pre class="docs-hero__code" data-v-1b5bfd8d><code data-v-1b5bfd8d>${ssrInterpolate(defaultCode)}</code></pre></div></div></section>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/docs/docs-hero/DocsHero.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const DocsHero = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-1b5bfd8d"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "DocsTopics",
  __ssrInlineRender: true,
  props: {
    eyebrow: {},
    title: {},
    subtitle: {},
    topics: {},
    openLabel: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "docs-topics" }, _attrs))} data-v-8e211347><div class="docs-topics__head" data-v-8e211347><p class="docs-topics__eyebrow" data-v-8e211347>${ssrInterpolate(__props.eyebrow)}</p><h2 class="docs-topics__title" data-v-8e211347>${ssrInterpolate(__props.title)}</h2><p class="docs-topics__subtitle" data-v-8e211347>${ssrInterpolate(__props.subtitle)}</p></div><div class="docs-topics__cards" data-v-8e211347><!--[-->`);
      ssrRenderList(__props.topics, (topic) => {
        _push(`<article class="docs-card" data-v-8e211347><div class="docs-card__head" data-v-8e211347><span class="docs-card__badge" data-v-8e211347>${ssrInterpolate(topic.badge)}</span><h3 class="docs-card__title" data-v-8e211347>${ssrInterpolate(topic.title)}</h3><p class="docs-card__description" data-v-8e211347>${ssrInterpolate(topic.description)}</p></div><div class="${ssrRenderClass(["docs-card__preview", topic.previewClass])}" data-v-8e211347><p class="docs-card__label" data-v-8e211347>${ssrInterpolate(topic.previewLabel)}</p><div class="docs-card__visual" data-v-8e211347><!--[-->`);
        ssrRenderList(topic.previewDots, (n) => {
          _push(`<span class="docs-card__dot" data-v-8e211347></span>`);
        });
        _push(`<!--]--></div></div><ul class="docs-card__list" data-v-8e211347><!--[-->`);
        ssrRenderList(topic.points, (point) => {
          _push(`<li data-v-8e211347>${ssrInterpolate(point)}</li>`);
        });
        _push(`<!--]--></ul><div class="docs-card__footer" data-v-8e211347>`);
        _push(ssrRenderComponent(unref(NavLink), {
          to: topic.link,
          "class-name": "button button_primary button_sm"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(__props.openLabel)}`);
            } else {
              return [
                createTextVNode(toDisplayString(__props.openLabel), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<span class="docs-card__hint" data-v-8e211347>${ssrInterpolate(topic.hint)}</span></div></article>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/docs/docs-topics/DocsTopics.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const DocsTopics = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-8e211347"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "DocsPlaybook",
  __ssrInlineRender: true,
  props: {
    eyebrow: {},
    title: {},
    subtitle: {},
    snippets: {}
  },
  setup(__props) {
    const { t } = useI18n();
    const toast = useToast();
    const copyLabel = computed(() => t("DOCS.COPY"));
    async function copy(code) {
      const ok = await copyToClipboard(code);
      toast[ok ? "success" : "error"](t(ok ? "COMMON.COPIED_TO_CLIPBOARD" : "COMMON.COPY_FAILED"));
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "docs-playbook" }, _attrs))} data-v-6a4c2cc3><div class="docs-playbook__head" data-v-6a4c2cc3><p class="docs-playbook__eyebrow" data-v-6a4c2cc3>${ssrInterpolate(__props.eyebrow)}</p><h2 class="docs-playbook__title" data-v-6a4c2cc3>${ssrInterpolate(__props.title)}</h2><p class="docs-playbook__subtitle" data-v-6a4c2cc3>${ssrInterpolate(__props.subtitle)}</p></div><div class="docs-playbook__grid" data-v-6a4c2cc3><!--[-->`);
      ssrRenderList(__props.snippets, (snippet) => {
        _push(`<div class="docs-snippet" data-v-6a4c2cc3><div class="${ssrRenderClass([{
          "docs-snippet__preview_card": snippet.preview === "card",
          "docs-snippet__preview_marquee": snippet.preview === "marquee",
          "docs-snippet__preview_pulse": snippet.preview === "pulse"
        }, "docs-snippet__preview"])}" data-v-6a4c2cc3>`);
        if (snippet.preview === "card") {
          _push(`<!--[--><div class="docs-snippet__shine" data-v-6a4c2cc3></div><div class="docs-snippet__chip" data-v-6a4c2cc3></div><div class="docs-snippet__rows" data-v-6a4c2cc3><span data-v-6a4c2cc3></span><span data-v-6a4c2cc3></span><span data-v-6a4c2cc3></span></div><!--]-->`);
        } else if (snippet.preview === "marquee") {
          _push(`<div class="docs-snippet__track" data-v-6a4c2cc3><!--[-->`);
          ssrRenderList(6, (n) => {
            _push(`<span data-v-6a4c2cc3>animate • gradient • shadow</span>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!--[--><div class="docs-snippet__pulse" data-v-6a4c2cc3></div><div class="docs-snippet__pulse docs-snippet__pulse_delayed" data-v-6a4c2cc3></div><!--]-->`);
        }
        _push(`</div><div class="docs-snippet__body" data-v-6a4c2cc3><h3 data-v-6a4c2cc3>${ssrInterpolate(snippet.title)}</h3><p data-v-6a4c2cc3>${ssrInterpolate(snippet.description)}</p><div class="docs-snippet__code" data-v-6a4c2cc3><pre data-v-6a4c2cc3><code data-v-6a4c2cc3>${ssrInterpolate(snippet.code)}</code></pre>`);
        _push(ssrRenderComponent(unref(Button), {
          variant: "ghost",
          size: "sm",
          onClick: ($event) => copy(snippet.code)
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
      _push(`<!--]--></div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/docs/docs-playbook/DocsPlaybook.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const DocsPlaybook = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-6a4c2cc3"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "DocsPrimer",
  __ssrInlineRender: true,
  props: {
    eyebrow: {},
    title: {},
    subtitle: {},
    sections: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "docs-primer" }, _attrs))} data-v-0f8fc83a><div class="docs-primer__head" data-v-0f8fc83a><p class="docs-primer__eyebrow" data-v-0f8fc83a>${ssrInterpolate(__props.eyebrow)}</p><h2 class="docs-primer__title" data-v-0f8fc83a>${ssrInterpolate(__props.title)}</h2><p class="docs-primer__subtitle" data-v-0f8fc83a>${ssrInterpolate(__props.subtitle)}</p></div><div class="docs-primer__grid" data-v-0f8fc83a><!--[-->`);
      ssrRenderList(__props.sections, (section) => {
        _push(`<article class="docs-primer__card" data-v-0f8fc83a><div class="docs-primer__header" data-v-0f8fc83a><h3 data-v-0f8fc83a>${ssrInterpolate(section.title)}</h3><p class="docs-primer__description" data-v-0f8fc83a>${ssrInterpolate(section.description)}</p></div><ul class="docs-primer__list" data-v-0f8fc83a><!--[-->`);
        ssrRenderList(section.items, (item) => {
          _push(`<li data-v-0f8fc83a>${ssrInterpolate(item)}</li>`);
        });
        _push(`<!--]--></ul></article>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/docs/docs-primer/DocsPrimer.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const DocsPrimer = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-0f8fc83a"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "DocsPage",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale, t } = useI18n();
    const content = computed(() => getDocsPageContent(locale.value));
    const topicsLabel = computed(() => t("DOCS.TOPICS_LABEL"));
    const topicsTitle = computed(() => t("DOCS.TOPICS_TITLE"));
    const topicsSubtitle = computed(() => t("DOCS.TOPICS_SUBTITLE"));
    const openLabel = computed(() => t("DOCS.OPEN_TOPIC"));
    const playbookLabel = computed(() => t("DOCS.PLAYBOOK_LABEL"));
    const playbookTitle = computed(() => t("DOCS.PLAYBOOK_TITLE"));
    const playbookSubtitle = computed(() => t("DOCS.PLAYBOOK_SUBTITLE"));
    const primerLabel = computed(() => t("DOCS.PRIMER_LABEL"));
    useHead(() => {
      const title = t("META.DOCS");
      const description = t("META_DESCRIPTION.DOCS");
      const url = typeof window !== "undefined" ? window.location.href : "";
      const metaEntries = [
        description ? { name: "description", content: description } : null,
        { property: "og:title", content: title },
        description ? { property: "og:description", content: description } : null,
        { property: "og:type", content: "website" },
        url ? { property: "og:url", content: url } : null
      ].filter(Boolean);
      return {
        title,
        meta: metaEntries,
        link: url ? [{ rel: "canonical", href: url }] : []
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "docs-page" }, _attrs))} data-v-c91e0afc><div class="container" data-v-c91e0afc>`);
      _push(ssrRenderComponent(unref(DocsHero), {
        content: content.value.hero
      }, null, _parent));
      _push(`</div><div class="container" data-v-c91e0afc>`);
      _push(ssrRenderComponent(unref(DocsTopics), {
        eyebrow: topicsLabel.value,
        title: topicsTitle.value,
        subtitle: topicsSubtitle.value,
        topics: content.value.topics,
        "open-label": openLabel.value
      }, null, _parent));
      _push(`</div><div class="container" data-v-c91e0afc>`);
      _push(ssrRenderComponent(unref(DocsPrimer), {
        eyebrow: primerLabel.value,
        title: content.value.primer.title,
        subtitle: content.value.primer.subtitle,
        sections: content.value.primer.sections
      }, null, _parent));
      _push(`</div><div class="container" data-v-c91e0afc>`);
      _push(ssrRenderComponent(unref(DocsPlaybook), {
        eyebrow: playbookLabel.value,
        title: playbookTitle.value,
        subtitle: playbookSubtitle.value,
        snippets: content.value.playbook
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/docs/ui/docs-page/DocsPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const DocsPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c91e0afc"]]);
export {
  DocsPage as default
};
