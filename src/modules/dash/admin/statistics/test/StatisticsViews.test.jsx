import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { adminDashboardReducer } from "@/features/dash/admin/dashboard";
import { adminStatisticsReducer } from "@/features/dash/admin/statistics";
import AdminStatisticsView from "../pages/AdminStatisticsView";

const render = ({ dashboard = {}, statistics = {} } = {}) => {
  const store = configureStore({
    reducer: { adminDashboard: adminDashboardReducer, adminStatistics: adminStatisticsReducer },
    preloadedState: {
      adminDashboard: { ...adminDashboardReducer(undefined, { type: "@@init" }), ...dashboard },
      adminStatistics: { ...adminStatisticsReducer(undefined, { type: "@@init" }), ...statistics },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <AdminStatisticsView />
    </Provider>,
  );
};

describe("AdminStatisticsView", () => {
  it("renders its own header with the year picker", () => {
    const html = render();
    expect(html).toContain("Revenue Statistics");
    expect(html).toContain("Full analytics for your Lab Unity platform.");
    expect(html).toContain(String(new Date().getFullYear()));
  });

  it("shows its own empty messages", () => {
    const html = render({
      dashboard: { stats: [], loading: false },
      statistics: { statistics: null, statisticsLoading: false },
    });
    expect(html).toContain("No statistics available yet.");
    expect(html).toContain("No chart data for the selected year.");
  });

  it("shows the errors", () => {
    const html = render({
      dashboard: { loading: false, statsError: "Stats failed" },
      statistics: { statisticsLoading: false, statisticsError: "Charts failed" },
    });
    expect(html).toContain("Stats failed");
    expect(html).toContain("Charts failed");
  });
});
