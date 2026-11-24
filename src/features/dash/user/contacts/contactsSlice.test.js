import { describe, expect, it } from "vitest";
import reducer, {
  invalidateContactsList,
  selectPendingRequestCount,
} from "./contactsSlice";
import {
  acceptConnection,
  declineConnection,
  fetchContactDetails,
  fetchContactsList,
  fetchPendingRequestCount,
  requestContactConnection,
} from "./contactsThunks";
import { logoutUser } from "@/features/auth/authThunks";

const initial = reducer(undefined, { type: "@@init" });
const meta = (page) => ({ page, pageSize: 8, total: 20, totalPages: 3 });
const page = (n) => ({ data: [{ id: `p${n}` }], meta: meta(n) });

describe("contacts list pagination state", () => {
  it("shows the latest requested page even if an older response arrives last", () => {
    let state = reducer(initial, fetchContactsList.pending("req-1", { page: 1 }));
    state = reducer(state, fetchContactsList.pending("req-2", { page: 2 }));
    state = reducer(state, fetchContactsList.fulfilled(page(2), "req-2", { page: 2 }));
    state = reducer(state, fetchContactsList.fulfilled(page(1), "req-1", { page: 1 }));

    expect(state.contacts).toEqual([{ id: "p2" }]);
    expect(state.contactsMeta.page).toBe(2);
    expect(state.contactsLoading).toBe(false);
  });

  it("keeps loading until the latest request settles", () => {
    let state = reducer(initial, fetchContactsList.pending("req-1", { page: 1 }));
    state = reducer(state, fetchContactsList.pending("req-2", { page: 2 }));
    state = reducer(state, fetchContactsList.fulfilled(page(1), "req-1", { page: 1 }));

    expect(state.contactsLoading).toBe(true);
    expect(state.contacts).toEqual([]);
  });

  it("records list failures and clears them on the next request", () => {
    let state = reducer(initial, fetchContactsList.pending("req-1", { page: 2 }));
    state = reducer(
      state,
      fetchContactsList.rejected(null, "req-1", { page: 2 }, "Network Error"),
    );
    expect(state.contactsError).toBe("Network Error");
    expect(state.contactsLoading).toBe(false);

    state = reducer(state, fetchContactsList.pending("req-2", { page: 2 }));
    expect(state.contactsError).toBeNull();
  });

  it("ignores a failure from a request the user already left", () => {
    let state = reducer(initial, fetchContactsList.pending("req-1", { page: 1 }));
    state = reducer(state, fetchContactsList.pending("req-2", { page: 2 }));
    state = reducer(
      state,
      fetchContactsList.rejected(null, "req-1", { page: 1 }, "Network Error"),
    );
    expect(state.contactsError).toBeNull();
    expect(state.contactsLoading).toBe(true);
  });

  it("clears a list error when filters invalidate the list", () => {
    let state = reducer(initial, fetchContactsList.pending("req-1", { page: 1 }));
    state = reducer(state, fetchContactsList.rejected(null, "req-1", { page: 1 }, "Failed"));
    state = reducer(state, invalidateContactsList());
    expect(state.contactsError).toBeNull();
    expect(state.contactsLoading).toBe(true);
  });
});

describe("pending request badge count", () => {
  const withCount = (count) => {
    let state = reducer(initial, fetchPendingRequestCount.pending("c"));
    return reducer(state, fetchPendingRequestCount.fulfilled(count, "c"));
  };

  it("starts at zero and stores the fetched count", () => {
    expect(selectPendingRequestCount({ userContacts: initial })).toBe(0);
    expect(withCount(3).pendingRequestCount).toBe(3);
  });

  it("keeps the latest count when responses arrive out of order", () => {
    let state = reducer(initial, fetchPendingRequestCount.pending("old"));
    state = reducer(state, fetchPendingRequestCount.pending("new"));
    state = reducer(state, fetchPendingRequestCount.fulfilled(2, "new"));
    state = reducer(state, fetchPendingRequestCount.fulfilled(9, "old"));
    expect(state.pendingRequestCount).toBe(2);
  });

  it("keeps the last count when a refresh fails", () => {
    let state = withCount(4);
    state = reducer(state, fetchPendingRequestCount.pending("r"));
    state = reducer(
      state,
      fetchPendingRequestCount.rejected(null, "r", undefined, "Failed"),
    );
    expect(state.pendingRequestCount).toBe(4);
  });

  it("drops by one when a request is confirmed or declined, never below zero", () => {
    let state = withCount(2);
    state = reducer(
      state,
      acceptConnection.fulfilled({ connectionId: "c1" }, "a", "c1"),
    );
    expect(state.pendingRequestCount).toBe(1);
    state = reducer(
      state,
      declineConnection.fulfilled({ connectionId: "c2" }, "d", "c2"),
    );
    expect(state.pendingRequestCount).toBe(0);
    state = reducer(
      state,
      declineConnection.fulfilled({ connectionId: "c3" }, "d2", "c3"),
    );
    expect(state.pendingRequestCount).toBe(0);
  });

  it("syncs from the Requests list total but not from other lists", () => {
    const requestsArgs = { page: 1, status: "pending", direction: "incoming" };
    let state = reducer(initial, fetchContactsList.pending("r1", requestsArgs));
    state = reducer(
      state,
      fetchContactsList.fulfilled(
        { data: [], meta: { page: 1, pageSize: 8, total: 5, totalPages: 1 } },
        "r1",
        requestsArgs,
      ),
    );
    expect(state.pendingRequestCount).toBe(5);

    state = reducer(state, fetchContactsList.pending("r2", { page: 1 }));
    state = reducer(state, fetchContactsList.fulfilled(page(1), "r2", { page: 1 }));
    expect(state.pendingRequestCount).toBe(5);

    const searched = { ...requestsArgs, search: "anna" };
    state = reducer(state, fetchContactsList.pending("r3", searched));
    state = reducer(
      state,
      fetchContactsList.fulfilled(
        { data: [], meta: { page: 1, pageSize: 8, total: 1, totalPages: 1 } },
        "r3",
        searched,
      ),
    );
    expect(state.pendingRequestCount).toBe(5);
  });

  it("resets on logout", () => {
    const state = reducer(withCount(3), logoutUser.fulfilled(undefined, "l"));
    expect(state.pendingRequestCount).toBe(0);
  });
});

describe("confirming a request from the list", () => {
  const people = (rows, total = rows.length) => ({
    data: rows,
    meta: { page: 1, pageSize: 8, total, totalPages: Math.ceil(total / 8) || 1 },
  });
  const loaded = (payload, args = { page: 1 }) => {
    const state = reducer(initial, fetchContactsList.pending("load", args));
    return reducer(state, fetchContactsList.fulfilled(payload, "load", args));
  };
  const pendingIn = (id) => ({
    id,
    connectionId: `conn-${id}`,
    connectionStatus: "PENDING",
    connectionDirection: "incoming",
  });

  it("removes the confirmed member from People at once and fixes the page count", () => {
    let state = loaded(
      people([pendingIn("anna"), { id: "bob", connectionStatus: null }], 9),
    );
    expect(state.contactsMeta.totalPages).toBe(2);

    state = reducer(
      state,
      acceptConnection.fulfilled({ connectionId: "conn-anna" }, "a", "conn-anna"),
    );

    expect(state.contacts.map((c) => c.id)).toEqual(["bob"]);
    expect(state.contactsMeta).toMatchObject({ total: 8, totalPages: 1 });
  });

  it("refreshes the page in the background without clearing cards", () => {
    let state = loaded(people([{ id: "bob" }], 9));
    const args = { page: 1, background: true };

    state = reducer(state, fetchContactsList.pending("bg", args));
    expect(state.contactsLoading).toBe(false);
    expect(state.contacts.map((c) => c.id)).toEqual(["bob"]);

    state = reducer(
      state,
      fetchContactsList.fulfilled(people([{ id: "bob" }, { id: "cara" }], 9), "bg", args),
    );
    expect(state.contacts.map((c) => c.id)).toEqual(["bob", "cara"]);
  });

  it("lets a page or filter load in flight win over a background refresh", () => {
    let state = loaded(people([{ id: "bob" }]));
    state = reducer(state, fetchContactsList.pending("page-2", { page: 2 }));
    state = reducer(state, fetchContactsList.pending("bg", { page: 1, background: true }));
    state = reducer(
      state,
      fetchContactsList.fulfilled(people([{ id: "stale" }]), "bg", { page: 1, background: true }),
    );
    expect(state.contactsLoading).toBe(true);

    state = reducer(
      state,
      fetchContactsList.fulfilled(people([{ id: "page-2-row" }]), "page-2", { page: 2 }),
    );
    expect(state.contacts.map((c) => c.id)).toEqual(["page-2-row"]);
  });

  it("keeps the visible cards when a background refresh fails", () => {
    let state = loaded(people([{ id: "bob" }]));
    const args = { page: 1, background: true };
    state = reducer(state, fetchContactsList.pending("bg", args));
    state = reducer(state, fetchContactsList.rejected(null, "bg", args, "Network Error"));

    expect(state.contacts.map((c) => c.id)).toEqual(["bob"]);
    expect(state.contactsError).toBeNull();
    expect(state.error).toBeNull();
  });
});

describe("sending a request from People", () => {
  const people = (ids, total = ids.length) => ({
    data: ids.map((id) => ({ id, connectionStatus: null, connectionId: null })),
    meta: { page: 1, pageSize: 8, total, totalPages: Math.ceil(total / 8) || 1 },
  });
  const loaded = (payload) => {
    const state = reducer(initial, fetchContactsList.pending("load", { page: 1 }));
    return reducer(state, fetchContactsList.fulfilled(payload, "load", { page: 1 }));
  };
  const sent = (addresseeId) =>
    requestContactConnection.fulfilled(
      { addresseeId, connection: { id: `conn-${addresseeId}`, status: "PENDING" } },
      "connect",
      addresseeId,
    );

  it("removes the member from People at once and fixes the page count", () => {
    let state = loaded(people(["anna", "bob"], 9));
    expect(state.contactsMeta.totalPages).toBe(2);

    state = reducer(state, requestContactConnection.pending("connect", "anna"));
    expect(state.connectingId).toBe("anna");

    state = reducer(state, sent("anna"));

    expect(state.connectingId).toBeNull();
    expect(state.contacts.map((c) => c.id)).toEqual(["bob"]);
    expect(state.contactsMeta).toMatchObject({ total: 8, totalPages: 1 });
  });

  it("leaves the list and totals alone when the member is not on this page", () => {
    let state = loaded(people(["bob"], 9));
    state = reducer(state, sent("someone-else"));

    expect(state.contacts.map((c) => c.id)).toEqual(["bob"]);
    expect(state.contactsMeta).toMatchObject({ total: 9, totalPages: 2 });
  });

  it("keeps the card when the request fails", () => {
    let state = loaded(people(["anna"]));
    state = reducer(state, requestContactConnection.pending("connect", "anna"));
    state = reducer(
      state,
      requestContactConnection.rejected(null, "connect", "anna", "A connection already exists"),
    );

    expect(state.contacts.map((c) => c.id)).toEqual(["anna"]);
    expect(state.contactsMeta.total).toBe(1);
    expect(state.connectingId).toBeNull();
  });

  it("marks an open profile as pending so it shows the sent state", () => {
    let state = reducer(
      initial,
      fetchContactDetails.fulfilled({ id: "anna", connectionStatus: null }, "d", "anna"),
    );
    state = reducer(state, sent("anna"));

    expect(state.selectedContact).toMatchObject({
      connectionStatus: "PENDING",
      connectionDirection: "outgoing",
    });
  });
});

