import ListingCard from '@/components/data-display/ListingCard/ListingCard';
import DashboardPage from '@/components/layout/DashboardPage';
import MarketplaceToolbar from '../components/toolbar/MarketplaceToolbar';
import ListingsSection from '../components/listings/ListingsSection';
import { useSavedListings } from '../hooks/useSavedListings';
import { MARKETPLACE_VIEW } from '../constant/constants';

const SavedListingsView = () => {
  const saved = useSavedListings();

  return (
    <DashboardPage>
      <MarketplaceToolbar
        query={saved.query}
        onQueryChange={saved.setQuery}
        category={saved.category}
        onCategoryChange={saved.setCategory}
        activeView={MARKETPLACE_VIEW.SAVED}
      />

      <ListingsSection
        title="Saved listings"
        loading={saved.loading}
        cards={saved.cards}
        renderCard={(listing) => (
          <ListingCard key={listing.id} listing={listing} saved onToggleSave={saved.unsave} />
        )}
        emptyTitle="No saved listings"
        emptyText="Browse the marketplace and tap the heart icon to save equipment here."
      />
    </DashboardPage>
  );
};

export default SavedListingsView;
