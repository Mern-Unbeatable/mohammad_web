import { ListingDetailSkeleton } from "@/components/loader";
import PanelPage from "@/components/layout/PanelPage";
import PanelBackButton from "@/components/layout/PanelBackButton";
import NotFound from "@/modules/error/NotFound";
import { StartConversationModal } from "@/modules/messages";
import ListingGallery from "../components/detail/ListingGallery";
import ListingInfoCard from "../components/detail/ListingInfoCard";
import PriceCard from "../components/detail/PriceCard";
import SellerCard from "../components/detail/SellerCard";
import { useAdminListingDetail } from "../hooks/useAdminListingDetail";
import { listingImages } from "../utils/listings";
import { MARKETPLACE_PATH } from "../constant/constants";

const AdminListingDetailView = () => {
  const detail = useAdminListingDetail();
  const { listing } = detail;

  if (detail.loading) {
    return (
      <PanelPage>
        <ListingDetailSkeleton />
      </PanelPage>
    );
  }

  if (detail.notFound) return <NotFound />;

  return (
    <PanelPage>
      <PanelBackButton fallback={MARKETPLACE_PATH} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
        <div className="min-w-0 space-y-4">
          <ListingGallery key={listing.id} images={listingImages(listing)} title={listing.title} />
          <ListingInfoCard listing={listing} />
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <PriceCard
            price={listing.price}
            canContact={detail.canContact}
            onContact={detail.openContact}
          />
          <SellerCard seller={listing.seller} />
        </aside>
      </div>

      <StartConversationModal
        open={detail.contactOpen}
        title="Contact seller"
        description={`Ask ${listing.seller.name} about this listing.`}
        placeholder="Hi, is this still available?"
        recipient={listing.seller}
        listing={detail.rawListing}
        onClose={detail.closeContact}
        onSend={detail.sendMessage}
      />
    </PanelPage>
  );
};

export default AdminListingDetailView;
