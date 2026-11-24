import { Ban, CheckCircle2, Eye } from "lucide-react";
import { formatDate } from "@/shared/utils/dates/date";
import {
  ACTIVATE_REASON,
  ALL,
  API_STATUS,
  PLAN_VALUES,
  ROW_STATUS,
  STATUS_FILTER_API,
  STATUS_VALUES,
  TAB_IDS,
  USERS_PAGE_SIZE,
  USER_TAB,
} from "../constant/constants";

const pick = (value, allowed) => (allowed.includes(value) ? value : ALL);

/** List state from the URL; unknown values fall back to "all" / page 1. */
export const readListParams = (searchParams) => ({
  tab: pick(searchParams.get("tab"), TAB_IDS),
  page: Math.max(1, Number.parseInt(searchParams.get("page"), 10) || 1),
  planFilter: pick(searchParams.get("plan"), PLAN_VALUES),
  statusFilter: pick(searchParams.get("status"), STATUS_VALUES),
  search: searchParams.get("q") || "",
});

/** Merges `changes` into a copy of `prev`; "all"/empty values and page 1 are dropped. */
export const applyParamChanges = (prev, changes) => {
  const next = new URLSearchParams(prev);
  Object.entries(changes).forEach(([key, value]) => {
    if (value == null || value === "" || value === ALL || (key === "page" && Number(value) <= 1)) {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
  });
  return next;
};

/** Sets or clears `q` and resets the page. */
export const applySearch = (prev, q) => {
  const next = new URLSearchParams(prev);
  if (q) next.set("q", q);
  else next.delete("q");
  next.delete("page");
  return next;
};

/** Build list query matching server adminUserListQuerySchema */
export const buildUsersQuery = ({ page, tab, statusFilter, planFilter, search }) => {
  const params = { page, pageSize: USERS_PAGE_SIZE };
  if (tab === USER_TAB.SUPPLIER || tab === USER_TAB.USER) params.role = tab;
  const status = STATUS_FILTER_API[statusFilter];
  if (status) params.status = status;
  if (planFilter !== ALL) params.plan = planFilter;
  const q = search?.trim();
  if (q) params.search = q;
  return params;
};

const capitalize = (text) => {
  const s = String(text);
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};

const rowStatus = (status) => {
  if (status === API_STATUS.SUSPENDED) return ROW_STATUS.SUSPEND;
  if (status === API_STATUS.BANNED) return ROW_STATUS.BANNED;
  return ROW_STATUS.ACTIVE;
};

/** API user → table row. */
export const toUserRow = (u) => ({
  id: u.id,
  userName:
    u.profile?.name ||
    [u.profile?.firstName, u.profile?.lastName].filter(Boolean).join(" ") ||
    u.email,
  avatar: u.profile?.avatar || "",
  userType: u.profileType || u.profile?.title || "Laboratory",
  company: u.profile?.company || u.profile?.country || "N/A",
  role: u.role || "USER",
  subscription: capitalize(u.subscription?.plan || "FREE"),
  joinedDate: formatDate(u.createdAt, { format: "short", fallback: "N/A" }),
  status: rowStatus(u.status),
});

/** Row label → API status update; activation gets a default reason. */
export const toStatusUpdate = (rowLabel, reason = "") => {
  const status = rowLabel === ROW_STATUS.SUSPEND ? API_STATUS.SUSPENDED : API_STATUS.ACTIVE;
  return {
    status,
    reason: reason?.trim() || (status === API_STATUS.SUSPENDED ? undefined : ACTIVATE_REASON),
  };
};

/** DataTable row menu: See Details, Active, Suspend (each disabled when it would not change anything). */
export const getUserRowActions = (row, { onDetails, onActivate, onSuspend }) => [
  { id: "details", label: "See Details", icon: Eye, onClick: () => onDetails(row.id) },
  {
    id: "active",
    label: "Active",
    icon: CheckCircle2,
    disabled: () => row.status === ROW_STATUS.ACTIVE,
    onClick: () => onActivate(row.id),
  },
  {
    id: "suspend",
    label: "Suspend",
    icon: Ban,
    variant: "danger",
    disabled: () => row.status === ROW_STATUS.SUSPEND || row.status === ROW_STATUS.BANNED,
    onClick: () => onSuspend(row),
  },
];
