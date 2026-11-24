import { useParams } from "react-router";
import JobDetailCard from "@/components/data-display/JobDetailCard/JobDetailCard";
import { JobDetailPageSkeleton } from "@/components/loader";
import PanelPage from "@/components/layout/PanelPage";
import NotFound from "@/modules/error/NotFound";
import { toJobDetailModel } from "@/features/dash/supplier/recruitment";
import { isJobOpen, jobClosedNotice } from "@/features/recruitment/jobStatus";
import {
  AppliedCandidatesPanel,
  ApplyForm,
  JobPosterCard,
} from "@/modules/dash/user/recruitment";
import { contactProfilePath } from "@/modules/dash/supplier/contacts";
import { PROFILE_PATH } from "@/modules/dash/supplier/profile";
import BackLink from "@/components/layout/BackLink";
import { useJobDetail } from "../hooks/useJobDetail";
import { useApplyToJob } from "../hooks/useApplyToJob";
import { JOB_BASE, editJobPath } from "../constant/constants";

const PAGE_LAYOUT =
  "lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-6";

const SupplierJobDetailView = () => {
  const { jobId } = useParams();
  const detail = useJobDetail(jobId);
  const apply = useApplyToJob(jobId);

  if (detail.notFound) return <NotFound />;

  if (detail.loading) {
    return (
      <PanelPage>
        <div className={PAGE_LAYOUT}>
          <JobDetailPageSkeleton />
        </div>
      </PanelPage>
    );
  }

  const job = toJobDetailModel(detail.selectedJob);
  if (!job) return <NotFound />;
  const { isOwner } = detail;
  const isOpen = isJobOpen(job);
  const alreadyApplied = Boolean(detail.selectedJob.myApplication);

  return (
    <PanelPage>
      <div className={PAGE_LAYOUT}>
        <div className="min-w-0">
          <BackLink to={JOB_BASE}>Back to Jobs</BackLink>

          <JobDetailCard
            job={job}
            applyHref={!isOwner && job.applyLink ? job.applyLink : undefined}
            onApply={!isOwner && !job.applyLink ? apply.openForm : undefined}
            showApplyButton={!isOwner && (isOpen || alreadyApplied)}
            applied={alreadyApplied}
            editHref={isOwner ? editJobPath(job.id) : undefined}
          />

          {!isOpen ? (
            <p className="mt-5 rounded-lg border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3 text-[14px] text-[#475467]">
              {jobClosedNotice(job.status, isOwner)}
            </p>
          ) : null}

          {!isOwner && isOpen && !alreadyApplied && apply.open ? (
            <ApplyForm
              coverLetter={apply.coverLetter}
              onCoverLetterChange={apply.setCoverLetter}
              cvFile={apply.cvFile}
              onSelectCv={apply.selectCv}
              onRemoveCv={apply.removeCv}
              cvError={apply.cvError}
              applying={apply.applying}
              onSubmit={apply.submit}
              onCancel={apply.close}
            />
          ) : null}
        </div>

        <aside className="mt-8 flex flex-col gap-4 lg:mt-10">
          <div className="shrink-0">
            <JobPosterCard
              owner={detail.selectedJob.owner}
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
