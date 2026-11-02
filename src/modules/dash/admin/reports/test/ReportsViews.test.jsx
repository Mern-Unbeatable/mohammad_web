import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { adminReportsReducer } from "@/features/dash/admin/reports";
import AdminReportsView from "../pages/AdminReportsView";
import AdminReportDetailView from "../pages/AdminReportDetailView";

const render = (element, { path = "/admin/reports", route = path, state = {} } = {}) => {
  const store = configureStore({
    reducer: { adminReports: adminReportsReducer },
    preloadedState: {
      adminReports: { ...adminReportsReducer(undefined, { type: "@@init" }), ...state },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={route} element={element} />
        </Routes>
      </MemoryRouter>
    </Provider>,
  );
};

const apiReport = {
  id: "r1",
  reason: "SPAM",
  reasonDetail: "Posting ads everywhere",
  status: "PENDING",
  targetType: "POST",
  targetSnippet: "Buy now!",
  reporter: { id: "u1", name: "Ana Lee" },
  reportedUser: { id: "u2", name: "Ben Ray", warnings: 2 },
};

describe("AdminReportsView", () => {
  it("renders the header, stat cards and report rows", () => {
    const html = render(<AdminReportsView />, {
      state: { reports: [apiReport], reportsMeta: { page: 1, total: 1 }, stats: { total: 7 } },
    });
    expect(html).toContain("Reports &amp; Moderation");
    expect(html).toContain("Total Reports");
    expect(html).toContain("Search reports...");
    expect(html).toContain("Ben Ray");
    expect(html).toContain("2 Warnings");
  });

  it("shows the store error", () => {
    expect(render(<AdminReportsView />, { state: { error: "Server down" } })).toContain("Server down");
  });
});

describe("AdminReportDetailView", () => {
  const renderDetail = (selectedReport) =>
    render(<AdminReportDetailView />, {
      path: "/admin/reports/r1",
      route: "/admin/reports/:reportId",
      state: { selectedReport },
    });

  it("renders the reason, both people, the target and all decisions", () => {
    const html = renderDetail(apiReport);
    expect(html).toContain("Report reason: Spam");
    expect(html).toContain("Posting ads everywhere");
    expect(html).toContain("View Reporter Profile");
    expect(html).toContain("Audit History");
    expect(html).toContain("Reported Post");
    for (const label of ["Remove Content", "Warn User", "Suspend User", "Ban User", "Mark Resolved"]) {
      expect(html).toContain(label);
    }
  });

  it("renders nothing of the page when the report is missing (it redirects)", () => {
    const html = renderDetail(null);
    expect(html).not.toContain("Report reason");
    expect(html).not.toContain("Mark Resolved");
  });
});
