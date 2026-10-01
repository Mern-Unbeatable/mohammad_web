/**
 * Admin profile feature public API.
 *
 * - profileApi      → HTTP
 * - profileThunks   → async actions
 * - profileSlice    → state + sync reducers
 * - profileMappers  → user ↔ form
 */

export { default as adminProfileReducer } from "./profileSlice";
export { clearProfileError, setProfileField } from "./profileSlice";
export {
  fetchAdminProfile,
  updateAdminProfile,
  updateAdminAvatar,
  changeAdminPassword,
} from "./profileThunks";
export { mapUserToForm, nameToProfilePayload } from "./profileMappers";
export * as profileApi from "./profileApi";
