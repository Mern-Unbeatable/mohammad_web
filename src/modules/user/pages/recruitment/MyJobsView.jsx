import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Eye, X } from "lucide-react";
import Container from "@/components/ui/Container";
import Pagination from "@/components/common/Pagination/Pagination";
import SegmentedTabs from "@/components/common/SegmentedTabs/SegmentedTabs";
import { CardSkeleton } from "@/components/common/Skeleton";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import JobCard from "@/components/data-display/JobCard/JobCard";
import RecruitmentToolbar from "@/modules/user/components/recruitment/RecruitmentToolbar";
import JobsSectionHeader from "@/modules/user/components/recruitment/JobsSectionHeader";
import { applicationStatusClass } from "@/modules/user/components/recruitment/candidates";
import {
  buildMyJobsQuery,
  jobCount,
  matchesStatusFilter,
  nextJobStatus,
} from "@/modules/user/components/recruitment/jobsSection";
import {
  fetchJobs,
  updateJob,
  removeJob,
  fetchMyApplications,
  withdrawApplication,
  clearRecruitmentError,
  invalidateJobsList,
  jobLeftList,
  levelToApi,
  toJobCardModel,
  formatPostedAgo,
  selectNewApplicationTotal,
  selectNewApplicationsByJob,
} from "@/features/user/recruitment";
import {
  MY_APPLICATION_FILTERS,
  MY_JOB_STATUS_FILTERS,
} from "@/shared/constants/jobStatus";
import { LIST_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

const JOB_BASE = "/recruitment";
const CANCELLABLE_STATUSES = new Set(["APPLIED", "REVIEWED"]);

const MyJobsView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    jobs,
    jobsMeta,
    jobsLoading,
    deleting,
    applications,
    applicationsMeta,
    applicationsLoading,
    error,
  } = useSelector((state) => state.userRecruitment);
  const newApplications = useSelector(selectNewApplicationTotal);
  const newApplicationsByJob = useSelector(selectNewApplicationsByJob);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [pendingWithdraw, setPendingWithdraw] = useState(null);
  const [withdrawing, setWithdrawing] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [applicationFilter, setApplicationFilter] = useState("applied");

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
    dispatch(
      fetchMyApplications({
        page: 1,
        pageSize: 20,
        sort: "desc",
        status: applicationFilter,
      }),
    );
  }, [dispatch, applicationFilter]);

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

  const handleConfirmWithdraw = async () => {
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

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container>
        <RecruitmentToolbar
          newApplications={newApplications}
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
                newApplications={newApplicationsByJob[job.id] || 0}
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
            <JobsSectionHeader
              title="My Applications"
              description="Roles you have applied to across the network."
              count={jobCount(applicationsLoading, applicationsMeta?.total)}
              itemName="application"
            >
              <SegmentedTabs
                tabs={MY_APPLICATION_FILTERS}
                activeTab={applicationFilter}
                onTabChange={setApplicationFilter}
                standalone
                ariaLabel="Filter my applications by status"
                className="border border-[#E4E7EC]"
              />
            </JobsSectionHeader>
          </div>

          {applicationsLoading ? (
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
                  className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] bg-white px-4 py-3"
                >
                  {app.job?.image ? (
                    <img
                      src={app.job.image}
                      alt=""
                      className="w-16 shrink-0 self-stretch rounded-lg border border-[#E4E7EC] bg-white object-contain p-1"
                    />
                  ) : null}
                  <div className="min-w-0 flex-1">
                    {app.jobId ? (
                      <Link
                        to={`${JOB_BASE}/${app.jobId}`}
                        className="block truncate text-[15px] font-semibold text-deep-blue hover:text-primary hover:underline"
                      >
                        {app.job?.title || "Job posting"}
                      </Link>
                    ) : (
                      <p className="truncate text-[15px] font-semibold text-deep-blue">
                        {app.job?.title || "Job posting"}
                      </p>
                    )}
                    <p className="mt-0.5 truncate text-[13px] text-[#64748B]">
                      {[app.job?.company, app.job?.location]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className={applicationStatusClass(app.status)}>
                        {app.status}
                      </span>
                      <span className="text-[11px] text-[#98A2B3]">
                        {app.appliedAt}
                      </span>
                    </div>
                  </div>
                  {app.jobId ? (
                    <Link
                      to={`${JOB_BASE}/${app.jobId}`}
                      aria-label={`View ${app.job?.title || "job posting"}`}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-primary/30 px-3 py-1.5 text-[12px] font-semibold text-primary transition-colors hover:bg-[#E8F3FB]"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                  ) : null}
                  {app.jobId && CANCELLABLE_STATUSES.has(app.status) ? (
                    <button
                      type="button"
                      onClick={() => setPendingWithdraw(app)}
                      disabled={withdrawing}
                      aria-label={`Cancel application for ${app.job?.title || "job posting"}`}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-[#FDA29B] px-3 py-1.5 text-[12px] font-semibold text-[#D92D20] transition-colors hover:bg-[#FEF3F2] disabled:opacity-60"
                    >
                      <X className="h-3.5 w-3.5" />
                      Cancel
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-10 text-center">
              <p className="text-[14px] text-[#64748B]">
                {applicationFilter === "cancelled"
                  ? "You have no cancelled applications."
                  : "You have not applied to any jobs yet."}
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

      <ConfirmModal
        open={Boolean(pendingWithdraw)}
        title="Cancel application?"
        description={
          pendingWithdraw ? (
            <p className="text-[14px] leading-relaxed text-[#64748B]">
              Your application for{" "}
              <span className="font-semibold text-deep-blue">
                {pendingWithdraw.job?.title || "this job"}
              </span>{" "}
              will be withdrawn and the employer will no longer see it. You can
              apply again while the job is open.
            </p>
          ) : null
        }
        confirmLabel="Cancel application"
        cancelLabel="Keep"
        confirming={withdrawing}
        onClose={() => {
          if (!withdrawing) setPendingWithdraw(null);
        }}
        onConfirm={handleConfirmWithdraw}
      />
    </main>
  );
};

export default MyJobsView;
