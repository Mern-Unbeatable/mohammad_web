import PanelPage from "@/components/layout/PanelPage";
import PanelPageHeader from "@/components/layout/PanelPageHeader";
import AdsTable from "../components/list/AdsTable";
import ErrorBanner from "../components/common/ErrorBanner";
import RejectAdModal from "../components/common/RejectAdModal";
import { useAdminAds } from "../hooks/useAdminAds";

const AdminAdvertisementView = () => {
  const ads = useAdminAds();

  return (
    <PanelPage>
      <PanelPageHeader title="Advertisement" subtitle="Manage advertisement post" />

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
