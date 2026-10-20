import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchSupplierAdDetails,
  clearSelectedSupplierAd,
  clearSupplierAdsError,
  toAdDetailModel,
} from "@/features/dash/supplier/advertisements";

/**
 * Loads one ad by id. `status` is "loading", "notFound" (fetch rejected or the
 * record can't be mapped) or "ready" with `ad` as the detail model.
 */
export const useSupplierAdDetail = (adId) => {
  const dispatch = useDispatch();
  const { selectedAd, selectedAdLoading, error } = useSelector((state) => state.supplierAds);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!adId) return undefined;
    dispatch(clearSupplierAdsError());
    dispatch(fetchSupplierAdDetails(adId)).then((result) => {
      if (fetchSupplierAdDetails.rejected.match(result)) setNotFound(true);
    });
    return () => {
      dispatch(clearSelectedSupplierAd());
    };
  }, [dispatch, adId]);

  useEffect(() => {
    if (error && !selectedAdLoading) toast.error(error);
  }, [error, selectedAdLoading]);

  if (notFound) return { status: "notFound", ad: null };
  if (selectedAdLoading || (!selectedAd && !error)) return { status: "loading", ad: null };

  const ad = toAdDetailModel(selectedAd);
  return ad ? { status: "ready", ad } : { status: "notFound", ad: null };
};
