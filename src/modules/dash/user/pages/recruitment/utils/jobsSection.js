import { employmentToApi, levelToApi } from "@/features/user/recruitment";
import { workplaceToApi } from "@/shared/constants/jobWorkplace";
import { JOB_STATUS } from "@/shared/constants/jobStatus";
import { ALL_OPTION } from "./recruitmentUrlFilters";

/** Count shown next to a section title; hidden (null) while loading. */
export const jobCount = (loading, total) => (loading ? null : total || 0);

/** Query for "Public Job Posts"; filter values are UI labels ("All" sends nothing). */
export const buildPublicJobsQuery = ({
  page,
  pageSize,
  query,
  level,
  employmentType,
  workplaceType,
}) => {
  const params = { page, pageSize, sort: "desc" };
  const q = query?.trim();
  if (q) params.search = q;
  const levelApi = levelToApi(level);
  if (levelApi) params.level = levelApi;
  if (employmentType && employmentType !== ALL_OPTION) {
    params.employmentType = employmentToApi(employmentType);
  }
  if (workplaceType && workplaceType !== ALL_OPTION) {
    params.workplaceType = workplaceToApi(workplaceType);
  }
  return params;
};

/** Query for "My Job Posts"; `status` is a MY_JOB_STATUS_FILTERS id. */
export const buildMyJobsQuery = ({
  page,
  pageSize,
  query,
  level,
  employmentType,
  workplaceType,
  status,
}) => {
  const params = { page, pageSize, sort: "desc", mine: true };
  const q = query?.trim();
  if (q) params.search = q;
  if (level) params.level = level;
  if (employmentType) params.employmentType = employmentType;
  if (workplaceType) params.workplaceType = workplaceType;
  if (status && status !== "all") params.status = status;
  return params;
};

export const nextJobStatus = (job) =>
  job?.status === JOB_STATUS.OPEN ? JOB_STATUS.CLOSED : JOB_STATUS.OPEN;

/** Whether a job with `status` still belongs under the active status tab. */
export const matchesStatusFilter = (filter, status) =>
  filter === "all" || filter === status;
