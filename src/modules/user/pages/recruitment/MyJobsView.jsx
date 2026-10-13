import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Container from "@/components/ui/Container";
import { CardSkeleton } from "@/components/common/Skeleton";
import ConfirmModal from "@/components/common/ConfirmModal/ConfirmModal";
import JobCard from "@/components/data-display/JobCard/JobCard";
import RecruitmentToolbar from "@/modules/user/components/recruitment/RecruitmentToolbar";
import {
  fetchJobs,
  removeJob,
  fetchMyApplications,
  clearRecruitmentError,
  levelToApi,
  toJobCardModel,
  formatPostedAgo,
} from "@/features/user/recruitment";
import { LIST_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

const JOB_BASE = "/recruitment";

const buildMyJobsQuery = ({ query, level }) => {
  const params = {
    page: 1,
    pageSize: 50,
    sort: "desc",
    mine: true,
  };
  const q = query?.trim();
  if (q) params.search = q;
  const levelApi = levelToApi(level);
  if (levelApi) params.level = levelApi;
  return params;
};

const MyJobsView = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    jobs,
    jobsLoading,
    deleting,
    applications,
    applicationsLoading,
    error,
  } = useSelector((state) => state.userRecruitment);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [level, setLevel] = useState("All");
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    dispatch(clearRecruitmentError());
    dispatch(fetchJobs(buildMyJobsQuery({ query: debouncedQuery, level })));
  }, [dispatch, debouncedQuery, level]);

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
          onLevelChange={setLevel}
          activeView="mine"
          basePath={JOB_BASE}
        />

        <div className="mt-6 space-y-4">
          {jobsLoading ? (
            <CardSkeleton
              variant="job"
              count={LIST_PAGE_SIZE}
              className="space-y-4"
            />
          ) : filtered.length > 0 ? (
            filtered.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                variant="mine"
                highlighted={index === 0}
                detailHref={`${JOB_BASE}/${job.id}`}
                onDelete={deleting ? undefined : handleDeleteRequest}
                onEdit={() => navigate(`${JOB_BASE}/${job.id}/edit`)}
              />
            ))
          ) : (
            <div className="rounded-xl border border-[#E4E7EC] bg-white px-6 py-14 text-center">
              <p className="text-[15px] font-semibold text-deep-blue">
                No job posts yet
              </p>
              <p className="mt-2 text-[14px] text-[#64748B]">
                Post your first role to reach qualified laboratory professionals.
              </p>
            </div>
          )}
        </div>

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
