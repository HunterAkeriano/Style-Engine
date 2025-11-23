import { defineComponent, ref, mergeProps, unref, useSSRContext, withCtx, createTextVNode, toDisplayString, computed, reactive, onMounted } from "vue";
import { ssrRenderAttrs, ssrRenderClass, ssrRenderAttr, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderStyle } from "vue/server-renderer";
import { RouterLink, RouterView } from "vue-router";
import { useI18n } from "vue-i18n";
import { u as useApi, s as setCookie, A as AUTH_TOKEN_KEY, r as removeCookie, g as getCookie, I as Icon, _ as _export_sfc, a as Input, B as Button, b as useTheme } from "../main.mjs";
import { c as changePasswordSchema } from "./auth-C1t_Avcw.js";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "vue-toastification";
import "@unhead/vue";
import "body-scroll-lock-upgrade";
import "axios";
import "zod";
const api = useApi();
class AuthAPI {
  async login(data) {
    const response = await api.post("/auth/login", data);
    setCookie(AUTH_TOKEN_KEY, response.data.token, { days: 1, path: "/" });
    api.setAuthToken(response.data.token);
    return response.data;
  }
  async register(data) {
    const response = await api.post("/auth/register", data);
    setCookie(AUTH_TOKEN_KEY, response.data.token, { days: 1, path: "/" });
    api.setAuthToken(response.data.token);
    return response.data;
  }
  async refresh() {
    const response = await api.post("/auth/refresh", void 0, { withCredentials: true });
    setCookie(AUTH_TOKEN_KEY, response.data.token, { days: 1, path: "/" });
    api.setAuthToken(response.data.token);
    return response.data;
  }
  async getProfile() {
    const response = await api.get("/profile");
    return response.data;
  }
  async updateProfile(data) {
    const response = await api.put("/profile", data);
    return response.data;
  }
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.post("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  }
  logout() {
    api.post("/auth/logout").catch(() => {
    });
    removeCookie(AUTH_TOKEN_KEY);
    api.removeAuthToken();
  }
  isAuthenticated() {
    return !!getCookie(AUTH_TOKEN_KEY);
  }
  async requestPasswordReset(email) {
    await api.post("/auth/forgot-password", { email });
  }
  async resetPassword(payload) {
    await api.post("/auth/reset-password", payload);
  }
  async changePassword(currentPassword, newPassword) {
    await api.post("/auth/change-password", { currentPassword, newPassword });
  }
}
const authAPI = new AuthAPI();
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "ProfileHero",
  __ssrInlineRender: true,
  props: {
    displayAvatarUrl: {},
    initials: {},
    isPaidUser: { type: Boolean },
    isPremiumUser: { type: Boolean },
    isUploading: { type: Boolean },
    selectedFile: {},
    uploadError: {},
    email: {},
    memberSince: {},
    subscriptionUntil: {}
  },
  emits: ["file-selected", "upload"],
  setup(__props, { emit: __emit }) {
    const { t } = useI18n();
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "profile-hero" }, _attrs))} data-v-d6d216de><div class="profile-hero__top" data-v-d6d216de><div class="profile-hero__avatar" data-v-d6d216de><div class="${ssrRenderClass(["profile-hero__photo", { "profile-hero__photo_premium": __props.isPremiumUser }])}" data-v-d6d216de>`);
      if (__props.displayAvatarUrl) {
        _push(`<img${ssrRenderAttr("src", __props.displayAvatarUrl)} alt="Avatar" class="profile-hero__image" data-v-d6d216de>`);
      } else {
        _push(`<div class="profile-hero__placeholder" data-v-d6d216de><span class="profile-hero__initials" data-v-d6d216de>${ssrInterpolate(__props.initials)}</span></div>`);
      }
      _push(`</div>`);
      if (__props.isPaidUser) {
        _push(ssrRenderComponent(unref(Icon), {
          size: 20,
          class: ["profile-hero__crown", { "profile-hero__crown_premium": __props.isPremiumUser }],
          name: "icon-crown"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (__props.isPremiumUser) {
        _push(`<div class="profile-hero__badge" data-v-d6d216de>Premium</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="profile-hero__meta" data-v-d6d216de><p class="profile-hero__label" data-v-d6d216de>${ssrInterpolate(unref(t)("AUTH.EMAIL"))}</p><p class="profile-hero__value" data-v-d6d216de>${ssrInterpolate(__props.email)}</p><p class="profile-hero__label" data-v-d6d216de>${ssrInterpolate(unref(t)("PROFILE.MEMBER_SINCE"))}</p><p class="profile-hero__value" data-v-d6d216de>${ssrInterpolate(__props.memberSince)}</p>`);
      if (__props.subscriptionUntil) {
        _push(`<p class="profile-hero__label" data-v-d6d216de>${ssrInterpolate(unref(t)("PROFILE.SUBSCRIPTION_UNTIL"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.subscriptionUntil) {
        _push(`<p class="profile-hero__value" data-v-d6d216de>${ssrInterpolate(__props.subscriptionUntil)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="profile-hero__controls" data-v-d6d216de><input type="file" accept="image/jpeg,image/jpg,image/png,image/gif" class="profile-hero__file-input" data-v-d6d216de><div class="profile-hero__buttons" data-v-d6d216de><button${ssrIncludeBooleanAttr(__props.isUploading) ? " disabled" : ""} type="button" class="profile-hero__btn" data-v-d6d216de>${ssrInterpolate(unref(t)("PROFILE.UPLOAD_AVATAR"))}</button>`);
      if (__props.selectedFile) {
        _push(`<button${ssrIncludeBooleanAttr(__props.isUploading) ? " disabled" : ""} type="button" class="profile-hero__btn profile-hero__btn_confirm" data-v-d6d216de>${ssrInterpolate(__props.isUploading ? unref(t)("PROFILE.SAVING") : unref(t)("PROFILE.SAVE_CHANGES"))}</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="profile-hero__hint" data-v-d6d216de>${ssrInterpolate(unref(t)("PROFILE.UPLOAD_HINT"))}</p>`);
      if (__props.uploadError) {
        _push(`<p class="profile-hero__error" data-v-d6d216de>${ssrInterpolate(__props.uploadError)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/profile/ProfileHero.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const ProfileHero = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-d6d216de"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ProfileInfoForm",
  __ssrInlineRender: true,
  props: {
    name: {},
    email: {},
    memberSince: {},
    isSaving: { type: Boolean },
    hasChanges: { type: Boolean },
    saveError: {},
    saveSuccess: { type: Boolean }
  },
  emits: ["update:name", "submit"],
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "profile-form" }, _attrs))} data-v-6594ce02><div class="profile-form__field" data-v-6594ce02>`);
      _push(ssrRenderComponent(unref(Input), {
        "model-value": __props.name,
        disabled: __props.isSaving,
        label: unref(t)("AUTH.NAME"),
        "onUpdate:modelValue": ($event) => _ctx.$emit("update:name", $event)
      }, null, _parent));
      _push(`</div><div class="profile-form__field" data-v-6594ce02>`);
      _push(ssrRenderComponent(unref(Input), {
        "model-value": __props.email,
        type: "email",
        label: unref(t)("AUTH.EMAIL"),
        disabled: ""
      }, null, _parent));
      _push(`</div><div class="profile-form__field" data-v-6594ce02><label class="profile-form__label" data-v-6594ce02>${ssrInterpolate(unref(t)("PROFILE.MEMBER_SINCE"))}</label><p class="profile-form__text" data-v-6594ce02>${ssrInterpolate(__props.memberSince)}</p></div>`);
      _push(ssrRenderComponent(unref(Button), {
        disabled: __props.isSaving || !__props.hasChanges,
        type: "submit",
        class: "profile-form__submit"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.isSaving ? unref(t)("PROFILE.SAVING") : unref(t)("PROFILE.SAVE_CHANGES"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.isSaving ? unref(t)("PROFILE.SAVING") : unref(t)("PROFILE.SAVE_CHANGES")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.saveError) {
        _push(`<p class="profile-form__error" data-v-6594ce02>${ssrInterpolate(__props.saveError)}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.saveSuccess) {
        _push(`<p class="profile-form__success" data-v-6594ce02>${ssrInterpolate(unref(t)("PROFILE.SAVE_SUCCESS"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/profile/ProfileInfoForm.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const ProfileInfoForm = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-6594ce02"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ProfilePasswordForm",
  __ssrInlineRender: true,
  props: {
    currentPassword: {},
    newPassword: {},
    confirmPassword: {},
    errors: {},
    isChanging: { type: Boolean },
    success: { type: Boolean },
    serverError: {}
  },
  emits: ["update:currentPassword", "update:newPassword", "update:confirmPassword", "submit", "reset-errors"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const { t } = useI18n();
    function onUpdate(field, value) {
      emit("reset-errors");
      if (field === "currentPassword") emit("update:currentPassword", value);
      if (field === "newPassword") emit("update:newPassword", value);
      if (field === "confirmPassword") emit("update:confirmPassword", value);
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "profile-form profile-form_password" }, _attrs))} data-v-8792a24f><div class="profile-form__header" data-v-8792a24f><div data-v-8792a24f><h3 class="profile-form__title" data-v-8792a24f>${ssrInterpolate(unref(t)("PROFILE.PASSWORD_SECTION_TITLE"))}</h3><p class="profile-form__subtitle" data-v-8792a24f>${ssrInterpolate(unref(t)("PROFILE.PASSWORD_SECTION_SUBTITLE"))}</p></div></div><div class="profile-form__field" data-v-8792a24f>`);
      _push(ssrRenderComponent(unref(Input), {
        "model-value": __props.currentPassword,
        disabled: __props.isChanging,
        type: "password",
        label: unref(t)("AUTH.CURRENT_PASSWORD"),
        error: __props.errors.currentPassword ? unref(t)(`VALIDATION.${__props.errors.currentPassword}`) : "",
        "onUpdate:modelValue": ($event) => onUpdate("currentPassword", $event)
      }, null, _parent));
      _push(`</div><div class="profile-form__field" data-v-8792a24f>`);
      _push(ssrRenderComponent(unref(Input), {
        "model-value": __props.newPassword,
        disabled: __props.isChanging,
        type: "password",
        label: unref(t)("AUTH.NEW_PASSWORD"),
        error: __props.errors.newPassword ? unref(t)(`VALIDATION.${__props.errors.newPassword}`) : "",
        "onUpdate:modelValue": ($event) => onUpdate("newPassword", $event)
      }, null, _parent));
      _push(`</div><div class="profile-form__field" data-v-8792a24f>`);
      _push(ssrRenderComponent(unref(Input), {
        "model-value": __props.confirmPassword,
        disabled: __props.isChanging,
        type: "password",
        label: unref(t)("AUTH.CONFIRM_PASSWORD"),
        error: __props.errors.confirmPassword ? unref(t)(`VALIDATION.${__props.errors.confirmPassword}`) : "",
        "onUpdate:modelValue": ($event) => onUpdate("confirmPassword", $event)
      }, null, _parent));
      _push(`</div>`);
      _push(ssrRenderComponent(unref(Button), {
        disabled: __props.isChanging,
        type: "submit",
        class: "profile-form__submit"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.isChanging ? unref(t)("PROFILE.SAVING") : unref(t)("AUTH.CHANGE_PASSWORD_BUTTON"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.isChanging ? unref(t)("PROFILE.SAVING") : unref(t)("AUTH.CHANGE_PASSWORD_BUTTON")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.success) {
        _push(`<p class="profile-form__success" data-v-8792a24f>${ssrInterpolate(unref(t)("PROFILE.CHANGE_PASSWORD_SUCCESS"))}</p>`);
      } else {
        _push(`<!---->`);
      }
      if (__props.serverError) {
        _push(`<p class="profile-form__error" data-v-8792a24f>${ssrInterpolate(__props.serverError)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/profile/ProfilePasswordForm.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const ProfilePasswordForm = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-8792a24f"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ProfileNavigation",
  __ssrInlineRender: true,
  props: {
    isAdmin: { type: Boolean },
    isSuperAdmin: { type: Boolean }
  },
  setup(__props) {
    const { t, locale } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<nav${ssrRenderAttrs(mergeProps({ class: "profile-page__navigation" }, _attrs))}>`);
      _push(ssrRenderComponent(unref(RouterLink), {
        to: { name: `${unref(locale)}-profile-gradients` },
        "active-class": "profile-page__nav-link_active",
        class: "profile-page__nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("PROFILE.NAV_GRADIENTS"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("PROFILE.NAV_GRADIENTS")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(RouterLink), {
        to: { name: `${unref(locale)}-profile-shadows` },
        "active-class": "profile-page__nav-link_active",
        class: "profile-page__nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("PROFILE.NAV_SHADOWS"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("PROFILE.NAV_SHADOWS")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(RouterLink), {
        to: { name: `${unref(locale)}-profile-animations` },
        "active-class": "profile-page__nav-link_active",
        class: "profile-page__nav-link"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("PROFILE.NAV_ANIMATIONS"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("PROFILE.NAV_ANIMATIONS")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (__props.isAdmin) {
        _push(ssrRenderComponent(unref(RouterLink), {
          to: { name: `${unref(locale)}-moderation` },
          class: "profile-page__nav-link profile-page__nav-link_admin"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("PROFILE.MODERATION_LINK"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("PROFILE.MODERATION_LINK")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (__props.isSuperAdmin) {
        _push(ssrRenderComponent(unref(RouterLink), {
          to: { name: `${unref(locale)}-moderation-users` },
          class: "profile-page__nav-link profile-page__nav-link_admin"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("PROFILE.USER_MANAGEMENT_LINK"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("PROFILE.USER_MANAGEMENT_LINK")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</nav>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/profile/ProfileNavigation.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ProfilePage",
  __ssrInlineRender: true,
  setup(__props) {
    const { t, locale } = useI18n();
    const { isDark } = useTheme();
    const mouseX = ref(0);
    const mouseY = ref(0);
    const celestialStyle = computed(() => ({
      transform: `translate(${mouseX.value * 0.03}px, ${mouseY.value * 0.03}px)`
    }));
    const selectedFile = ref(null);
    const previewUrl = ref(null);
    const isUploading = ref(false);
    const isSaving = ref(false);
    const uploadError = ref(null);
    const saveError = ref(null);
    const saveSuccess = ref(false);
    const passwordForm = reactive({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    const passwordErrors = reactive({});
    const passwordSuccess = ref(false);
    const passwordServerError = ref("");
    const isChangingPassword = ref(false);
    const user = ref(null);
    const formData = reactive({
      name: "",
      email: ""
    });
    const originalName = ref("");
    const userInitials = computed(() => {
      var _a, _b;
      if ((_a = user.value) == null ? void 0 : _a.name) {
        return user.value.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
      }
      if ((_b = user.value) == null ? void 0 : _b.email) {
        return user.value.email[0].toUpperCase();
      }
      return "?";
    });
    const displayAvatarUrl = computed(() => {
      var _a;
      return previewUrl.value || ((_a = user.value) == null ? void 0 : _a.avatarUrl) || null;
    });
    const memberSince = computed(() => {
      var _a;
      if (!((_a = user.value) == null ? void 0 : _a.createdAt)) return "";
      const date = new Date(user.value.createdAt);
      return date.toLocaleDateString(locale.value || void 0, { year: "numeric", month: "long" });
    });
    const subscriptionUntil = computed(() => {
      if (!user.value) return "";
      if (!user.value.subscriptionExpiresAt) return "";
      const expires = new Date(user.value.subscriptionExpiresAt);
      if (expires.getFullYear() >= 2100) return t("PROFILE.SUBSCRIPTION_FOREVER");
      return expires.toLocaleDateString(locale.value || void 0, { year: "numeric", month: "long", day: "numeric" });
    });
    const hasChanges = computed(() => formData.name !== originalName.value);
    const isAdmin = computed(() => {
      var _a;
      return Boolean((_a = user.value) == null ? void 0 : _a.isAdmin);
    });
    const isSuperAdmin = computed(() => {
      var _a;
      return Boolean((_a = user.value) == null ? void 0 : _a.isSuperAdmin);
    });
    const isPaidUser = computed(() => {
      var _a, _b;
      return ((_a = user.value) == null ? void 0 : _a.subscriptionTier) === "pro" || ((_b = user.value) == null ? void 0 : _b.subscriptionTier) === "premium";
    });
    const isPremiumUser = computed(() => {
      var _a;
      return ((_a = user.value) == null ? void 0 : _a.subscriptionTier) === "premium";
    });
    function resetPasswordErrors() {
      passwordErrors.currentPassword = "";
      passwordErrors.newPassword = "";
      passwordErrors.confirmPassword = "";
    }
    async function loadProfile() {
      try {
        const response = await authAPI.getProfile();
        user.value = response.user;
        formData.name = response.user.name || "";
        formData.email = response.user.email;
        originalName.value = response.user.name || "";
      } catch (error) {
        console.error("Failed to load profile", error);
      }
    }
    function handleFileSelect(event) {
      var _a;
      const target = event.target;
      const file = (_a = target.files) == null ? void 0 : _a[0];
      uploadError.value = null;
      saveSuccess.value = false;
      if (!file) {
        selectedFile.value = null;
        previewUrl.value = null;
        return;
      }
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        uploadError.value = t("PROFILE.UPLOAD_FORMAT_ERROR");
        selectedFile.value = null;
        previewUrl.value = null;
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        uploadError.value = t("PROFILE.UPLOAD_SIZE_ERROR");
        selectedFile.value = null;
        previewUrl.value = null;
        return;
      }
      selectedFile.value = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        var _a2;
        previewUrl.value = (_a2 = e.target) == null ? void 0 : _a2.result;
      };
      reader.readAsDataURL(file);
    }
    async function handleUpload() {
      if (!selectedFile.value) return;
      isUploading.value = true;
      uploadError.value = null;
      saveSuccess.value = false;
      try {
        const response = await authAPI.uploadAvatar(selectedFile.value);
        user.value = response.user;
        selectedFile.value = null;
        previewUrl.value = null;
      } catch (error) {
        uploadError.value = (error == null ? void 0 : error.message) || t("PROFILE.UPLOAD_ERROR");
      } finally {
        isUploading.value = false;
      }
    }
    function updateName(value) {
      formData.name = value;
      saveSuccess.value = false;
    }
    async function handleProfileUpdate() {
      if (!hasChanges.value) return;
      isSaving.value = true;
      saveError.value = null;
      saveSuccess.value = false;
      try {
        const response = await authAPI.updateProfile({
          name: formData.name || void 0
        });
        user.value = response.user;
        originalName.value = response.user.name || "";
        saveSuccess.value = true;
        setTimeout(() => {
          saveSuccess.value = false;
        }, 3e3);
      } catch (error) {
        saveError.value = (error == null ? void 0 : error.message) || t("VALIDATION.SERVER_ERROR");
      } finally {
        isSaving.value = false;
      }
    }
    async function handlePasswordChange() {
      resetPasswordErrors();
      passwordSuccess.value = false;
      passwordServerError.value = "";
      const result = changePasswordSchema.safeParse(passwordForm);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          const field = issue.path[0];
          passwordErrors[field] = issue.message;
        });
        return;
      }
      isChangingPassword.value = true;
      try {
        await authAPI.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
        passwordSuccess.value = true;
        passwordForm.currentPassword = "";
        passwordForm.newPassword = "";
        passwordForm.confirmPassword = "";
      } catch (err) {
        passwordServerError.value = (err == null ? void 0 : err.message) || t("PROFILE.CHANGE_PASSWORD_ERROR");
      } finally {
        isChangingPassword.value = false;
      }
    }
    onMounted(() => {
      loadProfile();
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "profile-page" }, _attrs))}><div class="profile-page__sky">`);
      if (unref(isDark)) {
        _push(`<span class="profile-page__stars profile-page__stars-1"></span>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(isDark)) {
        _push(`<span class="profile-page__stars profile-page__stars-2"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<span class="${ssrRenderClass([`profile-page__celestial_${unref(isDark) ? "moon" : "sun"}`, "profile-page__celestial"])}" style="${ssrRenderStyle(celestialStyle.value)}"></span>`);
      if (!unref(isDark)) {
        _push(`<span class="profile-page__cloud profile-page__cloud-1"></span>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isDark)) {
        _push(`<span class="profile-page__cloud profile-page__cloud-2"></span>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isDark)) {
        _push(`<span class="profile-page__cloud profile-page__cloud-3"></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="profile-page__container"><div class="profile-page__header"><h1 class="profile-page__title">${ssrInterpolate(unref(t)("PROFILE.TITLE"))}</h1><p class="profile-page__subtitle">${ssrInterpolate(unref(t)("PROFILE.SUBTITLE"))}</p></div><div class="profile-page__content">`);
      _push(ssrRenderComponent(ProfileHero, {
        "display-avatar-url": displayAvatarUrl.value,
        initials: userInitials.value,
        "is-paid-user": isPaidUser.value,
        "is-premium-user": isPremiumUser.value,
        "is-uploading": isUploading.value,
        "selected-file": selectedFile.value,
        "upload-error": uploadError.value,
        email: formData.email,
        "member-since": memberSince.value,
        "subscription-until": subscriptionUntil.value,
        onFileSelected: handleFileSelect,
        onUpload: handleUpload
      }, null, _parent));
      _push(ssrRenderComponent(ProfileInfoForm, {
        name: formData.name,
        email: formData.email,
        "member-since": memberSince.value,
        "is-saving": isSaving.value,
        "has-changes": hasChanges.value,
        "save-error": saveError.value,
        "save-success": saveSuccess.value,
        "onUpdate:name": updateName,
        onSubmit: handleProfileUpdate
      }, null, _parent));
      _push(ssrRenderComponent(ProfilePasswordForm, {
        "current-password": passwordForm.currentPassword,
        "new-password": passwordForm.newPassword,
        "confirm-password": passwordForm.confirmPassword,
        errors: passwordErrors,
        "is-changing": isChangingPassword.value,
        success: passwordSuccess.value,
        "server-error": passwordServerError.value,
        "onUpdate:currentPassword": (value) => passwordForm.currentPassword = value,
        "onUpdate:newPassword": (value) => passwordForm.newPassword = value,
        "onUpdate:confirmPassword": (value) => passwordForm.confirmPassword = value,
        onResetErrors: resetPasswordErrors,
        onSubmit: handlePasswordChange
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        "is-admin": isAdmin.value,
        "is-super-admin": isSuperAdmin.value
      }, null, _parent));
      _push(`<div class="profile-page__router">`);
      _push(ssrRenderComponent(unref(RouterView), null, null, _parent));
      _push(`</div></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/profile/ProfilePage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
