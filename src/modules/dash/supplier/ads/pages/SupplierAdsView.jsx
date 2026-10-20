import CreateAdModal from "@/components/modals/supplier/CreateAdModal";
import PanelPage from "@/components/navigation/panel/PanelPage";
import PanelPageHeader from "@/components/navigation/panel/PanelPageHeader";
import { panelPrimaryBtn } from "@/components/navigation/panel/panelPageTheme";
import AdsTable from "../components/list/AdsTable";
import { useSupplierAds } from "../hooks/useSupplierAds";

const SupplierAdsView = () => {
  const ads = useSupplierAds();

  return (
    <PanelPage>
      <PanelPageHeader
        title="My Advertisement"
        subtitle="Create and manage your ads on here"
        action={
          <button type="button" onClick={() => ads.openCreate(null)} className={panelPrimaryBtn}>
            Create a advertisement
          </button>
        }
      />

      <AdsTable
        rows={ads.rows}
        loading={ads.loading}
        search={ads.search}
        onSearchChange={ads.changeSearch}
        statusFilter={ads.statusFilter}
        onStatusChange={ads.changeStatus}
        sortFilter={ads.sortFilter}
        onSortChange={ads.changeSort}
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
