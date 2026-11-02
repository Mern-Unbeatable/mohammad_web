import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { adminMarketplaceReducer } from "@/features/dash/admin/marketplace";
import AdminMarketplaceView from "../pages/AdminMarketplaceView";
import AdminListingDetailView from "../pages/AdminListingDetailView";

const render = (element, { path = "/admin/marketplace", route = path, state = {} } = {}) => {
  const store = configureStore({
    reducer: {
      adminMarketplace: adminMarketplaceReducer,
      auth: (s = { user: { id: "admin1" } }) => s,
    },
    preloadedState: {
      adminMarketplace: { ...adminMarketplaceReducer(undefined, { type: "@@init" }), ...state },
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

const apiListing = {
  id: "l1",
  title: "Used centrifuge",
  description: "Works well.",
  category: "CENTRIFUGATION",
  condition: "GOOD",
  price: 1200,
  images: ["https://x.test/1.png", "https://x.test/2.png"],
  seller: { id: "s1", firstName: "Ana", lastName: "Lee" },
};

describe("AdminMarketplaceView", () => {
  it("renders the header, category pills and listing cards", () => {
    const html = render(<AdminMarketplaceView />, {
      state: { listings: [apiListing], listingsLoading: false },
    });
    expect(html).toContain("Manage listings, sellers, transactions and commissions.");
    expect(html).toContain("Chromatography");
    expect(html).toContain("Used centrifuge");
  });

  it("shows the empty state and the store error", () => {
    const html = render(<AdminMarketplaceView />, {
      state: { listings: [], listingsLoading: false, error: "Server down" },
    });
    expect(html).toContain("No listings found for this category.");
    expect(html).toContain("Server down");
  });
});

describe("AdminListingDetailView", () => {
  const renderDetail = (selectedListing) =>
    render(<AdminListingDetailView />, {
      path: "/admin/marketplace/l1",
      route: "/admin/marketplace/:listingId",
      state: { selectedListing },
    });

  it("renders the listing, gallery thumbnails, seller and contact button", () => {
    const html = renderDetail(apiListing);
    expect(html).toContain("Used centrifuge");
    expect(html).toContain("Centrifugation");
    expect(html).toContain("View image 2");
    expect(html).toContain("Ana Lee");
    expect(html).toContain('href="/admin/users/s1"');
    expect(html).toContain("Contact seller");
  });

  it("hides Contact seller on the admin's own listing", () => {
    const html = renderDetail({ ...apiListing, seller: { id: "admin1", name: "Me" } });
    expect(html).not.toContain("Contact seller</button>");
  });
});
