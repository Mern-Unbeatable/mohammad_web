import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/api";

/**
 * Supplier general posts HTTP helpers — no Redux. Used by generalThunks.
 */

const parseListResponse = (response, params = {}) => {
  const outer = response;
  const inner = unwrapApiData(response);

  let postsData = [];
  let metaData = {
    page: params.page || 1,
    pageSize: params.pageSize || 8,
    total: 0,
    totalPages: 1,
  };

  if (Array.isArray(inner)) {
    postsData = inner;
    metaData = outer?.meta || metaData;
  } else if (Array.isArray(inner?.data)) {
    postsData = inner.data;
    metaData = inner.meta || outer?.meta || metaData;
  } else if (Array.isArray(outer?.data)) {
    postsData = outer.data;
    metaData = outer.meta || metaData;
  }

  if (!metaData.total && postsData.length) {
    metaData = {
      ...metaData,
      total: postsData.length,
      totalPages: Math.max(
        1,
        Math.ceil(postsData.length / (metaData.pageSize || 8)),
      ),
    };
  }

  return { data: postsData, meta: metaData };
};

// ═══════════════════════════════════════════════════════════════════════
// Posts list
// ═══════════════════════════════════════════════════════════════════════
export async function getPostsList(params = {}) {
  const query = {
    page: 1,
    pageSize: 8,
    sort: "desc",
    ...params,
  };
  if (!query.type) delete query.type;
  if (!query.search) delete query.search;

  const response = await crudService.get(
    API_ENDPOINTS.SUPPLIER.GENERAL.LIST,
    query,
  );
  return parseListResponse(response, query);
}

// ═══════════════════════════════════════════════════════════════════════
// Post details
// ═══════════════════════════════════════════════════════════════════════
export async function getPostById(postId) {
  const response = await crudService.get(
    API_ENDPOINTS.SUPPLIER.GENERAL.DETAILS(postId),
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Create post
// ═══════════════════════════════════════════════════════════════════════
export async function createPost(payload) {
  const response = await crudService.post(
    API_ENDPOINTS.SUPPLIER.GENERAL.CREATE,
    payload,
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Update post
// ═══════════════════════════════════════════════════════════════════════
export async function updatePost(postId, payload) {
  const response = await crudService.patch(
    API_ENDPOINTS.SUPPLIER.GENERAL.UPDATE(postId),
    payload,
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Delete post
// ═══════════════════════════════════════════════════════════════════════
export async function deletePost(postId) {
  const response = await crudService.del(
    API_ENDPOINTS.SUPPLIER.GENERAL.DELETE(postId),
  );
  return { postId, data: unwrapApiData(response) ?? response };
}

export { getApiErrorMessage };
