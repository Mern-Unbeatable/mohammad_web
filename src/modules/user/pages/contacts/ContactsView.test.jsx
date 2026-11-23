import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { userContactsReducer } from "@/features/user/contacts";
import ContactsView from "./ContactsView";

const contact = (id) => ({ id, firstName: `Member`, lastName: id, connectionStatus: null });

const render = (url, contactsState = {}) => {
  const store = configureStore({
    reducer: { userContacts: userContactsReducer },
    preloadedState: {
      userContacts: {
        ...userContactsReducer(undefined, { type: "@@init" }),
        ...contactsState,
      },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <MemoryRouter initialEntries={[url]}>
        <ContactsView />
      </MemoryRouter>
    </Provider>,
  );
};

const tabs = (html) =>
  [...html.matchAll(/<button[^>]*role="tab"[^>]*aria-selected="(true|false)"[^>]*>(.*?)<\/button>/g)].map(
    ([, selected, inner]) => ({
      label: inner.replace(/<[^>]+>/g, "").replace(/\d+$/, ""),
      selected: selected === "true",
    }),
  );

/** Markup after the filter toolbar, so tab icons don't count as card content. */
const cardsOf = (html) => html.slice(html.indexOf("</select>"));

const loadedPage = (page, totalPages = 3) => ({
  contacts: [contact(`p${page}-a`), contact(`p${page}-b`)],
  contactsMeta: { page, pageSize: 8, total: totalPages * 8, totalPages },
});

describe("ContactsView pagination", () => {
  it("highlights the page from the URL and shows that page's contacts", () => {
    const html = render("/contacts?page=2", loadedPage(2));

    expect(html).toContain('aria-label="Page 2" aria-current="page"');
    expect(html).not.toContain('aria-label="Page 1" aria-current="page"');
    expect(html).toContain("p2-a");
    expect(html).toContain("24 members found");
  });

  it("disables Previous on the first page and Next on the last page", () => {
    const first = render("/contacts?page=1", loadedPage(1));
    expect(first).toMatch(/aria-label="Previous page"[^>]*disabled/);
    expect(first).not.toMatch(/aria-label="Next page"[^>]*disabled/);

    const last = render("/contacts?page=3", loadedPage(3));
    expect(last).toMatch(/aria-label="Next page"[^>]*disabled/);
    expect(last).not.toMatch(/aria-label="Previous page"[^>]*disabled/);
  });

  it.each(["/contacts", "/contacts?page=abc", "/contacts?page=0", "/contacts?page=-4"])(
    "treats %s as page 1",
    (url) => {
      const html = render(url, loadedPage(1));
      expect(html).toContain('aria-label="Page 1" aria-current="page"');
    },
  );

  it("shows a loading state instead of an empty page for an out-of-range page", () => {
    const html = render("/contacts?page=9", { ...loadedPage(9), contacts: [] });

    expect(html).toContain("Loading…");
    expect(html).not.toContain("No members match your search.");
  });

  it("shows skeletons while loading", () => {
    const html = render("/contacts?page=2", { contactsLoading: true });
    expect(html).toContain("Loading…");
    expect(html).not.toContain('aria-label="Pagination"');
  });

  it("shows the empty state when there are no contacts", () => {
    const html = render("/contacts?page=1", {
      contacts: [],
      contactsMeta: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
    });
    expect(html).toContain("No members match your search.");
    expect(html).toContain("0 members found");
  });

  it("restores the filter, country and search from the URL", () => {
    const html = render("/contacts?page=2&country=France&q=anna", loadedPage(2));

    expect(html).toContain('<option value="France" selected="">');
    expect(html).toContain('value="anna"');
    expect(html).toContain('aria-label="Page 2" aria-current="page"');
  });

  it("renders People, Pending, Confirm and Connected tabs in order", () => {
    const html = render("/contacts?page=1", loadedPage(1));

    expect(html).toContain('role="tablist" aria-label="Filter contacts"');
    expect(tabs(html)).toEqual([
      { label: "People", selected: true },
      { label: "Pending", selected: false },
      { label: "Confirm", selected: false },
      { label: "Connected", selected: false },
    ]);
    const icons = [...html.matchAll(/role="tab"[^>]*>.*?<svg[^>]*class="lucide (lucide-[\w-]+)/g)].map(
      ([, icon]) => icon,
    );
    expect(icons).toEqual(["lucide-users", "lucide-clock", "lucide-user-check", "lucide-handshake"]);
    // Only the country dropdown remains.
    expect(html.match(/<select/g)).toHaveLength(1);
    expect(html).toContain('<select aria-label="Filter by country"');
  });

  it.each([
    ["connected", "Connected", "You have no connections yet.", "0 connections"],
    ["pending", "Pending", "You have no pending sent requests.", "0 requests sent"],
    ["requests", "Confirm", "No requests waiting for you to confirm.", "0 requests to confirm"],
  ])("restores the %s filter from the URL as the %s tab", (id, label, emptyText, count) => {
    const html = render(`/contacts?filter=${id}&page=1`, {
      contacts: [],
      contactsMeta: { page: 1, pageSize: 8, total: 0, totalPages: 1 },
    });

    expect(tabs(html).find((t) => t.selected)?.label).toBe(label);
    expect(html).toContain(count);
    expect(html).toContain(emptyText);
  });

  it("shows the number of requests to confirm on the Confirm tab", () => {
    const html = render("/contacts?page=1", { ...loadedPage(1), pendingRequestCount: 3 });
    expect(html).toContain('aria-label="3 requests to confirm"');

    const none = render("/contacts?page=1", { ...loadedPage(1), pendingRequestCount: 0 });
    expect(none).not.toContain("to confirm");
  });

  it("shows Pending on cards in the Pending tab and Confirm in the Confirm tab", () => {
    const sent = render("/contacts?filter=pending&page=1", {
      contacts: [{ ...contact("s1"), connectionId: "c1", connectionStatus: "PENDING", connectionDirection: "outgoing" }],
      contactsMeta: { page: 1, pageSize: 8, total: 1, totalPages: 1 },
    });
    expect(cardsOf(sent)).toContain("lucide-clock");
    expect(cardsOf(sent)).not.toContain("bg-green-primary");

    const received = render("/contacts?filter=requests&page=1", {
      contacts: [{ ...contact("r1"), connectionId: "c2", connectionStatus: "PENDING", connectionDirection: "incoming" }],
      contactsMeta: { page: 1, pageSize: 8, total: 1, totalPages: 1 },
    });
    expect(cardsOf(received)).toContain("bg-green-primary");
    expect(cardsOf(received)).not.toContain("lucide-clock");
  });

  it("shows the Connected total and pagination from the filtered result", () => {
    const html = render("/contacts?filter=connected&page=2", {
      contacts: [contact("c9"), contact("c10")],
      contactsMeta: { page: 2, pageSize: 8, total: 10, totalPages: 2 },
    });

    expect(tabs(html).find((t) => t.selected)?.label).toBe("Connected");
    expect(html).toContain("10 connections");
    expect(html).toContain('aria-label="Page 2" aria-current="page"');
    expect(html).toMatch(/aria-label="Next page"[^>]*disabled/);
  });

  it("explains an empty Connected list differently when a search is active", () => {
    const empty = { contacts: [], contactsMeta: { page: 1, pageSize: 8, total: 0, totalPages: 1 } };

    expect(render("/contacts?filter=connected&page=1", empty)).toContain(
      "You have no connections yet.",
    );
    expect(render("/contacts?filter=connected&page=1&q=zed", empty)).toContain(
      "No connections match your search.",
    );
    expect(render("/contacts?filter=connected&page=1&country=Italy", empty)).toContain(
      "No connections match your search.",
    );
  });

  it("falls back to People for an unknown filter", () => {
    const html = render("/contacts?filter=admins&country=Atlantis", loadedPage(1));

    expect(tabs(html).find((t) => t.selected)?.label).toBe("People");
    expect(html).toContain('<option value="All countries" selected="">');
  });

  it("shows an error state with a retry when the list fails", () => {
    const html = render("/contacts?page=2", { contactsError: "Network Error" });

    expect(html).toContain("Couldn&#x27;t load contacts.");
    expect(html).toContain("Try again");
    expect(html).not.toContain("No members match your search.");
  });
});
