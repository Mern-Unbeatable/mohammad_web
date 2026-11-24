import PanelPage from "@/components/layout/PanelPage";
import DashboardHeader from "../components/overview/DashboardHeader";
import StatsSection from "../components/overview/StatsSection";
import SnapshotSection from "../components/overview/SnapshotSection";
import AttentionSection from "../components/overview/AttentionSection";
import QuickLinksSection from "../components/overview/QuickLinksSection";
import ChartsSection from "../components/charts/ChartsSection";
import { useAdminDashboard } from "../hooks/useAdminDashboard";

const AdminDashboardView = () => {
  const dash = useAdminDashboard();

  return (
    <PanelPage>
      <DashboardHeader
        years={dash.years}
        year={dash.chartYear}
        onYearChange={dash.setChartYear}
        subtitle="Monitor growth, revenue, and work that needs your attention."
      />

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

      <AttentionSection
        attention={dash.attention}
        loading={dash.statsLoading}
        ready={dash.hasStats}
      />

      {dash.hasStats ? (
        <SnapshotSection snapshot={dash.snapshot} loading={dash.statsLoading} />
      ) : null}

      <QuickLinksSection />
    </PanelPage>
  );
};

export default AdminDashboardView;
