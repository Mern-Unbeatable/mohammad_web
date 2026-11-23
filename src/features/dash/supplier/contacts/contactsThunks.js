import { createContactsThunks } from "@/features/contacts";
import * as contactsApi from "./contactsApi";

/** Supplier contacts async thunks (`supplierContacts/*`). */
export const {
  fetchContactsList,
  fetchPendingRequestCount,
  fetchContactDetails,
  requestContactConnection,
  acceptConnection,
  declineConnection,
  removeConnection,
} = createContactsThunks("supplierContacts", contactsApi);
