import { PERIOD } from "@/modules/dash/admin/dashboard";
import { CHARTS } from "../constant/constants";

/** Every chart starts on the whole year. */
export const initialPeriods = () =>
  Object.fromEntries(CHARTS.map((chart) => [chart.id, PERIOD.YEAR]));

/** Chart cards with their series, or [] until the statistics have labels. */
export const buildCharts = (statistics) => {
  if (!statistics?.labels?.length) return [];
  const series = statistics.series || {};
  return CHARTS.map(({ id, title, lines }) => ({
    id,
    title,
    series: lines.map((line) => ({
      id: line.id,
      label: line.label,
      color: line.color,
      values: series[line.key] || [],
    })),
  }));
};
