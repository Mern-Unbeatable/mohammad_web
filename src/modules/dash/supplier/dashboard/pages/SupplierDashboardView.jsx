import CreateAdModal from "@/components/modals/supplier/CreateAdModal";
import PanelPage from "@/components/layout/PanelPage";
import WelcomeBanner from "../components/overview/WelcomeBanner";
import StatsGrid from "../components/overview/StatsGrid";
import ActivityChart from "../components/overview/ActivityChart";
import ErrorState from "../components/common/ErrorState";
import RecentAdsCard from "../components/ads/RecentAdsCard";
import RecentNotificationsCard from "../components/notifications/RecentNotificationsCard";
import { useSupplierDashboard } from "../hooks/useSupplierDashboard";

const SupplierDashboardView = () => {
  const dash = useSupplierDashboard();

  return (
    <PanelPage>
      <WelcomeBanner name={dash.displayName} onCreateAd={dash.openCreate} />

      {dash.error ? <ErrorState message={dash.error} onRetry={dash.retry} /> : null}

      <StatsGrid stats={dash.stats} loading={dash.statsLoading} />

      <ActivityChart
        chart={dash.chart}
        loading={dash.chartLoading}
        year={dash.chartYear}
        yearOptions={dash.yearOptions}
        onYearChange={dash.changeYear}
      />

      <RecentAdsCard ads={dash.recentAds} loading={dash.adsLoading} rowActions={dash.adRowActions} />

      <RecentNotificationsCard
        notifications={dash.notifications}
        loading={dash.notificationsLoading}
      />

      <CreateAdModal
        key={dash.createOpen ? "open" : "closed"}
        open={dash.createOpen}
        onClose={dash.closeCreate}
      />
    </PanelPage>
  );
};

export default SupplierDashboardView;
