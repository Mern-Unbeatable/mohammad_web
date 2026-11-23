import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";
import { unwrapSubscribePayload } from "./subscriptionsMappers";

/**
 * User subscriptions HTTP helpers — no Redux. Used by subscriptionsThunks.
 */

export async function getMySubscription() {
  const response = await crudService.get(API_ENDPOINTS.USER.SUBSCRIPTIONS.ME);
  return unwrapApiData(response) || response;
}

export async function getPlans() {
  const response = await crudService.get(
    API_ENDPOINTS.PUBLIC.SUBSCRIPTION_PLANS,
  );
  return unwrapApiData(response) || response;
}

export async function subscribe(plan) {
  const payload = typeof plan === "string" ? { plan } : plan;
  const response = await crudService.post(
    API_ENDPOINTS.USER.SUBSCRIPTIONS.SUBSCRIBE,
    payload,
  );
  const data = unwrapApiData(response) || response;
  return unwrapSubscribePayload(data);
}

export async function confirmCheckout(sessionId) {
  const response = await crudService.post(
    API_ENDPOINTS.USER.SUBSCRIPTIONS.CONFIRM_CHECKOUT,
    { sessionId },
  );
  return unwrapApiData(response) || response;
}

export async function cancelSubscription() {
  const response = await crudService.post(
    API_ENDPOINTS.USER.SUBSCRIPTIONS.CANCEL,
  );
  return unwrapApiData(response) || response;
}

export { getApiErrorMessage };
