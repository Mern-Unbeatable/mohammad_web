import { Link, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";
import Container from "@/components/ui/Container";
import { JobDetailPageSkeleton } from "@/components/common/Skeleton";
import JobDetailCard from "@/components/data-display/JobDetailCard/JobDetailCard";
import { toJobDetailModel } from "@/features/dash/user/recruitment";
import NotFound from "@/shared/pages/NotFound";
import { isJobOpen, jobClosedNotice } from "@/shared/constants/jobStatus";
import AppliedCandidatesPanel from "./components/candidates/AppliedCandidatesPanel";
import JobPosterCard from "./components/detail/JobPosterCard";
import ApplyForm from "./components/detail/ApplyForm";
import { useJobDetail } from "./hooks/useJobDetail";
import { useApplyToJob } from "./hooks/useApplyToJob";
import { JOB_BASE, editJobPath } from "./constant/constants";

const PAGE_LAYOUT =
  "max-w-[1160px] lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-6";

const JobDetailView = () => {
  const { jobId } = useParams();
  const detail = useJobDetail(jobId);
  const apply = useApplyToJob(jobId);

  if (detail.notFound) return <NotFound />;

  if (detail.loading) {
    return (
      <main className="pt-6 pb-8 sm:pt-8">
        <Container className={PAGE_LAYOUT}>
          <JobDetailPageSkeleton />
        </Container>
      </main>
    );
  }

  const job = toJobDetailModel(detail.selectedJob);
  if (!job) return <NotFound />;
  const { isOwner } = detail;
  const isOpen = isJobOpen(job);
  const alreadyApplied = Boolean(detail.selectedJob.myApplication);

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container className={PAGE_LAYOUT}>
        <div className="min-w-0">
          <Link
            to={JOB_BASE}
            className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Jobs
          </Link>

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
      </Container>
    </main>
  );
};

export default JobDetailView;
