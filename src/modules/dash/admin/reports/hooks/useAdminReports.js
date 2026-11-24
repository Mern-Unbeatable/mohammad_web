import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-hot-toast";
import {
  fetchReportStats,
  fetchReportsList,
  statusLabelToApi,
  toReportRowModel,
  toStatCards,
  updateReportStatus,
} from "@/features/dash/admin/reports";
import { buildReportsQuery, getReportRowActions } from "../utils/reports";
import {
  DEFAULT_STATUS_FILTER,
  SEARCH_DEBOUNCE_MS,
  reportDetailPath,
} from "../constant/constants";

/** Reports list: stats, debounced search, status filter, paging and status row actions. */
export const useAdminReports = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { reports, reportsMeta, stats, reportsLoading, statsLoading, error } = useSelector(
    (state) => state.adminReports,
  );

  const [statusFilter, setStatusFilter] = useState(DEFAULT_STATUS_FILTER);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (search === debouncedSearch) return;
      setDebouncedSearch(search);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search, debouncedSearch]);

  useEffect(() => {
    dispatch(fetchReportStats());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchReportsList(buildReportsQuery({ page, statusFilter, search: debouncedSearch })));
  }, [dispatch, page, statusFilter, debouncedSearch]);

  const rows = useMemo(() => (reports || []).map(toReportRowModel).filter(Boolean), [reports]);
  const statCards = useMemo(() => toStatCards(stats), [stats]);

  const changeStatusFilter = (value) => {
    setStatusFilter(value);
    setPage(1);
  };

  const setReportStatus = async (reportId, label) => {
    const apiStatus = statusLabelToApi(label);
    if (!apiStatus) return;
    const result = await dispatch(updateReportStatus({ reportId, status: apiStatus }));
    if (updateReportStatus.fulfilled.match(result)) {
      toast.success(`Status set to ${label}`);
      dispatch(fetchReportStats());
      return;
    }
    toast.error(result.payload || "Failed to update status");
  };

  const rowActions = (row) =>
    getReportRowActions(row, {
      onDetails: (id) => navigate(reportDetailPath(id)),
      onStatus: setReportStatus,
    });

  return {
    error,
    statCards,
    statsLoading: statsLoading && !statCards.length,
    rows,
    loading: reportsLoading,
    search,
    changeSearch: setSearch,
    statusFilter,
    changeStatusFilter,
    rowActions,
    page: reportsMeta?.page || page,
    total: reportsMeta?.total || 0,
    changePage: setPage,
  };
};
