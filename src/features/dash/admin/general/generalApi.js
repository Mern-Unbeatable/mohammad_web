import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/config";

/**
 * Admin general posts HTTP helpers — no Redux. Used by generalThunks.
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
  const response = await crudService.get(
    API_ENDPOINTS.ADMIN.GENERAL.LIST,
    params,
  );
  return parseListResponse(response, params);
}

// ═══════════════════════════════════════════════════════════════════════
// Post details
// ═══════════════════════════════════════════════════════════════════════
export async function getPostById(postId) {
  const response = await crudService.get(
    API_ENDPOINTS.ADMIN.GENERAL.DETAILS(postId),
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Delete post
// ═══════════════════════════════════════════════════════════════════════
export async function deletePost(postId) {
  const response = await crudService.del(
    API_ENDPOINTS.ADMIN.GENERAL.DELETE(postId),
  );
  return { postId, data: unwrapApiData(response) ?? response };
}

export { getApiErrorMessage };
