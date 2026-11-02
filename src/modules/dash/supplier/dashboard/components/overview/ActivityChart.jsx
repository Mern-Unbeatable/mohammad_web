import BarChartCard from "@/components/data-display/BarChartCard/BarChartCard";
import { BarChartCardSkeleton } from "@/components/loader";
import { CHART_HEIGHT } from "../../constant/constants";

/** Yearly bar chart with a year select. */
const ActivityChart = ({ chart, loading, year, yearOptions, onYearChange }) =>
  loading ? (
    <BarChartCardSkeleton />
  ) : (
    <BarChartCard
      title={chart.title}
      series={chart.series}
      labels={chart.labels}
      yTicks={chart.yTicks}
      yMax={chart.yMax}
      yearValue={year}
      yearOptions={yearOptions}
      onYearChange={onYearChange}
      chartHeight={CHART_HEIGHT}
      legendPosition="bottom"
      fullWidth
    />
  );

export default ActivityChart;
