import { CHART_YEAR_COUNT, FALLBACK_NAME } from "../constant/constants";

/** Current year first, then the previous ones, as strings for the select. */
export const chartYearOptions = (currentYear) =>
  Array.from({ length: CHART_YEAR_COUNT }, (_, i) => String(currentYear - i));

export const displayNameOf = (user) =>
  user?.profile?.name ||
  [user?.profile?.firstName, user?.profile?.lastName].filter(Boolean).join(" ") ||
  user?.name ||
  FALLBACK_NAME;
