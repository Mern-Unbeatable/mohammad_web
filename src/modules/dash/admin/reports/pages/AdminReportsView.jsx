import PanelPage from "@/components/layout/PanelPage";
import PanelPageHeader from "@/components/layout/PanelPageHeader";
import ReportStats from "../components/list/ReportStats";
import ReportsTable from "../components/list/ReportsTable";
import ErrorBanner from "../components/common/ErrorBanner";
import { useAdminReports } from "../hooks/useAdminReports";

const AdminReportsView = () => {
  const reports = useAdminReports();

  return (
    <PanelPage>
      <PanelPageHeader
        title="Reports & Moderation"
        subtitle="Review reported content and users, take appropriate action, and manage moderation cases across the Lab Unity healthcare and diagnostic network."
      />

      {reports.error ? <ErrorBanner>{reports.error}</ErrorBanner> : null}

      <ReportStats cards={reports.statCards} loading={reports.statsLoading} />

      <ReportsTable
        rows={reports.rows}
        loading={reports.loading}
        search={reports.search}
        onSearchChange={reports.changeSearch}
        statusFilter={reports.statusFilter}
        onStatusFilterChange={reports.changeStatusFilter}
        rowActions={reports.rowActions}
        page={reports.page}
        total={reports.total}
        onPageChange={reports.changePage}
      />
    </PanelPage>
  );
};

export default AdminReportsView;
