import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "react-hot-toast";
import {
  fetchSupplierAds,
  clearSupplierAdsError,
  removeSupplierAd,
  cancelSupplierAd,
  confirmSupplierAdCheckout,
  toAdRowModel,
  adsApi,
} from "@/features/dash/supplier/advertisements";
import { buildAdsQuery } from "../utils/adsQuery";
import { getAdRowActions } from "../utils/adRowActions";
import {
  DEFAULT_STATUS_FILTER,
  SEARCH_DEBOUNCE_MS,
  adDetailPath,
} from "../constant/constants";

/** My ads list: search (debounced), status filter, paging, row actions and the create / resubmit modal. */
export const useSupplierAds = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { ads, adsMeta, adsLoading, error } = useSelector(
    (state) => state.supplierAds,
  );
  const checkoutHandled = useRef(false);

  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS_FILTER);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [resubmitAdId, setResubmitAdId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search === debouncedSearch) return;
      setDebouncedSearch(search);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search, debouncedSearch]);

  useEffect(() => {
    dispatch(clearSupplierAdsError());
    dispatch(
      fetchSupplierAds(
        buildAdsQuery({ page, statusFilter, search: debouncedSearch }),
      ),
    );
  }, [dispatch, page, statusFilter, debouncedSearch]);

  const rows = useMemo(
    () => (ads || []).map(toAdRowModel).filter(Boolean),
    [ads],
  );

  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const changeStatus = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const openCreate = (adId = null) => {
    setResubmitAdId(adId);
    setCreateOpen(true);
  };

  const closeCreate = () => {
    setCreateOpen(false);
    setResubmitAdId(null);
  };

  const handleCreated = () => {
    setPage(1);
    dispatch(
      fetchSupplierAds(
        buildAdsQuery({ page: 1, statusFilter, search: debouncedSearch }),
      ),
    );
  };

  const refresh = () => {
    dispatch(
      fetchSupplierAds(
        buildAdsQuery({ page: 1, statusFilter, search: debouncedSearch }),
      ),
    );
  };

  // Handle Stripe Checkout return once (?checkout=success|cancelled&ad=&session_id=).
  useEffect(() => {
    if (checkoutHandled.current) return;

    const checkout = searchParams.get("checkout");
    if (!checkout) return;

    checkoutHandled.current = true;
    const adId = searchParams.get("ad");
    const sessionId = searchParams.get("session_id");

    const next = new URLSearchParams(searchParams);
    ["checkout", "ad", "session_id"].forEach((k) => next.delete(k));
    setSearchParams(next, { replace: true });

    if (checkout === "success" && adId && sessionId) {
      dispatch(confirmSupplierAdCheckout({ adId, sessionId }))
        .unwrap()
        .then(() => {
          toast.success("Payment received — your Ads is pending review.");
          refresh();
        })
        .catch((message) => {
          toast.error(
            typeof message === "string"
              ? message
              : "We couldn't confirm your payment. Please check your advertisement status.",
          );
        });
    } else if (checkout === "cancelled") {
      toast.error("Payment cancelled. Your Ads is saved and unpaid.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handlePayNow = async (adId) => {
    try {
      const checkout = await adsApi.startAdCheckout(adId);
      if (checkout?.checkoutUrl) {
        window.location.assign(checkout.checkoutUrl);
        return;
      }
      toast.error("Could not start payment. Please try again.");
    } catch (err) {
      toast.error(adsApi.getApiErrorMessage(err, "Could not start payment"));
    }
  };

  const handleCancel = async (adId) => {
    const result = await dispatch(cancelSupplierAd(adId));
    if (cancelSupplierAd.fulfilled.match(result)) {
      toast.success("Advertisement cancelled.");
      refresh();
    }
  };

  const handleDelete = async (adId) => {
    const result = await dispatch(removeSupplierAd(adId));
    if (removeSupplierAd.fulfilled.match(result)) {
      toast.success("Advertisement deleted.");
    }
  };

  const rowActions = (row) =>
    getAdRowActions(row, {
      onDetails: (id) => navigate(adDetailPath(id)),
      onResubmit: (id) => openCreate(id),
      onRenew: () => openCreate(null),
      onPay: handlePayNow,
      onCancel: handleCancel,
      onDelete: handleDelete,
    });

  const resubmitAd = resubmitAdId
    ? (ads || []).find((ad) => ad.id === resubmitAdId) || null
    : null;

  return {
    rows,
    loading: adsLoading,
    error,
    total: adsMeta?.total || 0,
    summary: adsMeta?.summary || {
      total: 0,
      active: 0,
      pending: 0,
      expired: 0,
    },
    page: adsMeta?.page || page,
    changePage: setPage,
    search,
    changeSearch,
    statusFilter,
    changeStatus,
    rowActions,
    createOpen,
    resubmitAdId,
    resubmitAd,
    openCreate,
    closeCreate,
    handleCreated,
  };
};
