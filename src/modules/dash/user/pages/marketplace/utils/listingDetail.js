import { sellerContactLinks } from '@/features/dash/user/marketplace';
import { editListingPath } from '../constant/constants';

export const listingGalleryImages = (listing) =>
  listing.images?.length ? listing.images : listing.image ? [listing.image] : [];

/** Seller profile link; null without both ids, since we can't tell whose profile it is. */
export const sellerProfileHref = (sellerId, userId) =>
  !sellerId || !userId ? null : sellerId === userId ? '/profile' : `/contacts/${sellerId}`;

/** Viewer-relative facts about a detail listing model. */
export const listingViewerState = (listing, userId) => {
  const sellerId = listing.seller.id;
  const isOwnListing = Boolean(sellerId && sellerId === userId);
  const { emailHref, whatsAppHref } = isOwnListing
    ? { emailHref: null, whatsAppHref: null }
    : sellerContactLinks(listing.seller, listing.title);
  return {
    sellerId,
    isOwnListing,
    canContact: Boolean(sellerId) && !isOwnListing,
    profileHref: sellerProfileHref(sellerId, userId),
    editHref: editListingPath(listing.id),
    emailHref,
    whatsAppHref,
  };
};
