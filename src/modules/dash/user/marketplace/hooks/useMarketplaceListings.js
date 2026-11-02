import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router';
import { fetchListings, clearMarketplaceError } from '@/features/dash/user/marketplace';
import { usePageParam } from '@/shared/hooks/usePageParam';
import { SEARCH_PARAM } from '@/shared/utils/urlFilters';
import { CATEGORY_PARAM, marketplaceFilters } from '../utils/marketplaceUrlFilters';
import { buildListingsQuery } from '../utils/listingQueries';
import { SEARCH_DEBOUNCE_MS } from '../constant/constants';
import { useListingsState } from './useListingsState';

/** Browse page: category, search and page live in the URL. */
export const useMarketplaceListings = () => {
  const dispatch = useDispatch();
  const { cards, listingsMeta, listingsLoading, listingsError } = useListingsState();

  const [searchParams, setSearchParams] = useSearchParams();
  const { [CATEGORY_PARAM]: category, [SEARCH_PARAM]: search } =
    marketplaceFilters.read(searchParams);
  const [page, setPage] = usePageParam();

  const [query, setQuery] = useState(search);
  const [syncedSearch, setSyncedSearch] = useState(search);
  // Back/Forward can change `q`; mirror it into the search box.
  if (search !== syncedSearch) {
    setSyncedSearch(search);
    setQuery(search);
  }

  const updateFilters = useCallback(
    (changes, { replace = false } = {}) => {
      setSearchParams((prev) => marketplaceFilters.apply(prev, changes), { replace });
    },
    [setSearchParams],
  );

  useEffect(() => {
    const next = marketplaceFilters.normalize(searchParams);
    if (next) setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = query.trim() ? query : '';
      if (nextSearch === search) return;
      updateFilters({ [SEARCH_PARAM]: nextSearch }, { replace: true });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query, search, updateFilters]);

  const loadListings = useCallback(() => {
    dispatch(clearMarketplaceError());
    dispatch(fetchListings(buildListingsQuery({ page, query: search, category })));
  }, [dispatch, page, search, category]);

  // Run before paint so skeletons replace stale cards immediately on filter/page change
  useLayoutEffect(() => {
    loadListings();
  }, [loadListings]);

  const totalPages = Math.max(1, listingsMeta?.totalPages || 1);
  // Only trust totalPages once it belongs to the page in the URL.
  const pageOutOfRange =
    !listingsLoading &&
    !listingsError &&
    Number(listingsMeta?.page) === page &&
    page > totalPages;

  useEffect(() => {
    if (pageOutOfRange) setPage(totalPages, { replace: true });
  }, [pageOutOfRange, totalPages, setPage]);

  const changeCategory = (next) => {
    if (next === category) return;
    updateFilters({ [CATEGORY_PARAM]: next });
  };

  const changePage = (next) => {
    if (next === page) return;
    setPage(next);
  };

  return {
    query,
    setQuery,
    category,
    changeCategory,
    page,
    totalPages,
    changePage,
    cards,
    loading: listingsLoading || pageOutOfRange,
    error: listingsError,
    retry: loadListings,
  };
};
