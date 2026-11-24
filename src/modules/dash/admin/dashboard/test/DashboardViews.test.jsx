import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { adminDashboardReducer } from "@/features/dash/admin/dashboard";
import { adminStatisticsReducer } from "@/features/dash/admin/statistics";
import AdminDashboardView from "../pages/AdminDashboardView";
import ErrorState from "../components/common/ErrorState";

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
      <MemoryRouter>
        <AdminDashboardView />
      </MemoryRouter>
    </Provider>,
  );
};

describe("AdminDashboardView", () => {
  it("renders the header and the year picker", () => {
    const html = render();
    expect(html).toContain("Monitor growth, revenue, and work that needs your attention.");
    expect(html).toContain(String(new Date().getFullYear()));
  });

  it("shows empty states without data", () => {
    const html = render({
      dashboard: { stats: [], loading: false },
      statistics: { statistics: null, statisticsLoading: false },
    });
    expect(html).toContain("No dashboard statistics available yet.");
    expect(html).toContain("No chart data for the selected year.");
    expect(html).not.toContain("Reports queue");
    expect(html).toContain("Quick links");
  });

  it("renders attention items and snapshot when provided", () => {
    const html = render({
      dashboard: {
        loading: false,
        stats: [{ id: "active-users", label: "Active Users", value: 12 }],
        attention: {
          reports: [
            {
              id: "r1",
              reason: "SPAM",
              reporter: "Alex",
              reportedUser: "Sam",
              avatar: "https://cdn.example.com/sam.jpg",
              initials: "S",
              snippet: "Buy cheap reagents",
              createdAt: "2026-11-01T10:00:00.000Z",
            },
          ],
          ads: [
            {
              id: "a1",
              title: "Lab booth promo",
              supplier: "Acme Labs",
              category: "Events",
              createdAt: "2026-11-02T10:00:00.000Z",
            },
          ],
        },
        snapshot: {
          newSubscribers: 3,
          newJobs: 5,
          totalListings: 40,
          pendingReports: 1,
          pendingAds: 1,
        },
      },
      statistics: { statistics: null, statisticsLoading: false },
    });

    expect(html).toContain("This month at a glance");
    expect(html).toContain("Spam · Sam");
    expect(html).toContain("Lab booth promo");
    expect(html).toContain("Acme Labs");
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

describe("ErrorState", () => {
  it("only shows Retry when a handler is given", () => {
    expect(renderToStaticMarkup(<ErrorState message="x" />)).not.toContain("Retry");
    expect(renderToStaticMarkup(<ErrorState message="x" onRetry={() => {}} />)).toContain("Retry");
  });
});
