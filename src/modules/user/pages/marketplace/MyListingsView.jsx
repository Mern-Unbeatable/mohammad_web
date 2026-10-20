import ListingCard from '@/components/data-display/ListingCard/ListingCard';
import MarketplacePage from './components/layout/MarketplacePage';
import MarketplaceToolbar from './components/toolbar/MarketplaceToolbar';
import ListingsSection from './components/listings/ListingsSection';
import DeleteListingModal from './components/modals/DeleteListingModal';
import { useMyListings } from './hooks/useMyListings';
import { MARKETPLACE_VIEW } from './constant/constants';

const MyListingsView = () => {
  const mine = useMyListings();

  return (
    <MarketplacePage
      overlays={
        <DeleteListingModal
          listing={mine.pendingDelete}
          deleting={mine.deleting}
          onClose={mine.cancelDelete}
          onConfirm={mine.confirmDelete}
        />
      }
    >
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
    </MarketplacePage>
  );
};

export default MyListingsView;
