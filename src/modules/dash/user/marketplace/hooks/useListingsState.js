import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-hot-toast';
import { toListingCardModel } from '@/features/dash/user/marketplace';

/** Marketplace list state with listings mapped to card models; toasts store errors. */
export const useListingsState = () => {
  const { listings, listingsMeta, listingsLoading, listingsError, deleting, error } =
    useSelector((state) => state.userMarketplace);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const cards = useMemo(
    () => (listings || []).map(toListingCardModel).filter(Boolean),
    [listings],
  );

  return { cards, listingsMeta, listingsLoading, listingsError, deleting };
};
