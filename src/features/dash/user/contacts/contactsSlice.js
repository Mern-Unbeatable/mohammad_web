import { createContactsSlice } from "@/features/contacts";
import * as thunks from "./contactsThunks";

const contactsSlice = createContactsSlice({
  name: "userContacts",
  thunks,
  trackContactsError: true,
});

export const { clearContactsError, clearSelectedContact, invalidateContactsList } =
  contactsSlice.actions;

export const { selectPendingRequestCount } = contactsSlice;
export default contactsSlice.reducer;
