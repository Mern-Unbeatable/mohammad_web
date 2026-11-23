import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/config";

/**
 * Payment history HTTP helpers — no Redux; the history is page-local state.
 * List calls resolve to `{ items, meta }`.
 */

const dropEmpty = (params) =>
  Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ""),
  );

function toList(response, params) {
  const items = unwrapApiData(response);
  return {
    items: Array.isArray(items) ? items : [],
    meta: response?.meta || {
      page: params.page || 1,
      pageSize: params.pageSize || 10,
      total: 0,
      totalPages: 1,
    },
  };
}

/** The signed-in member's own payments (user or supplier). */
export async function getMyPayments(params = {}) {
  const query = dropEmpty(params);
  const response = await crudService.get(API_ENDPOINTS.PAYMENTS.MINE, query);
  return toList(response, query);
}

/** Admin: every member's payments; `meta.summary` holds paid totals. */
export async function getAdminPayments(params = {}) {
  const query = dropEmpty(params);
  const response = await crudService.get(API_ENDPOINTS.ADMIN.PAYMENTS.LIST, query);
  return toList(response, query);
}

/** Current Stripe links: `{ hostedInvoiceUrl, invoicePdfUrl, receiptUrl, invoiceNumber }`. */
export async function getPaymentLinks(paymentId) {
  const response = await crudService.get(API_ENDPOINTS.PAYMENTS.LINKS(paymentId));
  return unwrapApiData(response) || {};
}

/** Admin: import every Stripe invoice into the history. */
export async function syncAllPayments() {
  const response = await crudService.post(API_ENDPOINTS.ADMIN.PAYMENTS.SYNC);
  return unwrapApiData(response) || {};
}

export { getApiErrorMessage };
