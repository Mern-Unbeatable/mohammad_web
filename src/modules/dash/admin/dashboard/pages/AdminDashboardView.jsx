import PanelPage from "@/components/layout/PanelPage";
import DashboardHeader from "../components/overview/DashboardHeader";
import StatsSection from "../components/overview/StatsSection";
import ChartsSection from "../components/charts/ChartsSection";
import { useAdminDashboard } from "../hooks/useAdminDashboard";

const AdminDashboardView = () => {
  const dash = useAdminDashboard();

  return (
    <PanelPage>
      <DashboardHeader years={dash.years} year={dash.chartYear} onYearChange={dash.setChartYear} />

      <StatsSection
        stats={dash.stats}
        loading={dash.statsLoading}
        error={dash.statsError}
        hasStats={dash.hasStats}
        onRetry={dash.retryStats}
      />

      <ChartsSection
        loading={dash.chartsLoading}
        error={dash.chartsError}
        hasCharts={dash.hasCharts}
        onRetry={dash.retryCharts}
        userGrowth={dash.userGrowth}
        userPeriod={dash.userPeriod}
        onUserPeriodChange={dash.setUserPeriod}
        revenue={dash.revenue}
        revenuePeriod={dash.revenuePeriod}
        onRevenuePeriodChange={dash.setRevenuePeriod}
      />
    </PanelPage>
  );
};

export default AdminDashboardView;
