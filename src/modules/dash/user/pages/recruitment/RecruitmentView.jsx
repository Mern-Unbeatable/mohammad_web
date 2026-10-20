import { useSelector } from "react-redux";
import Pagination from "@/components/common/Pagination/Pagination";
import Container from "@/components/ui/Container";
import { selectNewApplicationTotal } from "@/features/dash/user/recruitment";
import RecruitmentToolbar from "./components/toolbar/RecruitmentToolbar";
import ViewModeToggle from "./components/toolbar/ViewModeToggle";
import JobsSectionHeader from "./components/jobs/JobsSectionHeader";
import PublicJobList from "./components/jobs/PublicJobList";
import { usePublicJobs } from "./hooks/usePublicJobs";
import { useViewMode } from "./hooks/useViewMode";
import { JOB_BASE } from "./constant/constants";
import { jobCount } from "./utils/jobsSection";
import {
  EMPLOYMENT_FILTER_OPTIONS,
  WORKPLACE_FILTER_OPTIONS,
} from "./utils/recruitmentUrlFilters";

const RecruitmentView = () => {
  const newApplications = useSelector(selectNewApplicationTotal);
  const jobs = usePublicJobs();
  const [viewMode, setViewMode] = useViewMode();

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container>
        <RecruitmentToolbar
          newApplications={newApplications}
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
          activeView="browse"
          basePath={JOB_BASE}
        />

        <div className="mt-6">
          <JobsSectionHeader
            title="Public Job Posts"
            description="Open roles posted by other members of the network."
            count={jobs.error ? null : jobCount(jobs.loading, jobs.total)}
          >
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
          </JobsSectionHeader>
        </div>

        <div className="mt-4">
          <PublicJobList
            items={jobs.items}
            page={jobs.page}
            viewMode={viewMode}
            loading={jobs.loading}
            error={jobs.error}
            onRetry={jobs.reload}
          />
        </div>

        <Pagination
          page={jobs.page}
          totalPages={jobs.totalPages}
          onPageChange={jobs.changePage}
          className="mt-8"
        />
      </Container>
    </main>
  );
};

export default RecruitmentView;
