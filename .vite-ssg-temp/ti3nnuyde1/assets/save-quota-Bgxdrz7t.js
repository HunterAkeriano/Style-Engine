import { a as listSaves } from "./saves-Czai1rJv.js";
import { S as SubscriptionTier, g as getUserLimit } from "./pricing-DAHM4Bo5.js";
import { d as useAuthStore } from "../main.mjs";
function resolveSubscriptionTier(value) {
  const normalized = typeof value === "string" ? value.toLowerCase() : value;
  if (!normalized) return void 0;
  if (normalized === "free") return SubscriptionTier.FREE;
  if (normalized === "pro") return SubscriptionTier.PRO;
  if (normalized === "premium") return SubscriptionTier.PREMIUM;
  return void 0;
}
async function evaluateSaveQuota(category) {
  var _a;
  const authStore = useAuthStore();
  const tier = resolveSubscriptionTier(((_a = authStore.user) == null ? void 0 : _a.subscriptionTier) ?? authStore.userPlan);
  if (tier !== SubscriptionTier.PRO) {
    return { allowed: true, limit: Infinity, used: 0, plan: tier };
  }
  const limit = getUserLimit(SubscriptionTier.PRO, "savedTemplates");
  if (limit === -1) {
    return { allowed: true, limit: Infinity, used: 0, plan: tier };
  }
  const saved = await listSaves(category);
  return {
    allowed: saved.length < limit,
    limit,
    used: saved.length,
    plan: tier
  };
}
export {
  evaluateSaveQuota as e,
  resolveSubscriptionTier as r
};
