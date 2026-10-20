import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { toJobCardModel } from "@/features/dash/supplier/recruitment";

/** Jobs from the store as card models, with totals; toasts store errors. */
export const useJobsList = () => {
  const { jobs, jobsMeta, jobsLoading, deleting, error } = useSelector(
    (state) => state.supplierRecruitment,
  );

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const items = useMemo(() => (jobs || []).map(toJobCardModel).filter(Boolean), [jobs]);

  return {
    items,
    loading: jobsLoading,
    deleting,
    total: jobsMeta?.total || 0,
    rawTotal: jobsMeta?.total,
    totalPages: Math.max(1, jobsMeta?.totalPages || 1),
  };
};
