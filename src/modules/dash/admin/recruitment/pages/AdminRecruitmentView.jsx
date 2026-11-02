import Pagination from "@/components/common/Pagination/Pagination";
import PanelPage from "@/components/layout/PanelPage";
import PanelPageHeader from "@/components/layout/PanelPageHeader";
import JobFilters from "../components/list/JobFilters";
import JobsList from "../components/list/JobsList";
import DeleteJobModal from "../components/list/DeleteJobModal";
import ErrorBanner from "../components/common/ErrorBanner";
import { useAdminJobs } from "../hooks/useAdminJobs";

const AdminRecruitmentView = () => {
  const jobs = useAdminJobs();

  return (
    <PanelPage>
      <PanelPageHeader
        title="Recruitment"
        subtitle="Manage job listings, approvals and applications."
        action={
          <JobFilters
            timeFilter={jobs.timeFilter}
            onTimeFilterChange={jobs.changeTimeFilter}
            level={jobs.level}
            onLevelChange={jobs.changeLevel}
          />
        }
      />

      {jobs.error ? <ErrorBanner>{jobs.error}</ErrorBanner> : null}

      <JobsList
        items={jobs.items}
        loading={jobs.loading}
        deleting={jobs.deleting}
        onDelete={jobs.requestDelete}
      />

      <Pagination
        page={jobs.page}
        totalPages={jobs.totalPages}
        onPageChange={jobs.changePage}
        className="mt-2"
      />

      <DeleteJobModal
        job={jobs.pendingDelete}
        deleting={jobs.deleting}
        onClose={jobs.cancelDelete}
        onConfirm={jobs.confirmDelete}
      />
    </PanelPage>
  );
};

export default AdminRecruitmentView;
