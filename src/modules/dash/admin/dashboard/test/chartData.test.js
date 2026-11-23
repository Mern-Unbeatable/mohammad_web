import { describe, expect, it } from "vitest";
import { buildSeries, filterChartData, yearOptions } from "../utils/chartData";
import { PERIOD, USER_GROWTH_LINES } from "../constant/constants";

const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const series = [{ id: "a", values: labels.map((_, i) => i) }];

describe("filterChartData", () => {
  it("keeps the whole year by default", () => {
    expect(filterChartData(labels, series, PERIOD.YEAR, 5).labels).toHaveLength(12);
  });

  it("slices this month and the last 3 / 6 months up to the given month", () => {
    expect(filterChartData(labels, series, PERIOD.MONTH, 5)).toEqual({
      labels: ["Jun"],
      series: [{ id: "a", values: [5] }],
    });
    expect(filterChartData(labels, series, PERIOD.LAST_3, 5).labels).toEqual(["Apr", "May", "Jun"]);
    expect(filterChartData(labels, series, PERIOD.LAST_6, 1).labels).toEqual(["Jan", "Feb"]);
  });

  it("returns empty labels when there are none", () => {
    expect(filterChartData([], series)).toEqual({ labels: [], series });
  });
});

describe("buildSeries", () => {
  it("returns [] without statistics", () => {
    expect(buildSeries(null, USER_GROWTH_LINES)).toEqual([]);
  });

  it("maps each line to its values, defaulting to []", () => {
    expect(buildSeries({ series: { newUsers: [1, 2] } }, USER_GROWTH_LINES)).toEqual([
      { id: "newUsers", label: "New Users", color: "#F97316", values: [1, 2] },
      { id: "newSubscribers", label: "Subscribers", color: "#EC4899", values: [] },
    ]);
  });
});

describe("yearOptions", () => {
  it("lists the current year and the two before it", () => {
    expect(yearOptions(2026)).toEqual(["2026", "2025", "2024"]);
  });
});
