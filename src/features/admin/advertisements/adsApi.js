import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/config";

/**
 * Admin advertisements HTTP helpers — no Redux. Used by adsThunks.
 */

const parseListResponse = (response, params = {}) => {
  const outer = response;
  const inner = unwrapApiData(response);

  let rows = [];
  let metaData = {
    page: params.page || 1,
    pageSize: params.pageSize || 10,
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
        Math.ceil(rows.length / (metaData.pageSize || 10)),
      ),
    };
  }

  return { data: rows, meta: metaData };
};

// ═══════════════════════════════════════════════════════════════════════
// Ads list
// ═══════════════════════════════════════════════════════════════════════
export async function getAdsList(params = {}) {
  const response = await crudService.get(
    API_ENDPOINTS.ADMIN.ADVERTISEMENTS.LIST,
    params,
  );
  return parseListResponse(response, params);
}

// ═══════════════════════════════════════════════════════════════════════
// Ad details
// ═══════════════════════════════════════════════════════════════════════
export async function getAdById(adId) {
  const response = await crudService.get(
    API_ENDPOINTS.ADMIN.ADVERTISEMENTS.DETAILS(adId),
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Review (approve / reject / expire)
// ═══════════════════════════════════════════════════════════════════════
export async function reviewAd(adId, status, rejectionReason) {
  const body = { status };
  if (rejectionReason) body.rejectionReason = rejectionReason;

  const response = await crudService.patch(
    API_ENDPOINTS.ADMIN.ADVERTISEMENTS.REVIEW(adId),
    body,
  );
  return unwrapApiData(response) || response;
}

export { getApiErrorMessage };
