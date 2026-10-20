/**
 * Admin advertisements feature public API.
 *
 * - adsApi     → HTTP
 * - adsThunks  → async actions
 * - adsSlice   → state + sync reducers
 */

export { default as adminAdsReducer } from "./adsSlice";
export { clearAdsError, clearSelectedAd } from "./adsSlice";
export {
  fetchAdsList,
  fetchAdDetails,
  reviewAdvertisement,
} from "./adsThunks";
export * as adsApi from "./adsApi";
