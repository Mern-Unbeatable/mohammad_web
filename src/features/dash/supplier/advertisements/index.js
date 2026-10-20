/**
 * Supplier advertisements feature public API.
 *
 * - adsApi     → HTTP
 * - adsThunks  → async actions
 * - adsSlice   → state + sync reducers
 * - adsMappers → list/detail/create models
 */

export { default as supplierAdsReducer } from "./adsSlice";
export {
  clearSupplierAdsError,
  clearSelectedSupplierAd,
} from "./adsSlice";
export {
  fetchSupplierAds,
  fetchSupplierAdDetails,
  fetchSupplierAdPricing,
  createSupplierAd,
  updateSupplierAd,
  removeSupplierAd,
} from "./adsThunks";
export {
  statusFilterToApi,
  categoryIdToApi,
  durationIdToDays,
  durationDaysToId,
  defaultDurationId,
  toDurationTiers,
  toAdRowModel,
  toAdDetailModel,
  formToCreatePayload,
  adToForm,
  formatUploadDate,
  formatDisplayDate,
  formatPrice,
  formatAdFee,
} from "./adsMappers";
export * as adsApi from "./adsApi";
