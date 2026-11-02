import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/config";

/**
 * Supplier dashboard HTTP helpers — no Redux. Used by dashThunks.
 * Overview is composed from ads + notifications (no dedicated dashboard route).
 */

const parseListResponse = (response, params = {}) => {
  const outer = response;
  const inner = unwrapApiData(response);

  let rows = [];
  let metaData = {
    page: params.page || 1,
    pageSize: params.pageSize || 20,
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
        Math.ceil(rows.length / (metaData.pageSize || 20)),
      ),
    };
  }

  return { data: rows, meta: metaData };
};

// ═══════════════════════════════════════════════════════════════════════
// Own advertisements (supplier-scoped on the server)
// ═══════════════════════════════════════════════════════════════════════
export async function getMyAds(params = {}) {
  const query = {
    page: 1,
    pageSize: 100,
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
// Recent notifications
// ═══════════════════════════════════════════════════════════════════════
export async function getNotifications(params = {}) {
  const query = {
    page: 1,
    pageSize: 5,
    sort: "desc",
    ...params,
  };
  const response = await crudService.get(
    API_ENDPOINTS.SUPPLIER.NOTIFICATIONS.LIST,
    query,
  );
  return parseListResponse(response, query);
}

export { getApiErrorMessage };
