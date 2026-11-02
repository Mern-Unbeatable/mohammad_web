import Pagination from '@/components/common/Pagination/Pagination';
import ListingCard from '@/components/data-display/ListingCard/ListingCard';
import DashboardPage from '@/components/layout/DashboardPage';
import MarketplaceToolbar from '../components/toolbar/MarketplaceToolbar';
import ListingsSection from '../components/listings/ListingsSection';
import { useMarketplaceListings } from '../hooks/useMarketplaceListings';
import { useToggleSaveListing } from '../hooks/useToggleSaveListing';
import { MARKETPLACE_VIEW } from '../constant/constants';

const MarketplaceView = () => {
  const browse = useMarketplaceListings();
  const toggleSave = useToggleSaveListing();

  return (
    <DashboardPage>
      <MarketplaceToolbar
        query={browse.query}
        onQueryChange={browse.setQuery}
        category={browse.category}
        onCategoryChange={browse.changeCategory}
        activeView={MARKETPLACE_VIEW.BROWSE}
      />

      <ListingsSection
        title="Featured listings"
        loading={browse.loading}
        error={browse.error}
        onRetry={browse.retry}
        cards={browse.cards}
        renderCard={(listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            saved={listing.isSaved}
            onToggleSave={toggleSave}
          />
        )}
        emptyTitle="No listings found"
        emptyText="Try a different search or category filter."
      >
        <Pagination
          page={browse.page}
          totalPages={browse.totalPages}
          onPageChange={browse.changePage}
          className="mt-8"
        />
      </ListingsSection>
    </DashboardPage>
  );
};

export default MarketplaceView;
