import { statusFilterToApi } from "@/features/dash/admin/advertisements";
import { ADS_PAGE_SIZE } from "../constant/constants";

/** API params for the admin ads list. */
export const buildAdsQuery = ({ page, statusFilter, search }) => {
  const params = {
    page,
    pageSize: ADS_PAGE_SIZE,
  };

  const status = statusFilterToApi(statusFilter);
  if (status) params.status = status;

  const q = search?.trim();
  if (q) params.search = q;

  return params;
};
