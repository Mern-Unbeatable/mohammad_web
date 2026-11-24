import LineChartCard from "@/components/data-display/LineChartCard/LineChartCard";
import { LineChartCardSkeleton } from "@/components/loader";
import {
  CHART_GRID_CLASS,
  EmptyState,
  ErrorState,
  PERIOD_OPTIONS,
} from "@/modules/dash/admin/dashboard";

/** All statistics charts (already filtered by period) with loading / error / empty states. */
const StatisticsCharts = ({ charts, loading, error, onRetry, onPeriodChange }) => {
  if (loading) {
    return (
      <div className={CHART_GRID_CLASS}>
        <LineChartCardSkeleton />
        <LineChartCardSkeleton />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (!charts.length) return <EmptyState message="No chart data for the selected year." />;

  return (
    <div className={CHART_GRID_CLASS}>
      {charts.map((chart) => (
        <LineChartCard
          key={chart.id}
          title={chart.title}
          series={chart.series}
          labels={chart.labels}
          yearOptions={PERIOD_OPTIONS}
          yearValue={chart.period}
          onYearChange={(value) => onPeriodChange(chart.id, value)}
        />
      ))}
    </div>
  );
};

export default StatisticsCharts;
