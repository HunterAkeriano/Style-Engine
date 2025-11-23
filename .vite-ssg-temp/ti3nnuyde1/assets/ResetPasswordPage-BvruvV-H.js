import { defineComponent, reactive, ref, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { v as ThemeSwitcher, w as LanguageSwitcher, a as Input, _ as _export_sfc } from "../main.mjs";
import "./auth-C1t_Avcw.js";
import { S as StarfieldAnimation } from "./StarfieldAnimation-DfBx44Ie.js";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "vue-toastification";
import "@unhead/vue";
import "body-scroll-lock-upgrade";
import "axios";
import "zod";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ResetPasswordPage",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const route = useRoute();
    useRouter();
    const form = reactive({
      password: "",
      confirmPassword: ""
    });
    const errors = reactive({});
    const loading = ref(false);
    const serverMessage = ref("");
    const serverError = ref("");
    route.query.token || "";
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "auth-shell" }, _attrs))} data-v-721fded8>`);
      _push(ssrRenderComponent(unref(StarfieldAnimation), null, null, _parent));
      _push(`<div class="auth-shell__card" data-v-721fded8><div class="auth-shell__controls" data-v-721fded8>`);
      _push(ssrRenderComponent(ThemeSwitcher, null, null, _parent));
      _push(ssrRenderComponent(LanguageSwitcher, null, null, _parent));
      _push(`</div><div class="auth-shell__header" data-v-721fded8><p class="auth-shell__eyebrow" data-v-721fded8>${ssrInterpolate(unref(t)("AUTH.RESET_TITLE"))}</p><h1 class="auth-shell__title" data-v-721fded8>${ssrInterpolate(unref(t)("AUTH.RESET_TITLE"))}</h1><p class="auth-shell__subtitle" data-v-721fded8>${ssrInterpolate(unref(t)("AUTH.RESET_SUBTITLE"))}</p></div><form class="auth-shell__form" novalidate data-v-721fded8>`);
      _push(ssrRenderComponent(unref(Input), {
        modelValue: form.password,
        "onUpdate:modelValue": ($event) => form.password = $event,
        label: unref(t)("AUTH.NEW_PASSWORD"),
        error: errors.password ? unref(t)(`VALIDATION.${errors.password}`) : "",
        type: "password",
        autocomplete: "new-password",
        onInput: ($event) => errors.password = ""
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: form.confirmPassword,
        "onUpdate:modelValue": ($event) => form.confirmPassword = $event,
        label: unref(t)("AUTH.CONFIRM_PASSWORD"),
        error: errors.confirmPassword ? unref(t)(`VALIDATION.${errors.confirmPassword}`) : "",
        type: "password",
        autocomplete: "new-password",
        onInput: ($event) => errors.confirmPassword = ""
      }, null, _parent));
      _push(`<button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} type="submit" class="auth-shell__submit" data-v-721fded8><span data-v-721fded8>${ssrInterpolate(loading.value ? unref(t)("AUTH.SIGNING_IN") : unref(t)("AUTH.SET_NEW_PASSWORD"))}</span></button>`);
      if (serverMessage.value) {
        _push(`<p class="auth-shell__success" data-v-721fded8>${ssrInterpolate(serverMessage.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (serverError.value) {
        _push(`<p class="auth-shell__error" data-v-721fded8>${ssrInterpolate(serverError.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form><div class="auth-shell__footer" data-v-721fded8>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/reset-password/ResetPasswordPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const ResetPasswordPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-721fded8"]]);
export {
  ResetPasswordPage as default
};
