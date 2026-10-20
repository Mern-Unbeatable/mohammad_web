import { Briefcase, Megaphone, Newspaper, Store } from "lucide-react";

export const USERS_PATH = "/admin/users";
export const userDetailPath = (userId) => `${USERS_PATH}/${userId}`;

export const USERS_PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 350;
export const ALL = "all";

export const USER_TAB = { ALL: "all", USER: "user", SUPPLIER: "supplier" };

export const USER_TABS = [
  { id: USER_TAB.ALL, label: "All Users" },
  { id: USER_TAB.USER, label: "Users" },
  { id: USER_TAB.SUPPLIER, label: "Supplier" },
];

export const TAB_IDS = USER_TABS.map((t) => t.id);
export const PLAN_VALUES = ["all", "monthly", "yearly", "free"];
export const STATUS_VALUES = ["all", "active", "suspend", "banned"];

export const PLAN_FILTER_OPTIONS = [
  { value: "all", label: "All Subscription" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "free", label: "Free" },
];

export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "suspend", label: "Suspended" },
  { value: "banned", label: "Banned" },
];

/** Filter value → API `status`. */
export const STATUS_FILTER_API = { active: "active", suspend: "suspended", banned: "banned" };

/** Row status labels. */
export const ROW_STATUS = { ACTIVE: "Active", SUSPEND: "Suspend", BANNED: "Banned" };

export const API_STATUS = { ACTIVE: "ACTIVE", SUSPENDED: "SUSPENDED", BANNED: "BANNED" };

export const ACTIVATE_REASON = "Account activated by admin";

export const MESSAGES = {
  SUSPENDED: "User suspended successfully",
  ACTIVATED: "User activated successfully",
  UPDATE_FAILED: "Failed to update user status",
};

export const SUBSCRIPTION_PILL_STYLES = {
  Monthly: "bg-secondary text-primary",
  Yearly: "bg-pink-secondary text-pink-light",
  Free: "bg-[#F3F4F6] text-[#64748B]",
};

export const ACCOUNT_STATUS_CLASS = {
  ACTIVE: "bg-green-secondary text-green-primary",
  SUSPENDED: "bg-[#F4F3FF] text-[#5925DC]",
  BANNED: "bg-[#FEF3F2] text-[#D92D20]",
};

/** Membership states that count as premium on the profile page. */
export const PREMIUM_STATUSES = ["premium", "trial", "cancelled"];

/** Content kinds shown as activity tabs, per account type. */
export const SUPPLIER_CONTENT_KINDS = ["advertisements", "listings", "jobs"];
export const USER_CONTENT_KINDS = ["jobs"];

export const POSTS_TAB = { id: "posts", param: "posts", label: "Posts", icon: Newspaper };

export const CONTENT_TABS = {
  advertisements: { param: "ads", label: "Ads", icon: Megaphone, empty: "No advertisements yet." },
  listings: { param: "marketplace", label: "Marketplace", icon: Store, empty: "No marketplace listings yet." },
  jobs: { param: "jobs", label: "Jobs", icon: Briefcase, empty: "No job posts yet." },
};

export const CONTENT_STATUS_CLASS = {
  ACTIVE: "bg-green-secondary text-green-primary",
  OPEN: "bg-green-secondary text-green-primary",
  PENDING: "bg-[#FFFAEB] text-[#B54708]",
  SOLD: "bg-secondary text-primary",
  EXPIRED: "bg-[#F3F4F6] text-[#475467]",
  CLOSED: "bg-[#FEF3F2] text-[#D92D20]",
  REJECTED: "bg-[#FEF3F2] text-[#D92D20]",
  REMOVED: "bg-[#FEF3F2] text-[#D92D20]",
};
