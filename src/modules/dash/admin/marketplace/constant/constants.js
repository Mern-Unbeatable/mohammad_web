export const MARKETPLACE_PATH = "/admin/marketplace";
export const listingDetailPath = (listingId) => `${MARKETPLACE_PATH}/${listingId}`;
export const sellerProfilePath = (userId) => `/admin/users/${userId}`;

export const MARKETPLACE_PAGE_SIZE = 8;
export const DEFAULT_CATEGORY = "All";
export const LISTING_GRID_CLASS = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
