import { describe, expect, it } from "vitest";
import { buildCharts, initialPeriods } from "../utils/charts";
import { CHARTS } from "../constant/constants";

describe("initialPeriods", () => {
  it("starts every chart on This year", () => {
    const periods = initialPeriods();
    expect(Object.keys(periods)).toEqual(CHARTS.map((c) => c.id));
    expect(new Set(Object.values(periods))).toEqual(new Set(["This year"]));
  });
});

describe("buildCharts", () => {
  it("returns [] without labels", () => {
    expect(buildCharts(null)).toEqual([]);
    expect(buildCharts({ labels: [], series: {} })).toEqual([]);
  });

  it("builds six charts in order, defaulting missing series to []", () => {
    const charts = buildCharts({ labels: ["Jan"], series: { newUsers: [3] } });
    expect(charts.map((c) => c.title)).toEqual([
      "User Growth",
      "Revenue",
      "New Users",
      "Monthly Subscription Revenue",
      "New Subscribers",
      "Yearly Subscription Revenue",
    ]);
    expect(charts[0].series[0]).toEqual({ id: "newUsers", label: "New Users", color: "#F97316", values: [3] });
    expect(charts[1].series[0].values).toEqual([]);
    expect(charts[2].series).toEqual([
      { id: "newUsersOnly", label: "New Users", color: "#F97316", values: [3] },
    ]);
  });

  it("still builds charts when series is missing", () => {
    expect(buildCharts({ labels: ["Jan"] })).toHaveLength(6);
  });
});
