import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import Card from "@/components/ui/Card";
import JobDetailCard from "@/components/data-display/JobDetailCard/JobDetailCard";
import { JobDetailSkeleton } from "@/components/common/Skeleton";
import {
  fetchSupplierJobDetails,
  clearSelectedJob,
  clearRecruitmentError,
  toJobDetailModel,
  recruitmentApi,
} from "@/features/supplier/recruitment";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import NotFound from "@/shared/pages/NotFound";
import { isJobOpen, jobClosedNotice } from "@/shared/constants/jobStatus";

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

  const isOwner =
    Boolean(authUser?.id) &&
    Boolean(selectedJob?.owner?.id) &&
    authUser.id === selectedJob.owner.id;
  const applied = appliedJobId === job.id;
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

      <JobDetailCard
        job={job}
        applyHref={!isOwner && job.applyLink ? job.applyLink : undefined}
        onApply={
          !isOwner && !job.applyLink ? () => setShowApplyForm(true) : undefined
        }
        showApplyButton={!isOwner && isOpen && !applied && !showApplyForm}
      />

      {!isOpen ? (
        <p className="rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3 text-[14px] text-[#475467]">
          {jobClosedNotice(job.status, isOwner)}
        </p>
      ) : null}

      {applied ? (
        <p className="text-[14px] font-medium text-green-primary">
          Your application has been submitted.
        </p>
      ) : null}

      {!isOwner && isOpen && showApplyForm ? (
        <Card>
          <form onSubmit={handleApplySubmit} className="space-y-4 p-5 sm:p-6">
            <div>
              <h2 className="text-[16px] font-bold text-deep-blue">
                Apply for this position
              </h2>
              <p className="mt-1 text-[13px] text-[#64748B]">
                Optionally include a short cover letter with your application.
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
    </PanelPage>
  );
};

export default SupplierJobDetailView;
