import PanelPage from "@/components/navigation/panel/PanelPage";
import { DashboardHeader, StatsSection } from "@/modules/dash/admin/dashboard";
import StatisticsCharts from "../components/StatisticsCharts";
import { useAdminStatistics } from "../hooks/useAdminStatistics";
import { PAGE_SUBTITLE, PAGE_TITLE } from "../constant/constants";

/**
 * Statistics & Reports — full analytics view (ADMIN_REPORT §7.10).
 * Uses existing GET /admin/dashboard + GET /admin/statistics?year=
 */
const AdminStatisticsView = () => {
  const stats = useAdminStatistics();

  return (
    <PanelPage>
      <DashboardHeader
        title={PAGE_TITLE}
        subtitle={PAGE_SUBTITLE}
        years={stats.years}
        year={stats.chartYear}
        onYearChange={stats.setChartYear}
      />

      <StatsSection
        stats={stats.stats}
        loading={stats.statsLoading}
        error={stats.statsError}
        hasStats={stats.hasStats}
        onRetry={stats.retryStats}
        emptyMessage="No statistics available yet."
      />

      <StatisticsCharts
        charts={stats.charts}
        loading={stats.chartsLoading}
        error={stats.chartsError}
        onRetry={stats.retryCharts}
        onPeriodChange={stats.setPeriod}
      />
    </PanelPage>
  );
};

export default AdminStatisticsView;
