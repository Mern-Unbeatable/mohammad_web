import { describe, expect, it } from "vitest";
import reducer, {
  invalidateContactsList,
  selectPendingRequestCount,
} from "./contactsSlice";
import {
  acceptConnection,
  declineConnection,
  fetchContactsList,
  fetchPendingRequestCount,
  requestContactConnection,
} from "./contactsThunks";

const initial = reducer(undefined, { type: "@@init" });
const list = (ids, total = ids.length) => ({
  data: ids.map((id) => ({ id, connectionId: `conn-${id}` })),
  meta: { page: 1, pageSize: 8, total, totalPages: Math.ceil(total / 8) || 1 },
});
const loaded = (payload, args = { page: 1 }) => {
  const state = reducer(initial, fetchContactsList.pending("load", args));
  return reducer(state, fetchContactsList.fulfilled(payload, "load", args));
};

describe("supplier contacts list across tabs", () => {
  it("shows the latest tab even if the previous tab's response arrives last", () => {
    const people = { page: 1 };
    const connected = { page: 1, status: "accepted" };
    let state = reducer(initial, fetchContactsList.pending("people", people));
    state = reducer(state, invalidateContactsList());
    state = reducer(state, fetchContactsList.pending("connected", connected));
    state = reducer(
      state,
      fetchContactsList.fulfilled(list(["friend"]), "connected", connected),
    );
    state = reducer(
      state,
      fetchContactsList.fulfilled(list(["stranger"]), "people", people),
    );

    expect(state.contacts.map((c) => c.id)).toEqual(["friend"]);
    expect(state.contactsLoading).toBe(false);
  });

  it("keeps loading until the latest request settles", () => {
    let state = reducer(initial, fetchContactsList.pending("p1", { page: 1 }));
    state = reducer(state, fetchContactsList.pending("p2", { page: 2 }));
    state = reducer(state, fetchContactsList.fulfilled(list(["a"]), "p1", { page: 1 }));

    expect(state.contactsLoading).toBe(true);
    expect(state.contacts).toEqual([]);
  });

  it("ignores a failure from a request the user already left", () => {
    let state = reducer(initial, fetchContactsList.pending("p1", { page: 1 }));
    state = reducer(state, fetchContactsList.pending("p2", { page: 2 }));
    state = reducer(
      state,
      fetchContactsList.rejected(null, "p1", { page: 1 }, "Network Error"),
    );

    expect(state.error).toBeNull();
    expect(state.contactsLoading).toBe(true);
  });
});

describe("supplier Confirm badge", () => {
  const badge = (state) => selectPendingRequestCount({ supplierContacts: state });
  const withCount = (n) =>
    reducer(
      reducer(initial, fetchPendingRequestCount.pending("c")),
      fetchPendingRequestCount.fulfilled(n, "c"),
    );

  it("keeps the count until a request is confirmed or declined", () => {
    let state = withCount(2);
    expect(badge(state)).toBe(2);

    state = reducer(state, fetchContactsList.pending("people", { page: 1 }));
    state = reducer(state, fetchContactsList.fulfilled(list(["a"]), "people", { page: 1 }));
    expect(badge(state)).toBe(2);

    state = reducer(
      state,
      acceptConnection.fulfilled({ connectionId: "conn-x" }, "a", "conn-x"),
    );
    expect(badge(state)).toBe(1);

    state = reducer(
      state,
      declineConnection.fulfilled({ connectionId: "conn-y" }, "d", "conn-y"),
    );
    expect(badge(state)).toBe(0);
  });

  it("syncs the count from the unfiltered Confirm list total", () => {
    const args = { page: 1, status: "pending", direction: "incoming" };
    let state = reducer(initial, fetchContactsList.pending("r", args));
    state = reducer(state, fetchContactsList.fulfilled(list(["a"], 3), "r", args));
    expect(badge(state)).toBe(3);

    const searched = { ...args, search: "an" };
    state = reducer(state, fetchContactsList.pending("s", searched));
    state = reducer(state, fetchContactsList.fulfilled(list([], 0), "s", searched));
    expect(badge(state)).toBe(3);
  });
});

describe("supplier contacts actions", () => {
  it("moves a member out of People once a request is sent", () => {
    let state = loaded(list(["anna", "bob"], 9));
    state = reducer(
      state,
      requestContactConnection.fulfilled(
        { addresseeId: "anna", connection: { id: "conn-anna" } },
        "r",
        "anna",
      ),
    );

    expect(state.contacts.map((c) => c.id)).toEqual(["bob"]);
    expect(state.contactsMeta).toMatchObject({ total: 8, totalPages: 1 });
  });

  it("moves a member out of Confirm once the request is accepted", () => {
    let state = loaded(list(["anna", "bob"], 9));
    state = reducer(
      state,
      acceptConnection.fulfilled({ connectionId: "conn-anna" }, "a", "conn-anna"),
    );

    expect(state.contacts.map((c) => c.id)).toEqual(["bob"]);
    expect(state.contactsMeta).toMatchObject({ total: 8, totalPages: 1 });
  });

  it("refreshes the page in the background without clearing cards", () => {
    let state = loaded(list(["bob"], 9));
    const args = { page: 1, background: true };
    state = reducer(state, fetchContactsList.pending("bg", args));
    expect(state.contactsLoading).toBe(false);
    expect(state.contacts.map((c) => c.id)).toEqual(["bob"]);

    state = reducer(
      state,
      fetchContactsList.fulfilled(list(["bob", "cara"], 9), "bg", args),
    );
    expect(state.contacts.map((c) => c.id)).toEqual(["bob", "cara"]);
  });

  it("lets a page or tab load in flight win over a background refresh", () => {
    let state = loaded(list(["bob"]));
    state = reducer(state, fetchContactsList.pending("p2", { page: 2 }));
    state = reducer(state, fetchContactsList.pending("bg", { page: 1, background: true }));
    state = reducer(
      state,
      fetchContactsList.fulfilled(list(["stale"]), "bg", { page: 1, background: true }),
    );
    expect(state.contactsLoading).toBe(true);

    state = reducer(state, fetchContactsList.fulfilled(list(["row"]), "p2", { page: 2 }));
    expect(state.contacts.map((c) => c.id)).toEqual(["row"]);
  });

  it("keeps the visible cards when a background refresh fails", () => {
    let state = loaded(list(["bob"]));
    const args = { page: 1, background: true };
    state = reducer(state, fetchContactsList.pending("bg", args));
    state = reducer(state, fetchContactsList.rejected(null, "bg", args, "Network Error"));

    expect(state.contacts.map((c) => c.id)).toEqual(["bob"]);
    expect(state.error).toBeNull();
  });
});
