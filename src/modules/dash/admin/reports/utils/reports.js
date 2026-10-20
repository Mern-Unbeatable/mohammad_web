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
  { id: "pending", label: REPORT_STATUS.PENDING },
  { id: "review", label: REPORT_STATUS.UNDER_REVIEW },
  { id: "resolved", label: REPORT_STATUS.RESOLVED },
];

/** DataTable row menu: See Details, then one entry per status (the current one disabled). */
export const getReportRowActions = (row, { onDetails, onStatus }) => [
  { id: "details", label: "See Details", onClick: () => onDetails(row.id) },
  ...STATUS_ACTIONS.map(({ id, label }) => ({
    id,
    label,
    disabled: () => row.status === label,
    onClick: () => onStatus(row.id, label),
  })),
];

/** Title / button text of the note dialog for Suspend or Ban. */
export const reasonModalCopy = (action) =>
  action === MODERATION.BAN
    ? { title: "Ban User", submitLabel: "Ban" }
    : { title: "Suspend User", submitLabel: "Suspend" };
