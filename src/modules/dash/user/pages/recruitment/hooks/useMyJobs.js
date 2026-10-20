import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchJobs,
  updateJob,
  removeJob,
  clearRecruitmentError,
  invalidateJobsList,
  jobLeftList,
  toJobCardModel,
  selectNewApplicationsByJob,
} from "@/features/user/recruitment";
import { LIST_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";
import { SEARCH_DEBOUNCE_MS } from "../constant/constants";
import {
  buildMyJobsQuery,
  matchesStatusFilter,
  nextJobStatus,
} from "../utils/jobsSection";

/** The caller's own job posts: search, status tab, paging, open/close and delete. */
export function useMyJobs() {
  const dispatch = useDispatch();
  const { jobs, jobsMeta, jobsLoading, deleting, error } = useSelector(
    (state) => state.userRecruitment,
  );
  const newApplicationsByJob = useSelector(selectNewApplicationsByJob);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [togglingId, setTogglingId] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === debouncedQuery) return;
      dispatch(invalidateJobsList());
      setDebouncedQuery(query);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, debouncedQuery, dispatch]);

  useLayoutEffect(() => {
    dispatch(clearRecruitmentError());
    dispatch(
      fetchJobs(
        buildMyJobsQuery({
          page,
          pageSize: LIST_PAGE_SIZE,
          query: debouncedQuery,
          status: statusFilter,
        }),
      ),
    );
  }, [dispatch, page, debouncedQuery, statusFilter, reloadKey]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const items = useMemo(
    () => (jobs || []).map(toJobCardModel).filter(Boolean),
    [jobs],
  );

  const total = jobsMeta?.total || 0;
  const totalPages = Math.max(1, jobsMeta?.totalPages || 1);

  // Call once a job has left this page. If it was the last one, step back
  // when the page no longer exists, otherwise refetch to pull in later posts.
  const refillPageIfEmptied = () => {
    if (items.length > 1) return;
    const remainingPages = Math.max(1, Math.ceil((total - 1) / LIST_PAGE_SIZE));
    dispatch(invalidateJobsList());
    if (page > remainingPages) setPage(remainingPages);
    else setReloadKey((key) => key + 1);
  };

  const changeStatusFilter = (next) => {
    if (next === statusFilter) return;
    dispatch(invalidateJobsList());
    setPage(1);
    setStatusFilter(next);
  };

  const changePage = (next) => {
    if (next === page) return;
    dispatch(invalidateJobsList());
    setPage(next);
  };

  const toggleStatus = async (job) => {
    if (togglingId) return;
    const status = nextJobStatus(job);
    setTogglingId(job.id);
    const result = await dispatch(updateJob({ jobId: job.id, payload: { status } }));
    setTogglingId(null);
    if (!updateJob.fulfilled.match(result)) return;
    toast.success(status === "OPEN" ? "Job reopened" : "Job closed");
    if (!matchesStatusFilter(statusFilter, status)) {
      dispatch(jobLeftList(job.id));
      refillPageIfEmptied();
    }
  };

  const requestDelete = (id) => {
    if (deleting) return;
    const job = items.find((item) => item.id === id);
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
      refillPageIfEmptied();
      return;
    }
    toast.error(result.payload || "Failed to delete job");
  };

  return {
    items,
    total,
    page,
    totalPages,
    loading: jobsLoading,
    unfiltered: statusFilter === "all" && !debouncedQuery.trim(),
    newApplicationsByJob,
    changePage,
    query,
    setQuery,
    statusFilter,
    changeStatusFilter,
    togglingId,
    toggleStatus,
    deleting,
    pendingDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
