/**
 * Supplier contacts feature public API.
 *
 * - contactsApi     → HTTP
 * - contactsThunks  → async actions
 * - contactsSlice   → state + sync reducers
 * - contactsMappers → card / profile models
 */

export { default as supplierContactsReducer } from "./contactsSlice";
export {
  clearContactsError,
  clearSelectedContact,
  invalidateContactsList,
} from "./contactsSlice";
export {
  fetchContactsList,
  fetchContactDetails,
  requestContactConnection,
  acceptConnection,
  declineConnection,
  removeConnection,
} from "./contactsThunks";
export {
  COUNTRY_OPTIONS,
  toContactCardModel,
  toContactProfileModel,
} from "./contactsMappers";
export * as contactsApi from "./contactsApi";
