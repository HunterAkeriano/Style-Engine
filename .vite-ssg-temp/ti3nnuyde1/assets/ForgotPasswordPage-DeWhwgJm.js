import { defineComponent, reactive, ref, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { v as ThemeSwitcher, w as LanguageSwitcher, a as Input, _ as _export_sfc } from "../main.mjs";
import "./auth-C1t_Avcw.js";
import { S as StarfieldAnimation } from "./StarfieldAnimation-DfBx44Ie.js";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "@unhead/vue";
import "body-scroll-lock-upgrade";
import "axios";
import "zod";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ForgotPasswordPage",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const route = useRoute();
    useRouter();
    useToast();
    const form = reactive({ email: "" });
    const errors = reactive({});
    const loading = ref(false);
    const serverMessage = ref("");
    const serverError = ref("");
    const prefillEmail = typeof route.query.email === "string" ? route.query.email : "";
    if (prefillEmail) form.email = prefillEmail;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "auth-shell" }, _attrs))} data-v-b9b3d582>`);
      _push(ssrRenderComponent(unref(StarfieldAnimation), null, null, _parent));
      _push(`<div class="auth-shell__card" data-v-b9b3d582><div class="auth-shell__controls" data-v-b9b3d582>`);
      _push(ssrRenderComponent(ThemeSwitcher, null, null, _parent));
      _push(ssrRenderComponent(LanguageSwitcher, null, null, _parent));
      _push(`</div><div class="auth-shell__header" data-v-b9b3d582><p class="auth-shell__eyebrow" data-v-b9b3d582>${ssrInterpolate(unref(t)("AUTH.FORGOT_PASSWORD"))}</p><h1 class="auth-shell__title" data-v-b9b3d582>${ssrInterpolate(unref(t)("AUTH.FORGOT_TITLE"))}</h1><p class="auth-shell__subtitle" data-v-b9b3d582>${ssrInterpolate(unref(t)("AUTH.FORGOT_SUBTITLE"))}</p></div><form class="auth-shell__form" novalidate data-v-b9b3d582>`);
      _push(ssrRenderComponent(unref(Input), {
        modelValue: form.email,
        "onUpdate:modelValue": ($event) => form.email = $event,
        label: unref(t)("AUTH.EMAIL"),
        error: errors.email ? unref(t)(`VALIDATION.${errors.email}`) : "",
        type: "email",
        autocomplete: "email",
        onInput: ($event) => errors.email = ""
      }, null, _parent));
      _push(`<button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} type="submit" class="auth-shell__submit" data-v-b9b3d582><span data-v-b9b3d582>${ssrInterpolate(loading.value ? unref(t)("AUTH.SIGNING_IN") : unref(t)("AUTH.SEND_RESET"))}</span></button>`);
      if (serverMessage.value) {
        _push(`<p class="auth-shell__success" data-v-b9b3d582>${ssrInterpolate(serverMessage.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (serverError.value) {
        _push(`<p class="auth-shell__error" data-v-b9b3d582>${ssrInterpolate(serverError.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form><div class="auth-shell__footer" data-v-b9b3d582>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: `/${unref(locale)}/login`,
        class: "auth-shell__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("AUTH.SIGN_IN"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("AUTH.SIGN_IN")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/forgot-password/ForgotPasswordPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ForgotPasswordPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b9b3d582"]]);
export {
  ForgotPasswordPage as default
};
