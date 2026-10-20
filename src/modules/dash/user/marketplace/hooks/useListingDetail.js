import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { toast } from 'react-hot-toast';
import {
  fetchListingDetails,
  clearMarketplaceError,
  clearSelectedListing,
  toListingDetailModel,
} from '@/features/dash/user/marketplace';
import { useAuth } from '@/modules/auth';
import { CHAT_BASE_PATHS } from '@/features/messages/chatPaths';
import { useStartConversation } from '@/modules/messages';
import { listingGalleryImages, listingViewerState } from '../utils/listingDetail';
import { useToggleSaveListing } from './useToggleSaveListing';

export const useListingDetail = () => {
  const { listingId } = useParams();
  const dispatch = useDispatch();
  const startConversation = useStartConversation(CHAT_BASE_PATHS.USER);
  const toggleSave = useToggleSaveListing();
  const { user } = useAuth();
  const { selectedListing, selectedListingLoading, error } = useSelector(
    (state) => state.userMarketplace,
  );

  // The gallery index belongs to one listing; a new listing starts at the first image.
  const imageKey = `${listingId}:${selectedListing?.id}`;
  const [gallery, setGallery] = useState({ key: imageKey, index: 0 });
  const activeImage = gallery.key === imageKey ? gallery.index : 0;
  const setActiveImage = useCallback(
    (index) => setGallery({ key: imageKey, index }),
    [imageKey],
  );

  /** Listing id the Contact seller dialog is open for. */
  const [contactListingId, setContactListingId] = useState(null);
  const closeContact = useCallback(() => setContactListingId(null), []);

  useEffect(() => {
    dispatch(clearMarketplaceError());
    dispatch(clearSelectedListing());
    if (listingId) dispatch(fetchListingDetails(listingId));
    return () => {
      dispatch(clearSelectedListing());
    };
  }, [dispatch, listingId]);

  useEffect(() => {
    if (error && !selectedListingLoading) toast.error(error);
  }, [error, selectedListingLoading]);

  const listing = selectedListing ? toListingDetailModel(selectedListing) : null;
  const viewer = listing ? listingViewerState(listing, user?.id) : null;

  return {
    loading: selectedListingLoading && !selectedListing,
    listing,
    viewer,
    images: listing ? listingGalleryImages(listing) : [],
    saved: Boolean(listing?.isSaved),
    toggleSave: () => toggleSave(listing.id),
    activeImage,
    setActiveImage,
    contactOpen: Boolean(listing) && contactListingId === listing.id && viewer.canContact,
    openContact: () => setContactListingId(listing.id),
    closeContact,
    sendMessage: (message) =>
      startConversation({ recipientId: viewer.sellerId, message, listingId: listing.id }),
  };
};
