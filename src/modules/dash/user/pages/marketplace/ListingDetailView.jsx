import { Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';
import { ListingDetailSkeleton } from '@/components/common/Skeleton';
import NotFound from '@/modules/error/NotFound';
import { StartConversationModal } from '@/modules/messages';
import MarketplacePage from './components/layout/MarketplacePage';
import ImageGallery from './components/detail/ImageGallery';
import ListingOverviewCard from './components/detail/ListingOverviewCard';
import ListingPriceCard from './components/detail/ListingPriceCard';
import SellerCard from './components/detail/SellerCard';
import { useListingDetail } from './hooks/useListingDetail';
import { MARKETPLACE_PATH } from './constant/constants';

const PAGE_CLASS = 'pt-6 pb-8 sm:pt-8';

const ListingDetailView = () => {
  const detail = useListingDetail();
  const { listing, viewer } = detail;

  if (detail.loading) {
    return (
      <MarketplacePage className={PAGE_CLASS}>
        <ListingDetailSkeleton />
      </MarketplacePage>
    );
  }

  if (!listing) return <NotFound />;

  return (
    <MarketplacePage
      className={PAGE_CLASS}
      overlays={
        <StartConversationModal
          open={detail.contactOpen}
          title="Contact seller"
          description={`Ask ${listing.seller.name} about this listing.`}
          placeholder="Hi, is this still available?"
          recipient={listing.seller}
          listing={listing.raw}
          onClose={detail.closeContact}
          onSend={detail.sendMessage}
        />
      }
    >
      <Link
        to={MARKETPLACE_PATH}
        className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to marketplace
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
        <div className="min-w-0 space-y-5">
          <ImageGallery
            images={detail.images}
            title={listing.title}
            activeImage={detail.activeImage}
            onSelect={detail.setActiveImage}
          />
          <ListingOverviewCard listing={listing} />
        </div>

        <aside className="space-y-5 lg:sticky lg:top-[78px] lg:self-start">
          <ListingPriceCard
            price={listing.price}
            saved={detail.saved}
            onToggleSave={detail.toggleSave}
            viewer={viewer}
            onContact={detail.openContact}
          />
          <SellerCard seller={listing.seller} profileHref={viewer.profileHref} />
        </aside>
      </div>
    </MarketplacePage>
  );
};

export default ListingDetailView;
