import { API_ENDPOINTS, getApiErrorMessage } from "@/config";
import { createContactsApi } from "@/features/contacts";

/** Supplier contacts / connections HTTP helpers — no Redux. */
export const {
  getContactsList,
  getPendingRequestCount,
  getContactById,
  requestConnection,
  acceptConnection,
  declineConnection,
  removeConnection,
} = createContactsApi(API_ENDPOINTS.SUPPLIER.CONTACTS);

export { getApiErrorMessage };
