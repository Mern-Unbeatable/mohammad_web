import { crudService, API_ENDPOINTS, getApiErrorMessage } from "@/config";

/** Public contact form; the server emails the message to the contact inbox. */
export async function sendContactMessage(payload) {
  return crudService.post(API_ENDPOINTS.PUBLIC.CONTACT, payload);
}

export { getApiErrorMessage };
