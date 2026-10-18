import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";

/**
 * Admin users HTTP helpers — no Redux. Used by usersThunks.
 */

// ═══════════════════════════════════════════════════════════════════════
// Users list
// ═══════════════════════════════════════════════════════════════════════
export async function getUsersList(params = {}) {
  const response = await crudService.get(
    API_ENDPOINTS.ADMIN.USERS.LIST,
    params,
  );
  const outer = response;
  const inner = unwrapApiData(response);

  let usersData = [];
  let metaData = {
    page: params.page || 1,
    pageSize: params.pageSize || 10,
    total: 0,
    totalPages: 1,
  };

  if (Array.isArray(inner)) {
    usersData = inner;
    metaData = outer?.meta || metaData;
  } else if (Array.isArray(inner?.data)) {
    usersData = inner.data;
    metaData = inner.meta || outer?.meta || metaData;
  } else if (Array.isArray(outer?.data)) {
    usersData = outer.data;
    metaData = outer.meta || metaData;
  }

  if (!metaData.total && usersData.length) {
    metaData = {
      ...metaData,
      total: usersData.length,
      totalPages: Math.max(
        1,
        Math.ceil(usersData.length / (metaData.pageSize || 10)),
      ),
    };
  }

  return { data: usersData, meta: metaData };
}

// ═══════════════════════════════════════════════════════════════════════
// User details
// ═══════════════════════════════════════════════════════════════════════
export async function getUserById(userId) {
  const response = await crudService.get(
    API_ENDPOINTS.ADMIN.USERS.DETAILS(userId),
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// User status
// ═══════════════════════════════════════════════════════════════════════
/** `{ advertisements, listings, jobs }`, each `{ total, items }`. */
export async function getUserContent(userId) {
  const response = await crudService.get(
    API_ENDPOINTS.ADMIN.USERS.CONTENT(userId),
  );
  return unwrapApiData(response) || response;
}

export async function patchUserStatus(userId, status, reason) {
  const response = await crudService.patch(
    API_ENDPOINTS.ADMIN.USERS.STATUS(userId),
    {
      status,
      reason,
    },
  );
  return { userId, status, data: unwrapApiData(response) ?? response };
}

export { getApiErrorMessage };
