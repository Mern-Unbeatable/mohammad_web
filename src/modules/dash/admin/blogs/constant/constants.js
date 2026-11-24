export const BLOGS_PATH = "/admin/blogs";
export const NEW_BLOG_PATH = `${BLOGS_PATH}/new`;

export const BLOGS_PAGE_SIZE = 8;
export const BLOG_GRID_CLASS =
  "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

/* ---------- Editor ---------- */

export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif";
export const IMAGE_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
export const MAX_FILE_MB = 10;
export const MAX_FILE_BYTES = MAX_FILE_MB * 1024 * 1024;

export const DEFAULT_READ_TIME = "5 min read";
