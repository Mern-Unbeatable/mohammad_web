import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "@/features/auth";
import { supplierContactsReducer } from "@/features/dash/supplier/contacts";
import { userFeedReducer } from "@/features/dash/user/feed";
import { userReportsReducer } from "@/features/dash/user/reports";
import SupplierContactsView from "../pages/SupplierContactsView";
import SupplierContactProfileView from "../pages/SupplierContactProfileView";

const render = (
  element,
  { path = "/supplier/contacts", route = "/supplier/contacts", state = {} } = {},
) => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      supplierContacts: supplierContactsReducer,
      userFeed: userFeedReducer,
      userReports: userReportsReducer,
    },
    preloadedState: {
      supplierContacts: { ...supplierContactsReducer(undefined, { type: "@@init" }), ...state },
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

const contact = (id) => ({ id, firstName: "Member", lastName: id, connectionStatus: null });

describe("SupplierContactsView", () => {
  it("renders the header, filters, count and cards linking to supplier profiles", () => {
    const html = render(<SupplierContactsView />, {
      state: {
        contacts: [contact("u1"), contact("u2")],
        contactsMeta: { page: 1, total: 2, totalPages: 1 },
      },
    });
    expect(html).toContain("Contacts Directory");
    expect(html).toContain('aria-label="Filter by country"');
    expect(html).toContain("2 members found");
    expect(html).toContain('href="/supplier/contacts/u1"');
  });

  it("shows the Confirm count badge and the empty message", () => {
    const html = render(<SupplierContactsView />, { state: { pendingRequestCount: 3 } });
    expect(html).toContain("3 requests to confirm");
    expect(html).toContain("No members match your search.");
  });
});

describe("SupplierContactProfileView", () => {
  it("renders the back link for a loaded contact", () => {
    const html = render(<SupplierContactProfileView />, {
      path: "/supplier/contacts/u1",
      route: "/supplier/contacts/:contactId",
      state: { selectedContact: contact("u1") },
    });
    expect(html).toContain("Back to directory");
    expect(html).toContain('href="/supplier/contacts"');
  });
});
