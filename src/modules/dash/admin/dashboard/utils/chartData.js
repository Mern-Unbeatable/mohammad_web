import { PERIOD, YEAR_OPTION_COUNT } from "../constant/constants";

/** The current year and the ones before it, as strings for the year picker. */
export const yearOptions = (currentYear = new Date().getFullYear()) =>
  Array.from({ length: YEAR_OPTION_COUNT }, (_, i) => String(currentYear - i));

/** Chart series for `lines`, or [] until statistics have a `series` object. */
export const buildSeries = (statistics, lines) => {
  if (!statistics?.series) return [];
  return lines.map(({ id, key, label, color }) => ({
    id,
    label,
    color,
    values: statistics.series[key] || [],
  }));
};

/**
 * Slice 12-month chart series by UI period within the selected calendar year.
 */
export const filterChartData = (
  rawLabels = [],
  rawSeries = [],
  selectedPeriod = PERIOD.YEAR,
  currentMonthIdx = new Date().getMonth(),
) => {
  if (!rawLabels.length) return { labels: [], series: rawSeries };

  let startIndex = 0;
  let endIndex = rawLabels.length;

  if (selectedPeriod === PERIOD.MONTH) {
    startIndex = currentMonthIdx;
    endIndex = currentMonthIdx + 1;
  } else if (selectedPeriod === PERIOD.LAST_3) {
    startIndex = Math.max(0, currentMonthIdx - 2);
    endIndex = currentMonthIdx + 1;
  } else if (selectedPeriod === PERIOD.LAST_6) {
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
