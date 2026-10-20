import { GRID_PAGE_SIZE } from "@/shared/hooks/usePaginatedList";

export const BLOG_BASE_PATH = "/supplier/blogs";
export const blogDetailPath = (slug) => `${BLOG_BASE_PATH}/${slug}`;

export const BLOGS_PAGE_SIZE = GRID_PAGE_SIZE;
export const SEARCH_DEBOUNCE_MS = 350;

export const POPULAR_POSTS_LIMIT = 5;
