import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";
import JobDetailCard from "@/components/data-display/JobDetailCard/JobDetailCard";
import { JobDetailSkeleton } from "@/components/common/Skeleton";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import NotFound from "@/shared/pages/NotFound";
import {
  fetchJobDetails,
  clearSelectedJob,
} from "@/features/admin/recruitment";
import { toJobCardModel } from "@/features/admin/recruitment/recruitmentMappers";

const AdminJobDetailView = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();

  const { selectedJob, selectedJobLoading, error } = useSelector(
    (state) => state.adminRecruitment,
  );

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobDetails(jobId));
    }
    return () => {
      dispatch(clearSelectedJob());
    };
  }, [dispatch, jobId]);

  const job = useMemo(() => toJobCardModel(selectedJob), [selectedJob]);

  if (selectedJobLoading) {
    return (
      <PanelPage>
        <JobDetailSkeleton />
      </PanelPage>
    );
  }

  if (error && !selectedJob) {
    return <NotFound />;
  }

  if (!job) return <NotFound />;

  return (
    <PanelPage>
      <Link
        to="/admin/recruitment"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <JobDetailCard
        job={job}
        applyHref={job.applyLink}
        showApplyButton={Boolean(job.applyLink)}
      />
    </PanelPage>
  );
};

export default AdminJobDetailView;
