import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";

/**
 * Admin marketplace HTTP helpers — no Redux. Used by marketplaceThunks.
 */

const parseListResponse = (response, params = {}) => {
  const outer = response;
  const inner = unwrapApiData(response);

  let listingsData = [];
  let metaData = {
    page: params.page || 1,
    pageSize: params.pageSize || 8,
    total: 0,
    totalPages: 1,
  };

  if (Array.isArray(inner)) {
    listingsData = inner;
    metaData = outer?.meta || metaData;
  } else if (Array.isArray(inner?.data)) {
    listingsData = inner.data;
    metaData = inner.meta || outer?.meta || metaData;
  } else if (Array.isArray(outer?.data)) {
    listingsData = outer.data;
    metaData = outer.meta || metaData;
  }

  if (!metaData.total && listingsData.length) {
    metaData = {
      ...metaData,
      total: listingsData.length,
      totalPages: Math.max(
        1,
        Math.ceil(listingsData.length / (metaData.pageSize || 8)),
      ),
    };
  }

  return { data: listingsData, meta: metaData };
};

// ═══════════════════════════════════════════════════════════════════════
// Listings list
// ═══════════════════════════════════════════════════════════════════════
export async function getListingsList(params = {}) {
  const response = await crudService.get(
    API_ENDPOINTS.ADMIN.MARKETPLACE.LIST,
    params,
  );
  return parseListResponse(response, params);
}

// ═══════════════════════════════════════════════════════════════════════
// Listing details
// ═══════════════════════════════════════════════════════════════════════
export async function getListingById(listingId) {
  const response = await crudService.get(
    API_ENDPOINTS.ADMIN.MARKETPLACE.DETAILS(listingId),
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Delete listing
// ═══════════════════════════════════════════════════════════════════════
export async function deleteListing(listingId) {
  const response = await crudService.del(
    API_ENDPOINTS.ADMIN.MARKETPLACE.DELETE(listingId),
  );
  return { listingId, data: unwrapApiData(response) ?? response };
}

export { getApiErrorMessage };
