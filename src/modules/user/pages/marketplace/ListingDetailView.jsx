import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  BadgeCheck,
  ChevronLeft,
  Heart,
  MessageCircle,
  Pencil,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Container from '@/components/ui/Container';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ListingDetailSkeleton } from '@/components/common/Skeleton';
import {
  fetchListingDetails,
  toggleSaveListing,
  clearMarketplaceError,
  clearSelectedListing,
  toListingDetailModel,
} from '@/features/user/marketplace';
import { formatPrice } from '@/modules/user/data/marketplace';
import { useAuth } from '@/shared/auth/useAuth';
import { CHAT_BASE_PATHS, listingChatPath } from '@/shared/constants/chat';
import NotFound from '@/shared/pages/NotFound';

const SpecTile = ({ label, value }) => (
  <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3.5">
    <p className="text-[12px] font-medium text-[#64748B]">{label}</p>
    <p className="mt-1 text-[14px] font-semibold text-deep-blue">{value}</p>
  </div>
);

const ImageGallery = ({ images, title, activeImage, onSelect }) => (
  <div>
    <div className="overflow-hidden rounded-2xl bg-[#F9FAFB]">
      {images[activeImage] ? (
        <img
          src={images[activeImage]}
          alt={title}
          className="aspect-[16/10] w-full object-cover"
        />
      ) : (
        <div className="flex aspect-[16/10] w-full items-center justify-center text-[13px] text-[#98A2B3]">
          No image
        </div>
      )}
    </div>

    {images.length > 1 && (
      <div className="mt-3 grid grid-cols-4 gap-2.5">
        {images.map((src, index) => (
          <button
            key={`${src}-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`View image ${index + 1}`}
            aria-current={activeImage === index}
            className={`aspect-[4/3] overflow-hidden rounded-xl border-2 transition-colors ${
              activeImage === index
                ? 'border-primary'
                : 'border-transparent hover:border-[#D0D5DD]'
            }`}
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    )}
  </div>
);

const ListingDetailView = () => {
  const { listingId } = useParams();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const {
    selectedListing,
    selectedListingLoading,
    error,
  } = useSelector((state) => state.userMarketplace);

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    dispatch(clearMarketplaceError());
    dispatch(clearSelectedListing());
    if (listingId) dispatch(fetchListingDetails(listingId));
    return () => {
      dispatch(clearSelectedListing());
    };
  }, [dispatch, listingId]);

  useEffect(() => {
    if (error && !selectedListingLoading) toast.error(error);
  }, [error, selectedListingLoading]);

  useEffect(() => {
    setActiveImage(0);
  }, [listingId, selectedListing?.id]);

  if (selectedListingLoading && !selectedListing) {
    return (
      <main className="pt-6 pb-8 sm:pt-8">
        <Container>
          <ListingDetailSkeleton />
        </Container>
      </main>
    );
  }

  if (!selectedListingLoading && !selectedListing) {
    return <NotFound />;
  }

  const listing = toListingDetailModel(selectedListing);
  if (!listing) return <NotFound />;

  const images = listing.images?.length ? listing.images : listing.image ? [listing.image] : [];
  const saved = Boolean(listing.isSaved);
  const sellerId = listing.seller.id;
  const isOwnListing = Boolean(sellerId && sellerId === user?.id);

  const handleToggleSave = async () => {
    const result = await dispatch(toggleSaveListing(listing.id));
    if (toggleSaveListing.rejected.match(result)) {
      toast.error(result.payload || 'Failed to update saved listing');
    }
  };

  return (
    <main className="pt-6 pb-8 sm:pt-8">
      <Container>
        <Link
          to="/marketplace"
          className="mb-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to marketplace
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
          <div className="min-w-0 space-y-5">
            <ImageGallery
              images={images}
              title={listing.title}
              activeImage={activeImage}
              onSelect={setActiveImage}
            />

            <Card>
              <div className="space-y-5 p-5 sm:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="information">{listing.condition}</Badge>
                  <Badge variant="post">Year {listing.year}</Badge>
                  <Badge variant="post">{listing.category}</Badge>
                </div>

                <div>
                  <h1 className="text-[24px] font-bold leading-tight text-deep-blue sm:text-[26px]">
                    {listing.title}
                  </h1>
                  <p className="mt-3 max-w-2xl text-[14px] leading-[1.7] text-[#475467]">
                    {listing.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <SpecTile label="Category" value={listing.category} />
                  <SpecTile label="Condition" value={listing.condition} />
                  <SpecTile label="Year" value={listing.year} />
                  <SpecTile label="Location" value={listing.location} />
                  <SpecTile label="Seller" value={listing.seller.name} />
                  <SpecTile label="Listed" value={listing.listedAt} />
                </div>
              </div>
            </Card>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-[78px] lg:self-start">
            <Card className="p-5 sm:p-6">
              <p className="text-[32px] font-bold leading-none text-deep-blue">
                {formatPrice(listing.price)}
              </p>
              <p className="mt-2 text-[12px] text-[#64748B]">
                Excl. VAT · Collection or delivery
              </p>

              <div className="mt-5 space-y-2.5">
                {isOwnListing ? (
                  <Link
                    to={`/marketplace/${listing.id}/edit`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0]"
                  >
                    <Pencil className="h-4 w-4" />
                    Edit listing
                  </Link>
                ) : sellerId ? (
                  <Link
                    to={listingChatPath(CHAT_BASE_PATHS.USER, sellerId, listing.id)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contact seller
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={handleToggleSave}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-pink-secondary px-4 py-2.5 text-[13px] font-semibold text-pink-light transition-opacity hover:opacity-90"
                >
                  <Heart className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                  {saved ? 'Saved' : 'Save listing'}
                </button>
              </div>

              <div className="mt-5 flex items-center gap-2 border-t border-[#E4E7EC] pt-4 text-[12px] text-[#64748B]">
                <BadgeCheck className="h-4 w-4 shrink-0 text-green-primary" />
                Verified Lab Unity member
              </div>
            </Card>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[#98A2B3]">
                Seller
              </p>
              <Card className="p-5">
                <div className="flex items-center gap-3">
                  <Avatar
                    initials={listing.seller.initials}
                    size="md"
                    className={listing.seller.avatarClass}
                  />
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-deep-blue">
                      {listing.seller.name}
                    </p>
                    <p className="mt-0.5 text-[12px] leading-snug text-[#64748B]">
                      {listing.seller.title} · {listing.seller.company}
                    </p>
                  </div>
                </div>
                {listing.seller.id ? (
                  <Link
                    to={`/contacts/${listing.seller.id}`}
                    className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-secondary px-4 py-2.5 text-[13px] font-semibold text-primary hover:bg-[#E3EEF8]"
                  >
                    View seller profile
                  </Link>
                ) : null}
              </Card>
            </div>
          </aside>
        </div>
      </Container>
    </main>
  );
};

export default ListingDetailView;
