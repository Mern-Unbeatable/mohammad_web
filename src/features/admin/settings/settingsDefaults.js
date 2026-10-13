/**
 * Setting keys + non-pricing UI defaults for admin app settings.
 * Pricing (`subscription_pricing`, `sponsored_pricing`) defaults live on the
 * API, which always returns normalized numeric values for those keys.
 */

export const SETTINGS_KEYS = {
  subscription: "subscription_pricing",
  sponsored: "sponsored_pricing",
  marketplaceCategories: "marketplace_categories",
  generalCategories: "general_categories",
};

export const SUBSCRIPTION_FEATURES = [
  "Full professional profile & photo",
  "Unlimited connections",
  "Lab Marketplace",
  "Recruitment",
  "General",
  "Messages",
  "Blogs",
  "Notifications",
  "Profile",
  "Statistics & Reports",
  "Settings",
];

export const DEFAULT_MARKETPLACE_CATEGORIES = [
  "Chromatography",
  "Spectroscopy",
  "Incubation",
  "Centrifugation",
  "Weighing",
  "Safety",
  "Consumables",
  "Microscopy",
];

export const DEFAULT_GENERAL_CATEGORIES = ["News", "Document"];
