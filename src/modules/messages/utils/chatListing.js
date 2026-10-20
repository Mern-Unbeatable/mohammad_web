/** Inactive listings can only be attached by their own seller. */
export const isListingUnavailable = (listing, currentUserId) => {
  if (!listing?.id) return true;
  return Boolean(
    listing.status && listing.status !== 'ACTIVE' && listing.seller?.id !== currentUserId,
  );
};
