import { JOB_STATUS } from "@/shared/constants/jobStatus";

export const jobCountLabel = (loading, total) =>
  loading ? "Loading…" : `${total} job post${total === 1 ? "" : "s"}`;

/** Query for "My Job Posts"; `status` is a MY_JOB_STATUS_FILTERS id. */
export const buildMyJobsQuery = ({ page, pageSize, query, level, status }) => {
  const params = { page, pageSize, sort: "desc", mine: true };
  const q = query?.trim();
  if (q) params.search = q;
  if (level) params.level = level;
  if (status && status !== "all") params.status = status;
  return params;
};

export const nextJobStatus = (job) =>
  job?.status === JOB_STATUS.OPEN ? JOB_STATUS.CLOSED : JOB_STATUS.OPEN;

/** Whether a job with `status` still belongs under the active status tab. */
export const matchesStatusFilter = (filter, status) =>
  filter === "all" || filter === status;
