import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "@/components/ui/Card";
import JobDetailCard from "@/components/data-display/JobDetailCard/JobDetailCard";
import { JobDetailSkeleton } from "@/components/common/Skeleton";
import { AppliedCandidatesPanel, JobPosterCard } from "@/modules/dash/user/pages/recruitment";
import {
  fetchSupplierJobDetails,
  clearSelectedJob,
  clearRecruitmentError,
  toJobDetailModel,
  recruitmentApi,
} from "@/features/dash/supplier/recruitment";
import PanelPage from "@/components/navigation/panel/PanelPage";
import NotFound from "@/modules/error/NotFound";
import { isJobOpen, jobClosedNotice } from "@/features/recruitment/jobStatus";

const contactPath = (userId) => `/supplier/contacts/${userId}`;

const SupplierJobDetailView = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { selectedJob, selectedJobLoading, error } = useSelector(
    (state) => state.supplierRecruitment,
  );
  const authUser = useSelector((state) => state.auth.user);
  const [notFound, setNotFound] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [appliedJobId, setAppliedJobId] = useState(null);
  const [appsCache, setAppsCache] = useState({ key: null, rows: [] });

  const isOwner =
    Boolean(authUser?.id) &&
    Boolean(selectedJob?.owner?.id) &&
    selectedJob?.id === jobId &&
    authUser.id === selectedJob.owner.id;

  useEffect(() => {
    if (!jobId) return undefined;
    dispatch(clearRecruitmentError());
    dispatch(fetchSupplierJobDetails(jobId)).then((result) => {
      if (fetchSupplierJobDetails.rejected.match(result)) {
        setNotFound(true);
      }
    });
    return () => {
      dispatch(clearSelectedJob());
    };
  }, [dispatch, jobId]);

  useEffect(() => {
    if (error && !selectedJobLoading) toast.error(error);
  }, [error, selectedJobLoading]);

  useEffect(() => {
    if (!isOwner || !jobId) return undefined;
    let cancelled = false;
    recruitmentApi
      .getJobApplications(jobId)
      .then((rows) => {
        if (!cancelled) setAppsCache({ key: jobId, rows });
      })
      .catch(() => {
        if (!cancelled) setAppsCache({ key: jobId, rows: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [isOwner, jobId]);

  if (notFound) return <NotFound />;

  if (selectedJobLoading || (!selectedJob && !error)) {
    return (
      <PanelPage>
        <JobDetailSkeleton />
      </PanelPage>
    );
  }

  const job = toJobDetailModel(selectedJob);
  if (!job) return <NotFound />;

  const applicationsLoaded = appsCache.key === jobId;
  const justApplied = appliedJobId === job.id;
  const applied = justApplied || Boolean(selectedJob.myApplication);
  const isOpen = isJobOpen(job);

  const closeApplyForm = () => {
    setShowApplyForm(false);
    setCoverLetter("");
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    if (applying) return;

    setApplying(true);
    try {
      await recruitmentApi.applyToJob(job.id, {
        coverLetter: coverLetter.trim() || undefined,
      });
      toast.success("Application submitted");
      setAppliedJobId(job.id);
      closeApplyForm();
    } catch (err) {
      toast.error(
        recruitmentApi.getApiErrorMessage(err, "Failed to apply to job"),
      );
    } finally {
      setApplying(false);
    }
  };

  return (
    <PanelPage>
      <Link
        to="/supplier/recruitment"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="min-w-0 space-y-4">
          <JobDetailCard
            job={job}
            applyHref={!isOwner && job.applyLink ? job.applyLink : undefined}
            onApply={
              !isOwner && !job.applyLink
                ? () => setShowApplyForm(true)
                : undefined
            }
            showApplyButton={!isOwner && (isOpen || applied) && !showApplyForm}
            applied={applied}
            editHref={
              isOwner ? `/supplier/recruitment/${job.id}/edit` : undefined
            }
          />

          {!isOpen ? (
            <p className="rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3 text-[14px] text-[#475467]">
              {jobClosedNotice(job.status, isOwner)}
            </p>
          ) : null}

          {justApplied ? (
            <p className="text-[14px] font-medium text-green-primary">
              Your application has been submitted.
            </p>
          ) : null}

          {!isOwner && isOpen && !applied && showApplyForm ? (
            <Card>
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
                    onClick={closeApplyForm}
                    disabled={applying}
                    className="inline-flex items-center justify-center rounded-lg border border-[#E4E7EC] px-5 py-2.5 text-[13px] font-semibold text-[#475467] hover:bg-[#F9FAFB] disabled:opacity-60"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </Card>
          ) : null}
        </div>

        <aside className="flex flex-col gap-4">
          <div className="shrink-0">
            <JobPosterCard
              owner={selectedJob.owner}
              isSelf={isOwner}
              profilePath={isOwner ? () => "/supplier/profile" : contactPath}
            />
          </div>
          {isOwner ? (
            <AppliedCandidatesPanel
              applications={applicationsLoaded ? appsCache.rows : []}
              loading={!applicationsLoaded}
              profilePath={contactPath}
            />
          ) : null}
        </aside>
      </div>
    </PanelPage>
  );
};

export default SupplierJobDetailView;
