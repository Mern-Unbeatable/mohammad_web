import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RefreshCw } from "lucide-react";
import StatCard from "@/components/data-display/StatCard/StatCard";
import LineChartCard from "@/components/data-display/LineChartCard/LineChartCard";
import {
  CardSkeleton,
  LineChartCardSkeleton,
} from "@/components/common/Skeleton";
import PanelPage from "@/shared/layout/PanelLayout/PanelPage";
import PanelPageHeader from "@/shared/layout/PanelLayout/PanelPageHeader";
import {
  fetchAdminDashboardStats,
  clearAdminError,
} from "@/features/admin/dashboard";
import {
  fetchAdminStatistics,
  clearStatisticsError,
} from "@/features/admin/statistics";

const PERIOD_OPTIONS = [
  "This year",
  "This month",
  "Last 3 months",
  "Last 6 months",
];
const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = [currentYear, currentYear - 1, currentYear - 2].map(
  String,
);

const filterChartData = (
  rawLabels = [],
  rawSeries = [],
  selectedPeriod = "This year",
) => {
  if (!rawLabels.length) return { labels: [], series: rawSeries };

  const currentMonthIdx = new Date().getMonth();
  let startIndex = 0;
  let endIndex = rawLabels.length;

  if (selectedPeriod === "This month") {
    startIndex = currentMonthIdx;
    endIndex = currentMonthIdx + 1;
  } else if (selectedPeriod === "Last 3 months") {
    startIndex = Math.max(0, currentMonthIdx - 2);
    endIndex = currentMonthIdx + 1;
  } else if (selectedPeriod === "Last 6 months") {
    startIndex = Math.max(0, currentMonthIdx - 5);
    endIndex = currentMonthIdx + 1;
  }

  return {
    labels: rawLabels.slice(startIndex, endIndex),
    series: rawSeries.map((s) => ({
      ...s,
      values: (s.values || []).slice(startIndex, endIndex),
    })),
  };
};

const EmptyState = ({ message }) => (
  <div className="rounded-xl border border-dashed border-[#D0D5DD] bg-white px-6 py-10 text-center">
    <p className="text-[14px] text-[#64748B]">{message}</p>
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center gap-3 rounded-xl border border-[#FEE4E2] bg-[#FFFBFA] px-6 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
    <p className="text-[14px] font-medium text-[#B42318]">{message}</p>
    {onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    ) : null}
  </div>
);

/**
 * Statistics & Reports — full analytics view (ADMIN_REPORT §7.10).
 * Uses existing GET /admin/dashboard + GET /admin/statistics?year=
 */
const AdminStatisticsView = () => {
  const dispatch = useDispatch();
  const { stats, loading, statsError } = useSelector(
    (state) => state.adminDashboard,
  );
  const { statistics, statisticsLoading, statisticsError } = useSelector(
    (state) => state.adminStatistics,
  );

  const [chartYear, setChartYear] = useState(String(currentYear));
  const [periods, setPeriods] = useState({
    userGrowth: "This year",
    revenue: "This year",
    newUsers: "This year",
    subscribers: "This year",
    monthlyRev: "This year",
    yearlyRev: "This year",
  });

  const setPeriod = (key, value) => {
    setPeriods((prev) => ({ ...prev, [key]: value }));
  };

  const load = () => {
    dispatch(clearAdminError());
    dispatch(clearStatisticsError());
    dispatch(fetchAdminDashboardStats());
    dispatch(fetchAdminStatistics(Number(chartYear)));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, chartYear]);

  const labels = statistics?.labels || [];
  const series = statistics?.series || {};

  const charts = useMemo(() => {
    if (!labels.length) return [];
    return [
      {
        key: "userGrowth",
        title: "User Growth",
        series: [
          {
            id: "newUsers",
            label: "New Users",
            color: "#F97316",
            values: series.newUsers || [],
          },
          {
            id: "newSubscribers",
            label: "Subscribers",
            color: "#EC4899",
            values: series.newSubscribers || [],
          },
        ],
      },
      {
        key: "revenue",
        title: "Revenue",
        series: [
          {
            id: "monthlyRevenue",
            label: "Monthly Revenue (€)",
            color: "#10B981",
            values: series.monthlyRevenue || [],
          },
          {
            id: "yearlyRevenue",
            label: "Yearly Revenue (€)",
            color: "#3B82F6",
            values: series.yearlyRevenue || [],
          },
        ],
      },
      {
        key: "newUsers",
        title: "New Users",
        series: [
          {
            id: "newUsersOnly",
            label: "New Users",
            color: "#F97316",
            values: series.newUsers || [],
          },
        ],
      },
      {
        key: "monthlyRev",
        title: "Monthly Subscription Revenue",
        series: [
          {
            id: "monthlyOnly",
            label: "Monthly (€)",
            color: "#10B981",
            values: series.monthlyRevenue || [],
          },
        ],
      },
      {
        key: "subscribers",
        title: "New Subscribers",
        series: [
          {
            id: "subsOnly",
            label: "Subscribers",
            color: "#EC4899",
            values: series.newSubscribers || [],
          },
        ],
      },
      {
        key: "yearlyRev",
        title: "Yearly Subscription Revenue",
        series: [
          {
            id: "yearlyOnly",
            label: "Yearly (€)",
            color: "#3B82F6",
            values: series.yearlyRevenue || [],
          },
        ],
      },
    ];
  }, [labels, series]);

  return (
    <PanelPage>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <PanelPageHeader
          title="Revenue Statistics"
          subtitle="Full analytics for your Lab Unity platform."
        />
        <label className="relative inline-flex min-w-[120px] shrink-0 items-center self-start">
          <span className="sr-only">Statistics year</span>
          <select
            value={chartYear}
            onChange={(e) => setChartYear(e.target.value)}
            className="h-9 w-full cursor-pointer appearance-none rounded-lg border border-[#E4E7EC] bg-white py-1.5 pl-3 pr-8 text-[13px] font-medium text-deep-blue outline-none focus:border-primary"
          >
            {YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <CardSkeleton
          variant="statCard"
          count={6}
          className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 xl:grid-cols-6"
        />
      ) : statsError ? (
        <ErrorState message={statsError} onRetry={load} />
      ) : !stats?.length ? (
        <EmptyState message="No statistics available yet." />
      ) : (
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat) => (
            <StatCard key={stat.id} {...stat} />
          ))}
        </div>
      )}

      {statisticsLoading ? (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <LineChartCardSkeleton />
          <LineChartCardSkeleton />
        </div>
      ) : statisticsError ? (
        <ErrorState
          message={statisticsError}
          onRetry={() => dispatch(fetchAdminStatistics(Number(chartYear)))}
        />
      ) : !charts.length ? (
        <EmptyState message="No chart data for the selected year." />
      ) : (
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
          {charts.map((chart) => {
            const filtered = filterChartData(
              labels,
              chart.series,
              periods[chart.key],
            );
            return (
              <LineChartCard
                key={chart.key}
                title={chart.title}
                series={filtered.series}
                labels={filtered.labels}
                yearOptions={PERIOD_OPTIONS}
                yearValue={periods[chart.key]}
                onYearChange={(value) => setPeriod(chart.key, value)}
              />
            );
          })}
        </div>
      )}
    </PanelPage>
  );
};

export default AdminStatisticsView;
