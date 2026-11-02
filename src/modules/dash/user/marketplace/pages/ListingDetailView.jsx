import BackLink from '@/components/layout/BackLink';
import { ListingDetailSkeleton } from '@/components/loader';
import DashboardPage from '@/components/layout/DashboardPage';
import NotFound from '@/modules/error/NotFound';
import { StartConversationModal } from '@/modules/messages';
import ImageGallery from '../components/detail/ImageGallery';
import ListingOverviewCard from '../components/detail/ListingOverviewCard';
import ListingPriceCard from '../components/detail/ListingPriceCard';
import { JobPosterCard } from '@/modules/dash/user/recruitment';
import { useListingDetail } from '../hooks/useListingDetail';
import { MARKETPLACE_PATH } from '../constant/constants';

const ListingDetailView = () => {
  const detail = useListingDetail();
  const { listing, viewer } = detail;

  if (detail.loading) {
    return (
      <DashboardPage>
        <ListingDetailSkeleton />
      </DashboardPage>
    );
  }

  if (!listing) return <NotFound />;

  return (
    <DashboardPage>
      <BackLink to={MARKETPLACE_PATH} className="mb-5">
        Back to marketplace
      </BackLink>

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
          <JobPosterCard
            title="Seller"
            owner={{ ...listing.raw?.seller, id: listing.seller.id, name: listing.seller.name }}
            isSelf={viewer.isOwnListing}
            profileHref={viewer.profileHref}
          />
          <ListingPriceCard
            price={listing.price}
            saved={detail.saved}
            onToggleSave={detail.toggleSave}
            viewer={viewer}
            onContact={detail.openContact}
          />
        </aside>
      </div>

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
    </DashboardPage>
  );
};

export default ListingDetailView;
