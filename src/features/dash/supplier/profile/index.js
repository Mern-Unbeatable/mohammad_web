/**
 * Supplier profile feature public API.
 *
 * - profileApi      → HTTP
 * - profileThunks   → async actions
 * - profileSlice    → state + sync reducers
 * - profileMappers  → user ↔ form
 */

export { default as supplierProfileReducer } from "./profileSlice";
export { clearProfileError, setProfileField } from "./profileSlice";
export {
  fetchSupplierProfile,
  updateSupplierProfile,
  changeSupplierPassword,
} from "./profileThunks";
export {
  emptyProfileForm,
  mapUserToForm,
  formToUpdatePayload,
} from "./profileMappers";
export * as profileApi from "./profileApi";
