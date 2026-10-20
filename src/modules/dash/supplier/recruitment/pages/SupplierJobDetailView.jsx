import { useParams } from "react-router";
import JobDetailCard from "@/components/data-display/JobDetailCard/JobDetailCard";
import { JobDetailSkeleton } from "@/components/loader";
import PanelPage from "@/components/navigation/panel/PanelPage";
import NotFound from "@/modules/error/NotFound";
import { AppliedCandidatesPanel, JobPosterCard } from "@/modules/dash/user/recruitment";
import { contactProfilePath } from "@/modules/dash/supplier/contacts";
import { PROFILE_PATH } from "@/modules/dash/supplier/profile";
import { isJobOpen } from "@/features/recruitment/jobStatus";
import BackLink from "../components/layout/BackLink";
import ApplyForm from "../components/detail/ApplyForm";
import JobNotices from "../components/detail/JobNotices";
import { useJobDetail } from "../hooks/useJobDetail";
import { useApplyToJob } from "../hooks/useApplyToJob";
import { JOB_BASE, editJobPath } from "../constant/constants";

const SupplierJobDetailView = () => {
  const { jobId } = useParams();
  const detail = useJobDetail(jobId);
  const apply = useApplyToJob(detail.job?.id);
  const { job, isOwner } = detail;

  if (detail.notFound) return <NotFound />;

  if (detail.loading) {
    return (
      <PanelPage>
        <JobDetailSkeleton />
      </PanelPage>
    );
  }

  if (!job) return <NotFound />;

  const applied = apply.justApplied || detail.alreadyApplied;
  const isOpen = isJobOpen(job);

  return (
    <PanelPage>
      <BackLink to={JOB_BASE}>Back to Jobs</BackLink>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="min-w-0 space-y-4">
          <JobDetailCard
            job={job}
            applyHref={!isOwner && job.applyLink ? job.applyLink : undefined}
            onApply={!isOwner && !job.applyLink ? apply.openForm : undefined}
            showApplyButton={!isOwner && (isOpen || applied) && !apply.open}
            applied={applied}
            editHref={isOwner ? editJobPath(job.id) : undefined}
          />

          <JobNotices
            status={job.status}
            isOpen={isOpen}
            isOwner={isOwner}
            justApplied={apply.justApplied}
          />

          {!isOwner && isOpen && !applied && apply.open ? (
            <ApplyForm
              coverLetter={apply.coverLetter}
              onCoverLetterChange={apply.setCoverLetter}
              applying={apply.applying}
              onSubmit={apply.submit}
              onCancel={apply.close}
            />
          ) : null}
        </div>

        <aside className="flex flex-col gap-4">
          <div className="shrink-0">
            <JobPosterCard
              owner={detail.owner}
              isSelf={isOwner}
              profilePath={isOwner ? () => PROFILE_PATH : contactProfilePath}
            />
          </div>
          {isOwner ? (
            <AppliedCandidatesPanel
              applications={detail.applications}
              loading={detail.applicationsLoading}
              profilePath={contactProfilePath}
            />
          ) : null}
        </aside>
      </div>
    </PanelPage>
  );
};

export default SupplierJobDetailView;
