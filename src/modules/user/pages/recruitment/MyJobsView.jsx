import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import Container from "@/components/ui/Container";
import Pagination from "@/components/common/Pagination/Pagination";
import SegmentedTabs from "@/components/common/SegmentedTabs/SegmentedTabs";
import { CardSkeleton } from "@/components/common/Skeleton";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import JobCard from "@/components/data-display/JobCard/JobCard";
import RecruitmentToolbar from "@/modules/user/components/recruitment/RecruitmentToolbar";
import JobsSectionHeader from "@/modules/user/components/recruitment/JobsSectionHeader";
import {
  buildMyJobsQuery,
  jobCountLabel,
  matchesStatusFilter,
  nextJobStatus,
} from "@/modules/user/components/recruitment/jobsSection";
import {
  fetchJobs,
  updateJob,
  removeJob,
  fetchMyApplications,
  clearRecruitmentError,
  invalidateJobsList,
  jobLeftList,
  levelToApi,
  toJobCardModel,
  formatPostedAgo,
} from "@/features/user/recruitment";
import { MY_JOB_STATUS_FILTERS } from "@/shared/constants/jobStatus";
import { LIST_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

const JOB_BASE = "/recruitment";

const MyJobsView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    jobs,
    jobsMeta,
    jobsLoading,
    deleting,
    applications,
    applicationsLoading,
    error,
  } = useSelector((state) => state.userRecruitment);

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
      fetchJobs(
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
    dispatch(fetchMyApplications({ page: 1, pageSize: 20, sort: "desc" }));
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const filtered = useMemo(
    () => (jobs || []).map(toJobCardModel).filter(Boolean),
    [jobs],
  );

  const myApplications = useMemo(
    () =>
      (applications || []).map((app) => {
        const job = app.job ? toJobCardModel(app.job) : null;
        return {
          id: app.id,
          status: app.status || "PENDING",
          appliedAt: formatPostedAgo(app.appliedAt || app.createdAt).replace(
            /^Posted /,
            "Applied ",
          ),
          coverLetter: app.coverLetter || "",
          job,
          jobId: job?.id || app.jobId,
        };
      }),
    [applications],
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

  const unfiltered =
    statusFilter === "all" && !debouncedQuery.trim() && level === "All";

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
      updateJob({ jobId: job.id, payload: { status } }),
    );
    setTogglingId(null);
    if (!updateJob.fulfilled.match(result)) return;
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

    const result = await dispatch(removeJob(pendingDelete.id));
    if (removeJob.fulfilled.match(result)) {
      toast.success("Job deleted");
      setPendingDelete(null);
      refillPageIfEmptied();
      return;
    }
    toast.error(result.payload || "Failed to delete job");
  };

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container>
        <RecruitmentToolbar
          query={query}
          onQueryChange={setQuery}
          level={level}
          onLevelChange={handleLevelChange}
          activeView="mine"
          basePath={JOB_BASE}
        />

        <div className="mt-6">
          <JobsSectionHeader
            title="My Job Posts"
            description="Jobs you have posted. Close a role to stop new applications."
            countLabel={jobCountLabel(jobsLoading, total)}
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
        </div>

        <div className="mt-4 space-y-4">
          {jobsLoading ? (
            <CardSkeleton
              variant="myJob"
              count={LIST_PAGE_SIZE}
              className="space-y-4"
            />
          ) : filtered.length > 0 ? (
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
                {unfiltered ? "No job posts yet" : "No job posts match these filters"}
              </p>
              <p className="mt-2 text-[14px] text-[#64748B]">
                {unfiltered
                  ? "Post your first role to reach qualified laboratory professionals."
                  : "Try a different search, level or status."}
              </p>
            </div>
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          className="mt-8"
        />

        <section className="mt-10">
          <div className="mb-4">
            <h2 className="text-[20px] font-bold text-deep-blue">
              My Applications
            </h2>
            <p className="mt-1 text-[14px] text-[#64748B]">
              Roles you have applied to across the network.
            </p>
          </div>

          {applicationsLoading && !myApplications.length ? (
            <CardSkeleton
              variant="application"
              count={3}
              className="space-y-3"
            />
          ) : myApplications.length ? (
            <div className="space-y-3">
              {myApplications.map((app) => (
                <div
                  key={app.id}
                  className="rounded-xl border border-[#E4E7EC] bg-white px-5 py-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      {app.jobId ? (
                        <Link
                          to={`${JOB_BASE}/${app.jobId}`}
                          className="text-[15px] font-semibold text-primary hover:underline"
                        >
                          {app.job?.title || "Job posting"}
                        </Link>
                      ) : (
                        <p className="text-[15px] font-semibold text-deep-blue">
                          {app.job?.title || "Job posting"}
                        </p>
                      )}
                      <p className="mt-0.5 text-[13px] text-[#64748B]">
                        {[app.job?.company, app.job?.location]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                      <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                        {app.status}
                      </span>
                      <span className="text-[11px] text-[#98A2B3]">
                        {app.appliedAt}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-10 text-center">
              <p className="text-[14px] text-[#64748B]">
                You have not applied to any jobs yet.
              </p>
            </div>
          )}
        </section>
      </Container>

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
    </main>
  );
};

export default MyJobsView;
