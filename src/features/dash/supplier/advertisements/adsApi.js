import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/config";

/**
 * Supplier advertisements HTTP helpers — no Redux. Used by adsThunks.
 */

const parseListResponse = (response, params = {}) => {
  const outer = response;
  const inner = unwrapApiData(response);

  let rows = [];
  let metaData = {
    page: params.page || 1,
    pageSize: params.pageSize || 7,
    total: 0,
    totalPages: 1,
  };

  if (Array.isArray(inner)) {
    rows = inner;
    metaData = outer?.meta || metaData;
  } else if (Array.isArray(inner?.data)) {
    rows = inner.data;
    metaData = inner.meta || outer?.meta || metaData;
  } else if (Array.isArray(outer?.data)) {
    rows = outer.data;
    metaData = outer.meta || metaData;
  }

  if (!metaData.total && rows.length) {
    metaData = {
      ...metaData,
      total: rows.length,
      totalPages: Math.max(
        1,
        Math.ceil(rows.length / (metaData.pageSize || 7)),
      ),
    };
  }

  return { data: rows, meta: metaData };
};

// ═══════════════════════════════════════════════════════════════════════
// Ads list (supplier-scoped)
// ═══════════════════════════════════════════════════════════════════════
export async function getAdsList(params = {}) {
  const query = {
    page: 1,
    pageSize: 7,
    sort: "desc",
    mine: true,
    ...params,
  };
  const response = await crudService.get(
    API_ENDPOINTS.SUPPLIER.ADVERTISEMENTS.LIST,
    query,
  );
  return parseListResponse(response, query);
}

// ═══════════════════════════════════════════════════════════════════════
// Ad details
// ═══════════════════════════════════════════════════════════════════════
export async function getAdById(adId) {
  const response = await crudService.get(
    API_ENDPOINTS.SUPPLIER.ADVERTISEMENTS.DETAILS(adId),
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Sponsored duration pricing (admin `sponsored_pricing` setting)
// ═══════════════════════════════════════════════════════════════════════
export async function getAdPricing() {
  const response = await crudService.get(
    API_ENDPOINTS.SUPPLIER.ADVERTISEMENTS.PRICING,
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Create ad
// ═══════════════════════════════════════════════════════════════════════
export async function createAd(payload) {
  const response = await crudService.post(
    API_ENDPOINTS.SUPPLIER.ADVERTISEMENTS.CREATE,
    payload,
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Update / resubmit ad
// ═══════════════════════════════════════════════════════════════════════
export async function updateAd(adId, payload) {
  const response = await crudService.patch(
    API_ENDPOINTS.SUPPLIER.ADVERTISEMENTS.UPDATE(adId),
    payload,
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Media upload (shared /uploads endpoint, multer field `file`)
// ═══════════════════════════════════════════════════════════════════════
export async function uploadAdMedia(file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await crudService.upload(
    API_ENDPOINTS.SUPPLIER.UPLOADS.SINGLE,
    formData,
    null,
    { timeout: 120000 },
  );
  const data = unwrapApiData(response) || response;
  if (!data?.url) {
    throw new Error("Upload did not return a file URL");
  }
  return data;
}

// ═══════════════════════════════════════════════════════════════════════
// Delete ad
// ═══════════════════════════════════════════════════════════════════════
export async function deleteAd(adId) {
  const response = await crudService.del(
    API_ENDPOINTS.SUPPLIER.ADVERTISEMENTS.DELETE(adId),
  );
  return { adId, data: unwrapApiData(response) ?? response };
}

// ═══════════════════════════════════════════════════════════════════════
// Cancel ad (withdraw from review / circulation)
// ═══════════════════════════════════════════════════════════════════════
export async function cancelAd(adId) {
  const response = await crudService.patch(
    API_ENDPOINTS.SUPPLIER.ADVERTISEMENTS.CANCEL(adId),
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Payment — start Stripe Checkout and confirm on return
// ═══════════════════════════════════════════════════════════════════════
export async function startAdCheckout(adId) {
  const response = await crudService.post(
    API_ENDPOINTS.SUPPLIER.ADVERTISEMENTS.CHECKOUT(adId),
  );
  return unwrapApiData(response) || response;
}

export async function confirmAdCheckout(adId, sessionId) {
  const response = await crudService.post(
    API_ENDPOINTS.SUPPLIER.ADVERTISEMENTS.CHECKOUT_CONFIRM(adId),
    { sessionId },
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Active sponsored ads (public feed) + engagement tracking
// ═══════════════════════════════════════════════════════════════════════
export async function getActiveAds(params = {}) {
  const response = await crudService.get(
    API_ENDPOINTS.SUPPLIER.ADVERTISEMENTS.ACTIVE,
    { page: 1, pageSize: 10, ...params },
  );
  return parseListResponse(response, params);
}

export async function trackAd(adId, metric) {
  try {
    await crudService.post(
      API_ENDPOINTS.SUPPLIER.ADVERTISEMENTS.TRACK(adId, metric),
    );
  } catch {
    // Engagement tracking is best-effort; never block the UI on it.
  }
}

export { getApiErrorMessage };
