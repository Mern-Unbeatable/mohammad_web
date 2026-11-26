import { useCallback, useEffect, useState } from 'react';
import { toGeneralPostModel, categoryToApi } from '@/features/dash/user/general';
import * as publicGeneralApi from '@/features/public/general/generalApi';
import {
  DEFAULT_CATEGORY,
  PUBLIC_POSTS_PAGE_SIZE,
} from '../constant/constants';
import { hasReachedGuestViewLimit } from '../utils/guestViews';
import {
  getCachedPostsList,
  postsListCacheKey,
  setCachedPostsList,
} from '../utils/postsListCache';
import { useAuth } from '@/modules/auth';

export const usePublicGeneralPosts = () => {
  const { isAuthenticated, sessionReady } = useAuth();
  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [guestLimited, setGuestLimited] = useState(false);

  const applyResult = useCallback(
    (result) => {
      setItems(result.items);
      setMeta(result.meta);
      setError(null);
      if (!isAuthenticated) setGuestLimited(hasReachedGuestViewLimit());
      else setGuestLimited(false);
    },
    [isAuthenticated],
  );

  const load = useCallback(
    async ({ force = false } = {}) => {
      const resolvedPage = isAuthenticated ? page : 1;
      const key = postsListCacheKey({
        category,
        page: resolvedPage,
        isAuthenticated,
      });

      if (!force) {
        const cached = getCachedPostsList(key);
        if (cached) {
          applyResult(cached);
          setLoading(false);
          return;
        }
      }

      setLoading(true);
      setError(null);
      try {
        const type = categoryToApi(category);
        const response = await publicGeneralApi.getPublicPostsList({
          page: resolvedPage,
          pageSize: PUBLIC_POSTS_PAGE_SIZE,
          sort: 'desc',
          ...(type ? { type } : {}),
        });
        const next = {
          items: (response.data || []).map(toGeneralPostModel).filter(Boolean),
          meta: response.meta || { page: 1, totalPages: 1, total: 0 },
        };
        setCachedPostsList(key, next);
        applyResult(next);
      } catch (err) {
        setError(publicGeneralApi.getApiErrorMessage(err, 'Failed to load posts'));
        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [applyResult, category, page, isAuthenticated],
  );

  useEffect(() => {
    if (!sessionReady) return undefined;
    load();
    return undefined;
  }, [load, sessionReady]);

  useEffect(() => {
    if (!isAuthenticated) setGuestLimited(hasReachedGuestViewLimit());
    else setGuestLimited(false);
  }, [isAuthenticated]);

  const onCategoryChange = (next) => {
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
    retry: () => load({ force: true }),
    isAuthenticated,
    guestLimited,
  };
};
