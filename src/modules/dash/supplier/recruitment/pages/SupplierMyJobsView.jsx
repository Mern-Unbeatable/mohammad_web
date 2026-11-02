import { Link } from "react-router";
import { Plus } from "lucide-react";
import Pagination from "@/components/common/Pagination/Pagination";
import SegmentedTabs from "@/components/common/SegmentedTabs/SegmentedTabs";
import PanelPage from "@/components/layout/PanelPage";
import DeleteJobModal from "@/components/modals/recruitment/DeleteJobModal";
import WithdrawApplicationModal from "@/components/modals/recruitment/WithdrawApplicationModal";
import { MY_JOB_STATUS_FILTERS } from "@/features/recruitment/jobStatus";
import {
  JobsSectionHeader,
  MyApplicationsSection,
  MyJobList,
  jobCount,
} from "@/modules/dash/user/recruitment";
import RecruitmentHeader from "../components/layout/RecruitmentHeader";
import { useMyJobs } from "../hooks/useMyJobs";
import { useMyApplications } from "../hooks/useMyApplications";
import {
  CREATE_JOB_PATH,
  RECRUITMENT_VIEW,
  editJobPath,
  jobDetailPath,
} from "../constant/constants";

const SupplierMyJobsView = () => {
  const jobs = useMyJobs();
  const applications = useMyApplications();

  return (
    <PanelPage>
      <RecruitmentHeader
        activeView={RECRUITMENT_VIEW.MINE}
        query={jobs.query}
        onQueryChange={jobs.setQuery}
        filters={
          <SegmentedTabs
            tabs={MY_JOB_STATUS_FILTERS}
            activeTab={jobs.statusFilter}
            onTabChange={jobs.changeStatusFilter}
            standalone
            ariaLabel="Filter my job posts by status"
            className="shrink-0 self-start border border-[#E4E7EC] sm:self-auto"
          />
        }
      />

      <JobsSectionHeader
        title="My Job Posts"
        description="Jobs you have posted. Close a role to stop new applications."
        count={jobCount(jobs.loading, jobs.total)}
      >
        <Link
          to={CREATE_JOB_PATH}
          className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-md bg-primary px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#066BB0] sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          Post Job
        </Link>
      </JobsSectionHeader>

      <MyJobList
        items={jobs.items}
        page={jobs.page}
        loading={jobs.loading}
        unfiltered={jobs.unfiltered}
        newApplicationsByJob={jobs.newApplicationsByJob}
        deleting={jobs.deleting}
        togglingId={jobs.togglingId}
        onToggleStatus={jobs.toggleStatus}
        onDelete={jobs.requestDelete}
        jobHref={jobDetailPath}
        editHref={editJobPath}
      />

      <Pagination
        page={jobs.page}
        totalPages={jobs.totalPages}
        onPageChange={jobs.changePage}
        className="mt-2"
      />

      <MyApplicationsSection
        items={applications.items}
        total={applications.total}
        loading={applications.loading}
        filter={applications.filter}
        onFilterChange={applications.setFilter}
        withdrawing={applications.withdrawing}
        onWithdraw={applications.requestWithdraw}
        jobHref={jobDetailPath}
      />

      <DeleteJobModal
        job={jobs.pendingDelete}
        deleting={jobs.deleting}
        onClose={jobs.cancelDelete}
        onConfirm={jobs.confirmDelete}
      />

      <WithdrawApplicationModal
        application={applications.pendingWithdraw}
        withdrawing={applications.withdrawing}
        onClose={applications.cancelWithdraw}
        onConfirm={applications.confirmWithdraw}
      />
    </PanelPage>
  );
};

export default SupplierMyJobsView;
