import { Link } from "react-router";
import { useSelector } from "react-redux";
import { Plus } from "lucide-react";
import Container from "@/components/ui/Container";
import Pagination from "@/components/common/Pagination/Pagination";
import SegmentedTabs from "@/components/common/SegmentedTabs/SegmentedTabs";
import { selectNewApplicationTotal } from "@/features/dash/user/recruitment";
import { MY_JOB_STATUS_FILTERS } from "@/features/recruitment/jobStatus";
import RecruitmentToolbar from "./components/toolbar/RecruitmentToolbar";
import JobsSectionHeader from "./components/jobs/JobsSectionHeader";
import MyJobList from "./components/jobs/MyJobList";
import MyApplicationsSection from "./components/applications/MyApplicationsSection";
import DeleteJobModal from "./components/modals/DeleteJobModal";
import WithdrawApplicationModal from "./components/modals/WithdrawApplicationModal";
import { useMyJobs } from "./hooks/useMyJobs";
import { useMyApplications } from "./hooks/useMyApplications";
import { CREATE_JOB_PATH, JOB_BASE } from "./constant/constants";
import { jobCount } from "./utils/jobsSection";

const MyJobsView = () => {
  const newApplications = useSelector(selectNewApplicationTotal);
  const jobs = useMyJobs();
  const applications = useMyApplications();

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container>
        <RecruitmentToolbar
          newApplications={newApplications}
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
          activeView="mine"
          basePath={JOB_BASE}
        />

        <div className="mt-6">
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
        </div>

        <div className="mt-4">
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
          />
        </div>

        <Pagination
          page={jobs.page}
          totalPages={jobs.totalPages}
          onPageChange={jobs.changePage}
          className="mt-8"
        />

        <MyApplicationsSection
          items={applications.items}
          total={applications.total}
          loading={applications.loading}
          filter={applications.filter}
          onFilterChange={applications.setFilter}
          withdrawing={applications.withdrawing}
          onWithdraw={applications.requestWithdraw}
        />
      </Container>

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
    </main>
  );
};

export default MyJobsView;
