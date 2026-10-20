import { roleLabel } from "@/shared/constants/roles";
import { formatDate as formatSharedDate } from "@/shared/utils/dates/date";
import {
  API_STATUS,
  PREMIUM_STATUSES,
  SUPPLIER_CONTENT_KINDS,
  USER_CONTENT_KINDS,
} from "../constant/constants";

const formatDate = (value) => formatSharedDate(value, { format: "short", fallback: "—" });

export const isSupplierUser = (user) =>
  user?.role === "SUPPLIER" || user?.profileType === "SUPPLIER";

export const contentKindsFor = (isSupplier) =>
  isSupplier ? SUPPLIER_CONTENT_KINDS : USER_CONTENT_KINDS;

export const isPremiumMember = (profileUser) =>
  PREMIUM_STATUSES.includes(profileUser.membershipStatus);

/** Upper-cased account status, defaulting to ACTIVE. */
export const accountStatus = (user) => String(user.status || API_STATUS.ACTIVE).toUpperCase();

/** "SUSPENDED" → "Suspended". */
export const statusText = (status) => status.charAt(0) + status.slice(1).toLowerCase();

/** Label / value rows of the admin-only account card. */
export const accountRows = (user) => [
  ["Role", roleLabel(user.role)],
  ["Account type", user.profileType || "—"],
  ["Joined", formatDate(user.createdAt)],
  ["Last login", formatDate(user.lastLoginAt)],
  ["Warnings", String(user.warnings ?? 0)],
];
