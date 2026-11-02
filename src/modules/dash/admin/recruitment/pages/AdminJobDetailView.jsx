import JobDetailCard from "@/components/data-display/JobDetailCard/JobDetailCard";
import { JobDetailSkeleton } from "@/components/loader";
import PanelPage from "@/components/layout/PanelPage";
import PanelBackButton from "@/components/layout/PanelBackButton";
import NotFound from "@/modules/error/NotFound";
import JobSidebar from "../components/detail/JobSidebar";
import { useAdminJobDetail } from "../hooks/useAdminJobDetail";
import { RECRUITMENT_PATH } from "../constant/constants";

const AdminJobDetailView = () => {
  const detail = useAdminJobDetail();
  const { job } = detail;

  if (detail.loading) {
    return (
      <PanelPage>
        <JobDetailSkeleton />
      </PanelPage>
    );
  }

  if (detail.notFound) return <NotFound />;

  return (
    <PanelPage>
      <PanelBackButton fallback={RECRUITMENT_PATH} />

      <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <JobDetailCard job={job} applyHref={job.applyLink} showApplyButton={Boolean(job.applyLink)} />
        <JobSidebar
          owner={detail.owner}
          applications={detail.applications}
          loading={detail.applicationsLoading}
        />
      </div>
    </PanelPage>
  );
};

export default AdminJobDetailView;
