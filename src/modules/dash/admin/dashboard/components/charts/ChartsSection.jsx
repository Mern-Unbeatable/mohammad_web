import LineChartCard from "@/components/data-display/LineChartCard/LineChartCard";
import { LineChartCardSkeleton } from "@/components/loader";
import EmptyState from "../common/EmptyState";
import ErrorState from "../common/ErrorState";
import { CHART_GRID_CLASS, PERIOD_OPTIONS } from "../../constant/constants";

/** User growth and revenue charts, each with its own period, plus loading / error / empty states. */
const ChartsSection = ({
  loading,
  error,
  hasCharts,
  onRetry,
  userGrowth,
  userPeriod,
  onUserPeriodChange,
  revenue,
  revenuePeriod,
  onRevenuePeriodChange,
}) => {
  if (loading) {
    return (
      <div className={CHART_GRID_CLASS}>
        <LineChartCardSkeleton />
        <LineChartCardSkeleton />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!hasCharts) return <EmptyState message="No chart data for the selected year." />;

  return (
    <div className={CHART_GRID_CLASS}>
      <LineChartCard
        title="User Growth"
        series={userGrowth.series}
        labels={userGrowth.labels}
        yearOptions={PERIOD_OPTIONS}
        yearValue={userPeriod}
        onYearChange={onUserPeriodChange}
      />
      <LineChartCard
        title="Revenue"
        series={revenue.series}
        labels={revenue.labels}
        yearOptions={PERIOD_OPTIONS}
        yearValue={revenuePeriod}
        onYearChange={onRevenuePeriodChange}
      />
    </div>
  );
};

export default ChartsSection;
