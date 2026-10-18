import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { ChevronLeft } from "lucide-react";
import JobDetailCard from "@/components/data-display/JobDetailCard/JobDetailCard";
import { JobDetailSkeleton } from "@/components/common/Skeleton";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import NotFound from "@/shared/pages/NotFound";
import JobPosterCard from "@/modules/user/components/recruitment/JobPosterCard";
import AppliedCandidatesPanel from "@/modules/user/components/recruitment/AppliedCandidatesPanel";
import {
  fetchJobDetails,
  clearSelectedJob,
  recruitmentApi,
} from "@/features/admin/recruitment";
import { toJobCardModel } from "@/features/admin/recruitment/recruitmentMappers";

const adminProfilePath = (userId) => `/admin/users/${userId}`;

const AdminJobDetailView = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();

  const { selectedJob, selectedJobLoading, error } = useSelector(
    (state) => state.adminRecruitment,
  );
  const [appsCache, setAppsCache] = useState({ key: null, rows: [] });

  useEffect(() => {
    if (jobId) {
      dispatch(fetchJobDetails(jobId));
    }
    return () => {
      dispatch(clearSelectedJob());
    };
  }, [dispatch, jobId]);

  useEffect(() => {
    if (!jobId) return undefined;
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
  }, [jobId]);

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

  const applicationsLoaded = appsCache.key === jobId;

  return (
    <PanelPage>
      <Link
        to="/admin/recruitment"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <JobDetailCard
          job={job}
          applyHref={job.applyLink}
          showApplyButton={Boolean(job.applyLink)}
        />

        <aside className="flex flex-col gap-4 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-120px)]">
          <div className="shrink-0">
            <JobPosterCard
              owner={selectedJob?.owner}
              profilePath={adminProfilePath}
            />
          </div>
          <AppliedCandidatesPanel
            applications={applicationsLoaded ? appsCache.rows : []}
            loading={!applicationsLoaded}
            profilePath={adminProfilePath}
            description="Everyone who applied to this job."
          />
        </aside>
      </div>
    </PanelPage>
  );
};

export default AdminJobDetailView;
