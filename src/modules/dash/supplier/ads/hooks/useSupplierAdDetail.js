import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  fetchSupplierAdDetails,
  clearSelectedSupplierAd,
  clearSupplierAdsError,
  cancelSupplierAd,
  removeSupplierAd,
  toAdDetailModel,
  adsApi,
} from "@/features/dash/supplier/advertisements";
import { ADS_PATH } from "../constant/constants";

/**
 * Loads one ad by id and exposes supplier manage actions for the detail sidebar.
 * `status` is "loading", "notFound", or "ready".
 */
export const useSupplierAdDetail = (adId) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedAd, selectedAdLoading, saving, deleting, error } = useSelector(
    (state) => state.supplierAds,
  );
  const [notFound, setNotFound] = useState(false);
  const [paying, setPaying] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [resubmitMode, setResubmitMode] = useState(false);

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

  const refresh = () => {
    if (adId) dispatch(fetchSupplierAdDetails(adId));
  };

  const handlePay = async () => {
    if (!adId) return;
    setPaying(true);
    try {
      const checkout = await adsApi.startAdCheckout(adId);
      if (checkout?.checkoutUrl) {
        window.location.assign(checkout.checkoutUrl);
        return;
      }
      toast.error("Could not start payment. Please try again.");
    } catch (err) {
      toast.error(adsApi.getApiErrorMessage(err, "Could not start payment"));
    } finally {
      setPaying(false);
    }
  };

  const handleCancel = async () => {
    const result = await dispatch(cancelSupplierAd(adId));
    if (cancelSupplierAd.fulfilled.match(result)) {
      toast.success("Advertisement cancelled.");
      refresh();
    }
  };

  const handleDelete = async () => {
    const result = await dispatch(removeSupplierAd(adId));
    if (removeSupplierAd.fulfilled.match(result)) {
      toast.success("Advertisement deleted.");
      navigate(ADS_PATH, { replace: true });
    }
  };

  const openResubmit = () => {
    setResubmitMode(true);
    setCreateOpen(true);
  };

  const openRenew = () => {
    setResubmitMode(false);
    setCreateOpen(true);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    setResubmitMode(false);
  };

  const handleCreated = () => {
    const wasResubmit = resubmitMode;
    closeCreate();
    if (wasResubmit) refresh();
    else navigate(ADS_PATH);
  };

  const runAction = (actionId) => {
    if (actionId === "pay") return handlePay();
    if (actionId === "cancel") return handleCancel();
    if (actionId === "delete") return handleDelete();
    if (actionId === "resubmit") return openResubmit();
    if (actionId === "renew") return openRenew();
    return undefined;
  };

  if (notFound) {
    return {
      status: "notFound",
      ad: null,
      busy: false,
      runAction,
      createOpen: false,
      resubmitAdId: null,
      resubmitAd: null,
      closeCreate,
      handleCreated,
    };
  }

  if (selectedAdLoading || (!selectedAd && !error)) {
    return {
      status: "loading",
      ad: null,
      busy: false,
      runAction,
      createOpen: false,
      resubmitAdId: null,
      resubmitAd: null,
      closeCreate,
      handleCreated,
    };
  }

  const ad = toAdDetailModel(selectedAd);
  if (!ad) {
    return {
      status: "notFound",
      ad: null,
      busy: false,
      runAction,
      createOpen: false,
      resubmitAdId: null,
      resubmitAd: null,
      closeCreate,
      handleCreated,
    };
  }

  return {
    status: "ready",
    ad,
    busy: saving || deleting || paying,
    runAction,
    createOpen,
    resubmitAdId: resubmitMode ? adId : null,
    resubmitAd: resubmitMode ? selectedAd : null,
    closeCreate,
    handleCreated,
  };
};
