import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/config";

/**
 * User general posts HTTP helpers — no Redux. Used by generalThunks.
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

export async function getPostsList(params = {}) {
  const query = {
    page: 1,
    pageSize: 8,
    sort: "desc",
    ...params,
  };
  if (!query.type) delete query.type;
  if (!query.search) delete query.search;
  if (query.mine == null) delete query.mine;

  const response = await crudService.get(
    API_ENDPOINTS.USER.GENERAL.LIST,
    query,
  );
  return parseListResponse(response, query);
}

export async function getPostById(postId) {
  const response = await crudService.get(
    API_ENDPOINTS.USER.GENERAL.DETAILS(postId),
  );
  return unwrapApiData(response) || response;
}

export async function createPost(payload) {
  const response = await crudService.post(
    API_ENDPOINTS.USER.GENERAL.CREATE,
    payload,
  );
  return unwrapApiData(response) || response;
}

export async function updatePost(postId, payload) {
  const response = await crudService.patch(
    API_ENDPOINTS.USER.GENERAL.UPDATE(postId),
    payload,
  );
  return unwrapApiData(response) || response;
}

export async function deletePost(postId) {
  const response = await crudService.del(
    API_ENDPOINTS.USER.GENERAL.DELETE(postId),
  );
  return { postId, data: unwrapApiData(response) ?? response };
}

/**
 * Upload a single file via /uploads.
 * Field name must be `file` (matches multer upload.single("file")).
 */
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await crudService.upload(
    API_ENDPOINTS.USER.UPLOADS.SINGLE,
    formData,
    null,
    { timeout: 60000 },
  );
  const data = unwrapApiData(response) || response;
  if (!data?.url) {
    throw new Error("Upload did not return a file URL");
  }
  return data;
}

export { getApiErrorMessage };
