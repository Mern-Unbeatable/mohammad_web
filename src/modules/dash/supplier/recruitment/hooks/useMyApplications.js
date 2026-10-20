import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchSupplierMyApplications,
  withdrawSupplierApplication,
} from "@/features/dash/supplier/recruitment";
import { MY_APPLICATIONS_PAGE_SIZE } from "../constant/constants";
import { toApplicationModel } from "../utils/applications";

/** Jobs the caller applied to, the Applied / Cancelled tab, and withdrawing. */
export function useMyApplications() {
  const dispatch = useDispatch();
  const { applications, applicationsMeta, applicationsLoading } = useSelector(
    (state) => state.supplierRecruitment,
  );

  const [filter, setFilter] = useState("applied");
  const [pendingWithdraw, setPendingWithdraw] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    dispatch(
      fetchSupplierMyApplications({
        page: 1,
        pageSize: MY_APPLICATIONS_PAGE_SIZE,
        sort: "desc",
        status: filter,
      }),
    );
  }, [dispatch, filter]);

  const items = useMemo(
    () => (applications || []).map(toApplicationModel),
    [applications],
  );

  const cancelWithdraw = () => {
    if (!withdrawing) setPendingWithdraw(null);
  };

  const confirmWithdraw = async () => {
    if (!pendingWithdraw?.jobId || withdrawing) return;
    setWithdrawing(true);
    const result = await dispatch(withdrawSupplierApplication(pendingWithdraw.jobId));
    setWithdrawing(false);
    if (withdrawSupplierApplication.fulfilled.match(result)) {
      toast.success("Application cancelled");
      setPendingWithdraw(null);
      return;
    }
    toast.error(result.payload || "Failed to cancel application");
  };

  return {
    items,
    total: applicationsMeta?.total,
    loading: applicationsLoading,
    filter,
    setFilter,
    withdrawing,
    pendingWithdraw,
    requestWithdraw: setPendingWithdraw,
    cancelWithdraw,
    confirmWithdraw,
  };
}
