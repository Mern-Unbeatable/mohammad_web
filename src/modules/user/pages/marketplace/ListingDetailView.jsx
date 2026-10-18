import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import {
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Heart,
  Mail,
  MessageCircle,
  Pencil,
  UserRound,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Container from '@/components/ui/Container';
import Avatar from '@/components/ui/Avatar';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { ListingDetailSkeleton } from '@/components/common/Skeleton';
import ImageViewer from '@/components/common/ImageViewer/ImageViewer';
import {
  fetchListingDetails,
  toggleSaveListing,
  clearMarketplaceError,
  clearSelectedListing,
  sellerContactLinks,
  toListingDetailModel,
} from '@/features/user/marketplace';
import { formatPrice } from '@/modules/user/data/marketplace';
import { useAuth } from '@/shared/auth/useAuth';
import { CHAT_BASE_PATHS } from '@/shared/constants/chat';
import NotFound from '@/shared/pages/NotFound';
import StartConversationModal from '@/shared/pages/messages/StartConversationModal';
import { useStartConversation } from '@/shared/pages/messages/useStartConversation';

const SpecTile = ({ label, value }) => (
  <div className="rounded-xl border border-[#E4E7EC] bg-[#F9FAFB] px-4 py-3.5">
    <p className="text-[12px] font-medium text-[#64748B]">{label}</p>
    <p className="mt-1 text-[14px] font-semibold text-deep-blue">{value}</p>
  </div>
);

const contactButtonClass =
  'inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-[13px] font-semibold transition-colors';

/** Seller contact link; a greyed-out disabled button when the seller has no such detail. */
const ContactLinkButton = ({ href, icon, label, unavailableLabel, external, className }) =>
  href ? (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`${contactButtonClass} ${className}`}
    >
      {icon}
      {label}
    </a>
  ) : (
    <button
      type="button"
      disabled
      title={unavailableLabel}
      aria-label={`${label}: ${unavailableLabel}`}
      className={`${contactButtonClass} cursor-not-allowed border-[#E4E7EC] bg-[#F2F4F7] text-[#98A2B3]`}
    >
      {icon}
      {label}
    </button>
  );

const VISIBLE_THUMBNAILS = 4;

const arrowClass =
  'absolute top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-deep-blue shadow-md transition hover:bg-white disabled:pointer-events-none disabled:opacity-0';

const ImageGallery = ({ images, title, activeImage, onSelect }) => {
  const stripRef = useRef(null);
  const [viewerOpen, setViewerOpen] = useState(false);
  const closeViewer = useCallback(() => setViewerOpen(false), []);
  const count = images.length;
  const hasMany = count > 1;
  const scrollable = count > VISIBLE_THUMBNAILS;

  useEffect(() => {
    const strip = stripRef.current;
    const thumb = strip?.children[activeImage];
    if (!strip || !thumb) return;
    const left = thumb.offsetLeft;
    const right = left + thumb.offsetWidth;
    if (left < strip.scrollLeft) {
      strip.scrollTo({ left, behavior: 'smooth' });
    } else if (right > strip.scrollLeft + strip.clientWidth) {
      strip.scrollTo({ left: right - strip.clientWidth, behavior: 'smooth' });
    }
  }, [activeImage]);

  const step = (direction) => onSelect((activeImage + direction + count) % count);

  const scrollStrip = (direction) => {
    const strip = stripRef.current;
    if (strip) strip.scrollBy({ left: direction * strip.clientWidth, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="group relative overflow-hidden rounded-2xl bg-[#F9FAFB]">
        {images[activeImage] ? (
          <>
            <img
              src={images[activeImage]}
              alt={title}
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/25">
              <button
                type="button"
                onClick={() => setViewerOpen(true)}
                aria-label="View full screen"
                className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-deep-blue opacity-0 shadow-lg transition hover:scale-105 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100"
              >
                <Eye className="h-5 w-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex aspect-[16/10] w-full items-center justify-center text-[13px] text-[#98A2B3]">
            No image
          </div>
        )}

        {hasMany && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous image"
              className={`${arrowClass} left-3`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next image"
              className={`${arrowClass} right-3`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[12px] font-semibold text-white">
              {activeImage + 1} / {count}
            </span>
          </>
        )}
      </div>

      {hasMany && (
        <div className="relative mt-3">
          <div
            ref={stripRef}
            className="flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-smooth scrollbar-hide"
          >
            {images.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => onSelect(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={activeImage === index}
                className={`aspect-[4/3] w-[calc((100%-1.875rem)/4)] shrink-0 snap-start overflow-hidden rounded-xl border-2 transition-colors ${
                  activeImage === index
                    ? 'border-primary'
                    : 'border-transparent hover:border-[#D0D5DD]'
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>

          {scrollable && (
            <>
              <button
                type="button"
                onClick={() => scrollStrip(-1)}
                aria-label="Scroll thumbnails left"
                className={`${arrowClass} -left-3 h-8 w-8`}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollStrip(1)}
                aria-label="Scroll thumbnails right"
                className={`${arrowClass} -right-3 h-8 w-8`}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      )}

      {viewerOpen && images[activeImage] ? (
        <ImageViewer
          images={images}
          index={activeImage}
          onChange={onSelect}
          onClose={closeViewer}
          alt={title}
        />
      ) : null}
    </div>
  );
};

const ListingDetailView = () => {
  const { listingId } = useParams();
  const dispatch = useDispatch();
  const startConversation = useStartConversation(CHAT_BASE_PATHS.USER);
  const { user } = useAuth();
  const {
    selectedListing,
    selectedListingLoading,
    error,
  } = useSelector((state) => state.userMarketplace);

  const [activeImage, setActiveImage] = useState(0);
  /** Listing id the Contact seller dialog is open for. */
  const [contactListingId, setContactListingId] = useState(null);
  const closeContact = useCallback(() => setContactListingId(null), []);

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
  // Without both IDs we can't tell whose profile it is, so show no link.
  const sellerProfileHref =
    !sellerId || !user?.id ? null : isOwnListing ? '/profile' : `/contacts/${sellerId}`;
  const { emailHref, whatsAppHref } = isOwnListing
    ? { emailHref: null, whatsAppHref: null }
    : sellerContactLinks(listing.seller, listing.title);

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
                  <p className="mt-3 whitespace-pre-line text-[14px] leading-[1.7] text-[#475467] [overflow-wrap:anywhere]">
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
            <Card className="relative p-5 sm:p-6">
              <button
                type="button"
                onClick={handleToggleSave}
                aria-label={saved ? 'Remove from saved' : 'Save listing'}
                aria-pressed={saved}
                title={saved ? 'Saved' : 'Save listing'}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E7EC] bg-white text-pink-light shadow-sm transition-colors hover:bg-pink-secondary sm:right-5 sm:top-5"
              >
                <Heart className={`h-5 w-5 ${saved ? 'fill-current' : ''}`} />
              </button>
              <p className="pr-12 text-[32px] font-bold leading-none text-deep-blue">
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
                  <button
                    type="button"
                    onClick={() => setContactListingId(listing.id)}
                    aria-haspopup="dialog"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-[#066BB0]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Contact seller
                  </button>
                ) : null}
                {!isOwnListing && sellerId ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    <ContactLinkButton
                      href={emailHref}
                      icon={<Mail className="h-4 w-4" />}
                      label="Email"
                      unavailableLabel="Seller hasn't added an email"
                      className="border-[#D0D5DD] bg-white text-[#344054] hover:bg-[#F9FAFB]"
                    />
                    <ContactLinkButton
                      href={whatsAppHref}
                      icon={<FaWhatsapp className="h-4 w-4" />}
                      label="WhatsApp"
                      unavailableLabel="Seller hasn't added a phone number"
                      external
                      className="border-[#25D366]/40 bg-[#25D366]/10 text-[#128C7E] hover:bg-[#25D366]/20"
                    />
                  </div>
                ) : null}
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
                    src={listing.seller.avatar}
                    alt={listing.seller.name}
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
                {sellerProfileHref ? (
                  <Link
                    to={sellerProfileHref}
                    className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary px-4 py-2.5 text-[13px] font-semibold text-primary hover:bg-[#E3EEF8]"
                  >
                    <UserRound className="h-4 w-4" />
                    View seller profile
                  </Link>
                ) : null}
              </Card>
            </div>
          </aside>
        </div>
      </Container>

      <StartConversationModal
        open={contactListingId === listing.id && Boolean(sellerId) && !isOwnListing}
        title="Contact seller"
        description={`Ask ${listing.seller.name} about this listing.`}
        placeholder="Hi, is this still available?"
        recipient={listing.seller}
        listing={listing.raw}
        onClose={closeContact}
        onSend={(message) =>
          startConversation({ recipientId: sellerId, message, listingId: listing.id })
        }
      />
    </main>
  );
};

export default ListingDetailView;
