import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboardStats, clearAdminError } from "@/features/dash/admin/dashboard";
import { fetchAdminStatistics, clearStatisticsError } from "@/features/dash/admin/statistics";
import { buildSeries, filterChartData, yearOptions } from "../utils/chartData";
import { PERIOD, REVENUE_LINES, USER_GROWTH_LINES } from "../constant/constants";

/** KPI stats and the user-growth / revenue charts for a chosen year, each with its own period. */
export const useAdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading, statsError } = useSelector((state) => state.adminDashboard);
  const { statistics, statisticsLoading, statisticsError } = useSelector(
    (state) => state.adminStatistics,
  );

  const years = useMemo(() => yearOptions(), []);
  const [chartYear, setChartYear] = useState(years[0]);
  const [userPeriod, setUserPeriod] = useState(PERIOD.YEAR);
  const [revenuePeriod, setRevenuePeriod] = useState(PERIOD.YEAR);

  const loadCharts = useCallback(
    () => dispatch(fetchAdminStatistics(Number(chartYear))),
    [dispatch, chartYear],
  );

  const loadDashboard = useCallback(() => {
    dispatch(clearAdminError());
    dispatch(clearStatisticsError());
    dispatch(fetchAdminDashboardStats());
    loadCharts();
  }, [dispatch, loadCharts]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const userGrowthSeries = useMemo(() => buildSeries(statistics, USER_GROWTH_LINES), [statistics]);
  const revenueSeries = useMemo(() => buildSeries(statistics, REVENUE_LINES), [statistics]);
  const labels = statistics?.labels || [];

  return {
    years,
    chartYear,
    setChartYear,
    stats,
    statsLoading: loading,
    statsError,
    hasStats: Array.isArray(stats) && stats.length > 0,
    retryStats: loadDashboard,
    chartsLoading: statisticsLoading,
    chartsError: statisticsError,
    hasCharts: labels.length > 0 && (userGrowthSeries.length > 0 || revenueSeries.length > 0),
    retryCharts: loadCharts,
    userGrowth: filterChartData(labels, userGrowthSeries, userPeriod),
    userPeriod,
    setUserPeriod,
    revenue: filterChartData(labels, revenueSeries, revenuePeriod),
    revenuePeriod,
    setRevenuePeriod,
  };
};
