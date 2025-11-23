import { defineComponent, mergeProps, unref, useSSRContext, withCtx, createTextVNode, toDisplayString, ref, computed, watch, onMounted, onBeforeUnmount, createVNode, createBlock, createCommentVNode, openBlock } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrRenderAttr } from "vue/server-renderer";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";
import { P as PRICING_PLANS, S as SubscriptionTier } from "./pricing-DAHM4Bo5.js";
import { _ as _export_sfc, I as Icon, B as Button, S as Select, T as Table } from "../main.mjs";
import { g as getPublicUsers } from "./users-w9z5Y5IP.js";
import "pinia";
import "vite-ssg";
import "@unhead/vue/server";
import "vue-toastification";
import "@unhead/vue";
import "body-scroll-lock-upgrade";
import "axios";
const ABOUT_TIER_FILTER_OPTIONS = [
  { value: "all", labelKey: "ABOUT.FILTER.ALL" },
  { value: "free", labelKey: "ABOUT.FILTER.FREE" },
  { value: "pro", labelKey: "ABOUT.FILTER.PRO" },
  { value: "premium", labelKey: "ABOUT.FILTER.PREMIUM" }
];
const ABOUT_USERS_TABLE_COLUMNS = [
  { key: "avatar", labelKey: "ABOUT.TABLE.AVATAR", width: "72px" },
  { key: "name", labelKey: "ABOUT.TABLE.NAME", sortable: true },
  {
    key: "email",
    labelKey: "ABOUT.TABLE.EMAIL",
    sortable: true,
    hideOnMobile: true
  },
  {
    key: "createdAt",
    labelKey: "ABOUT.TABLE.JOINED",
    sortable: true,
    hideOnMobile: true
  },
  {
    key: "subscriptionTier",
    labelKey: "ABOUT.TABLE.STATUS",
    sortable: true,
    align: "right"
  }
];
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "AboutHero",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "about-hero" }, _attrs))} data-v-b2d22e6d><p class="about-hero__eyebrow" data-v-b2d22e6d>${ssrInterpolate(unref(t)("ABOUT.PAGE_TAG"))}</p><div class="about-hero__headline" data-v-b2d22e6d><h1 class="about-hero__title" data-v-b2d22e6d><span class="about-hero__title-base" data-v-b2d22e6d>${ssrInterpolate(unref(t)("ABOUT.PAGE_TITLE"))}</span><span class="about-hero__title-highlight" data-v-b2d22e6d>${ssrInterpolate(unref(t)("ABOUT.PAGE_TITLE_HIGHLIGHT"))}</span></h1><div class="about-hero__glow" aria-hidden="true" data-v-b2d22e6d></div><div class="about-hero__orb about-hero__orb_left" aria-hidden="true" data-v-b2d22e6d></div><div class="about-hero__orb about-hero__orb_right" aria-hidden="true" data-v-b2d22e6d></div></div><p class="about-hero__subtitle" data-v-b2d22e6d>${ssrInterpolate(unref(t)("ABOUT.PAGE_SUBTITLE"))}</p><div class="about-hero__grid" aria-hidden="true" data-v-b2d22e6d></div></section>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/about/about-hero/AboutHero.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const AboutHero = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-b2d22e6d"]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "AboutMission",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "about-mission" }, _attrs))} data-v-e9bd656c><div class="about-mission__visual" aria-hidden="true" data-v-e9bd656c><div class="about-mission__grid" data-v-e9bd656c></div><div class="about-mission__glow about-mission__glow_primary" data-v-e9bd656c></div><div class="about-mission__glow about-mission__glow_accent" data-v-e9bd656c></div><div class="about-mission__rings" data-v-e9bd656c><div class="about-mission__ring about-mission__ring_outer" data-v-e9bd656c></div><div class="about-mission__ring about-mission__ring_middle" data-v-e9bd656c></div><div class="about-mission__ring about-mission__ring_inner" data-v-e9bd656c></div></div><div class="about-mission__orbit about-mission__orbit_slow" data-v-e9bd656c><span class="about-mission__particle about-mission__particle_primary" data-v-e9bd656c></span></div><div class="about-mission__orbit about-mission__orbit_fast" data-v-e9bd656c><span class="about-mission__particle about-mission__particle_accent" data-v-e9bd656c></span></div><div class="about-mission__pulse" data-v-e9bd656c></div><div class="about-mission__beam about-mission__beam_top" data-v-e9bd656c></div><div class="about-mission__beam about-mission__beam_bottom" data-v-e9bd656c></div></div><div class="about-mission__content" data-v-e9bd656c><p class="about-mission__tag" data-v-e9bd656c>${ssrInterpolate(unref(t)("ABOUT.MISSION_TAG"))}</p><h2 class="about-mission__title" data-v-e9bd656c>${ssrInterpolate(unref(t)("ABOUT.MISSION_TITLE"))}</h2><p class="about-mission__text" data-v-e9bd656c>${ssrInterpolate(unref(t)("ABOUT.MISSION_TEXT"))}</p><div class="about-mission__points" data-v-e9bd656c><div class="about-mission__point" data-v-e9bd656c><span class="about-mission__point-label" data-v-e9bd656c>${ssrInterpolate(unref(t)("ABOUT.MISSION_POINT_1_TITLE"))}</span><p class="about-mission__point-text" data-v-e9bd656c>${ssrInterpolate(unref(t)("ABOUT.MISSION_POINT_1_TEXT"))}</p></div><div class="about-mission__point" data-v-e9bd656c><span class="about-mission__point-label" data-v-e9bd656c>${ssrInterpolate(unref(t)("ABOUT.MISSION_POINT_2_TITLE"))}</span><p class="about-mission__point-text" data-v-e9bd656c>${ssrInterpolate(unref(t)("ABOUT.MISSION_POINT_2_TEXT"))}</p></div><div class="about-mission__point" data-v-e9bd656c><span class="about-mission__point-label" data-v-e9bd656c>${ssrInterpolate(unref(t)("ABOUT.MISSION_POINT_3_TITLE"))}</span><p class="about-mission__point-text" data-v-e9bd656c>${ssrInterpolate(unref(t)("ABOUT.MISSION_POINT_3_TEXT"))}</p></div></div></div></section>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/about/about-mission/AboutMission.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const AboutMission = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-e9bd656c"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "AboutPlans",
  __ssrInlineRender: true,
  props: {
    plans: {}
  },
  emits: ["select"],
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "about-plans" }, _attrs))} data-v-2d306f8d><div class="about-plans__head" data-v-2d306f8d><div data-v-2d306f8d><p class="about-plans__tag" data-v-2d306f8d>${ssrInterpolate(unref(t)("ABOUT.PLANS_TAG"))}</p><h2 class="about-plans__title" data-v-2d306f8d>${ssrInterpolate(unref(t)("ABOUT.PLANS_TITLE"))}</h2><p class="about-plans__subtitle" data-v-2d306f8d>${ssrInterpolate(unref(t)("ABOUT.PLANS_SUBTITLE"))}</p></div></div><div class="about-plans__grid" data-v-2d306f8d><!--[-->`);
      ssrRenderList(__props.plans, (plan) => {
        _push(`<article class="${ssrRenderClass(["pricing-card", { "pricing-card_popular": plan.popular }])}" data-v-2d306f8d>`);
        if (plan.popular) {
          _push(`<div class="pricing-card__badge" data-v-2d306f8d>${ssrInterpolate(unref(t)("PRICING.POPULAR"))}</div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="pricing-card__header" data-v-2d306f8d><h3 class="pricing-card__name" data-v-2d306f8d>${ssrInterpolate(plan.name)}</h3><div class="pricing-card__price" data-v-2d306f8d><span class="pricing-card__amount" data-v-2d306f8d>$${ssrInterpolate(plan.price)}</span><span class="pricing-card__interval" data-v-2d306f8d>/ ${ssrInterpolate(unref(t)("PRICING.MONTHLY"))}</span></div></div><ul class="pricing-card__features" data-v-2d306f8d><!--[-->`);
        ssrRenderList(plan.features, (feature, index) => {
          _push(`<li class="pricing-card__feature" data-v-2d306f8d>`);
          _push(ssrRenderComponent(unref(Icon), {
            name: "icon-check",
            size: 16
          }, null, _parent));
          _push(`<span data-v-2d306f8d>${ssrInterpolate(unref(t)(feature))}</span></li>`);
        });
        _push(`<!--]--></ul>`);
        _push(ssrRenderComponent(unref(Button), {
          variant: plan.popular ? "primary" : "secondary",
          size: "lg",
          class: "pricing-card__button",
          onClick: ($event) => _ctx.$emit("select", plan.tier)
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(plan.price === 0 ? unref(t)("PRICING.GET_STARTED") : unref(t)("PRICING.UPGRADE"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(plan.price === 0 ? unref(t)("PRICING.GET_STARTED") : unref(t)("PRICING.UPGRADE")), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</article>`);
      });
      _push(`<!--]--></div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/about/about-plans/AboutPlans.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const AboutPlans = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-2d306f8d"]]);
const pageSize = 20;
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "UsersTable",
  __ssrInlineRender: true,
  setup(__props) {
    const allowedSorts = {
      name: "name",
      email: "email",
      createdat: "createdAt",
      subscriptiontier: "subscriptionTier"
    };
    const normalizeTier = (value) => {
      const tier = (value || "").toLowerCase();
      if (tier === "free" || tier === "pro" || tier === "premium") {
        return tier;
      }
      return "all";
    };
    const normalizeSortBy = (value) => {
      if (!value) return "createdAt";
      const normalized = value.toLowerCase();
      return allowedSorts[normalized] ?? "createdAt";
    };
    const normalizeSortOrder = (value) => {
      if (!value) return "desc";
      return value.toLowerCase() === "asc" ? "asc" : "desc";
    };
    const { t, locale } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const users = ref([]);
    const loading = ref(false);
    const error = ref("");
    const currentPage = ref(1);
    const totalUsers = ref(0);
    const hasMore = ref(false);
    const loadMoreTrigger = ref(null);
    let observer = null;
    const initialTier = normalizeTier(route.query.tier);
    const filters = ref({
      tier: initialTier
    });
    const lastSyncedTier = ref(initialTier);
    const sortBy = ref("createdAt");
    const sortOrder = ref("desc");
    const tierOptions = computed(
      () => ABOUT_TIER_FILTER_OPTIONS.map((option) => ({
        value: option.value,
        label: t(option.labelKey)
      }))
    );
    const columns = computed(
      () => ABOUT_USERS_TABLE_COLUMNS.map((column) => {
        let accessor;
        if (column.key === "name") {
          accessor = (row) => {
            const user = toUser(row);
            return user.name || user.email.split("@")[0];
          };
        } else if (column.key === "email") {
          accessor = (row) => toUser(row).email;
        } else if (column.key === "createdAt") {
          accessor = (row) => toUser(row).createdAt;
        } else if (column.key === "subscriptionTier") {
          accessor = (row) => toUser(row).subscriptionTier;
        }
        return {
          key: column.key,
          label: t(column.labelKey),
          sortable: column.sortable,
          width: column.width,
          align: column.align,
          hideOnMobile: column.hideOnMobile,
          ...accessor ? { accessor } : {}
        };
      })
    );
    function toUser(row) {
      return row;
    }
    function syncTierQuery() {
      if (lastSyncedTier.value === filters.value.tier) {
        return;
      }
      lastSyncedTier.value = filters.value.tier;
      const nextQuery = { ...route.query };
      nextQuery.tier = filters.value.tier;
      delete nextQuery.sortBy;
      delete nextQuery.sortOrder;
      router.replace({ query: nextQuery }).catch(() => {
      });
    }
    function getUserInitials(user) {
      const name = user.name || user.email;
      return name.substring(0, 2).toUpperCase();
    }
    function formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString(locale.value, {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
    }
    async function loadUsers(options = {}) {
      if (loading.value) return;
      const { reset = false, page = currentPage.value } = options;
      if (reset) {
        users.value = [];
        currentPage.value = 1;
        hasMore.value = false;
      }
      loading.value = true;
      error.value = "";
      try {
        const response = await getPublicUsers({
          page,
          limit: pageSize,
          tier: filters.value.tier,
          sortBy: sortBy.value,
          sortOrder: sortOrder.value
        });
        if (reset) {
          users.value = response.users;
          currentPage.value = 1;
        } else {
          users.value.push(...response.users);
          currentPage.value = page;
        }
        totalUsers.value = response.pagination.total;
        hasMore.value = response.pagination.hasMore;
      } catch (err) {
        error.value = (err == null ? void 0 : err.message) || t("ABOUT.ERROR_LOADING");
        hasMore.value = false;
      } finally {
        loading.value = false;
      }
    }
    function handleFilterChange() {
      syncTierQuery();
      loadUsers({ reset: true, page: 1 });
    }
    function handleSortChange(payload) {
      const nextSortBy = normalizeSortBy(payload.sortBy);
      const nextSortOrder = normalizeSortOrder(payload.sortOrder);
      sortBy.value = nextSortBy;
      sortOrder.value = nextSortOrder;
      loadUsers({ reset: true, page: 1 });
    }
    function loadMore() {
      if (!hasMore.value || loading.value) return;
      const nextPage = currentPage.value + 1;
      loadUsers({ page: nextPage });
    }
    function setupObserver() {
      if (observer) {
        observer.disconnect();
      }
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadMore();
            }
          });
        },
        { rootMargin: "160px 0px" }
      );
      if (loadMoreTrigger.value) {
        observer.observe(loadMoreTrigger.value);
      }
    }
    watch(
      () => route.query.tier,
      (tier) => {
        const normalizedTier = normalizeTier(tier);
        if (normalizedTier === filters.value.tier) {
          return;
        }
        filters.value.tier = normalizedTier;
        lastSyncedTier.value = normalizedTier;
        loadUsers({ reset: true, page: 1 });
      }
    );
    onMounted(() => {
      setupObserver();
      loadUsers({ reset: true, page: 1 });
    });
    watch(loadMoreTrigger, (newNode, oldNode) => {
      if (oldNode && observer) {
        observer.unobserve(oldNode);
      }
      if (newNode && observer) {
        observer.observe(newNode);
      }
    });
    onBeforeUnmount(() => {
      if (observer) {
        observer.disconnect();
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "users-table" }, _attrs))} data-v-e01e4340><header class="users-table__header" data-v-e01e4340><div class="users-table__headline" data-v-e01e4340><h2 class="users-table__title" data-v-e01e4340>${ssrInterpolate(unref(t)("ABOUT.OUR_COMMUNITY"))}</h2><p class="users-table__subtitle" data-v-e01e4340>${ssrInterpolate(unref(t)("ABOUT.COMMUNITY_DESCRIPTION"))}</p></div><div class="users-table__filters" data-v-e01e4340>`);
      _push(ssrRenderComponent(unref(Select), {
        modelValue: filters.value.tier,
        "onUpdate:modelValue": [($event) => filters.value.tier = $event, handleFilterChange],
        options: tierOptions.value,
        class: "users-table__filter"
      }, null, _parent));
      _push(`<span class="users-table__count" data-v-e01e4340>${ssrInterpolate(unref(t)("ABOUT.TOTAL_USERS", { count: totalUsers.value }))}</span></div></header>`);
      if (loading.value && !users.value.length) {
        _push(`<div class="users-table__status" data-v-e01e4340>${ssrInterpolate(unref(t)("ABOUT.LOADING_USERS"))}</div>`);
      } else if (error.value) {
        _push(`<div class="users-table__status users-table__status_error" data-v-e01e4340>${ssrInterpolate(error.value)}</div>`);
      } else {
        _push(ssrRenderComponent(unref(Table), {
          class: "users-table__table",
          columns: columns.value,
          rows: users.value,
          "row-key": "id",
          "sort-by": sortBy.value,
          "sort-order": sortOrder.value,
          "sticky-header": "",
          striped: "",
          hoverable: "",
          size: "sm",
          onSortChange: handleSortChange
        }, {
          "cell-avatar": withCtx(({ row }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="user-avatar" data-v-e01e4340${_scopeId}>`);
              if (toUser(row).avatarUrl) {
                _push2(`<img${ssrRenderAttr("src", toUser(row).avatarUrl)}${ssrRenderAttr("alt", toUser(row).name || toUser(row).email)} class="user-avatar__img" data-v-e01e4340${_scopeId}>`);
              } else {
                _push2(`<span class="user-avatar__initials" data-v-e01e4340${_scopeId}>${ssrInterpolate(getUserInitials(toUser(row)))}</span>`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "user-avatar" }, [
                  toUser(row).avatarUrl ? (openBlock(), createBlock("img", {
                    key: 0,
                    src: toUser(row).avatarUrl,
                    alt: toUser(row).name || toUser(row).email,
                    class: "user-avatar__img"
                  }, null, 8, ["src", "alt"])) : (openBlock(), createBlock("span", {
                    key: 1,
                    class: "user-avatar__initials"
                  }, toDisplayString(getUserInitials(toUser(row))), 1))
                ])
              ];
            }
          }),
          "cell-name": withCtx(({ row }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(toUser(row).name || toUser(row).email.split("@")[0])}`);
            } else {
              return [
                createTextVNode(toDisplayString(toUser(row).name || toUser(row).email.split("@")[0]), 1)
              ];
            }
          }),
          "cell-email": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(value)}`);
            } else {
              return [
                createTextVNode(toDisplayString(value), 1)
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
          "cell-subscriptionTier": withCtx(({ value }, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="user-status" data-v-e01e4340${_scopeId}>`);
              if (value !== "free") {
                _push2(ssrRenderComponent(unref(Icon), {
                  size: 14,
                  class: ["user-status__crown", { "user-status__crown_premium": value === "premium" }],
                  name: "icon-crown"
                }, null, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`<span class="${ssrRenderClass(["user-status__badge", `user-status__badge_${value}`])}" data-v-e01e4340${_scopeId}>${ssrInterpolate(unref(t)(`ABOUT.TIER.${value.toUpperCase()}`))}</span></div>`);
            } else {
              return [
                createVNode("div", { class: "user-status" }, [
                  value !== "free" ? (openBlock(), createBlock(unref(Icon), {
                    key: 0,
                    size: 14,
                    class: ["user-status__crown", { "user-status__crown_premium": value === "premium" }],
                    name: "icon-crown"
                  }, null, 8, ["class"])) : createCommentVNode("", true),
                  createVNode("span", {
                    class: ["user-status__badge", `user-status__badge_${value}`]
                  }, toDisplayString(unref(t)(`ABOUT.TIER.${value.toUpperCase()}`)), 3)
                ])
              ];
            }
          }),
          empty: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="users-table__status" data-v-e01e4340${_scopeId}>${ssrInterpolate(unref(t)("ABOUT.NO_USERS"))}</div>`);
            } else {
              return [
                createVNode("div", { class: "users-table__status" }, toDisplayString(unref(t)("ABOUT.NO_USERS")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      }
      _push(`<div class="users-table__sentinel" aria-hidden="true" data-v-e01e4340></div>`);
      if (hasMore.value && !loading.value) {
        _push(`<div class="users-table__load-more" data-v-e01e4340>`);
        _push(ssrRenderComponent(unref(Button), {
          variant: "secondary",
          size: "md",
          onClick: loadMore
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("ABOUT.LOAD_MORE"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("ABOUT.LOAD_MORE")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (loading.value && users.value.length) {
        _push(`<div class="users-table__loading-more" data-v-e01e4340>${ssrInterpolate(unref(t)("ABOUT.LOADING_MORE"))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/about/users-table/UsersTable.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const UsersTable = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-e01e4340"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AboutCommunity",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "about-community" }, _attrs))} data-v-d5d8be08><div class="about-community__head" data-v-d5d8be08><p class="about-community__tag" data-v-d5d8be08>${ssrInterpolate(unref(t)("ABOUT.COMMUNITY_TAG"))}</p><h2 class="about-community__title" data-v-d5d8be08>${ssrInterpolate(unref(t)("ABOUT.COMMUNITY_TITLE"))}</h2><p class="about-community__subtitle" data-v-d5d8be08>${ssrInterpolate(unref(t)("ABOUT.COMMUNITY_SUBTITLE"))}</p></div>`);
      _push(ssrRenderComponent(UsersTable, null, null, _parent));
      _push(`</section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/widgets/about/about-community/AboutCommunity.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AboutCommunity = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d5d8be08"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "AboutPage",
  __ssrInlineRender: true,
  setup(__props) {
    const { locale } = useI18n();
    const router = useRouter();
    const plans = computed(() => [
      PRICING_PLANS[SubscriptionTier.FREE],
      PRICING_PLANS[SubscriptionTier.PRO],
      PRICING_PLANS[SubscriptionTier.PREMIUM]
    ]);
    function handlePlanSelect(tier) {
      if (tier === SubscriptionTier.FREE) {
        router.push(`/${locale.value}/register`);
        return;
      }
      router.push({
        path: `/${locale.value}/register`,
        query: { plan: tier }
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "about-page" }, _attrs))} data-v-a3cb18ee><div class="about-page__container" data-v-a3cb18ee>`);
      _push(ssrRenderComponent(unref(AboutHero), null, null, _parent));
      _push(ssrRenderComponent(unref(AboutMission), null, null, _parent));
      _push(ssrRenderComponent(unref(AboutPlans), {
        plans: plans.value,
        onSelect: handlePlanSelect
      }, null, _parent));
      _push(ssrRenderComponent(unref(AboutCommunity), null, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("src/pages/about/AboutPage.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AboutPage = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a3cb18ee"]]);
export {
  AboutPage as default
};
