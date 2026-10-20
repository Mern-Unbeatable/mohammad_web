import Pagination from "@/components/common/Pagination/Pagination";
import SegmentedTabs from "@/components/common/SegmentedTabs/SegmentedTabs";
import PanelPage from "@/components/navigation/panel/PanelPage";
import { JobsSectionHeader } from "@/modules/dash/user/recruitment";
import { MY_JOB_STATUS_FILTERS } from "@/features/recruitment/jobStatus";
import RecruitmentHeader from "../components/layout/RecruitmentHeader";
import MyJobsList from "../components/jobs/MyJobsList";
import DeleteJobModal from "../components/jobs/DeleteJobModal";
import { useMyJobs } from "../hooks/useMyJobs";
import { RECRUITMENT_VIEW } from "../constant/constants";

const SupplierMyJobsView = () => {
  const mine = useMyJobs();

  return (
    <PanelPage>
      <RecruitmentHeader
        activeView={RECRUITMENT_VIEW.MINE}
        query={mine.query}
        onQueryChange={mine.setQuery}
        level={mine.level}
        onLevelChange={mine.changeLevel}
      />

      <JobsSectionHeader
        title="My Job Posts"
        description="Jobs you have posted. Close a role to stop new applications."
        count={mine.count}
      >
        <SegmentedTabs
          tabs={MY_JOB_STATUS_FILTERS}
          activeTab={mine.statusFilter}
          onTabChange={mine.changeStatus}
          standalone
          ariaLabel="Filter my job posts by status"
          className="border border-[#E4E7EC]"
        />
      </JobsSectionHeader>

      <MyJobsList
        loading={mine.loading}
        items={mine.items}
        page={mine.page}
        unfiltered={mine.unfiltered}
        deleting={mine.deleting}
        togglingId={mine.togglingId}
        onEdit={mine.editJob}
        onDelete={mine.requestDelete}
        onToggleStatus={mine.toggleStatus}
      />

      <Pagination
        page={mine.page}
        totalPages={mine.totalPages}
        onPageChange={mine.changePage}
        className="mt-2"
      />

      <DeleteJobModal
        job={mine.pendingDelete}
        deleting={mine.deleting}
        onClose={mine.cancelDelete}
        onConfirm={mine.confirmDelete}
      />
    </PanelPage>
  );
};

export default SupplierMyJobsView;
