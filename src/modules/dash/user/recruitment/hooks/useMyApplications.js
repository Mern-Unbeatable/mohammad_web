import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchMyApplications,
  withdrawApplication,
  toJobCardModel,
  formatPostedAgo,
} from "@/features/dash/user/recruitment";
import { MY_APPLICATIONS_PAGE_SIZE } from "../constant/constants";

const toApplicationModel = (app) => {
  const job = app.job ? toJobCardModel(app.job) : null;
  return {
    id: app.id,
    status: app.status || "PENDING",
    appliedAt: formatPostedAgo(app.appliedAt || app.createdAt).replace(
      /^Posted /,
      "Applied ",
    ),
    coverLetter: app.coverLetter || "",
    cv: app.cv || null,
    job,
    jobId: job?.id || app.jobId,
  };
};

/** Jobs the caller applied to, the Applied / Cancelled tab, and withdrawing. */
export function useMyApplications() {
  const dispatch = useDispatch();
  const { applications, applicationsMeta, applicationsLoading } = useSelector(
    (state) => state.userRecruitment,
  );

  const [filter, setFilter] = useState("applied");
  const [pendingWithdraw, setPendingWithdraw] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    dispatch(
      fetchMyApplications({
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
    const result = await dispatch(withdrawApplication(pendingWithdraw.jobId));
    setWithdrawing(false);
    if (withdrawApplication.fulfilled.match(result)) {
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
