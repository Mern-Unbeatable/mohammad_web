import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { Bell } from "lucide-react";
import { authReducer } from "@/features/auth";
import { supplierAdsReducer } from "@/features/dash/supplier/advertisements";
import { supplierDashboardReducer } from "@/features/dash/supplier/dashboard";
import SupplierDashboardView from "../pages/SupplierDashboardView";

const render = (dashboard = {}) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      supplierAds: supplierAdsReducer,
      supplierDashboard: supplierDashboardReducer,
    },
    preloadedState: {
      auth: {
        ...authReducer(undefined, { type: "@@init" }),
        user: { id: "s1", role: "SUPPLIER", profile: { name: "Novagen Labs" } },
        isAuthenticated: true,
        sessionReady: true,
      },
      supplierDashboard: {
        ...supplierDashboardReducer(undefined, { type: "@@init" }),
        ...dashboard,
      },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter>
        <SupplierDashboardView />
      </MemoryRouter>
    </Provider>,
  );
};

describe("SupplierDashboardView", () => {
  it("greets the supplier and shows empty states without data", () => {
    const html = render();
    expect(html).toContain("Welcome back, Novagen Labs");
    expect(html).toContain("No advertisements yet.");
    expect(html).toContain("No notifications yet.");
    expect(html).toContain('href="/supplier/ads"');
    expect(html).toContain('href="/supplier/notifications"');
  });

  it("renders recent ads and notifications", () => {
    const html = render({
      recentAds: [{ id: "a1", title: "HPLC column", category: "Product", status: "Active" }],
      notifications: [
        { id: "n1", icon: Bell, iconClass: "", title: "Ad approved", subtitle: "Live now", time: "1h" },
      ],
    });
    expect(html).toContain("HPLC column");
    expect(html).toContain("Ad approved");
    expect(html).not.toContain("No advertisements yet.");
  });

  it("shows the error with a retry button", () => {
    const html = render({ error: "Dashboard unavailable" });
    expect(html).toContain("Dashboard unavailable");
    expect(html).toContain("Retry");
  });
});
