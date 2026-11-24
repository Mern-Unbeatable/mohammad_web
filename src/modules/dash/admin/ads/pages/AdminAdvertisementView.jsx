import { CheckCircle2, Clock3, Megaphone, TimerOff } from "lucide-react";
import StatCard from "@/components/data-display/StatCard/StatCard";
import PanelPage from "@/components/layout/PanelPage";
import PanelPageHeader from "@/components/layout/PanelPageHeader";
import AdsTable from "../components/list/AdsTable";
import ErrorBanner from "../components/common/ErrorBanner";
import RejectAdModal from "../components/common/RejectAdModal";
import { useAdminAds } from "../hooks/useAdminAds";

const AdminAdvertisementView = () => {
  const ads = useAdminAds();
  const { summary } = ads;

  const stats = [
    {
      id: "total",
      icon: Megaphone,
      tone: "blue",
      label: "Total ads",
      value: summary.total ?? 0,
    },
    {
      id: "active",
      icon: CheckCircle2,
      tone: "green",
      label: "Active",
      value: summary.active ?? 0,
    },
    {
      id: "pending",
      icon: Clock3,
      tone: "orange",
      label: "Pending",
      value: summary.pending ?? 0,
    },
    {
      id: "expired",
      icon: TimerOff,
      tone: "pink",
      label: "Expired",
      value: summary.expired ?? 0,
    },
  ];

  return (
    <PanelPage>
      <PanelPageHeader title="Advertisement" subtitle="Manage advertisement post" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

      {ads.error ? <ErrorBanner>{ads.error}</ErrorBanner> : null}

      <AdsTable
        rows={ads.rows}
        loading={ads.loading}
        search={ads.search}
        onSearchChange={ads.changeSearch}
        statusFilter={ads.statusFilter}
        onStatusChange={ads.changeStatus}
        rowActions={ads.rowActions}
        page={ads.page}
        total={ads.total}
        onPageChange={ads.changePage}
      />

      <RejectAdModal
        open={Boolean(ads.rejectTarget)}
        title={ads.rejectTarget?.title}
        onClose={ads.closeReject}
        onConfirm={ads.confirmReject}
      />
    </PanelPage>
  );
};

export default AdminAdvertisementView;
