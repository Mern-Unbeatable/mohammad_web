import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchListingsList,
  removeListing,
  toListingCardModel,
} from "@/features/dash/admin/marketplace";
import { buildListingsQuery } from "../utils/listings";
import { DEFAULT_CATEGORY } from "../constant/constants";

/** Listing grid: category filter, paging and the delete flow. */
export const useAdminListings = () => {
  const dispatch = useDispatch();
  const { listings, listingsMeta, listingsLoading, deleting, error } = useSelector(
    (state) => state.adminMarketplace,
  );

  const [category, setCategory] = useState(DEFAULT_CATEGORY);
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchListingsList(buildListingsQuery({ page, category })));
  }, [dispatch, page, category]);

  const items = useMemo(
    () => (listings || []).map(toListingCardModel).filter(Boolean),
    [listings],
  );

  const changeCategory = (next) => {
    setCategory(next);
    setPage(1);
  };

  const requestDelete = (listingId) => {
    if (deleting) return;
    const listing = items.find((item) => item.id === listingId);
    if (listing) setPendingDelete(listing);
  };

  const cancelDelete = () => {
    if (!deleting) setPendingDelete(null);
  };

  const confirmDelete = async () => {
    if (!pendingDelete?.id || deleting) return;
    const result = await dispatch(removeListing(pendingDelete.id));
    if (removeListing.fulfilled.match(result)) {
      toast.success("Listing deleted");
      setPendingDelete(null);
      return;
    }
    toast.error(result.payload || "Failed to delete listing");
  };

  return {
    items,
    loading: listingsLoading && !items.length,
    error,
    category,
    changeCategory,
    page: listingsMeta?.page || page,
    totalPages: listingsMeta?.totalPages || 1,
    changePage: setPage,
    deleting,
    pendingDelete,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
};
