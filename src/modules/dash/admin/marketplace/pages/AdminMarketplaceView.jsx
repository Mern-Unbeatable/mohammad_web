import Pagination from "@/components/common/Pagination/Pagination";
import PanelPage from "@/components/layout/PanelPage";
import PanelPageHeader from "@/components/layout/PanelPageHeader";
import CategoryFilter from "../components/list/CategoryFilter";
import ListingsGrid from "../components/list/ListingsGrid";
import DeleteListingModal from "../components/list/DeleteListingModal";
import ErrorBanner from "../components/common/ErrorBanner";
import { useAdminListings } from "../hooks/useAdminListings";

const AdminMarketplaceView = () => {
  const market = useAdminListings();

  return (
    <PanelPage>
      <PanelPageHeader
        title="Marketplace"
        subtitle="Manage listings, sellers, transactions and commissions."
      />

      <CategoryFilter value={market.category} onChange={market.changeCategory} />

      {market.error ? <ErrorBanner>{market.error}</ErrorBanner> : null}

      <ListingsGrid
        items={market.items}
        loading={market.loading}
        deleting={market.deleting}
        onDelete={market.requestDelete}
      />

      <Pagination
        page={market.page}
        totalPages={market.totalPages}
        onPageChange={market.changePage}
        className="mt-2"
      />

      <DeleteListingModal
        listing={market.pendingDelete}
        deleting={market.deleting}
        onClose={market.cancelDelete}
        onConfirm={market.confirmDelete}
      />
    </PanelPage>
  );
};

export default AdminMarketplaceView;
