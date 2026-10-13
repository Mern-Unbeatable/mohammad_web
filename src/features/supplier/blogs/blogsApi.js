import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";

/**
 * Supplier blogs HTTP helpers — no Redux. Used by blogsThunks.
 * Public published articles only (list + slug detail).
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
// Published blogs list
// ═══════════════════════════════════════════════════════════════════════
export async function getBlogsList(params = {}) {
  const query = {
    page: 1,
    pageSize: 8,
    sort: "desc",
    ...params,
  };
  if (!query.search) delete query.search;
  if (!query.category) delete query.category;

  const response = await crudService.get(
    API_ENDPOINTS.SUPPLIER.BLOGS.LIST,
    query,
  );
  return parseListResponse(response, query);
}

// ═══════════════════════════════════════════════════════════════════════
// Article by slug
// ═══════════════════════════════════════════════════════════════════════
export async function getBlogBySlug(slug) {
  const response = await crudService.get(
    API_ENDPOINTS.SUPPLIER.BLOGS.DETAILS(slug),
  );
  return unwrapApiData(response) || response;
}

export { getApiErrorMessage };
