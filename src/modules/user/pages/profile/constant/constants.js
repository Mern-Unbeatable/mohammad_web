/* ---------- Routes ---------- */

export const PROFILE_PATH = "/profile";
export const SUBSCRIPTION_PATH = "/subscription";

/* ---------- Profile page ---------- */

/** Membership statuses that count as premium and show the subscription card. */
export const PAID_MEMBERSHIP_STATUSES = ["premium", "trial", "cancelled"];

export const MY_REPORTS_QUERY = { page: 1, pageSize: 10, sort: "desc" };

/* ---------- Subscription card ---------- */

export const EMPTY_SUBSCRIPTION = {
  planName: "—",
  status: "—",
  startDate: "—",
  renewalDate: "—",
  amount: "—",
  billingCycle: "—",
  nextPayment: "—",
  paymentMethod: "—",
};

export const SUBSCRIPTION_STATUS_CLASS = {
  ACTIVE: "bg-green-secondary text-green-primary",
  TRIAL: "bg-[#FEF9E6] text-[#B8860B]",
  CANCELLED: "bg-[#FEF3E8] text-[#E67E22]",
};
export const SUBSCRIPTION_STATUS_FALLBACK_CLASS = "bg-[#FEE2E2] text-[#DC2626]";

/* ---------- Profile setup ---------- */

export const PROFILE_IMAGE_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
