import { createContactsThunks } from "@/features/contacts";
import * as contactsApi from "./contactsApi";

/** User contacts async thunks (`userContacts/*`). */
export const {
  fetchContactsList,
  fetchPendingRequestCount,
  fetchContactDetails,
  requestContactConnection,
  acceptConnection,
  declineConnection,
  removeConnection,
} = createContactsThunks("userContacts", contactsApi);
