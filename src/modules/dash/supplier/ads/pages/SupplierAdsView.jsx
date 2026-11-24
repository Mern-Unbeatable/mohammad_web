import { CheckCircle2, Clock3, Megaphone, TimerOff } from "lucide-react";
import CreateAdModal from "@/components/modals/supplier/CreateAdModal";
import StatCard from "@/components/data-display/StatCard/StatCard";
import PanelPage from "@/components/layout/PanelPage";
import PanelPageHeader from "@/components/layout/PanelPageHeader";
import { panelPrimaryBtn } from "@/components/layout/panelPageTheme";
import AdsTable from "../components/list/AdsTable";
import { useSupplierAds } from "../hooks/useSupplierAds";

const SupplierAdsView = () => {
  const ads = useSupplierAds();
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
      <PanelPageHeader
        title="Advertisement"
        subtitle="Manage advertisement post"
        action={
          <button type="button" onClick={() => ads.openCreate(null)} className={panelPrimaryBtn}>
            Create a advertisement
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}
      </div>

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

      <CreateAdModal
        key={ads.createOpen ? ads.resubmitAdId || "new" : "closed"}
        open={ads.createOpen}
        editAdId={ads.resubmitAdId}
        initialAd={ads.resubmitAd}
        onClose={ads.closeCreate}
        onCreated={ads.handleCreated}
      />
    </PanelPage>
  );
};

export default SupplierAdsView;
