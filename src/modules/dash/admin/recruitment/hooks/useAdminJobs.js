import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { fetchJobsList, removeJob, toJobCardModel } from "@/features/dash/admin/recruitment";
import { buildJobsQuery } from "../utils/jobsQuery";
import { DEFAULT_LEVEL_FILTER, DEFAULT_TIME_FILTER } from "../constant/constants";

/** Job list: time / level filters, paging and the delete flow. */
export const useAdminJobs = () => {
  const dispatch = useDispatch();
  const { jobs, jobsMeta, jobsLoading, deleting, error } = useSelector(
    (state) => state.adminRecruitment,
  );

  const [timeFilter, setTimeFilter] = useState(DEFAULT_TIME_FILTER);
  const [level, setLevel] = useState(DEFAULT_LEVEL_FILTER);
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchJobsList(buildJobsQuery({ page, timeFilter, level })));
  }, [dispatch, page, timeFilter, level]);

  const items = useMemo(() => (jobs || []).map(toJobCardModel).filter(Boolean), [jobs]);

  const changeTimeFilter = (value) => {
    setTimeFilter(value);
    setPage(1);
  };

  const changeLevel = (value) => {
    setLevel(value);
    setPage(1);
  };

  const requestDelete = (jobId) => {
    if (deleting) return;
    const job = items.find((item) => item.id === jobId);
    if (job) setPendingDelete(job);
  };

  const cancelDelete = () => {
    if (!deleting) setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;
    const result = await dispatch(removeJob(pendingDelete.id));
    if (removeJob.fulfilled.match(result)) {
      toast.success("Job deleted");
      setPendingDelete(null);
      return;
    }
    toast.error(result.payload || "Failed to delete job");
  };

  return {
    items,
    loading: jobsLoading && !items.length,
    error,
    timeFilter,
    changeTimeFilter,
    level,
    changeLevel,
    page: jobsMeta?.page || page,
    totalPages: jobsMeta?.totalPages || 1,
    changePage: setPage,
    deleting,
    pendingDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
};
