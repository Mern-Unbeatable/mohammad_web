import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, Eye } from "lucide-react";
import { toast } from "react-hot-toast";
import Container from "@/components/ui/Container";
import Card from "@/components/ui/Card";
import Avatar from "@/components/ui/Avatar";
import ApplicantDetailsModal from "@/modules/user/components/recruitment/ApplicantDetailsModal";
import JobPosterCard from "@/modules/user/components/recruitment/JobPosterCard";
import { CardSkeleton, JobDetailPageSkeleton } from "@/components/common/Skeleton";
import JobDetailCard from "@/components/data-display/JobDetailCard/JobDetailCard";
import {
  fetchJobDetails,
  applyToJob,
  clearSelectedJob,
  clearRecruitmentError,
  toJobDetailModel,
  recruitmentApi,
  formatPostedAgo,
  jobApplicationsSeen,
  fetchNewApplicationCounts,
} from "@/features/user/recruitment";
import NotFound from "@/shared/pages/NotFound";
import { isJobOpen, jobClosedNotice } from "@/shared/constants/jobStatus";

const capitalize = (text) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

const toCandidateModel = (app) => {
  const applicant = app.applicant || {};
  return {
    ...app,
    applicant,
    name:
      applicant.name ||
      [applicant.firstName, applicant.lastName].filter(Boolean).join(" ") ||
      applicant.email ||
      "Applicant",
    status: app.status || "APPLIED",
    appliedLabel: formatPostedAgo(app.appliedAt || app.createdAt).replace(
      /^Posted /,
      "Applied ",
    ),
    appliedAgo: capitalize(
      formatPostedAgo(app.appliedAt || app.createdAt).replace(/^Posted /, ""),
    ),
    profileHref: applicant.id ? `/contacts/${applicant.id}` : null,
  };
};

const appliedTime = (app) =>
  new Date(app.appliedAt || app.createdAt).getTime() || 0;

const sortByFirstApplied = (rows) =>
  [...rows].sort((a, b) => appliedTime(a) - appliedTime(b));

const JobDetailView = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { selectedJob, selectedJobLoading, applying, error } = useSelector(
    (state) => state.userRecruitment,
  );
  const authUser = useSelector((state) => state.auth.user);

  const [notFoundId, setNotFoundId] = useState(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [appsCache, setAppsCache] = useState({ key: null, rows: [] });
  const [viewingCandidate, setViewingCandidate] = useState(null);
  const closeCandidate = useCallback(() => setViewingCandidate(null), []);

  useEffect(() => {
    if (!jobId) return undefined;
    dispatch(clearRecruitmentError());
    dispatch(fetchJobDetails(jobId)).then((result) => {
      if (fetchJobDetails.rejected.match(result)) {
        setNotFoundId(jobId);
      }
    });
    return () => {
      dispatch(clearSelectedJob());
    };
  }, [dispatch, jobId]);

  useEffect(() => {
    if (error && !selectedJobLoading) toast.error(error);
  }, [error, selectedJobLoading]);

  const isOwner =
    Boolean(authUser?.id) &&
    Boolean(selectedJob?.owner?.id) &&
    authUser.id === selectedJob.owner.id;

  useEffect(() => {
    if (!jobId || !isOwner) return undefined;

    let cancelled = false;
    recruitmentApi
      .getJobApplications(jobId)
      .then((rows) => {
        if (!cancelled) {
          setAppsCache({
            key: jobId,
            rows: Array.isArray(rows) ? rows : [],
          });
        }
        dispatch(jobApplicationsSeen(jobId));
        dispatch(fetchNewApplicationCounts());
      })
      .catch((err) => {
        if (!cancelled) {
          setAppsCache({ key: jobId, rows: [] });
          toast.error(
            recruitmentApi.getApiErrorMessage?.(
              err,
              "Failed to load applications",
            ) || "Failed to load applications",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [dispatch, jobId, isOwner]);

  if (notFoundId === jobId) return <NotFound />;

  if (selectedJobLoading || (!selectedJob && !error)) {
    return (
      <main className="pt-6 pb-8 sm:pt-8">
        <Container className="max-w-[1160px] lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-6">
          <JobDetailPageSkeleton />
        </Container>
      </main>
    );
  }

  const job = toJobDetailModel(selectedJob);
  if (!job) return <NotFound />;
  const isOpen = isJobOpen(job);
  const alreadyApplied = Boolean(selectedJob.myApplication);

  const handleApplyClick = () => {
    setShowApplyForm(true);
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (applying) return;

    const result = await dispatch(
      applyToJob({
        jobId: job.id,
        coverLetter: coverLetter.trim() || undefined,
      }),
    );

    if (applyToJob.fulfilled.match(result)) {
      toast.success("Application submitted");
      setShowApplyForm(false);
      setCoverLetter("");
      return;
    }
    toast.error(result.payload || "Failed to apply to job");
  };

  const applications =
    isOwner && appsCache.key === jobId ? sortByFirstApplied(appsCache.rows) : [];
  const showApplicationsLoading = isOwner && appsCache.key !== jobId;

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container className="max-w-[1160px] lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-6">
        <div className="min-w-0">
          <Link
            to="/recruitment"
            className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Jobs
          </Link>

          <JobDetailCard
            job={job}
            applyHref={!isOwner && job.applyLink ? job.applyLink : undefined}
            onApply={!isOwner && !job.applyLink ? handleApplyClick : undefined}
            showApplyButton={!isOwner && (isOpen || alreadyApplied)}
            applied={alreadyApplied}
            editHref={isOwner ? `/recruitment/${job.id}/edit` : undefined}
          />

          {!isOpen ? (
            <p className="mt-5 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3 text-[14px] text-[#475467]">
              {jobClosedNotice(job.status, isOwner)}
            </p>
          ) : null}

          {!isOwner && isOpen && !alreadyApplied && showApplyForm ? (
            <Card className="mt-5">
              <form
                onSubmit={handleApplySubmit}
                className="space-y-4 p-5 sm:p-6"
              >
                <div>
                  <h2 className="text-[16px] font-bold text-deep-blue">
                    Apply for this position
                  </h2>
                  <p className="mt-1 text-[13px] text-[#64748B]">
                    Optionally include a short cover letter with your
                    application.
                  </p>
                </div>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={4}
                  placeholder="Cover letter (optional)"
                  className="w-full resize-y rounded-lg border border-[#E4E7EC] bg-white px-3.5 py-2.5 text-[14px] text-deep-blue outline-none placeholder:text-[#98A2B3] focus:border-primary focus:ring-2 focus:ring-primary/10"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="submit"
                    disabled={applying}
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0] disabled:opacity-60"
                  >
                    {applying ? "Submitting…" : "Submit application"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowApplyForm(false);
                      setCoverLetter("");
                    }}
                    className="inline-flex items-center justify-center rounded-lg border border-[#E4E7EC] px-5 py-2.5 text-[13px] font-semibold text-[#475467] hover:bg-[#F9FAFB]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Card>
          ) : null}
        </div>

        <aside className="mt-8 flex flex-col gap-4 lg:sticky lg:top-[86px] lg:mt-10 lg:max-h-[calc(100dvh-110px)]">
          <div className="shrink-0">
            <JobPosterCard owner={selectedJob.owner} isSelf={isOwner} />
          </div>

          {isOwner ? (
            <section className="rounded-xl border border-[#E4E7EC] bg-white p-4 lg:flex lg:min-h-0 lg:flex-col">
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="text-[18px] font-bold text-deep-blue">
                  Applied Candidates
                </h2>
                {!showApplicationsLoading ? (
                  <span className="text-[13px] font-medium text-[#98A2B3]">
                    {applications.length}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-[13px] text-[#64748B]">
                Candidates who applied to this role.
              </p>

              {showApplicationsLoading ? (
                <CardSkeleton
                  variant="candidate"
                  count={3}
                  className="mt-4 space-y-3"
                />
              ) : applications.length ? (
                <div className="mt-4 space-y-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-1">
                  {applications.map((app) => {
                    const candidate = toCandidateModel(app);
                    return (
                      <div
                        key={app.id}
                        className="flex items-center gap-3 rounded-xl border border-[#E4E7EC] bg-white px-4 py-3"
                      >
                        <Avatar
                          src={candidate.applicant.avatar}
                          alt={candidate.name}
                          size="sm"
                          className="self-start"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="flex items-center gap-1.5 text-[15px] font-semibold text-deep-blue">
                            <span className="truncate">{candidate.name}</span>
                            {candidate.isNew ? (
                              <span className="shrink-0 rounded-full bg-[#CC1016] px-1.5 py-px text-[10px] font-bold uppercase text-white">
                                New
                              </span>
                            ) : null}
                          </p>
                          <div className="mt-1 flex min-w-0 items-center gap-2">
                            <span className="inline-flex shrink-0 rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                              {candidate.status}
                            </span>
                            <span
                              className="truncate whitespace-nowrap text-[11px] text-[#98A2B3]"
                              title={candidate.appliedLabel}
                            >
                              {candidate.appliedAgo}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setViewingCandidate(candidate)}
                          aria-label={`View ${candidate.name}'s application`}
                          className="inline-flex shrink-0 items-center gap-1.5 rounded-md border border-primary/30 px-3 py-1.5 text-[12px] font-semibold text-primary transition-colors hover:bg-[#E8F3FB]"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-10 text-center">
                  <p className="text-[14px] text-[#64748B]">
                    No applications yet.
                  </p>
                </div>
              )}
            </section>
          ) : null}
        </aside>
      </Container>

      <ApplicantDetailsModal
        application={viewingCandidate}
        onClose={closeCandidate}
      />
    </main>
  );
};

export default JobDetailView;
