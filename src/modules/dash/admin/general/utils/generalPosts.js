import { categoryToApi } from "@/features/dash/admin/general";
import { GENERAL_PAGE_SIZE, POST_TYPE, TYPE_STYLES } from "../constant/constants";

/** List query; "All" sends no type filter. */
export const buildPostsQuery = ({ page, category }) => {
  const params = { page, pageSize: GENERAL_PAGE_SIZE };
  const type = categoryToApi(category);
  if (type) params.type = type;
  return params;
};

/** Pill classes for a post type; unknown types look like news. */
export const postTypeStyle = (type) => TYPE_STYLES[type] || TYPE_STYLES[POST_TYPE.NEWS];

export const postTypeLabel = (type) => (type === POST_TYPE.NEWS ? "News" : "Document");

/** Download link only for document posts that have a file. */
export const postDownloadUrl = (post) =>
  post.type === POST_TYPE.DOCUMENT && post.documentUrl ? post.documentUrl : null;
