/**
 * Shared contacts domain (user + supplier). Each role keeps its own
 * `features/dash/<role>/contacts/` entry point that binds these factories to
 * its endpoints and slice name.
 */
export { createContactsApi } from "./contactsApi";
export { createContactsThunks } from "./contactsThunks";
export { createContactsSlice } from "./contactsSlice";
export {
  COUNTRY_OPTIONS,
  toContactCardModel,
  toContactProfileModel,
} from "./contactsMappers";
