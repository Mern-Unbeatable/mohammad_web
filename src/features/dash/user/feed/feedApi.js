import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/config";

/**
 * User feed HTTP helpers — no Redux. Used by feedThunks.
 */

const parseListResponse = (response, params = {}) => {
  const outer = response;
  const inner = unwrapApiData(response);

  let postsData = [];
  let metaData = {
    page: params.page || 1,
    pageSize: params.pageSize || 10,
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
        Math.ceil(postsData.length / (metaData.pageSize || 10)),
      ),
    };
  }

  return { data: postsData, meta: metaData };
};

export async function getFeed(params = {}) {
  const query = {
    page: 1,
    pageSize: 10,
    sort: "desc",
    ...params,
  };
  if (!query.type) delete query.type;
  if (!query.search) delete query.search;
  if (query.mine === undefined || query.mine === null) delete query.mine;
  if (!query.authorId) delete query.authorId;

  const response = await crudService.get(API_ENDPOINTS.USER.FEED.LIST, query);
  return parseListResponse(response, query);
}

export async function getPostById(postId) {
  const response = await crudService.get(
    API_ENDPOINTS.USER.FEED.DETAILS(postId),
  );
  return unwrapApiData(response) || response;
}

export async function createPost(payload) {
  const response = await crudService.post(
    API_ENDPOINTS.USER.FEED.CREATE,
    payload,
  );
  return unwrapApiData(response) || response;
}

/**
 * Upload a single file via existing /uploads endpoint.
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

/**
 * Upload several files in one request via /uploads/multiple.
 * Field name must be `files` (matches multer upload.array("files", 12)).
 */
export async function uploadFiles(files = []) {
  const list = Array.from(files).filter(Boolean);
  if (!list.length) return [];

  const formData = new FormData();
  list.forEach((file) => formData.append("files", file));

  const response = await crudService.upload(
    API_ENDPOINTS.USER.UPLOADS.MULTIPLE,
    formData,
    null,
    { timeout: 120000 },
  );
  const data = unwrapApiData(response) || response;
  const rows = Array.isArray(data) ? data : [];
  if (rows.length !== list.length || rows.some((row) => !row?.url)) {
    throw new Error("Upload did not return file URLs");
  }
  return rows;
}

export async function updatePost(postId, payload) {
  const response = await crudService.patch(
    API_ENDPOINTS.USER.FEED.UPDATE(postId),
    payload,
  );
  return unwrapApiData(response) || response;
}

export async function deletePost(postId) {
  const response = await crudService.del(
    API_ENDPOINTS.USER.FEED.DELETE(postId),
  );
  return { postId, data: unwrapApiData(response) ?? response };
}

export async function addComment(postId, payload) {
  const text =
    typeof payload === "string"
      ? payload
      : payload?.content ?? payload?.body ?? "";
  const parentCommentId =
    typeof payload === "object" && payload
      ? payload.parentCommentId || undefined
      : undefined;
  const body = {
    content: String(text).trim(),
    ...(parentCommentId ? { parentCommentId } : {}),
  };
  const response = await crudService.post(
    API_ENDPOINTS.USER.FEED.COMMENTS(postId),
    body,
  );
  return unwrapApiData(response) || response;
}

export async function updateComment(postId, commentId, content) {
  const response = await crudService.patch(
    API_ENDPOINTS.USER.FEED.COMMENT(postId, commentId),
    { content: String(content ?? "").trim() },
  );
  return unwrapApiData(response) || response;
}

export async function deleteComment(postId, commentId) {
  const response = await crudService.del(
    API_ENDPOINTS.USER.FEED.COMMENT(postId, commentId),
  );
  return {
    postId,
    commentId,
    data: unwrapApiData(response) ?? response,
  };
}

export async function reactToPost(postId, type) {
  const response = await crudService.post(
    API_ENDPOINTS.USER.FEED.REACTIONS(postId),
    { type },
  );
  return unwrapApiData(response) || response;
}

/** One page of a post's reactions (newest first) plus per-type totals. */
export async function getPostReactions(postId, { page = 1, pageSize = 20, type } = {}) {
  const response = await crudService.get(API_ENDPOINTS.USER.FEED.REACTIONS(postId), {
    page,
    pageSize,
    ...(type ? { type } : {}),
  });
  const data = unwrapApiData(response) || {};
  const meta = response?.meta ||
    response?.data?.meta || { page, pageSize, total: 0, totalPages: 1 };
  return {
    items: Array.isArray(data.reactions) ? data.reactions : [],
    reactionCounts: data.reactionCounts || null,
    meta,
  };
}

export async function repostPost(postId, content = "") {
  const response = await crudService.post(
    API_ENDPOINTS.USER.FEED.REPOST(postId),
    { content: String(content).trim() },
  );
  return unwrapApiData(response) || response;
}

export async function undoRepost(postId) {
  const response = await crudService.del(
    API_ENDPOINTS.USER.FEED.REPOST(postId),
  );
  return unwrapApiData(response) || response;
}

export async function likeComment(postId, commentId) {
  const response = await crudService.post(
    API_ENDPOINTS.USER.FEED.COMMENT_LIKE(postId, commentId),
  );
  return unwrapApiData(response) || response;
}

export { getApiErrorMessage };
