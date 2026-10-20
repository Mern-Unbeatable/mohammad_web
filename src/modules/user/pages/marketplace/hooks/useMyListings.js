import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { fetchListings, removeListing, clearMarketplaceError } from '@/features/user/marketplace';
import { buildMineQuery } from '../utils/listingQueries';
import { editListingPath } from '../constant/constants';
import { useListingsState } from './useListingsState';
import { useLocalListingFilters } from './useLocalListingFilters';

export const useMyListings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filters = useLocalListingFilters();
  const { debouncedQuery, category } = filters;
  const { cards, listingsLoading, deleting } = useListingsState();
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    dispatch(clearMarketplaceError());
    dispatch(fetchListings(buildMineQuery({ query: debouncedQuery, category })));
  }, [dispatch, debouncedQuery, category]);

  const editListing = (id) => {
    if (!id) return;
    navigate(editListingPath(id));
  };

  const requestDelete = (id) => {
    if (deleting) return;
    const listing = cards.find((item) => item.id === id);
    if (!listing) return;
    setPendingDelete(listing);
  };

  const cancelDelete = () => {
    if (deleting) return;
    setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;

    const result = await dispatch(removeListing(pendingDelete.id));
    if (removeListing.fulfilled.match(result)) {
      toast.success('Listing removed');
      setPendingDelete(null);
      return;
    }
    toast.error(result.payload || 'Failed to delete listing');
  };

  return {
    ...filters,
    cards,
    loading: listingsLoading,
    deleting,
    editListing,
    pendingDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
};
