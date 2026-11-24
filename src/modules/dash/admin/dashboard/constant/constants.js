export const PERIOD = {
  YEAR: "This year",
  MONTH: "This month",
  LAST_3: "Last 3 months",
  LAST_6: "Last 6 months",
};

export const PERIOD_OPTIONS = [PERIOD.YEAR, PERIOD.MONTH, PERIOD.LAST_3, PERIOD.LAST_6];

/** How many years back the year picker offers, including the current one. */
export const YEAR_OPTION_COUNT = 3;

export const STAT_GRID_CLASS = "grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-3 xl:grid-cols-6";
export const STAT_SKELETON_COUNT = 6;
export const CHART_GRID_CLASS = "grid grid-cols-1 gap-3 xl:grid-cols-2";

/** Chart lines; `key` is the field in `statistics.series`. */
export const USER_GROWTH_LINES = [
  { id: "newUsers", key: "newUsers", label: "New Users", color: "#F97316" },
  { id: "newSubscribers", key: "newSubscribers", label: "Subscribers", color: "#EC4899" },
];

export const REVENUE_LINES = [
  { id: "monthlyRevenue", key: "monthlyRevenue", label: "Monthly Revenue (€)", color: "#10B981" },
  { id: "yearlyRevenue", key: "yearlyRevenue", label: "Yearly Revenue (€)", color: "#3B82F6" },
];
