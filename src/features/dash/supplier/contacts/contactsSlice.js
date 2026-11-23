import { createContactsSlice } from "@/features/contacts";
import * as thunks from "./contactsThunks";

const contactsSlice = createContactsSlice({
  name: "supplierContacts",
  thunks,
});

export const { clearContactsError, clearSelectedContact, invalidateContactsList } =
  contactsSlice.actions;

export const { selectPendingRequestCount } = contactsSlice;
export default contactsSlice.reducer;
