import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useAuth } from "@/modules/auth";
import { CHAT_BASE_PATHS } from "@/features/messages/chatPaths";
import { useStartConversation } from "@/modules/messages";
import {
  clearSelectedListing,
  fetchListingDetails,
  toListingCardModel,
} from "@/features/dash/admin/marketplace";
import { canContactSeller } from "../utils/listings";

/** Loads the listing from the route (cleared on leave) and the contact-seller modal. */
export const useAdminListingDetail = () => {
  const { listingId } = useParams();
  const dispatch = useDispatch();
  const { user } = useAuth();
  const startConversation = useStartConversation(CHAT_BASE_PATHS.ADMIN);
  const [contactListingId, setContactListingId] = useState(null);
  const closeContact = useCallback(() => setContactListingId(null), []);

  const { selectedListing, selectedListingLoading, error } = useSelector(
    (state) => state.adminMarketplace,
  );

  useEffect(() => {
    if (listingId) dispatch(fetchListingDetails(listingId));
    return () => {
      dispatch(clearSelectedListing());
    };
  }, [dispatch, listingId]);

  const listing = useMemo(() => toListingCardModel(selectedListing), [selectedListing]);
  const canContact = listing ? canContactSeller(listing, user?.id) : false;

  const sendMessage = (message) =>
    startConversation({
      recipientId: listing.seller.id,
      message,
      listingId: listing.id,
    });

  return {
    loading: selectedListingLoading,
    notFound: (error && !selectedListing) || !listing,
    listing,
    rawListing: selectedListing,
    canContact,
    contactOpen: canContact && contactListingId === listing?.id,
    openContact: () => setContactListingId(listing.id),
    closeContact,
    sendMessage,
  };
};
