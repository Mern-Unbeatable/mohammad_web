import ListingCard from '@/components/data-display/ListingCard/ListingCard';
import DashboardPage from '@/components/layout/DashboardPage';
import MarketplaceToolbar from '../components/toolbar/MarketplaceToolbar';
import ListingsSection from '../components/listings/ListingsSection';
import DeleteListingModal from '@/components/modals/marketplace/DeleteListingModal';
import { useMyListings } from '../hooks/useMyListings';
import { MARKETPLACE_VIEW } from '../constant/constants';

const MyListingsView = () => {
  const mine = useMyListings();

  return (
    <DashboardPage>
      <MarketplaceToolbar
        query={mine.query}
        onQueryChange={mine.setQuery}
        category={mine.category}
        onCategoryChange={mine.setCategory}
        activeView={MARKETPLACE_VIEW.MINE}
      />

      <ListingsSection
        title="My listings"
        loading={mine.loading}
        cards={mine.cards}
        renderCard={(listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            variant="mine"
            onEdit={mine.editListing}
            onDelete={mine.deleting ? undefined : mine.requestDelete}
          />
        )}
        emptyTitle="No listings yet"
        emptyText="Create your first listing to sell laboratory equipment to verified members."
      />

      <DeleteListingModal
        listing={mine.pendingDelete}
        deleting={mine.deleting}
        onClose={mine.cancelDelete}
        onConfirm={mine.confirmDelete}
      />
    </DashboardPage>
  );
};

export default MyListingsView;
