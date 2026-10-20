import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { supplierProfileReducer } from "@/features/dash/supplier/profile";
import SupplierProfileView from "../pages/SupplierProfileView";

const render = (profile = {}) => {
  const store = configureStore({
    reducer: { supplierProfile: supplierProfileReducer },
    preloadedState: {
      supplierProfile: { ...supplierProfileReducer(undefined, { type: "@@init" }), ...profile },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter>
        <SupplierProfileView />
      </MemoryRouter>
    </Provider>,
  );
};

describe("SupplierProfileView", () => {
  it("renders the supplier form with the save label", () => {
    const html = render({ loading: false });
    expect(html).toContain("My Profile");
    expect(html).toContain("Update your supplier profile visible to laboratories and buyers.");
    expect(html).toContain("Save Profile");
  });

  it("shows Saving… while saving", () => {
    expect(render({ loading: false, saving: true })).toContain("Saving…");
  });

  it("shows the skeleton instead of the form while loading", () => {
    expect(render({ loading: true })).not.toContain("Save Profile");
  });
});
