import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { adminAdsReducer } from "@/features/dash/admin/advertisements";
import AdminAdvertisementView from "../pages/AdminAdvertisementView";
import AdminAdvertisementDetailView from "../pages/AdminAdvertisementDetailView";
import ReviewActions from "../components/detail/ReviewActions";

const render = (element, { path = "/admin/advertisement", route = path, state = {} } = {}) => {
  const store = configureStore({
    reducer: { adminAds: adminAdsReducer },
    preloadedState: {
      adminAds: { ...adminAdsReducer(undefined, { type: "@@init" }), ...state },
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

const apiAd = {
  id: "ad1",
  title: "New HPLC column",
  status: "ACTIVE",
  category: "PRODUCT",
  description: "Sharper peaks.",
};

describe("AdminAdvertisementView", () => {
  it("renders the header, search and ad rows", () => {
    const html = render(<AdminAdvertisementView />, {
      state: { ads: [apiAd], adsMeta: { page: 1, total: 1 }, adsLoading: false },
    });
    expect(html).toContain("Manage advertisement post");
    expect(html).toContain("Search advertisements...");
    expect(html).toContain("New HPLC column");
  });

  it("shows the store error above the table", () => {
    const html = render(<AdminAdvertisementView />, { state: { error: "Server down" } });
    expect(html).toContain("Server down");
  });
});

describe("AdminAdvertisementDetailView", () => {
  const renderDetail = (selectedAd) =>
    render(<AdminAdvertisementDetailView />, {
      path: "/admin/advertisement/ad1",
      route: "/admin/advertisement/:adId",
      state: { selectedAd },
    });

  it("renders the ad and the review buttons once loaded", () => {
    const html = renderDetail(apiAd);
    expect(html).toContain("New HPLC column");
    expect(html).toContain("Approve");
    expect(html).toContain("Mark expired");
    expect(html).toContain("Reject");
  });

  it("does not show another ad's details while loading", () => {
    const html = renderDetail({ ...apiAd, id: "other" });
    expect(html).not.toContain("New HPLC column");
  });
});

describe("ReviewActions", () => {
  it("disables the current status and everything while busy", () => {
    const idle = renderToStaticMarkup(<ReviewActions status="Active" busy={false} />);
    expect(idle.match(/disabled=""/g)).toHaveLength(1);
    const busy = renderToStaticMarkup(<ReviewActions status="Active" busy />);
    expect(busy.match(/disabled=""/g)).toHaveLength(3);
  });
});
