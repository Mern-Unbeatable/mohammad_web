import { useCallback, useEffect, useMemo, useState } from 'react';
import { toGeneralPostModel, categoryToApi } from '@/features/dash/user/general';
import * as publicGeneralApi from '@/features/public/general/generalApi';
import {
  DEFAULT_CATEGORY,
  PUBLIC_POSTS_PAGE_SIZE,
} from '../constant/constants';
import { hasReachedGuestViewLimit } from '../utils/guestViews';
import { loadGuestBaseList } from '../utils/guestBaseList';
import {
  getCachedPostsList,
  postsListCacheKey,
  setCachedPostsList,
} from '../utils/postsListCache';
import { useAuth } from '@/modules/auth';

const filterByCategory = (items, category) => {
  const type = categoryToApi(category);
  if (!type) return items;
  return items.filter((post) => post.type === type);
};

export const usePublicGeneralPosts = () => {
  const { isAuthenticated, sessionReady } = useAuth();
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [page, setPage] = useState(1);
  const [baseItems, setBaseItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guestLimited, setGuestLimited] = useState(false);

  const loadGuestList = useCallback(async ({ force = false } = {}) => {
    setLoading(true);
    setError(null);
    try {
      const items = await loadGuestBaseList({ force });
      setBaseItems(items);
      setGuestLimited(hasReachedGuestViewLimit());
    } catch (err) {
      setError(publicGeneralApi.getApiErrorMessage(err, 'Failed to load posts'));
      setBaseItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAuthenticatedList = useCallback(
    async ({ force = false } = {}) => {
      const key = postsListCacheKey({
        category,
        page,
        pageSize: PUBLIC_POSTS_PAGE_SIZE,
        isAuthenticated: true,
      });

      if (!force) {
        const cached = getCachedPostsList(key);
        if (cached) {
          setBaseItems(cached.items);
          setMeta(cached.meta);
          setError(null);
          setGuestLimited(false);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      setError(null);
      try {
        const type = categoryToApi(category);
        const response = await publicGeneralApi.getPublicPostsList({
          page,
          pageSize: PUBLIC_POSTS_PAGE_SIZE,
          sort: 'desc',
          ...(type ? { type } : {}),
        });
        const next = {
          items: (response.data || []).map(toGeneralPostModel).filter(Boolean),
          meta: response.meta || { page: 1, totalPages: 1, total: 0 },
        };
        setCachedPostsList(key, next);
        setBaseItems(next.items);
        setMeta(next.meta);
        setGuestLimited(false);
      } catch (err) {
        setError(publicGeneralApi.getApiErrorMessage(err, 'Failed to load posts'));
        setBaseItems([]);
      } finally {
        setLoading(false);
      }
    },
    [category, page],
  );

  useEffect(() => {
    if (!sessionReady) return undefined;
    if (isAuthenticated) loadAuthenticatedList();
    else loadGuestList();
    return undefined;
  }, [sessionReady, isAuthenticated, loadAuthenticatedList, loadGuestList]);

  useEffect(() => {
    if (!isAuthenticated) setGuestLimited(hasReachedGuestViewLimit());
    else setGuestLimited(false);
  }, [isAuthenticated]);

  // Guests filter only inside the locked first-8 list — never fetch outside it.
  const items = useMemo(() => {
    if (isAuthenticated) return baseItems;
    return filterByCategory(baseItems, category);
  }, [baseItems, category, isAuthenticated]);

  const onCategoryChange = (next) => {
    if (next === category) return;
    setCategory(next);
    setPage(1);
  };

  return {
    category,
    onCategoryChange,
    page,
    setPage,
    items,
    totalPages: isAuthenticated ? meta.totalPages || 1 : 1,
    loading: !sessionReady || loading,
    error,
    retry: () =>
      isAuthenticated ? loadAuthenticatedList({ force: true }) : loadGuestList({ force: true }),
    isAuthenticated,
    guestLimited,
  };
};
