/** In-memory cache so revisiting `/general-posts` does not refetch the same list. */

const cache = new Map();

export const postsListCacheKey = ({ category, page, isAuthenticated }) =>
  `${isAuthenticated ? 'auth' : 'guest'}:${category}:${page}`;

export const getCachedPostsList = (key) => cache.get(key) || null;

export const setCachedPostsList = (key, value) => {
  cache.set(key, value);
};

export const clearCachedPostsList = () => {
  cache.clear();
};
