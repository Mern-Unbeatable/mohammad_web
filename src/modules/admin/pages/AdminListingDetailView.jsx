import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import { BadgeCheck, ChevronLeft, MessageCircle } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { ListingDetailSkeleton } from "@/components/common/Skeleton";
import { formatPrice } from "@/modules/user/data/marketplace";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import NotFound from "@/shared/pages/NotFound";
import { useAuth } from "@/shared/auth/useAuth";
import { CHAT_BASE_PATHS, listingChatPath } from "@/shared/constants/chat";
import {
  fetchListingDetails,
  clearSelectedListing,
} from "@/features/admin/marketplace";
import { toListingCardModel } from "@/features/admin/marketplace/marketplaceMappers";

const SpecTile = ({ label, value }) => (
  <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3.5">
    <p className="text-[12px] font-medium text-[#64748B]">{label}</p>
    <p className="mt-1 text-[14px] font-semibold text-deep-blue">{value}</p>
  </div>
);

const AdminListingDetailView = () => {
  const { listingId } = useParams();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [activeImage, setActiveImage] = useState(0);

  const { selectedListing, selectedListingLoading, error } = useSelector(
    (state) => state.adminMarketplace,
  );

  useEffect(() => {
    if (listingId) {
      dispatch(fetchListingDetails(listingId));
    }
    return () => {
      dispatch(clearSelectedListing());
    };
  }, [dispatch, listingId]);

  const listing = useMemo(
    () => toListingCardModel(selectedListing),
    [selectedListing],
  );

  useEffect(() => {
    setActiveImage(0);
  }, [listing?.id]);

  if (selectedListingLoading) {
    return (
      <PanelPage>
        <ListingDetailSkeleton />
      </PanelPage>
    );
  }

  if ((error && !selectedListing) || !listing) return <NotFound />;

  const images = listing.images?.length ? listing.images : [listing.image];

  return (
    <PanelPage>
      <Link
        to="/admin/marketplace"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#64748B] transition-colors hover:text-primary"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to marketplace
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px] xl:gap-8">
        <div className="min-w-0 space-y-4">
          <div>
            <div className="overflow-hidden rounded-2xl bg-[#F9FAFB]">
              <img
                src={images[activeImage]}
                alt={listing.title}
                className="aspect-[16/10] w-full object-cover"
              />
            </div>
            {images.length > 1 ? (
              <div className="mt-3 grid grid-cols-4 gap-2.5">
                {images.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                    className={`aspect-[4/3] overflow-hidden rounded-xl border-2 transition-colors ${
                      activeImage === index
                        ? "border-primary"
                        : "border-transparent hover:border-[#D0D5DD]"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <Card>
            <div className="space-y-4 p-5 sm:p-6">
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
                <SpecTile label="Location" value={listing.location} />
                <SpecTile label="Condition" value={listing.condition} />
                <SpecTile label="Year of manufacture" value={listing.year} />
                <SpecTile
                  label="Listed"
                  value={listing.listedAt || "—"}
                />
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <Card className="p-5 sm:p-6">
            <p className="text-[32px] font-bold leading-none text-deep-blue">
              {formatPrice(listing.price)}
            </p>
            <p className="mt-2 text-[12px] text-[#64748B]">
              Excl. VAT · Collection or delivery
            </p>

            {listing.seller.id && listing.seller.id !== user?.id ? (
              <Link
                to={listingChatPath(CHAT_BASE_PATHS.ADMIN, listing.seller.id, listing.id)}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0]"
              >
                <MessageCircle className="h-4 w-4" />
                Contact seller
              </Link>
            ) : null}

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
                  to={`/admin/users/${listing.seller.id}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-secondary px-4 py-2.5 text-[13px] font-semibold text-primary hover:bg-[#E3EEF8]"
                >
                  View seller profile
                </Link>
              ) : null}
            </Card>
          </div>
        </aside>
      </div>
    </PanelPage>
  );
};

export default AdminListingDetailView;
