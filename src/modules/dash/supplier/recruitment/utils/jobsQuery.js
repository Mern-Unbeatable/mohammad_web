import { levelToApi } from "@/features/dash/supplier/recruitment";
import { DEFAULT_LEVEL, DEFAULT_STATUS_FILTER, JOBS_PAGE_SIZE } from "../constant/constants";

/** Query for "Public Job Posts"; `level` is a UI label ("All" sends nothing). */
export const buildJobsQuery = ({ page, query, level }) => {
  const params = { page, pageSize: JOBS_PAGE_SIZE, sort: "desc" };
  const q = query?.trim();
  if (q) params.search = q;
  const levelApi = levelToApi(level);
  if (levelApi) params.level = levelApi;
  return params;
};

/** True when My Job Posts shows everything (no status, search or level). */
export const isUnfiltered = ({ statusFilter, query, level }) =>
  statusFilter === DEFAULT_STATUS_FILTER && !query.trim() && level === DEFAULT_LEVEL;

/** Pages left once one job is removed from a list of `total`. */
export const pagesAfterRemoval = (total) =>
  Math.max(1, Math.ceil((total - 1) / JOBS_PAGE_SIZE));
