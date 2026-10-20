import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'react-hot-toast';
import { toChatListingModel } from '@/features/messages';
import { marketplaceApi } from '@/features/dash/user/marketplace';
import { CHAT_LISTING_PARAM, CHAT_SECTIONS } from '@/features/messages/chatPaths';
import { LISTING_UNAVAILABLE_MESSAGE } from '../constant/constants';
import { isListingUnavailable } from '../utils/chatListing';

/**
 * `?listing=<id>` on a direct chat preloads that marketplace listing into the
 * composer. `pendingListing` is `{ id, loading: true }` until it arrives;
 * unavailable listings are toasted and the param is dropped.
 */
export function useListingDraft({ section, targetId, currentUserId }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const listingParam =
    section === CHAT_SECTIONS.DIRECT && targetId ? searchParams.get(CHAT_LISTING_PARAM) : null;
  /** `{ id, listing }` from the marketplace API for `listingParam`. */
  const [loadedListing, setLoadedListing] = useState(null);

  const dropListingParam = useCallback(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete(CHAT_LISTING_PARAM);
        return next;
      },
      { replace: true },
    );
  }, [setSearchParams]);

  useEffect(() => {
    if (!listingParam) return undefined;
    let cancelled = false;
    marketplaceApi
      .getListingById(listingParam)
      .then((listing) => {
        if (cancelled) return;
        if (isListingUnavailable(listing, currentUserId)) {
          toast.error(LISTING_UNAVAILABLE_MESSAGE);
          dropListingParam();
          return;
        }
        setLoadedListing({ id: listingParam, listing });
      })
      .catch((err) => {
        if (cancelled) return;
        toast.error(marketplaceApi.getApiErrorMessage(err, LISTING_UNAVAILABLE_MESSAGE));
        dropListingParam();
      });
    return () => {
      cancelled = true;
    };
  }, [listingParam, currentUserId, dropListingParam]);

  const pendingListing = useMemo(() => {
    if (!listingParam) return null;
    if (loadedListing?.id !== listingParam) return { id: listingParam, loading: true };
    return toChatListingModel(loadedListing.listing);
  }, [listingParam, loadedListing]);

  return { pendingListing, dropListingParam };
}
