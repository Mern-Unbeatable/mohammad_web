import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { adminSettingsReducer, SETTINGS_KEYS } from "@/features/dash/admin/settings";
import AdminSettingsView from "../pages/AdminSettingsView";

const render = (state = {}) => {
  const store = configureStore({
    reducer: { adminSettings: adminSettingsReducer },
    preloadedState: {
      adminSettings: { ...adminSettingsReducer(undefined, { type: "@@init" }), ...state },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <AdminSettingsView />
    </Provider>,
  );
};

const settings = {
  [SETTINGS_KEYS.subscription]: { monthly: 9, yearly: 90 },
  [SETTINGS_KEYS.sponsored]: [{ id: "d1", label: "1 day", price: 5 }],
  [SETTINGS_KEYS.marketplaceCategories]: ["Microscopy"],
  [SETTINGS_KEYS.generalCategories]: ["News"],
};

describe("AdminSettingsView", () => {
  it("renders every section from the loaded settings", () => {
    const html = render({ settings, loadedRequestId: "req1" });
    expect(html).toContain("Manage Your Subscription");
    expect(html).toContain('value="90"');
    expect(html).toContain("Sponsored Post Pricing");
    expect(html).toContain('value="1 day"');
    expect(html).toContain("Remove Microscopy");
    expect(html).toContain("Remove News");
  });

  it("shows Saving… on the section being saved", () => {
    const html = render({
      settings,
      loadedRequestId: "req1",
      savingKey: SETTINGS_KEYS.marketplaceCategories,
    });
    expect(html.match(/Saving…/g)).toHaveLength(1);
  });

  it("shows the retry card when the first load failed", () => {
    const html = render({ loadedRequestId: null, loading: false, error: "Server down" });
    expect(html).toContain("Server down");
    expect(html).toContain("Retry");
    expect(html).not.toContain("Manage Your Subscription");
  });

  it("keeps the header while loading", () => {
    const html = render({ loadedRequestId: null, loading: true });
    expect(html).toContain("Manage your subscription and Sponsored Price");
    expect(html).not.toContain("Manage Your Subscription");
  });
});
