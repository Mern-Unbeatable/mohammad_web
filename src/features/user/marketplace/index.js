/**
 * User marketplace feature public API.
 *
 * - marketplaceApi     → HTTP
 * - marketplaceThunks  → async actions
 * - marketplaceSlice   → state + sync reducers
 * - marketplaceMappers → card / detail models
 */

export { default as userMarketplaceReducer } from "./marketplaceSlice";
export {
  clearMarketplaceError,
  clearSelectedListing,
} from "./marketplaceSlice";
export {
  fetchListings,
  fetchListingDetails,
  createListing,
  updateListing,
  removeListing,
  toggleSaveListing,
  enquireListing,
} from "./marketplaceThunks";
export {
  MARKETPLACE_CATEGORY_OPTIONS,
  categoryToApi,
  categoryFromApi,
  conditionFromApi,
  toListingCardModel,
  toListingDetailModel,
  formatListedAt,
} from "./marketplaceMappers";
export * as marketplaceApi from "./marketplaceApi";
