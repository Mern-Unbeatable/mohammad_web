/** Marketplace base route per role; suppliers have no marketplace pages. */
export const MARKETPLACE_BASE_PATHS = Object.freeze({
  USER: '/marketplace',
  ADMIN: '/admin/marketplace',
});

/** Listing detail route for `role`, or null when that role has no marketplace. */
export function marketplaceListingPath(role, listingId) {
  const base = MARKETPLACE_BASE_PATHS[String(role || '').toUpperCase()];
  return base && listingId ? `${base}/${encodeURIComponent(listingId)}` : null;
}
