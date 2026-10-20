import Pagination from "@/components/common/Pagination/Pagination";
import PanelPage from "@/components/navigation/panel/PanelPage";
import { JobsSectionHeader } from "@/modules/dash/user/recruitment";
import RecruitmentHeader from "../components/layout/RecruitmentHeader";
import PublicJobsList from "../components/jobs/PublicJobsList";
import { usePublicJobs } from "../hooks/usePublicJobs";
import { RECRUITMENT_VIEW } from "../constant/constants";

const SupplierRecruitmentView = () => {
  const jobs = usePublicJobs();

  return (
    <PanelPage>
      <RecruitmentHeader
        activeView={RECRUITMENT_VIEW.BROWSE}
        query={jobs.query}
        onQueryChange={jobs.setQuery}
        level={jobs.level}
        onLevelChange={jobs.changeLevel}
      />

      <JobsSectionHeader
        title="Public Job Posts"
        description="Open roles posted by other members of the network."
        count={jobs.count}
      />

      <PublicJobsList loading={jobs.loading} items={jobs.items} page={jobs.page} />

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
