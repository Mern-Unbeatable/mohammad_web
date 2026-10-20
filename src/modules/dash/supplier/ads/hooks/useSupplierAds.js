import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  fetchSupplierAds,
  clearSupplierAdsError,
  toAdRowModel,
} from "@/features/dash/supplier/advertisements";
import { buildAdsQuery } from "../utils/adsQuery";
import { getAdRowActions } from "../utils/adRowActions";
import {
  DEFAULT_SORT,
  DEFAULT_STATUS_FILTER,
  SEARCH_DEBOUNCE_MS,
  adDetailPath,
} from "../constant/constants";

/** My ads list: search (debounced), status / sort filters, paging, row actions and the create / resubmit modal. */
export const useSupplierAds = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ads, adsMeta, adsLoading, error } = useSelector((state) => state.supplierAds);

  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS_FILTER);
  const [sortFilter, setSortFilter] = useState(DEFAULT_SORT);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [resubmitAdId, setResubmitAdId] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(clearSupplierAdsError());
    dispatch(
      fetchSupplierAds(
        buildAdsQuery({ page, statusFilter, sortFilter, search: debouncedSearch }),
      ),
    );
  }, [dispatch, page, statusFilter, sortFilter, debouncedSearch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const rows = useMemo(() => (ads || []).map(toAdRowModel).filter(Boolean), [ads]);

  const changeSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const changeStatus = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const changeSort = (value) => {
    setSortFilter(value);
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
        buildAdsQuery({ page: 1, statusFilter, sortFilter, search: debouncedSearch }),
      ),
    );
  };

  const rowActions = (row) =>
    getAdRowActions(row, {
      onDetails: (id) => navigate(adDetailPath(id)),
      onResubmit: (id) => openCreate(id),
      onRenew: () => openCreate(null),
    });

  const resubmitAd = resubmitAdId
    ? (ads || []).find((ad) => ad.id === resubmitAdId) || null
    : null;

  return {
    rows,
    loading: adsLoading,
    total: adsMeta?.total || 0,
    page,
    changePage: setPage,
    search,
    changeSearch,
    statusFilter,
    changeStatus,
    sortFilter,
    changeSort,
    rowActions,
    createOpen,
    resubmitAdId,
    resubmitAd,
    openCreate,
    closeCreate,
    handleCreated,
  };
};
