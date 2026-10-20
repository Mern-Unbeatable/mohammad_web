import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/config";

/**
 * Supplier contacts / connections HTTP helpers — no Redux.
 */

const parseListResponse = (response, params = {}) => {
  const outer = response;
  const inner = unwrapApiData(response);

  let rows = [];
  let metaData = {
    page: params.page || 1,
    pageSize: params.pageSize || 8,
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
        Math.ceil(rows.length / (metaData.pageSize || 8)),
      ),
    };
  }

  return { data: rows, meta: metaData };
};

// ═══════════════════════════════════════════════════════════════════════
// Directory list
// ═══════════════════════════════════════════════════════════════════════
export async function getContactsList(params = {}) {
  const query = {
    page: 1,
    pageSize: 8,
    sort: "desc",
    ...params,
  };
  if (!query.country) delete query.country;
  if (!query.search) delete query.search;
  if (!query.status) delete query.status;
  if (!query.direction) delete query.direction;

  const response = await crudService.get(
    API_ENDPOINTS.SUPPLIER.CONTACTS.LIST,
    query,
  );
  return parseListResponse(response, query);
}

/** Pending requests addressed to the caller (Confirm tab badge). */
export async function getPendingRequestCount() {
  const { meta } = await getContactsList({
    status: "pending",
    direction: "incoming",
    page: 1,
    pageSize: 1,
  });
  return Number(meta?.total) || 0;
}

// ═══════════════════════════════════════════════════════════════════════
// Contact profile
// ═══════════════════════════════════════════════════════════════════════
export async function getContactById(contactId) {
  const response = await crudService.get(
    API_ENDPOINTS.SUPPLIER.CONTACTS.DETAILS(contactId),
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Request connection
// ═══════════════════════════════════════════════════════════════════════
export async function requestConnection(addresseeId) {
  const response = await crudService.post(
    API_ENDPOINTS.SUPPLIER.CONTACTS.REQUEST,
    { addresseeId },
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Accept / decline / remove (connection id, not user id)
// ═══════════════════════════════════════════════════════════════════════
export async function acceptConnection(connectionId) {
  const response = await crudService.patch(
    API_ENDPOINTS.SUPPLIER.CONTACTS.ACCEPT(connectionId),
  );
  return unwrapApiData(response) || response;
}

export async function declineConnection(connectionId) {
  const response = await crudService.patch(
    API_ENDPOINTS.SUPPLIER.CONTACTS.DECLINE(connectionId),
  );
  return unwrapApiData(response) || response;
}

export async function removeConnection(connectionId) {
  const response = await crudService.del(
    API_ENDPOINTS.SUPPLIER.CONTACTS.REMOVE(connectionId),
  );
  return { connectionId, data: unwrapApiData(response) ?? response };
}

export { getApiErrorMessage };
