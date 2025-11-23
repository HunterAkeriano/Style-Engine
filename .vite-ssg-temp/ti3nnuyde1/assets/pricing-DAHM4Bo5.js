var SubscriptionTier = /* @__PURE__ */ ((SubscriptionTier2) => {
  SubscriptionTier2["FREE"] = "free";
  SubscriptionTier2["PRO"] = "pro";
  SubscriptionTier2["PREMIUM"] = "premium";
  return SubscriptionTier2;
})(SubscriptionTier || {});
const PRICING_PLANS = {
  [
    "free"
    /* FREE */
  ]: {
    tier: "free",
    name: "Free",
    price: 0,
    interval: "month",
    limits: {
      savedTemplates: 5,
      exportFormats: ["css"],
      historyDays: 0,
      aiGenerations: 0
    },
    features: [
      "PRICING.FREE_TEMPLATES",
      "PRICING.BASIC_GENERATORS",
      "PRICING.CSS_EXPORT",
      "PRICING.COMMUNITY_SUPPORT"
    ]
  },
  [
    "pro"
    /* PRO */
  ]: {
    tier: "pro",
    name: "Pro",
    price: 5,
    interval: "month",
    limits: {
      savedTemplates: 50,
      exportFormats: ["css", "scss", "json"],
      historyDays: 30,
      aiGenerations: 100
    },
    features: [
      "PRICING.PRO_TEMPLATES",
      "PRICING.ALL_GENERATORS",
      "PRICING.MULTIPLE_EXPORTS",
      "PRICING.HISTORY_30_DAYS",
      "PRICING.AI_GENERATIONS",
      "PRICING.PRIORITY_SUPPORT"
    ],
    popular: true
  },
  [
    "premium"
    /* PREMIUM */
  ]: {
    tier: "premium",
    name: "Premium",
    price: 10,
    interval: "month",
    limits: {
      savedTemplates: -1,
      // unlimited
      exportFormats: ["css", "scss", "sass", "less", "json", "figma", "sketch"],
      historyDays: -1,
      // unlimited
      aiGenerations: -1
      // unlimited
    },
    features: [
      "PRICING.UNLIMITED_TEMPLATES",
      "PRICING.ALL_GENERATORS",
      "PRICING.ALL_EXPORTS",
      "PRICING.UNLIMITED_HISTORY",
      "PRICING.UNLIMITED_AI",
      "PRICING.FIGMA_SKETCH_EXPORT",
      "PRICING.TEAM_COLLABORATION",
      "PRICING.PREMIUM_SUPPORT",
      "PRICING.EARLY_ACCESS"
    ]
  }
};
function getUserLimit(tier, limitType) {
  return PRICING_PLANS[tier].limits[limitType];
}
export {
  PRICING_PLANS as P,
  SubscriptionTier as S,
  getUserLimit as g
};
