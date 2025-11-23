import { defineComponent, reactive, ref, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { d as useAuthStore, v as ThemeSwitcher, w as LanguageSwitcher, a as Input, _ as _export_sfc } from "../main.mjs";
import { S as StarfieldAnimation } from "./StarfieldAnimation-DfBx44Ie.js";
import "./auth-C1t_Avcw.js";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "vue-toastification";
import "@unhead/vue";
import "body-scroll-lock-upgrade";
import "axios";
import "zod";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "LoginPage",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useRoute();
    useAuthStore();
    const { t, locale } = useI18n();
    const formData = reactive({
      email: "",
      password: ""
    });
    const errors = reactive({});
    const isSubmitting = ref(false);
    const serverError = ref("");
    function clearFieldError(field) {
      errors[field] = void 0;
      serverError.value = "";
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RouterLink = resolveComponent("RouterLink");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-page" }, _attrs))} data-v-b4342619>`);
      _push(ssrRenderComponent(unref(StarfieldAnimation), null, null, _parent));
      _push(`<div class="login-page__content" data-v-b4342619><div class="login-page__form-container" data-v-b4342619><div class="login-page__controls" data-v-b4342619>`);
      _push(ssrRenderComponent(ThemeSwitcher, null, null, _parent));
      _push(ssrRenderComponent(LanguageSwitcher, null, null, _parent));
      _push(`</div><div class="login-page__header" data-v-b4342619><h1 class="login-page__title" data-v-b4342619>${ssrInterpolate(unref(t)("AUTH.LOGIN_TITLE"))}</h1><p class="login-page__subtitle" data-v-b4342619>${ssrInterpolate(unref(t)("AUTH.LOGIN_SUBTITLE"))}</p></div><form class="login-form" novalidate data-v-b4342619>`);
      _push(ssrRenderComponent(unref(Input), {
        modelValue: formData.email,
        "onUpdate:modelValue": ($event) => formData.email = $event,
        label: unref(t)("AUTH.EMAIL"),
        error: errors.email ? unref(t)(`VALIDATION.${errors.email}`) : "",
        type: "email",
        autocomplete: "email",
        onInput: ($event) => clearFieldError("email")
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: formData.password,
        "onUpdate:modelValue": ($event) => formData.password = $event,
        label: unref(t)("AUTH.PASSWORD"),
        error: errors.password ? unref(t)(`VALIDATION.${errors.password}`) : "",
        type: "password",
        autocomplete: "current-password",
        onInput: ($event) => clearFieldError("password")
      }, null, _parent));
      _push(`<div class="login-form__forgot" data-v-b4342619>`);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: `/${unref(locale)}/forgot-password`,
        class: "login-page__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("AUTH.FORGOT_PASSWORD"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("AUTH.FORGOT_PASSWORD")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><button${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="${ssrRenderClass([{ "login-form__submit_loading": isSubmitting.value }, "login-form__submit"])}" type="submit" data-v-b4342619><span data-v-b4342619>${ssrInterpolate(isSubmitting.value ? unref(t)("AUTH.SIGNING_IN") : unref(t)("AUTH.LOGIN_BUTTON"))}</span></button>`);
      if (serverError.value) {
        _push(`<div class="login-form__server-error" data-v-b4342619>${ssrInterpolate(serverError.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form><div class="login-page__footer" data-v-b4342619><p class="login-page__footer-text" data-v-b4342619>${ssrInterpolate(unref(t)("AUTH.NO_ACCOUNT"))} `);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: `/${unref(locale)}/register`,
        class: "login-page__link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("AUTH.SIGN_UP"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("AUTH.SIGN_UP")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/login/LoginPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const LoginPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-b4342619"]]);
export {
  LoginPage as default
};
