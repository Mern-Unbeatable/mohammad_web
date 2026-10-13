import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";

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
// Delete ad
// ═══════════════════════════════════════════════════════════════════════
export async function deleteAd(adId) {
  const response = await crudService.del(
    API_ENDPOINTS.SUPPLIER.ADVERTISEMENTS.DELETE(adId),
  );
  return { adId, data: unwrapApiData(response) ?? response };
}

export { getApiErrorMessage };
