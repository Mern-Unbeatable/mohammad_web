import { useParams } from "react-router";
import BackLink from "@/components/layout/BackLink";
import DashboardPage from "@/components/layout/DashboardPage";
import { JobDetailPageSkeleton } from "@/components/loader";
import JobDetailCard from "@/components/data-display/JobDetailCard/JobDetailCard";
import { toJobDetailModel } from "@/features/dash/user/recruitment";
import NotFound from "@/modules/error/NotFound";
import { isJobOpen, jobClosedNotice } from "@/features/recruitment/jobStatus";
import AppliedCandidatesPanel from "../components/candidates/AppliedCandidatesPanel";
import JobPosterCard from "../components/detail/JobPosterCard";
import ApplyForm from "../components/detail/ApplyForm";
import { useJobDetail } from "../hooks/useJobDetail";
import { useApplyToJob } from "../hooks/useApplyToJob";
import { JOB_BASE, editJobPath } from "../constant/constants";

const PAGE_GRID = "lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-6";

const JobDetailView = () => {
  const { jobId } = useParams();
  const detail = useJobDetail(jobId);
  const apply = useApplyToJob(jobId);

  if (detail.notFound) return <NotFound />;

  if (detail.loading) {
    return (
      <DashboardPage width="wide" className={PAGE_GRID}>
        <JobDetailPageSkeleton />
      </DashboardPage>
    );
  }

  const job = toJobDetailModel(detail.selectedJob);
  if (!job) return <NotFound />;
  const { isOwner } = detail;
  const isOpen = isJobOpen(job);
  const alreadyApplied = Boolean(detail.selectedJob.myApplication);

  return (
    <DashboardPage width="wide" className={PAGE_GRID}>
      <div className="min-w-0">
        <BackLink to={JOB_BASE} className="mb-5">
          Back to Jobs
        </BackLink>

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
          <JobPosterCard owner={detail.selectedJob.owner} isSelf={isOwner} />
        </div>

        {isOwner ? (
          <AppliedCandidatesPanel
            applications={detail.applications}
            loading={detail.applicationsLoading}
          />
        ) : null}
      </aside>
    </DashboardPage>
  );
};

export default JobDetailView;
