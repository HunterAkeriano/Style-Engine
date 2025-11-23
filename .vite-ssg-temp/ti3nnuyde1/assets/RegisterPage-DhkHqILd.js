import { defineComponent, reactive, ref, resolveComponent, mergeProps, unref, withCtx, createTextVNode, toDisplayString, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useRouter } from "vue-router";
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
  __name: "RegisterPage",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const { t, locale } = useI18n();
    useAuthStore();
    const formData = reactive({
      email: "",
      password: "",
      name: ""
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
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "register-page" }, _attrs))} data-v-62ae70ee>`);
      _push(ssrRenderComponent(unref(StarfieldAnimation), null, null, _parent));
      _push(`<div class="register-page__content" data-v-62ae70ee><div class="register-page__form-container" data-v-62ae70ee><div class="register-page__controls" data-v-62ae70ee>`);
      _push(ssrRenderComponent(ThemeSwitcher, null, null, _parent));
      _push(ssrRenderComponent(LanguageSwitcher, null, null, _parent));
      _push(`</div><div class="register-page__header" data-v-62ae70ee><h1 class="register-page__title" data-v-62ae70ee>${ssrInterpolate(unref(t)("AUTH.REGISTER_TITLE"))}</h1><p class="register-page__subtitle" data-v-62ae70ee>${ssrInterpolate(unref(t)("AUTH.REGISTER_SUBTITLE"))}</p></div><form class="register-form" novalidate data-v-62ae70ee>`);
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
        autocomplete: "new-password",
        onInput: ($event) => clearFieldError("password")
      }, null, _parent));
      _push(ssrRenderComponent(unref(Input), {
        modelValue: formData.name,
        "onUpdate:modelValue": ($event) => formData.name = $event,
        label: unref(t)("AUTH.NAME"),
        error: errors.name ? unref(t)(`VALIDATION.${errors.name}`) : "",
        type: "text",
        autocomplete: "name",
        onInput: ($event) => clearFieldError("name")
      }, null, _parent));
      _push(`<button${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} class="${ssrRenderClass([{ "register-form__submit_loading": isSubmitting.value }, "register-form__submit"])}" type="submit" data-v-62ae70ee><span data-v-62ae70ee>${ssrInterpolate(isSubmitting.value ? unref(t)("AUTH.CREATING_ACCOUNT") : unref(t)("AUTH.REGISTER_BUTTON"))}</span></button>`);
      if (serverError.value) {
        _push(`<div class="register-form__server-error" data-v-62ae70ee>${ssrInterpolate(serverError.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form><div class="register-page__footer" data-v-62ae70ee><p class="register-page__footer-text" data-v-62ae70ee>${ssrInterpolate(unref(t)("AUTH.HAS_ACCOUNT"))} `);
      _push(ssrRenderComponent(_component_RouterLink, {
        to: `/${unref(locale)}/login`,
        class: "register-page__link"
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
      _push(`</p></div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/register/RegisterPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const RegisterPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-62ae70ee"]]);
export {
  RegisterPage as default
};
