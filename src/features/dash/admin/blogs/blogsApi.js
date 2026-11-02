import {
  crudService,
  API_ENDPOINTS,
  unwrapApiData,
  getApiErrorMessage,
} from "@/config";

/**
 * Admin blogs HTTP helpers — no Redux. Used by blogsThunks.
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
// Blogs list
// ═══════════════════════════════════════════════════════════════════════
export async function getBlogsList(params = {}) {
  const response = await crudService.get(
    API_ENDPOINTS.ADMIN.BLOGS.LIST,
    params,
  );
  return parseListResponse(response, params);
}

// ═══════════════════════════════════════════════════════════════════════
// Create blog
// ═══════════════════════════════════════════════════════════════════════
export async function createBlog(payload) {
  const response = await crudService.post(
    API_ENDPOINTS.ADMIN.BLOGS.CREATE,
    payload,
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Update blog
// ═══════════════════════════════════════════════════════════════════════
export async function updateBlog(blogId, payload) {
  const response = await crudService.patch(
    API_ENDPOINTS.ADMIN.BLOGS.UPDATE(blogId),
    payload,
  );
  return unwrapApiData(response) || response;
}

// ═══════════════════════════════════════════════════════════════════════
// Delete blog
// ═══════════════════════════════════════════════════════════════════════
export async function deleteBlog(blogId) {
  const response = await crudService.del(
    API_ENDPOINTS.ADMIN.BLOGS.DELETE(blogId),
  );
  return { blogId, data: unwrapApiData(response) ?? response };
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
