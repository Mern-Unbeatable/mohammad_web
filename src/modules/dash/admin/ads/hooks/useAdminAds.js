import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { fetchAdsList, toAdRowModel } from "@/features/dash/admin/advertisements";
import { buildAdsQuery } from "../utils/adsQuery";
import { getAdRowActions } from "../utils/adRowActions";
import { useAdReview } from "./useAdReview";
import {
  AD_STATUS,
  DEFAULT_STATUS_FILTER,
  SEARCH_DEBOUNCE_MS,
  adDetailPath,
} from "../constant/constants";

/** Ads list: debounced search, status filter, paging, row actions and the reject modal. */
export const useAdminAds = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ads, adsMeta, adsLoading, error } = useSelector((state) => state.adminAds);
  const { busy, review } = useAdReview();

  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS_FILTER);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [rejectTarget, setRejectTarget] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search === debouncedSearch) return;
      setDebouncedSearch(search);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search, debouncedSearch]);

  useEffect(() => {
    dispatch(fetchAdsList(buildAdsQuery({ page, statusFilter, search: debouncedSearch })));
  }, [dispatch, page, statusFilter, debouncedSearch]);

  const rows = useMemo(() => (ads || []).map(toAdRowModel).filter(Boolean), [ads]);

  const changeStatus = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const rowActions = (row) =>
    getAdRowActions(row, {
      busy,
      onDetails: (id) => navigate(adDetailPath(id)),
      onReview: review,
      onReject: setRejectTarget,
    });

  return {
    rows,
    loading: adsLoading,
    error,
    page: adsMeta?.page || page,
    total: adsMeta?.total || 0,
    changePage: setPage,
    search,
    changeSearch: setSearch,
    statusFilter,
    changeStatus,
    rowActions,
    rejectTarget,
    closeReject: () => setRejectTarget(null),
    confirmReject: (reason) => {
      if (rejectTarget) review(rejectTarget.id, AD_STATUS.REJECTED, reason);
    },
  };
};
