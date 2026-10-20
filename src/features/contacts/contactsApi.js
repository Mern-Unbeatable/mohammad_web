import { crudService, unwrapApiData } from "@/config";

/**
 * Contacts / connections HTTP helpers — no Redux. Shared by every role;
 * `endpoints` is the role's `API_ENDPOINTS.<ROLE>.CONTACTS` group.
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

export function createContactsApi(endpoints) {
  // ═══════════════════════════════════════════════════════════════════════
  // Directory list
  // ═══════════════════════════════════════════════════════════════════════
  async function getContactsList(params = {}) {
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

    const response = await crudService.get(endpoints.LIST, query);
    return parseListResponse(response, query);
  }

  /** Pending requests addressed to the caller (badge count). */
  async function getPendingRequestCount() {
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
  async function getContactById(contactId) {
    const response = await crudService.get(endpoints.DETAILS(contactId));
    return unwrapApiData(response) || response;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Request connection
  // ═══════════════════════════════════════════════════════════════════════
  async function requestConnection(addresseeId) {
    const response = await crudService.post(endpoints.REQUEST, { addresseeId });
    return unwrapApiData(response) || response;
  }

  // ═══════════════════════════════════════════════════════════════════════
  // Accept / decline / remove (connection id, not user id)
  // ═══════════════════════════════════════════════════════════════════════
  async function acceptConnection(connectionId) {
    const response = await crudService.patch(endpoints.ACCEPT(connectionId));
    return unwrapApiData(response) || response;
  }

  async function declineConnection(connectionId) {
    const response = await crudService.patch(endpoints.DECLINE(connectionId));
    return unwrapApiData(response) || response;
  }

  async function removeConnection(connectionId) {
    const response = await crudService.del(endpoints.REMOVE(connectionId));
    return { connectionId, data: unwrapApiData(response) ?? response };
  }

  return {
    getContactsList,
    getPendingRequestCount,
    getContactById,
    requestConnection,
    acceptConnection,
    declineConnection,
    removeConnection,
  };
}
