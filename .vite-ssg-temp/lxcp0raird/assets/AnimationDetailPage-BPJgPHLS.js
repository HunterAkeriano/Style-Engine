import { defineComponent, ref, computed, defineAsyncComponent, onMounted, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, resolveDynamicComponent, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderVNode } from "vue/server-renderer";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { d as useAuthStore, N as NavLink, B as Button, M as Modal, a as Input, S as Select, c as copyToClipboard, _ as _export_sfc } from "../main.mjs";
import { useToast } from "vue-toastification";
import { a as animationExamples } from "./examples-data-CLm7QPwV.js";
import { c as createSave, a as listSaves } from "./saves-Czai1rJv.js";
import { g as getUserLimit, S as SubscriptionTier } from "./pricing-DAHM4Bo5.js";
import { e as evaluateSaveQuota, r as resolveSubscriptionTier } from "./save-quota-Bgxdrz7t.js";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "@unhead/vue";
import "body-scroll-lock-upgrade";
import "axios";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AnimationDetailPage",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const router = useRouter();
    const { t, locale } = useI18n();
    const copied = ref(false);
    const toast = useToast();
    const authStore = useAuthStore();
    const showAuthModal = ref(false);
    const showSaveModal = ref(false);
    const showProLimitModal = ref(false);
    const showExportModal = ref(false);
    const showExportProModal = ref(false);
    const saveName = ref("");
    const saveContext = ref(null);
    const entityLabel = computed(() => t("PROFILE.SAVED_ANIMATIONS"));
    const proSaveLimit = getUserLimit(SubscriptionTier.PRO, "savedTemplates");
    const proQuota = ref(null);
    const proLimitSubtitle = computed(
      () => {
        var _a;
        return t("PROFILE.PRO_LIMIT_MESSAGE", {
          limit: ((_a = proQuota.value) == null ? void 0 : _a.limit) ?? proSaveLimit,
          entity: entityLabel.value
        });
      }
    );
    function getUserTier() {
      var _a;
      return resolveSubscriptionTier(
        ((_a = authStore.user) == null ? void 0 : _a.subscriptionTier) ?? authStore.userPlan
      );
    }
    const savedAnimationHashes = ref(/* @__PURE__ */ new Set());
    const savingExampleId = ref(null);
    const animationPayloadHash = computed(() => {
      const payload = selectedExample.value;
      if (!payload) return "";
      return JSON.stringify({ html: payload.html, css: payload.css });
    });
    const isAnimationSaved = computed(
      () => animationPayloadHash.value ? savedAnimationHashes.value.has(animationPayloadHash.value) : false
    );
    const exportFormat = ref("html");
    const animationExportFormats = [
      { label: "HTML", value: "html" },
      { label: "CSS", value: "css" },
      { label: "JSON", value: "json" }
    ];
    const exportCode = computed(() => {
      const example = selectedExample.value;
      if (!example) return "";
      if (exportFormat.value === "css") {
        return example.css;
      }
      if (exportFormat.value === "json") {
        return JSON.stringify({ html: example.html, css: example.css }, null, 2);
      }
      return `${example.html}

<style>
${example.css}
</style>`;
    });
    const exportFileName = computed(() => {
      var _a;
      return `${((_a = selectedExample.value) == null ? void 0 : _a.id) ?? "animation"}.${exportFormat.value}`;
    });
    const examplesWithComponents = animationExamples.map((example) => ({
      ...example,
      component: defineAsyncComponent(example.component)
    }));
    const selectedExample = computed(
      () => examplesWithComponents.find((example) => example.id === route.params.id) ?? examplesWithComponents[0]
    );
    const title = computed(() => t(selectedExample.value.titleKey));
    const description = computed(() => t(selectedExample.value.descriptionKey));
    const snippet = computed(
      () => selectedExample.value ? `${selectedExample.value.html}

<style>
${selectedExample.value.css}
</style>` : ""
    );
    const highlightedCode = computed(() => {
      const value = snippet.value;
      const escaped = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return escaped.replace(
        /&lt;\/?([a-z0-9-]+)([^&]*?)&gt;/gi,
        (full, tagName, attrs) => {
          const isClosing = full.startsWith("&lt;/");
          const tagPrefix = isClosing ? "/" : "";
          const formattedAttrs = attrs.replace(
            /\s([a-z-:]+)=("[^"]*")/gi,
            (_attrFull, name, valueAttr) => ` <span class="code-attr">${name}</span>=<span class="code-value">${valueAttr}</span>`
          );
          return `<span class="code-tag">&lt;${tagPrefix}${tagName}</span>${formattedAttrs}<span class="code-tag">&gt;</span>`;
        }
      ).replace(/({|})/g, '<span class="code-brace">$1</span>');
    });
    async function handleCopy() {
      const ok = await copyToClipboard(snippet.value);
      if (ok) {
        copied.value = true;
        toast.success(t("COMMON.COPIED_TO_CLIPBOARD"));
        setTimeout(() => copied.value = false, 1500);
      }
    }
    async function handleSaveExample() {
      if (!selectedExample.value) return;
      if (!authStore.isAuthenticated) {
        showAuthModal.value = true;
        return;
      }
      saveContext.value = {
        defaultName: t(selectedExample.value.titleKey),
        payload: {
          html: selectedExample.value.html,
          css: selectedExample.value.css
        }
      };
      saveName.value = t(selectedExample.value.titleKey);
      showSaveModal.value = true;
    }
    function handleExportRequest() {
      if (!authStore.isAuthenticated) {
        showAuthModal.value = true;
        return;
      }
      const tier = getUserTier();
      if (!tier || tier === SubscriptionTier.FREE) {
        showExportProModal.value = true;
        return;
      }
      showExportModal.value = true;
    }
    function handleExportUpgrade() {
      showExportProModal.value = false;
      router.push({
        path: `/${locale.value}/about`,
        query: { plan: "premium" }
      });
    }
    async function copyExportCode() {
      if (!exportCode.value) return;
      const ok = await copyToClipboard(exportCode.value);
      toast[ok ? "success" : "error"](ok ? t("COMMON.COPIED_TO_CLIPBOARD") : t("COMMON.COPY_FAILED"));
    }
    function downloadExportCode() {
      const blob = new Blob([exportCode.value], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = exportFileName.value;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
    async function confirmSaveExample(name) {
      var _a;
      if (isAnimationSaved.value) return;
      const context = saveContext.value;
      if (!context) return;
      const finalName = name || context.defaultName;
      showSaveModal.value = false;
      const allowed = await ensureProQuota("animation");
      if (!allowed) {
        return;
      }
      savingExampleId.value = ((_a = selectedExample.value) == null ? void 0 : _a.id) ?? null;
      try {
        await createSave("animation", finalName, context.payload);
        toast.success(t("COMMON.SAVE_SUCCESS", { entity: entityLabel.value }));
        savedAnimationHashes.value.add(JSON.stringify(context.payload));
      } catch (error) {
        if ((error == null ? void 0 : error.status) === 409) {
          toast.error(t("COMMON.ALREADY_SAVED", { entity: entityLabel.value }));
        } else {
          toast.error(
            (error == null ? void 0 : error.message) || t("COMMON.SAVE_ERROR", { entity: entityLabel.value })
          );
        }
      } finally {
        savingExampleId.value = null;
        saveContext.value = null;
      }
    }
    function closeSaveModal() {
      showSaveModal.value = false;
      saveContext.value = null;
    }
    async function ensureProQuota(category) {
      const quota = await evaluateSaveQuota(category);
      proQuota.value = quota;
      if (!quota.allowed) {
        showProLimitModal.value = true;
        return false;
      }
      return true;
    }
    function handleProLimitConfirm() {
      showProLimitModal.value = false;
      router.push({
        path: `/${locale.value}/about`,
        query: { plan: "premium" }
      });
    }
    async function loadSavedAnimations() {
      if (!authStore.isAuthenticated) {
        savedAnimationHashes.value = /* @__PURE__ */ new Set();
        return;
      }
      try {
        const saved = await listSaves("animation");
        savedAnimationHashes.value = new Set(saved.map((item) => JSON.stringify(item.payload)));
      } catch (error) {
        console.warn("Failed to load saved animations", error);
      }
    }
    function handleAuthConfirm() {
      showAuthModal.value = false;
      router.push({
        name: `${locale.value}-login`,
        query: { redirect: route.fullPath }
      });
    }
    onMounted(() => {
      loadSavedAnimations();
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "animation-detail" }, _attrs))} data-v-fee16a0c><div class="animation-detail__background" data-v-fee16a0c><span class="animation-detail__beam animation-detail__beam_left" data-v-fee16a0c></span><span class="animation-detail__beam animation-detail__beam_right" data-v-fee16a0c></span></div><div class="container animation-detail__container" data-v-fee16a0c><div class="animation-detail__header" data-v-fee16a0c><div data-v-fee16a0c><p class="animation-detail__eyebrow" data-v-fee16a0c>${ssrInterpolate(unref(t)("ANIMATION.EYEBROW"))}</p><h1 class="animation-detail__title" data-v-fee16a0c>${ssrInterpolate(title.value)}</h1><p class="animation-detail__subtitle" data-v-fee16a0c>${ssrInterpolate(description.value)}</p></div><div class="animation-detail__actions" data-v-fee16a0c>`);
      _push(ssrRenderComponent(unref(NavLink), {
        to: "/animation",
        "class-name": "button button_secondary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("ANIMATION.BACK"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("ANIMATION.BACK")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="animation-detail__layout" data-v-fee16a0c><div class="animation-detail__preview" data-v-fee16a0c><p class="animation-card__tag" data-v-fee16a0c>${ssrInterpolate(unref(t)("ANIMATION.PREVIEW"))}</p>`);
      if (selectedExample.value) {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(selectedExample.value.component), null, null), _parent);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="animation-detail__preview-actions" data-v-fee16a0c>`);
      _push(ssrRenderComponent(unref(Button), {
        variant: "primary",
        size: "sm",
        onClick: handleCopy
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(copied.value ? unref(t)("COMMON.COPIED_TO_CLIPBOARD") : unref(t)("ANIMATION.COPY_SNIPPET"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(copied.value ? unref(t)("COMMON.COPIED_TO_CLIPBOARD") : unref(t)("ANIMATION.COPY_SNIPPET")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Button), {
        variant: "secondary",
        size: "sm",
        onClick: handleExportRequest
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("COMMON.EXPORT"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("COMMON.EXPORT")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Button), {
        variant: "ghost",
        size: "sm",
        onClick: handleSaveExample,
        disabled: savingExampleId.value === ((_a = selectedExample.value) == null ? void 0 : _a.id) || isAnimationSaved.value
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("ANIMATION.SAVE"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("ANIMATION.SAVE")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div><div class="animation-detail__code" data-v-fee16a0c><div class="animation-detail__code-head" data-v-fee16a0c><div class="animation-card__code-controls" data-v-fee16a0c><span data-v-fee16a0c></span><span data-v-fee16a0c></span><span data-v-fee16a0c></span></div><p class="animation-card__tag" data-v-fee16a0c>${ssrInterpolate(unref(t)("ANIMATION.HTML_CSS"))}</p></div><pre class="code-block" data-v-fee16a0c>${highlightedCode.value ?? ""}</pre></div></div>`);
      _push(ssrRenderComponent(unref(Modal), {
        visible: showAuthModal.value,
        title: unref(t)("COMMON.AUTH_REQUIRED_TITLE"),
        subtitle: unref(t)("COMMON.AUTH_REQUIRED_DESCRIPTION"),
        "show-actions": "",
        "confirm-text": unref(t)("COMMON.AUTH_REQUIRED_CONFIRM"),
        "cancel-text": unref(t)("COMMON.AUTH_REQUIRED_CLOSE"),
        onConfirm: handleAuthConfirm,
        onClose: ($event) => showAuthModal.value = false
      }, null, _parent));
      _push(ssrRenderComponent(unref(Modal), {
        visible: showSaveModal.value,
        title: unref(t)("PROFILE.SAVES_TITLE"),
        subtitle: unref(t)("PROFILE.SAVES_SUBTITLE"),
        onClose: closeSaveModal
      }, {
        footer: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="modal__actions" data-v-fee16a0c${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Button), {
              variant: "ghost",
              size: "md",
              onClick: closeSaveModal
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("COMMON.CANCEL"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("COMMON.CANCEL")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Button), {
              variant: "primary",
              size: "md",
              onClick: ($event) => confirmSaveExample(saveName.value)
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("COMMON.SAVE"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("COMMON.SAVE")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "modal__actions" }, [
                createVNode(unref(Button), {
                  variant: "ghost",
                  size: "md",
                  onClick: closeSaveModal
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("COMMON.CANCEL")), 1)
                  ]),
                  _: 1
                }),
                createVNode(unref(Button), {
                  variant: "primary",
                  size: "md",
                  onClick: ($event) => confirmSaveExample(saveName.value)
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("COMMON.SAVE")), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Input), {
              modelValue: saveName.value,
              "onUpdate:modelValue": ($event) => saveName.value = $event,
              label: unref(t)("COMMON.NAME")
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(Input), {
                modelValue: saveName.value,
                "onUpdate:modelValue": ($event) => saveName.value = $event,
                label: unref(t)("COMMON.NAME")
              }, null, 8, ["modelValue", "onUpdate:modelValue", "label"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Modal), {
        visible: showProLimitModal.value,
        title: unref(t)("PROFILE.PRO_LIMIT_TITLE"),
        subtitle: proLimitSubtitle.value,
        "show-actions": "",
        "confirm-text": unref(t)("PROFILE.PRO_LIMIT_ACTION"),
        "cancel-text": unref(t)("COMMON.CANCEL"),
        onConfirm: handleProLimitConfirm,
        onClose: ($event) => showProLimitModal.value = false
      }, null, _parent));
      _push(ssrRenderComponent(unref(Modal), {
        visible: showExportModal.value,
        title: unref(t)("COMMON.EXPORT"),
        onClose: ($event) => showExportModal.value = false
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="animation-export" data-v-fee16a0c${_scopeId}><div class="animation-export__toolbar" data-v-fee16a0c${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Select), {
              modelValue: exportFormat.value,
              "onUpdate:modelValue": ($event) => exportFormat.value = $event,
              options: animationExportFormats
            }, null, _parent2, _scopeId));
            _push2(`<div class="animation-export__actions" data-v-fee16a0c${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Button), {
              variant: "outline",
              size: "sm",
              onClick: copyExportCode
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("COMMON.COPY"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("COMMON.COPY")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(ssrRenderComponent(unref(Button), {
              variant: "ghost",
              size: "sm",
              onClick: downloadExportCode
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`${ssrInterpolate(unref(t)("COMMON.DOWNLOAD"))}`);
                } else {
                  return [
                    createTextVNode(toDisplayString(unref(t)("COMMON.DOWNLOAD")), 1)
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
            _push2(`</div></div><div class="animation-export__code" data-v-fee16a0c${_scopeId}><pre class="code-block" data-v-fee16a0c${_scopeId}><code data-v-fee16a0c${_scopeId}>${ssrInterpolate(exportCode.value)}</code></pre></div></div>`);
          } else {
            return [
              createVNode("div", { class: "animation-export" }, [
                createVNode("div", { class: "animation-export__toolbar" }, [
                  createVNode(unref(Select), {
                    modelValue: exportFormat.value,
                    "onUpdate:modelValue": ($event) => exportFormat.value = $event,
                    options: animationExportFormats
                  }, null, 8, ["modelValue", "onUpdate:modelValue"]),
                  createVNode("div", { class: "animation-export__actions" }, [
                    createVNode(unref(Button), {
                      variant: "outline",
                      size: "sm",
                      onClick: copyExportCode
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(t)("COMMON.COPY")), 1)
                      ]),
                      _: 1
                    }),
                    createVNode(unref(Button), {
                      variant: "ghost",
                      size: "sm",
                      onClick: downloadExportCode
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(t)("COMMON.DOWNLOAD")), 1)
                      ]),
                      _: 1
                    })
                  ])
                ]),
                createVNode("div", { class: "animation-export__code" }, [
                  createVNode("pre", { class: "code-block" }, [
                    createVNode("code", null, toDisplayString(exportCode.value), 1)
                  ])
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(unref(Modal), {
        visible: showExportProModal.value,
        title: unref(t)("COMMON.PRO_EXPORT_TITLE"),
        subtitle: unref(t)("COMMON.PRO_EXPORT_MESSAGE"),
        "show-actions": "",
        "confirm-text": unref(t)("COMMON.PRO_EXPORT_ACTION"),
        "cancel-text": unref(t)("COMMON.CANCEL"),
        onConfirm: handleExportUpgrade,
        onClose: ($event) => showExportProModal.value = false
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/animation/detail/AnimationDetailPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AnimationDetailPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fee16a0c"]]);
export {
  AnimationDetailPage as default
};
