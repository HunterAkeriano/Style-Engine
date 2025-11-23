import { defineComponent, ref, onMounted, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderList } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { b as listPendingModeration } from "./saves-Czai1rJv.js";
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
  __name: "ModerationPage",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const items = ref([]);
    const loading = ref(false);
    const approvingId = ref(null);
    const error = ref("");
    function formatPayload(value) {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return "";
      }
    }
    async function fetchPending() {
      loading.value = true;
      error.value = "";
      try {
        items.value = await listPendingModeration();
      } catch (err) {
        error.value = (err == null ? void 0 : err.message) || t("MODERATION.LOAD_ERROR");
      } finally {
        loading.value = false;
      }
    }
    onMounted(fetchPending);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "moderation-page" }, _attrs))} data-v-cbc81b80><div class="moderation-page__header" data-v-cbc81b80><div data-v-cbc81b80><h1 class="moderation-page__title" data-v-cbc81b80>${ssrInterpolate(unref(t)("MODERATION.TITLE"))}</h1><p class="moderation-page__subtitle" data-v-cbc81b80>${ssrInterpolate(unref(t)("MODERATION.SUBTITLE"))}</p></div><button class="moderation-page__refresh" type="button"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-cbc81b80>${ssrInterpolate(loading.value ? unref(t)("MODERATION.LOADING") : unref(t)("MODERATION.REFRESH"))}</button></div>`);
      if (error.value) {
        _push(`<div class="moderation-page__error" data-v-cbc81b80>${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (loading.value && !items.value.length) {
        _push(`<div class="moderation-page__empty" data-v-cbc81b80>${ssrInterpolate(unref(t)("MODERATION.LOADING"))}</div>`);
      } else if (!items.value.length) {
        _push(`<div class="moderation-page__empty" data-v-cbc81b80>${ssrInterpolate(unref(t)("MODERATION.EMPTY"))}</div>`);
      } else {
        _push(`<div class="moderation-page__list" data-v-cbc81b80><!--[-->`);
        ssrRenderList(items.value, (item) => {
          var _a;
          _push(`<div class="moderation-page__card" data-v-cbc81b80><div class="moderation-page__card-head" data-v-cbc81b80><div data-v-cbc81b80><p class="moderation-page__category" data-v-cbc81b80>${ssrInterpolate(unref(t)(`MODERATION.CATEGORY_${(_a = item.category) == null ? void 0 : _a.toUpperCase()}`))}</p><h3 class="moderation-page__name" data-v-cbc81b80>${ssrInterpolate(item.name)}</h3></div><button class="moderation-page__approve" type="button"${ssrIncludeBooleanAttr(approvingId.value === item.id) ? " disabled" : ""} data-v-cbc81b80>${ssrInterpolate(approvingId.value === item.id ? unref(t)("MODERATION.APPROVING") : unref(t)("MODERATION.APPROVE"))}</button></div><p class="moderation-page__date" data-v-cbc81b80>${ssrInterpolate(unref(t)("MODERATION.SUBMITTED"))} ${ssrInterpolate(new Date(item.createdAt).toLocaleString())}</p><pre class="moderation-page__payload" data-v-cbc81b80>${ssrInterpolate(formatPayload(item.payload))}</pre></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/moderation/ModerationPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ModerationPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-cbc81b80"]]);
export {
  ModerationPage as default
};
