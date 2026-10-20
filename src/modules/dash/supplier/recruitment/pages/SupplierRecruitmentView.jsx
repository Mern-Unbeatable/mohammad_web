import Pagination from "@/components/common/Pagination/Pagination";
import PanelPage from "@/components/navigation/panel/PanelPage";
import {
  EMPLOYMENT_FILTER_OPTIONS,
  JobsSectionHeader,
  PublicJobList,
  ViewModeToggle,
  WORKPLACE_FILTER_OPTIONS,
  jobCount,
  useViewMode,
} from "@/modules/dash/user/recruitment";
import RecruitmentHeader from "../components/layout/RecruitmentHeader";
import { usePublicJobs } from "../hooks/usePublicJobs";
import { RECRUITMENT_VIEW, VIEW_MODE_STORAGE_KEY, jobDetailPath } from "../constant/constants";

const SupplierRecruitmentView = () => {
  const jobs = usePublicJobs();
  const [viewMode, setViewMode] = useViewMode(VIEW_MODE_STORAGE_KEY);

  return (
    <PanelPage>
      <RecruitmentHeader
        activeView={RECRUITMENT_VIEW.BROWSE}
        query={jobs.query}
        onQueryChange={jobs.setQuery}
        level={jobs.level}
        onLevelChange={jobs.setLevel}
        employmentType={jobs.employmentType}
        employmentOptions={EMPLOYMENT_FILTER_OPTIONS}
        onEmploymentTypeChange={jobs.setEmploymentType}
        workplaceType={jobs.workplaceType}
        workplaceOptions={WORKPLACE_FILTER_OPTIONS}
        onWorkplaceTypeChange={jobs.setWorkplaceType}
      />

      <JobsSectionHeader
        title="Public Job Posts"
        description="Open roles posted by other members of the network."
        count={jobs.error ? null : jobCount(jobs.loading, jobs.total)}
      >
        <ViewModeToggle value={viewMode} onChange={setViewMode} />
      </JobsSectionHeader>

      <PublicJobList
        items={jobs.items}
        page={jobs.page}
        viewMode={viewMode}
        loading={jobs.loading}
        error={jobs.error}
        onRetry={jobs.reload}
        jobHref={jobDetailPath}
      />

      <Pagination
        page={jobs.page}
        totalPages={jobs.totalPages}
        onPageChange={jobs.changePage}
        className="mt-2"
      />
    </PanelPage>
  );
};

export default SupplierRecruitmentView;
