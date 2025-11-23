import { defineComponent, ref, reactive, computed, onMounted, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, withModifiers, createBlock, createCommentVNode, openBlock, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderClass } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { z } from "zod";
import { S as Select, B as Button, T as Table, M as Modal, a as Input, _ as _export_sfc } from "../main.mjs";
import { useToast } from "vue-toastification";
import { a as getModerationUsers, u as updateUser, d as deleteUser } from "./users-w9z5Y5IP.js";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "vue-router";
import "@unhead/vue";
import "body-scroll-lock-upgrade";
import "axios";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "UserManagementPage",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const toast = useToast();
    const users = ref([]);
    const loading = ref(false);
    const error = ref("");
    const pagination = ref({
      page: 1,
      limit: 50
    });
    const filters = reactive({
      tier: "all"
    });
    const loadedCount = computed(() => users.value.length);
    const selectedUser = ref(null);
    const isModalOpen = ref(false);
    const modalLoading = ref(false);
    const form = reactive({
      name: "",
      email: "",
      password: "",
      subscriptionTier: "free",
      subscriptionDuration: "month"
    });
    const formErrors = ref({});
    const userEditSchema = z.object({
      email: z.string().min(1, { message: t("VALIDATION.EMAIL_REQUIRED") }).email({ message: t("VALIDATION.EMAIL_INVALID") }),
      name: z.string().min(1, { message: t("VALIDATION.NAME_MIN") }).max(120, { message: t("VALIDATION.NAME_MAX") }).optional(),
      password: z.string().min(8, { message: t("VALIDATION.PASSWORD_MIN") }).optional(),
      subscriptionTier: z.enum(["free", "pro", "premium"]),
      subscriptionDuration: z.enum(["month", "forever", "free"])
    });
    const tierOptions = computed(() => [
      { value: "all", label: t("MODERATION.USERS_FILTER_ALL") },
      { value: "free", label: t("MODERATION.UNIT.FREE") },
      { value: "pro", label: t("MODERATION.UNIT.PRO") },
      { value: "premium", label: t("MODERATION.UNIT.PREMIUM") }
    ]);
    const durationOptions = computed(() => [
      { value: "month", label: t("MODERATION.USER_MODAL_DURATION_MONTH") },
      { value: "forever", label: t("MODERATION.USER_MODAL_DURATION_FOREVER") }
    ]);
    const columns = computed(() => [
      { key: "email", label: t("MODERATION.USERS_TABLE.EMAIL"), sortable: true },
      { key: "name", label: t("MODERATION.USERS_TABLE.NAME"), sortable: true },
      { key: "subscriptionTier", label: t("MODERATION.USERS_TABLE.PLAN"), sortable: true },
      { key: "createdAt", label: t("MODERATION.USERS_TABLE.CREATED"), sortable: true },
      { key: "actions", label: t("MODERATION.USERS_TABLE.ACTIONS") }
    ]);
    function formatDate(value) {
      return new Date(value).toLocaleString();
    }
    async function loadUsers() {
      loading.value = true;
      error.value = "";
      try {
        const params = {
          page: pagination.value.page,
          limit: pagination.value.limit,
          tier: filters.tier
        };
        const response = await getModerationUsers(params);
        users.value = response.users;
      } catch (err) {
        error.value = (err == null ? void 0 : err.message) || t("MODERATION.LOAD_ERROR");
        toast.error(error.value);
      } finally {
        loading.value = false;
      }
    }
    function openEdit(user) {
      clearFormErrors();
      selectedUser.value = user;
      form.name = user.name ?? "";
      form.email = user.email;
      form.subscriptionTier = user.subscriptionTier;
      form.subscriptionDuration = user.subscriptionTier === "free" ? "free" : "month";
      form.password = "";
      isModalOpen.value = true;
    }
    function closeModal() {
      clearFormErrors();
      isModalOpen.value = false;
      selectedUser.value = null;
      form.password = "";
    }
    function clearFormErrors() {
      formErrors.value = {};
    }
    async function submitEdit() {
      var _a;
      if (!selectedUser.value) return;
      const trimmedName = form.name.trim();
      const trimmedEmail = form.email.trim();
      const parsed = userEditSchema.safeParse({
        email: trimmedEmail,
        name: trimmedName || void 0,
        password: form.password || void 0,
        subscriptionTier: form.subscriptionTier,
        subscriptionDuration: form.subscriptionTier === "free" ? "free" : form.subscriptionDuration
      });
      if (!parsed.success) {
        formErrors.value = parsed.error.issues.reduce((acc, issue) => {
          const key = String(issue.path[0] ?? "form");
          acc[key] = issue.message;
          return acc;
        }, {});
        toast.error(((_a = parsed.error.issues[0]) == null ? void 0 : _a.message) || t("VALIDATION.SERVER_ERROR"));
        return;
      }
      formErrors.value = {};
      modalLoading.value = true;
      try {
        const payload = {
          email: parsed.data.email,
          subscriptionTier: parsed.data.subscriptionTier,
          subscriptionDuration: parsed.data.subscriptionDuration
        };
        if (parsed.data.name) {
          payload.name = parsed.data.name;
        }
        if (parsed.data.password) {
          payload.password = parsed.data.password;
        }
        const updated = await updateUser(selectedUser.value.id, payload);
        users.value = users.value.map((user) => user.id === updated.id ? updated : user);
        toast.success(t("MODERATION.USER_UPDATE_SUCCESS"));
        closeModal();
      } catch (err) {
        toast.error((err == null ? void 0 : err.message) || t("MODERATION.USER_UPDATE_ERROR"));
      } finally {
        modalLoading.value = false;
      }
    }
    async function confirmDelete(user) {
      if (!confirm(t("MODERATION.DELETE_CONFIRM", { name: user.email }))) return;
      try {
        await deleteUser(user.id);
        users.value = users.value.filter((row) => row.id !== user.id);
        toast.success(t("MODERATION.USER_DELETE_SUCCESS"));
      } catch (err) {
        toast.error((err == null ? void 0 : err.message) || t("MODERATION.USER_DELETE_ERROR"));
      }
    }
    onMounted(loadUsers);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "user-management-page" }, _attrs))} data-v-08e11003><header class="user-management-page__header" data-v-08e11003><div class="user-management-page__hero" data-v-08e11003><span class="user-management-page__tag" data-v-08e11003>${ssrInterpolate(unref(t)("MODERATION.USERS_TAG"))}</span><div data-v-08e11003><h1 data-v-08e11003>${ssrInterpolate(unref(t)("MODERATION.USERS_TITLE"))}</h1><p class="user-management-page__subtitle" data-v-08e11003>${ssrInterpolate(unref(t)("MODERATION.USERS_SUBTITLE"))}</p><p class="user-management-page__intro" data-v-08e11003>${ssrInterpolate(unref(t)("MODERATION.USERS_INTRO"))}</p><p class="user-management-page__count" data-v-08e11003>${ssrInterpolate(unref(t)("MODERATION.USERS_COUNT", { count: loadedCount.value }))}</p></div></div><div class="user-management-page__filters" data-v-08e11003>`);
      _push(ssrRenderComponent(unref(Select), {
        modelValue: filters.tier,
        "onUpdate:modelValue": [($event) => filters.tier = $event, loadUsers],
        options: tierOptions.value,
        label: unref(t)("MODERATION.USERS_FILTER_LABEL")
      }, null, _parent));
      _push(ssrRenderComponent(unref(Button), {
        variant: "secondary",
        size: "md",
        disabled: loading.value,
        onClick: loadUsers
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("MODERATION.REFRESH"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("MODERATION.REFRESH")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></header>`);
      if (error.value) {
        _push(`<div class="user-management-page__error" data-v-08e11003>${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (!loading.value || users.value.length) {
        _push(`<div class="user-management-page__table-card" data-v-08e11003>`);
        _push(ssrRenderComponent(unref(Table), {
          columns: columns.value,
          rows: users.value,
          "row-key": "id",
          size: "md",
          hoverable: "",
          "sticky-header": ""
        }, {
          "cell-subscriptionTier": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span class="${ssrRenderClass([`user-management-page__badge_${value}`, "user-management-page__badge"])}" data-v-08e11003${_scopeId}>${ssrInterpolate(unref(t)(`MODERATION.UNIT.${value.toUpperCase()}`))}</span>`);
            } else {
              return [
                createVNode("span", {
                  class: ["user-management-page__badge", `user-management-page__badge_${value}`]
                }, toDisplayString(unref(t)(`MODERATION.UNIT.${value.toUpperCase()}`)), 3)
              ];
            }
          }),
          "cell-createdAt": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(formatDate(value))}`);
            } else {
              return [
                createTextVNode(toDisplayString(formatDate(value)), 1)
              ];
            }
          }),
          "cell-actions": withCtx(({ row }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Button), {
                size: "sm",
                variant: "ghost",
                onClick: ($event) => openEdit(row)
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(t)("MODERATION.EDIT"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(t)("MODERATION.EDIT")), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(unref(Button), {
                size: "sm",
                variant: "outline",
                class: "user-management-page__delete",
                onClick: ($event) => confirmDelete(row)
              }, {
                default: withCtx((_, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(t)("MODERATION.DELETE"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(t)("MODERATION.DELETE")), 1)
                    ];
                  }
                }),
                _: 2
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(Button), {
                  size: "sm",
                  variant: "ghost",
                  onClick: ($event) => openEdit(row)
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("MODERATION.EDIT")), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"]),
                createVNode(unref(Button), {
                  size: "sm",
                  variant: "outline",
                  class: "user-management-page__delete",
                  onClick: ($event) => confirmDelete(row)
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("MODERATION.DELETE")), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (loading.value && !users.value.length) {
        _push(`<div class="user-management-page__empty" data-v-08e11003>${ssrInterpolate(unref(t)("MODERATION.LOADING"))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(unref(Modal), {
        visible: isModalOpen.value,
        title: unref(t)("MODERATION.USER_MODAL_TITLE"),
        subtitle: unref(t)("MODERATION.USER_MODAL_SUBTITLE"),
        "show-actions": "",
        closable: true,
        "close-on-backdrop": true,
        "confirm-text": modalLoading.value ? unref(t)("MODERATION.LOADING") : unref(t)("MODERATION.USER_MODAL_SAVE"),
        "cancel-text": unref(t)("COMMON.CANCEL"),
        "confirm-disabled": modalLoading.value,
        onConfirm: submitEdit,
        onClose: closeModal
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<form class="user-management-page__form" data-v-08e11003${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Input), {
              modelValue: form.email,
              "onUpdate:modelValue": ($event) => form.email = $event,
              label: unref(t)("MODERATION.USERS_TABLE.EMAIL"),
              error: formErrors.value.email,
              required: ""
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Input), {
              modelValue: form.name,
              "onUpdate:modelValue": ($event) => form.name = $event,
              label: unref(t)("MODERATION.USERS_TABLE.NAME"),
              error: formErrors.value.name
            }, null, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Select), {
              modelValue: form.subscriptionTier,
              "onUpdate:modelValue": ($event) => form.subscriptionTier = $event,
              options: tierOptions.value.slice(1),
              label: unref(t)("MODERATION.USERS_TABLE.PLAN")
            }, null, _parent2, _scopeId));
            if (form.subscriptionTier !== "free") {
              _push2(ssrRenderComponent(unref(Select), {
                modelValue: form.subscriptionDuration,
                "onUpdate:modelValue": ($event) => form.subscriptionDuration = $event,
                options: durationOptions.value,
                label: unref(t)("MODERATION.USER_MODAL_DURATION")
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
            _push2(ssrRenderComponent(unref(Input), {
              modelValue: form.password,
              "onUpdate:modelValue": ($event) => form.password = $event,
              type: "password",
              label: unref(t)("MODERATION.USER_MODAL_PASSWORD"),
              hint: unref(t)("MODERATION.USER_MODAL_PASSWORD_HINT"),
              error: formErrors.value.password
            }, null, _parent2, _scopeId));
            _push2(`</form>`);
          } else {
            return [
              createVNode("form", {
                class: "user-management-page__form",
                onSubmit: withModifiers(submitEdit, ["prevent"])
              }, [
                createVNode(unref(Input), {
                  modelValue: form.email,
                  "onUpdate:modelValue": ($event) => form.email = $event,
                  label: unref(t)("MODERATION.USERS_TABLE.EMAIL"),
                  error: formErrors.value.email,
                  required: ""
                }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "error"]),
                createVNode(unref(Input), {
                  modelValue: form.name,
                  "onUpdate:modelValue": ($event) => form.name = $event,
                  label: unref(t)("MODERATION.USERS_TABLE.NAME"),
                  error: formErrors.value.name
                }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "error"]),
                createVNode(unref(Select), {
                  modelValue: form.subscriptionTier,
                  "onUpdate:modelValue": ($event) => form.subscriptionTier = $event,
                  options: tierOptions.value.slice(1),
                  label: unref(t)("MODERATION.USERS_TABLE.PLAN")
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "label"]),
                form.subscriptionTier !== "free" ? (openBlock(), createBlock(unref(Select), {
                  key: 0,
                  modelValue: form.subscriptionDuration,
                  "onUpdate:modelValue": ($event) => form.subscriptionDuration = $event,
                  options: durationOptions.value,
                  label: unref(t)("MODERATION.USER_MODAL_DURATION")
                }, null, 8, ["modelValue", "onUpdate:modelValue", "options", "label"])) : createCommentVNode("", true),
                createVNode(unref(Input), {
                  modelValue: form.password,
                  "onUpdate:modelValue": ($event) => form.password = $event,
                  type: "password",
                  label: unref(t)("MODERATION.USER_MODAL_PASSWORD"),
                  hint: unref(t)("MODERATION.USER_MODAL_PASSWORD_HINT"),
                  error: formErrors.value.password
                }, null, 8, ["modelValue", "onUpdate:modelValue", "label", "hint", "error"])
              ], 32)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/moderation/UserManagementPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const UserManagementPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-08e11003"]]);
export {
  UserManagementPage as default
};
