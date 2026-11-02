import { levelToApi, timeToApi } from "@/features/dash/admin/recruitment";
import { JOBS_PAGE_SIZE } from "../constant/constants";

/** List query; "All Time" / "All" send no filter. */
export const buildJobsQuery = ({ page, timeFilter, level }) => {
  const params = { page, pageSize: JOBS_PAGE_SIZE };
  const since = timeToApi(timeFilter);
  if (since) params.since = since;
  const levelApi = levelToApi(level);
  if (levelApi) params.level = levelApi;
  return params;
};
