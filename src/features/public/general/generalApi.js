import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from '@/config';

/**
 * Public General posts HTTP helpers — no Redux.
 * Hits the same `/general` read endpoints (optional auth + guest view cookie).
 */

const parseListResponse = (response, params = {}) => {
  const outer = response;
  const inner = unwrapApiData(response);

  let postsData = [];
  let metaData = {
    page: params.page || 1,
    pageSize: params.pageSize || 12,
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

  return { data: postsData, meta: metaData };
};

export async function getPublicPostsList(params = {}) {
  const query = {
    page: 1,
    pageSize: 12,
    sort: 'desc',
    ...params,
  };
  if (!query.type) delete query.type;
  if (!query.search) delete query.search;
  delete query.mine;

  const response = await crudService.get(API_ENDPOINTS.PUBLIC.GENERAL.LIST, query);
  return parseListResponse(response, query);
}

export async function getPublicPostById(postId) {
  const response = await crudService.get(API_ENDPOINTS.PUBLIC.GENERAL.DETAILS(postId));
  return unwrapApiData(response) || response;
}

export { getApiErrorMessage };
