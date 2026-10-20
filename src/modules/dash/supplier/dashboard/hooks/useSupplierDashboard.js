import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchSupplierDashboard, clearSupplierDashError } from "@/features/dash/supplier/dashboard";
import { useAuth } from "@/modules/auth";
import { adDetailPath } from "@/modules/dash/supplier/ads";
import { chartYearOptions, displayNameOf } from "../utils/dashboardUtils";

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = chartYearOptions(currentYear);

/** Dashboard data for the chosen chart year, plus the create-ad modal state. */
export const useSupplierDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { stats, chart, recentAds, notifications, loading, error } = useSelector(
    (state) => state.supplierDashboard,
  );

  const [chartYear, setChartYear] = useState(String(currentYear));
  const [createOpen, setCreateOpen] = useState(false);

  const load = useCallback(() => {
    dispatch(clearSupplierDashError());
    dispatch(fetchSupplierDashboard(Number(chartYear)));
  }, [dispatch, chartYear]);

  useEffect(() => {
    load();
  }, [load]);

  const adRowActions = (row) => [
    { id: "details", label: "See Details", onClick: () => navigate(adDetailPath(row.id)) },
  ];

  return {
    displayName: displayNameOf(user),
    error,
    retry: load,
    stats,
    statsLoading: loading && !stats.length,
    chart,
    chartLoading: loading && !stats.length,
    chartYear,
    yearOptions: YEAR_OPTIONS,
    changeYear: setChartYear,
    recentAds,
    adsLoading: loading && !recentAds.length,
    adRowActions,
    notifications,
    notificationsLoading: loading && !notifications.length,
    createOpen,
    openCreate: () => setCreateOpen(true),
    closeCreate: () => setCreateOpen(false),
  };
};
