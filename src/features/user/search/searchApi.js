import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";

/**
 * User global search HTTP helpers — no Redux. Used by searchThunks.
 */

export async function globalSearch({ q, types, limit } = {}) {
  const query = {};
  if (q != null && q !== "") query.q = q;
  if (types != null && types !== "") query.types = types;
  if (limit != null) query.limit = limit;

  const response = await crudService.get(API_ENDPOINTS.USER.SEARCH, query);
  const data = unwrapApiData(response) ?? response;
  return data;
}

export { getApiErrorMessage };
