import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchListings, clearMarketplaceError } from '@/features/dash/user/marketplace';
import { buildSavedQuery } from '../utils/listingQueries';
import { useListingsState } from './useListingsState';
import { useLocalListingFilters } from './useLocalListingFilters';
import { useToggleSaveListing } from './useToggleSaveListing';

export const useSavedListings = () => {
  const dispatch = useDispatch();
  const filters = useLocalListingFilters();
  const { debouncedQuery, category } = filters;
  const { cards, listingsLoading } = useListingsState();
  const toggleSave = useToggleSaveListing();

  const loadSaved = useCallback(
    () => dispatch(fetchListings(buildSavedQuery({ query: debouncedQuery, category }))),
    [dispatch, debouncedQuery, category],
  );

  useEffect(() => {
    dispatch(clearMarketplaceError());
    loadSaved();
  }, [dispatch, loadSaved]);

  const unsave = async (id) => {
    if (await toggleSave(id)) loadSaved();
  };

  return { ...filters, cards, loading: listingsLoading, unsave };
};
