import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboardStats, clearAdminError } from "@/features/dash/admin/dashboard";
import { fetchAdminStatistics, clearStatisticsError } from "@/features/dash/admin/statistics";
import { filterChartData, yearOptions } from "@/modules/dash/admin/dashboard";
import { buildCharts, initialPeriods } from "../utils/charts";

/** KPI stats plus six charts for a chosen year, each with its own period. */
export const useAdminStatistics = () => {
  const dispatch = useDispatch();
  const { stats, loading, statsError } = useSelector((state) => state.adminDashboard);
  const { statistics, statisticsLoading, statisticsError } = useSelector(
    (state) => state.adminStatistics,
  );

  const years = useMemo(() => yearOptions(), []);
  const [chartYear, setChartYear] = useState(years[0]);
  const [periods, setPeriods] = useState(initialPeriods);

  const loadCharts = useCallback(
    () => dispatch(fetchAdminStatistics(Number(chartYear))),
    [dispatch, chartYear],
  );

  const loadAll = useCallback(() => {
    dispatch(clearAdminError());
    dispatch(clearStatisticsError());
    dispatch(fetchAdminDashboardStats());
    loadCharts();
  }, [dispatch, loadCharts]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const charts = useMemo(() => {
    const labels = statistics?.labels || [];
    return buildCharts(statistics).map((chart) => ({
      ...chart,
      period: periods[chart.id],
      ...filterChartData(labels, chart.series, periods[chart.id]),
    }));
  }, [statistics, periods]);

  const setPeriod = (chartId, value) => setPeriods((prev) => ({ ...prev, [chartId]: value }));

  return {
    years,
    chartYear,
    setChartYear,
    stats,
    statsLoading: loading,
    statsError,
    hasStats: Boolean(stats?.length),
    retryStats: loadAll,
    chartsLoading: statisticsLoading,
    chartsError: statisticsError,
    retryCharts: loadCharts,
    charts,
    setPeriod,
  };
};
