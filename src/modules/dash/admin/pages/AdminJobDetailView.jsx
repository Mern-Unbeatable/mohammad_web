import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import JobDetailCard from "@/components/data-display/JobDetailCard/JobDetailCard";
import { JobDetailSkeleton } from "@/components/common/Skeleton";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelBackButton from "@/shared/layout/PanelLayout/PanelBackButton";
import NotFound from "@/shared/pages/NotFound";
import { AppliedCandidatesPanel, JobPosterCard } from "@/modules/dash/user/pages/recruitment";
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
      <PanelBackButton fallback="/admin/recruitment" />

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <JobDetailCard
          job={job}
          applyHref={job.applyLink}
          showApplyButton={Boolean(job.applyLink)}
        />

        <aside className="flex flex-col gap-4">
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
