import { useLayoutEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  fetchSupplierJobs,
  updateSupplierJob,
  removeSupplierJob,
  clearRecruitmentError,
  invalidateJobsList,
  jobLeftList,
  levelToApi,
} from "@/features/dash/supplier/recruitment";
import {
  buildMyJobsQuery,
  jobCount,
  matchesStatusFilter,
  nextJobStatus,
} from "@/modules/dash/user/recruitment";
import { isUnfiltered, pagesAfterRemoval } from "../utils/jobsQuery";
import { DEFAULT_STATUS_FILTER, JOBS_PAGE_SIZE, editJobPath } from "../constant/constants";
import { useJobSearch } from "./useJobSearch";
import { useJobsList } from "./useJobsList";

/** My Job Posts: filters, status tabs, open / close toggle, edit and delete. */
export const useMyJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const search = useJobSearch();
  const { items, loading, deleting, total, totalPages } = useJobsList();
  const { page, setPage, debouncedQuery, level } = search;

  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS_FILTER);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useLayoutEffect(() => {
    dispatch(clearRecruitmentError());
    dispatch(
      fetchSupplierJobs(
        buildMyJobsQuery({
          page,
          pageSize: JOBS_PAGE_SIZE,
          query: debouncedQuery,
          level: levelToApi(level),
          status: statusFilter,
        }),
      ),
    );
  }, [dispatch, page, debouncedQuery, level, statusFilter, reloadKey]);

  // Call once a job has left this page. If it was the last one, step back
  // when the page no longer exists, otherwise refetch to pull in later posts.
  const refillPageIfEmptied = () => {
    if (items.length > 1) return;
    const remainingPages = pagesAfterRemoval(total);
    dispatch(invalidateJobsList());
    if (page > remainingPages) setPage(remainingPages);
    else setReloadKey((key) => key + 1);
  };

  const changeStatus = (next) => {
    if (next === statusFilter) return;
    search.resetToFirstPage();
    setStatusFilter(next);
  };

  const toggleStatus = async (job) => {
    if (togglingId) return;
    const status = nextJobStatus(job);
    setTogglingId(job.id);
    const result = await dispatch(updateSupplierJob({ jobId: job.id, payload: { status } }));
    setTogglingId(null);
    if (!updateSupplierJob.fulfilled.match(result)) return;
    toast.success(status === "OPEN" ? "Job reopened" : "Job closed");
    if (!matchesStatusFilter(statusFilter, status)) {
      dispatch(jobLeftList(job.id));
      refillPageIfEmptied();
    }
  };

  const requestDelete = (id) => {
    if (deleting) return;
    const job = items.find((item) => item.id === id);
    if (!job) return;
    setPendingDelete(job);
  };

  const cancelDelete = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;

    const result = await dispatch(removeSupplierJob(pendingDelete.id));
    if (removeSupplierJob.fulfilled.match(result)) {
      toast.success("Job deleted");
      setPendingDelete(null);
      refillPageIfEmptied();
      return;
    }
    toast.error(result.payload || "Failed to delete job");
  };

  return {
    query: search.query,
    setQuery: search.setQuery,
    level,
    changeLevel: search.changeLevel,
    statusFilter,
    changeStatus,
    page,
    changePage: search.changePage,
    totalPages,
    items,
    loading,
    count: jobCount(loading, total),
    unfiltered: isUnfiltered({ statusFilter, query: debouncedQuery, level }),
    deleting,
    togglingId,
    toggleStatus,
    editJob: (id) => navigate(editJobPath(id)),
    pendingDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
};
