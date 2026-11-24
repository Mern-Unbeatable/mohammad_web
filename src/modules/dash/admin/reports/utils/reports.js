import { CheckCircle2, Clock3, Eye, Search } from "lucide-react";
import { statusFilterToApi } from "@/features/dash/admin/reports";
import { MODERATION, REPORTS_PAGE_SIZE, REPORT_STATUS } from "../constant/constants";

/** List query; "all" and blank search are omitted. */
export const buildReportsQuery = ({ page, statusFilter, search }) => {
  const params = { page, pageSize: REPORTS_PAGE_SIZE };
  const status = statusFilterToApi(statusFilter);
  if (status) params.status = status;
  const q = search?.trim();
  if (q) params.search = q;
  return params;
};

const STATUS_ACTIONS = [
  { id: "pending", label: REPORT_STATUS.PENDING, icon: Clock3 },
  { id: "review", label: REPORT_STATUS.UNDER_REVIEW, icon: Search },
  { id: "resolved", label: REPORT_STATUS.RESOLVED, icon: CheckCircle2 },
];

/** DataTable row menu: See Details, then one entry per status (the current one disabled). */
export const getReportRowActions = (row, { onDetails, onStatus }) => [
  {
    id: "details",
    label: "See Details",
    icon: Eye,
    onClick: () => onDetails(row.id),
  },
  ...STATUS_ACTIONS.map(({ id, label, icon }) => ({
    id,
    label,
    icon,
    disabled: () => row.status === label,
    onClick: () => onStatus(row.id, label),
  })),
];

/** Title / button text of the confirm-note dialog for each moderation action. */
export const reasonModalCopy = (action) => {
  switch (action) {
    case MODERATION.REMOVE_CONTENT:
      return {
        title: "Remove Content",
        submitLabel: "Remove",
        description: "This will remove the reported content and resolve the case.",
        placeholder: "Add a moderation note…",
      };
    case MODERATION.WARN:
      return {
        title: "Warn User",
        submitLabel: "Warn",
        description: "This will issue a warning to the reported user and resolve the case.",
        placeholder: "Add a moderation note…",
      };
    case MODERATION.SUSPEND:
      return {
        title: "Suspend User",
        submitLabel: "Suspend",
        description: "This will suspend the reported user’s account and resolve the case.",
        placeholder: "Add a suspension reason…",
      };
    case MODERATION.BAN:
      return {
        title: "Ban User",
        submitLabel: "Ban",
        description: "This will permanently ban the reported user and resolve the case.",
        placeholder: "Add a ban reason…",
      };
    case "RESOLVE":
      return {
        title: "Mark Resolved",
        submitLabel: "Resolve",
        description: "This will close the report without further account action.",
        placeholder: "Add a resolution note…",
      };
    default:
      return {
        title: "Confirm action",
        submitLabel: "Confirm",
        description: "Please confirm this moderation action.",
        placeholder: "Add a moderation note…",
      };
  }
};
