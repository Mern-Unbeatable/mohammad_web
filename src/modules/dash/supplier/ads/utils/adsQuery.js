import { statusFilterToApi } from "@/features/dash/supplier/advertisements";
import { ADS_PAGE_SIZE } from "../constant/constants";

/** API params for the signed-in supplier's ads list. */
export const buildAdsQuery = ({ page, statusFilter, sortFilter, search }) => {
  const params = {
    page,
    pageSize: ADS_PAGE_SIZE,
    sort: sortFilter === "oldest" ? "asc" : "desc",
    mine: true,
  };

  const status = statusFilterToApi(statusFilter);
  if (status) params.status = status;

  const q = search?.trim();
  if (q) params.search = q;

  return params;
};
