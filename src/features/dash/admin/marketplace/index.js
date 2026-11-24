/**
 * Admin marketplace feature public API.
 *
 * - marketplaceApi     → HTTP
 * - marketplaceThunks  → async actions
 * - marketplaceSlice   → state + sync reducers
 */

export { default as adminMarketplaceReducer } from "./marketplaceSlice";
export {
  clearMarketplaceError,
  clearSelectedListing,
} from "./marketplaceSlice";
export {
  fetchListingsList,
  fetchListingDetails,
  removeListing,
} from "./marketplaceThunks";
export {
  MARKETPLACE_CATEGORY_OPTIONS,
  categoryToApi,
  toListingCardModel,
} from "./marketplaceMappers";
export * as marketplaceApi from "./marketplaceApi";
