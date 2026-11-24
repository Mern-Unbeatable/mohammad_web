import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdDetails,
  clearSelectedAd,
  toAdDetailModel,
} from "@/features/dash/admin/advertisements";
import { useAdReview } from "./useAdReview";
import { AD_STATUS, DEFAULT_LOAD_ERROR } from "../constant/constants";

/**
 * Loads an ad by id → `{ status: "loading" | "error" | "ready", ad, errorMessage }`,
 * plus review and the reject modal.
 */
export const useAdminAdDetail = (adId) => {
  const dispatch = useDispatch();
  const selectedAd = useSelector((state) => state.adminAds.selectedAd);
  const { busy, review } = useAdReview();
  const [rejectOpen, setRejectOpen] = useState(false);
  /** Error for the id whose fetch was rejected; ignored for any other id. */
  const [loadError, setLoadError] = useState({ id: null, message: "" });

  useEffect(() => {
    if (!adId) return undefined;
    let cancelled = false;
    dispatch(fetchAdDetails(adId)).then((result) => {
      if (!cancelled && fetchAdDetails.rejected.match(result)) {
        setLoadError({ id: adId, message: result.payload || DEFAULT_LOAD_ERROR });
      }
    });
    return () => {
      cancelled = true;
      dispatch(clearSelectedAd());
    };
  }, [dispatch, adId]);

  const ad = useMemo(
    () => (selectedAd?.id === adId ? toAdDetailModel(selectedAd) : null),
    [selectedAd, adId],
  );

  let status = "ready";
  if (!ad) status = loadError.id === adId ? "error" : "loading";

  return {
    status,
    ad,
    errorMessage: loadError.message,
    busy,
    review: (label, reason) => review(adId, label, reason),
    rejectOpen,
    openReject: () => setRejectOpen(true),
    closeReject: () => setRejectOpen(false),
    confirmReject: (reason) => review(adId, AD_STATUS.REJECTED, reason),
  };
};
