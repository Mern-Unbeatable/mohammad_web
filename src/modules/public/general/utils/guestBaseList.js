import { toGeneralPostModel } from '@/features/dash/user/general';
import * as publicGeneralApi from '@/features/public/general/generalApi';
import { PUBLIC_POSTS_PAGE_SIZE } from '../constant/constants';
import {
  getCachedPostsList,
  postsListCacheKey,
  setCachedPostsList,
} from './postsListCache';

export const GUEST_BASE_CACHE_KEY = postsListCacheKey({
  category: '__base__',
  page: 1,
  pageSize: PUBLIC_POSTS_PAGE_SIZE,
  isAuthenticated: false,
});

/** Newest 8 General posts — the only set guests may browse or open. */
export async function loadGuestBaseList({ force = false } = {}) {
  if (!force) {
    const cached = getCachedPostsList(GUEST_BASE_CACHE_KEY);
    if (cached?.items) return cached.items;
  }

  const response = await publicGeneralApi.getPublicPostsList({
    page: 1,
    pageSize: PUBLIC_POSTS_PAGE_SIZE,
    sort: 'desc',
  });
  const items = (response.data || [])
    .map(toGeneralPostModel)
    .filter(Boolean)
    .slice(0, PUBLIC_POSTS_PAGE_SIZE);

  setCachedPostsList(GUEST_BASE_CACHE_KEY, {
    items,
    meta: { page: 1, totalPages: 1, total: items.length },
  });
  return items;
}

export function getGuestBaseList() {
  return getCachedPostsList(GUEST_BASE_CACHE_KEY)?.items || null;
}

export function isInGuestBaseList(postId, items = getGuestBaseList()) {
  if (!postId || !items?.length) return false;
  return items.some((post) => post.id === postId);
}
