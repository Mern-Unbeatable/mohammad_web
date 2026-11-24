/**
 * Admin advertisements feature public API.
 *
 * - adsApi     → HTTP
 * - adsThunks  → async actions
 * - adsSlice   → state + sync reducers
 * - adsMappers → table / detail models and status mapping
 */

export { default as adminAdsReducer } from "./adsSlice";
export { clearAdsError, clearSelectedAd } from "./adsSlice";
export {
  fetchAdsList,
  fetchAdDetails,
  reviewAdvertisement,
} from "./adsThunks";
export {
  statusFilterToApi,
  statusLabelToReviewApi,
  toAdRowModel,
  toAdDetailModel,
} from "./adsMappers";
export * as adsApi from "./adsApi";
