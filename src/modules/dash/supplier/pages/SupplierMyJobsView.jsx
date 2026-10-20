import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import Pagination from "@/components/common/Pagination/Pagination";
import SegmentedTabs from "@/components/common/SegmentedTabs/SegmentedTabs";
import { CardSkeleton } from "@/components/common/Skeleton";
import JobCard from "@/components/data-display/JobCard/JobCard";
import {
  RecruitmentToolbar,
  JobsSectionHeader,
  buildMyJobsQuery,
  jobCount,
  matchesStatusFilter,
  nextJobStatus,
} from "@/modules/dash/user/pages/recruitment";
import SupplierRecruitmentActions from "@/modules/dash/supplier/components/SupplierRecruitmentActions";
import {
  fetchSupplierJobs,
  updateSupplierJob,
  removeSupplierJob,
  clearRecruitmentError,
  invalidateJobsList,
  jobLeftList,
  levelToApi,
  toJobCardModel,
} from "@/features/supplier/recruitment";
import { MY_JOB_STATUS_FILTERS } from "@/shared/constants/jobStatus";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import { LIST_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

const JOB_BASE = "/supplier/recruitment";

const SupplierMyJobsView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { jobs, jobsMeta, jobsLoading, deleting, error } = useSelector(
    (state) => state.supplierRecruitment,
  );

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query === debouncedQuery) return;
      dispatch(invalidateJobsList());
      setDebouncedQuery(query);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [query, debouncedQuery, dispatch]);

  useLayoutEffect(() => {
    dispatch(clearRecruitmentError());
    dispatch(
      fetchSupplierJobs(
        buildMyJobsQuery({
          page,
          pageSize: LIST_PAGE_SIZE,
          query: debouncedQuery,
          level: levelToApi(level),
          status: statusFilter,
        }),
      ),
    );
  }, [dispatch, page, debouncedQuery, level, statusFilter, reloadKey]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filtered = useMemo(
    () => (jobs || []).map(toJobCardModel).filter(Boolean),
    [jobs],
  );

  const total = jobsMeta?.total || 0;
  const totalPages = Math.max(1, jobsMeta?.totalPages || 1);

  // Call once a job has left this page. If it was the last one, step back
  // when the page no longer exists, otherwise refetch to pull in later posts.
  const refillPageIfEmptied = () => {
    if (filtered.length > 1) return;
    const remainingPages = Math.max(1, Math.ceil((total - 1) / LIST_PAGE_SIZE));
    dispatch(invalidateJobsList());
    if (page > remainingPages) setPage(remainingPages);
    else setReloadKey((key) => key + 1);
  };

  const resetToFirstPage = () => {
    dispatch(invalidateJobsList());
    setPage(1);
  };

  const handleLevelChange = (next) => {
    if (next === level) return;
    resetToFirstPage();
    setLevel(next);
  };

  const handleStatusChange = (next) => {
    if (next === statusFilter) return;
    resetToFirstPage();
    setStatusFilter(next);
  };

  const handlePageChange = (next) => {
    if (next === page) return;
    dispatch(invalidateJobsList());
    setPage(next);
  };

  const handleToggleStatus = async (job) => {
    if (togglingId) return;
    const status = nextJobStatus(job);
    setTogglingId(job.id);
    const result = await dispatch(
      updateSupplierJob({ jobId: job.id, payload: { status } }),
    );
    setTogglingId(null);
    if (!updateSupplierJob.fulfilled.match(result)) return;
    toast.success(status === "OPEN" ? "Job reopened" : "Job closed");
    if (!matchesStatusFilter(statusFilter, status)) {
      dispatch(jobLeftList(job.id));
      refillPageIfEmptied();
    }
  };

  const handleDeleteRequest = (id) => {
    if (deleting) return;
    const job = filtered.find((item) => item.id === id);
    if (!job) return;
    setPendingDelete(job);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
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

  const unfiltered =
    statusFilter === "all" && !debouncedQuery.trim() && level === "All";

  return (
    <PanelPage>
      <PanelPageHeader
        title="Recruitment"
        subtitle="Find your next laboratory-industry role or discover qualified candidates."
        action={<SupplierRecruitmentActions activeView="mine" />}
      />

      <RecruitmentToolbar
        query={query}
        onQueryChange={setQuery}
        level={level}
        onLevelChange={handleLevelChange}
        basePath={JOB_BASE}
        showTitle={false}
        showActions={false}
      />

      <JobsSectionHeader
        title="My Job Posts"
        description="Jobs you have posted. Close a role to stop new applications."
        count={jobCount(jobsLoading, total)}
      >
        <SegmentedTabs
          tabs={MY_JOB_STATUS_FILTERS}
          activeTab={statusFilter}
          onTabChange={handleStatusChange}
          standalone
          ariaLabel="Filter my job posts by status"
          className="border border-[#E4E7EC]"
        />
      </JobsSectionHeader>

      {jobsLoading ? (
        <CardSkeleton
          variant="myJob"
          count={LIST_PAGE_SIZE}
          className="space-y-4"
        />
      ) : (
        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                variant="mine"
                highlighted={index === 0 && page === 1}
                detailHref={`${JOB_BASE}/${job.id}`}
                onDelete={deleting ? undefined : handleDeleteRequest}
                onEdit={() => navigate(`${JOB_BASE}/${job.id}/edit`)}
                onToggleStatus={handleToggleStatus}
                togglingStatus={togglingId === job.id}
              />
            ))
          ) : (
            <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
              <p className="text-[15px] font-semibold text-deep-blue">
                {unfiltered
                  ? "No job posts yet"
                  : "No job posts match these filters"}
              </p>
              <p className="mt-2 text-[14px] text-[#64748B]">
                {unfiltered
                  ? "Post your first role to reach qualified laboratory professionals."
                  : "Try a different search, level or status."}
              </p>
            </div>
          )}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-2"
      />

      <ConfirmModal
        open={Boolean(pendingDelete)}
        title="Delete job post?"
        description={
          pendingDelete ? (
            <p className="text-[14px] leading-relaxed text-[#64748B]">
              This will permanently remove{" "}
              <span className="font-semibold text-deep-blue">
                {pendingDelete.title || "this job"}
              </span>
              {pendingDelete.company ? (
                <>
                  {" "}
                  at{" "}
                  <span className="font-semibold text-deep-blue">
                    {pendingDelete.company}
                  </span>
                </>
              ) : null}
              . This action cannot be undone.
            </p>
          ) : null
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirming={deleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </PanelPage>
  );
};

export default SupplierMyJobsView;
