import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock,
  Shield,
  Trash2,
  UserX,
} from "lucide-react";

export const REPORTS_PATH = "/admin/reports";
export const reportDetailPath = (reportId) => `${REPORTS_PATH}/${reportId}`;
export const USERS_PATH = "/admin/users";
export const userProfilePath = (userId) => `${USERS_PATH}/${userId}`;

export const REPORTS_PAGE_SIZE = 10;
export const SEARCH_DEBOUNCE_MS = 350;
export const DEFAULT_STATUS_FILTER = "all";

/** Row status labels; also what `statusLabelToApi` accepts. */
export const REPORT_STATUS = {
  PENDING: "Pending",
  UNDER_REVIEW: "Under Review",
  RESOLVED: "Resolved",
};

export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "under review", label: "Under Review" },
  { value: "resolved", label: "Resolved" },
];

export const STAT_GRID_CLASS = "grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4";
export const STAT_SKELETON_COUNT = 4;

export const REPORT_ICONS = {
  total: Shield,
  pending: Clock,
  review: Clock,
  resolved: CheckCircle2,
};

/** API moderation actions. */
export const MODERATION = {
  REMOVE_CONTENT: "REMOVE_CONTENT",
  WARN: "WARN",
  SUSPEND: "SUSPEND",
  BAN: "BAN",
};

export const RESOLVED_API_STATUS = "RESOLVED";

export const ACTION_TONES = {
  red: "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626] hover:bg-[#FEE2E2]",
  amber: "border-[#FDE68A] bg-[#FFFBEB] text-[#D97706] hover:bg-[#FEF3C7]",
  orange: "border-[#FED7AA] bg-[#FFF7ED] text-[#EA580C] hover:bg-[#FFEDD5]",
  pink: "border-pink-secondary bg-pink-secondary/30 text-pink-light hover:bg-pink-secondary/50",
  green: "border-green-secondary bg-green-secondary text-green-primary hover:opacity-90",
};

/**
 * Decision buttons in display order. `kind`: "moderate" runs the action at once,
 * "reason" asks for a note first, "resolve" marks the report resolved.
 */
export const DECISION_ACTIONS = [
  { id: MODERATION.REMOVE_CONTENT, label: "Remove Content", icon: Trash2, tone: "red", kind: "moderate" },
  { id: MODERATION.WARN, label: "Warn User", icon: AlertTriangle, tone: "amber", kind: "moderate" },
  { id: MODERATION.SUSPEND, label: "Suspend User", icon: UserX, tone: "orange", kind: "reason" },
  { id: MODERATION.BAN, label: "Ban User", icon: Ban, tone: "pink", kind: "reason" },
  { id: "RESOLVE", label: "Mark Resolved", icon: CheckCircle2, tone: "green", kind: "resolve" },
];
