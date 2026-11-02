import { API_ENDPOINTS, getApiErrorMessage } from "@/config";
import { createContactsApi } from "@/features/contacts";

/** User contacts / connections HTTP helpers — no Redux. */
export const {
  getContactsList,
  getPendingRequestCount,
  getContactById,
  requestConnection,
  acceptConnection,
  declineConnection,
  removeConnection,
} = createContactsApi(API_ENDPOINTS.USER.CONTACTS);

export { getApiErrorMessage };
