import { describe, expect, it, vi } from "vitest";
import reducer, { initialState, resetMessages } from "./messagesSlice";
import { fetchConversations } from "./messagesThunks";

vi.mock("./messagesApi", () => ({ getApiErrorMessage: (_err, fallback) => fallback }));

const direct = (id) => ({ id, isGroup: false, name: id, time: "t", unreadCount: 0, participants: [] });
const group = (id) => ({ id, isGroup: true, name: id, time: "t", unreadCount: 0, participants: [] });
const meta = (extra = {}) => ({ page: 1, pageSize: 30, total: 1, totalPages: 1, ...extra });

const pending = (requestId, arg) => fetchConversations.pending(requestId, arg);
const fulfilled = (requestId, arg, data, extraMeta) =>
  fetchConversations.fulfilled({ data, meta: meta(extraMeta) }, requestId, arg);
const rejected = (requestId, arg, message = "Failed to load conversations") =>
  fetchConversations.rejected(new Error(message), requestId, arg, message);

const run = (state, ...actions) => actions.reduce(reducer, state);

const DIRECT = { type: "direct", search: "", page: 1 };
const GROUP = { type: "group", search: "", page: 1 };

const loadedDirect = () =>
  run(initialState, pending("r1", DIRECT), fulfilled("r1", DIRECT, [direct("d1"), direct("d2")]));

describe("messages list: switching between the Messages and Groups tabs", () => {
  it("loads the Messages list", () => {
    const loading = reducer(initialState, pending("r1", DIRECT));
    expect(loading.conversationsLoading).toBe(true);

    const next = reducer(loading, fulfilled("r1", DIRECT, [direct("d1")]));
    expect(next.conversationsLoading).toBe(false);
    expect(next.conversations.map((c) => c.id)).toEqual(["d1"]);
    expect(next.conversationsError).toBeNull();
  });

  it("does not keep showing the Messages list while the Groups list loads", () => {
    const next = reducer(loadedDirect(), pending("r2", GROUP));
    expect(next.listType).toBe("group");
    expect(next.conversationsLoading).toBe(true);
    expect(next.conversations).toEqual([]);
  });

  it("shows the Groups list once it arrives", () => {
    const next = run(loadedDirect(), pending("r2", GROUP), fulfilled("r2", GROUP, [group("g1")]));
    expect(next.conversations.map((c) => c.id)).toEqual(["g1"]);
    expect(next.conversationsLoading).toBe(false);
  });

  it("shows an empty Groups list (not the Messages list) when there are no groups", () => {
    const next = run(loadedDirect(), pending("r2", GROUP), fulfilled("r2", GROUP, [], { total: 0 }));
    expect(next.conversations).toEqual([]);
    expect(next.conversationsLoading).toBe(false);
    expect(next.conversationsError).toBeNull();
  });

  it("keeps the loading state when a response for a tab already left arrives first", () => {
    // Messages → Groups → Messages: the Groups response lands while the
    // second Messages request is still pending.
    const state = run(loadedDirect(), pending("r2", GROUP), pending("r3", DIRECT));
    const next = reducer(state, fulfilled("r2", GROUP, [group("g1")]));
    expect(next.conversationsLoading).toBe(true);
    expect(next.conversations.some((c) => c.isGroup)).toBe(false);

    const done = reducer(next, fulfilled("r3", DIRECT, [direct("d3")]));
    expect(done.conversations.map((c) => c.id)).toEqual(["d3"]);
    expect(done.conversationsLoading).toBe(false);
  });

  it("ignores an older response for the same tab that arrives after a newer one", () => {
    // Messages → Groups → Messages, with the first Messages request slowest.
    const state = run(
      initialState,
      pending("r1", DIRECT),
      pending("r2", GROUP),
      pending("r3", DIRECT),
      fulfilled("r3", DIRECT, [direct("new")]),
    );
    const next = reducer(state, fulfilled("r1", DIRECT, [direct("old")]));
    expect(next.conversations.map((c) => c.id)).toEqual(["new"]);
  });

  it("survives switching tabs repeatedly; only the last tab's list is shown", () => {
    let state = loadedDirect();
    const args = [GROUP, DIRECT, GROUP, DIRECT, GROUP];
    args.forEach((arg, i) => {
      state = reducer(state, pending(`s${i}`, arg));
    });
    // Responses arrive in reverse order.
    [...args].reverse().forEach((arg, j) => {
      const i = args.length - 1 - j;
      state = reducer(state, fulfilled(`s${i}`, arg, [arg === GROUP ? group(`g${i}`) : direct(`d${i}`)]));
    });
    expect(state.listType).toBe("group");
    expect(state.conversations.map((c) => c.id)).toEqual(["g4"]);
    expect(state.conversationsLoading).toBe(false);
  });

  it("does not let a silent refresh for the previous tab take over the list", () => {
    const state = run(loadedDirect(), pending("r2", GROUP), fulfilled("r2", GROUP, [group("g1")]));
    const silentDirect = { ...DIRECT, silent: true };
    const next = run(state, pending("p1", silentDirect), fulfilled("p1", silentDirect, [direct("d9")]));
    expect(next.listType).toBe("group");
    expect(next.conversations.map((c) => c.id)).toEqual(["g1"]);
  });

  it("does not let a silent refresh end the loading state of a tab switch", () => {
    const state = reducer(loadedDirect(), pending("r2", GROUP));
    const silentGroup = { ...GROUP, silent: true };
    const next = run(state, pending("p1", silentGroup), rejected("p1", silentGroup));
    expect(next.conversationsLoading).toBe(true);
    expect(next.conversationsError).toBeNull();
  });

  it("applies a silent refresh for the current tab when nothing else is loading", () => {
    const silentDirect = { ...DIRECT, silent: true };
    const next = run(loadedDirect(), pending("p1", silentDirect), fulfilled("p1", silentDirect, [direct("d5")]));
    expect(next.conversations.map((c) => c.id)).toEqual(["d5"]);
    expect(next.conversationsLoading).toBe(false);
  });
});

describe("messages list: failures and retry", () => {
  it("shows an error for the tab that failed instead of the previous tab's list", () => {
    const next = run(loadedDirect(), pending("r2", GROUP), rejected("r2", GROUP));
    expect(next.conversationsLoading).toBe(false);
    expect(next.conversations).toEqual([]);
    expect(next.conversationsError).toBe("Failed to load conversations");
  });

  it("reports an expired session as a list error", () => {
    const next = run(initialState, pending("r1", DIRECT), rejected("r1", DIRECT, "Session expired"));
    expect(next.conversationsError).toBe("Session expired");
    expect(next.conversationsLoading).toBe(false);
  });

  it("clears the error and loads on retry", () => {
    const failed = run(initialState, pending("r1", GROUP), rejected("r1", GROUP));
    const retrying = reducer(failed, pending("r2", GROUP));
    expect(retrying.conversationsError).toBeNull();
    expect(retrying.conversationsLoading).toBe(true);

    const next = reducer(retrying, fulfilled("r2", GROUP, [group("g1")]));
    expect(next.conversations.map((c) => c.id)).toEqual(["g1"]);
  });

  it("ignores a failure from a tab the user already left", () => {
    const state = run(loadedDirect(), pending("r2", GROUP), pending("r3", DIRECT));
    const next = reducer(state, rejected("r2", GROUP));
    expect(next.conversationsError).toBeNull();
    expect(next.conversationsLoading).toBe(true);
  });

  it("keeps the loaded list when loading more fails, and reports it", () => {
    const more = { ...DIRECT, page: 2, cursor: "c1" };
    const next = run(loadedDirect(), pending("r2", more), rejected("r2", more));
    expect(next.conversations.map((c) => c.id)).toEqual(["d1", "d2"]);
    expect(next.conversationsLoadingMore).toBe(false);
    expect(next.conversationsError).toBeNull();
    expect(next.error).toBe("Failed to load conversations");
  });
});

describe("messages list: pagination and cached data", () => {
  it("appends the next page and keeps the server cursor", () => {
    const more = { ...DIRECT, page: 2, cursor: "c1" };
    const next = run(
      loadedDirect(),
      pending("r2", more),
      fulfilled("r2", more, [direct("d2"), direct("d3")], { page: 2, nextCursor: "c2" }),
    );
    expect(next.conversations.map((c) => c.id)).toEqual(["d1", "d2", "d3"]);
    expect(next.conversationsMeta.nextCursor).toBe("c2");
    expect(next.conversationsLoadingMore).toBe(false);
  });

  it("drops a next page that arrives after switching tabs", () => {
    const more = { ...DIRECT, page: 2, cursor: "c1" };
    const state = run(loadedDirect(), pending("r2", more), pending("r3", GROUP));
    const next = reducer(state, fulfilled("r2", more, [direct("d3")], { page: 2 }));
    expect(next.conversations).toEqual([]);
    expect(next.conversationsLoading).toBe(true);
  });

  it("does not reuse the previous tab's pagination for the new tab", () => {
    const state = run(
      initialState,
      pending("r1", DIRECT),
      fulfilled("r1", DIRECT, [direct("d1")], { totalPages: 3, nextCursor: "c-direct" }),
      pending("r2", GROUP),
    );
    expect(state.conversationsMeta.nextCursor).toBeUndefined();
    expect(state.conversationsMeta.totalPages).toBe(1);
  });

  it("starts from a clean list after leaving and returning to the chat page", () => {
    const left = reducer(loadedDirect(), resetMessages());
    expect(left.conversations).toEqual([]);
    const back = reducer(left, pending("r9", GROUP));
    expect(back.conversationsLoading).toBe(true);
    expect(back.conversationsError).toBeNull();
    expect(back.listType).toBe("group");
  });

  it("refreshing the same tab (e.g. a search) keeps rows visible while loading", () => {
    const searching = { ...DIRECT, search: "an" };
    const next = reducer(loadedDirect(), pending("r2", searching));
    expect(next.conversations.map((c) => c.id)).toEqual(["d1", "d2"]);
    expect(next.conversationsLoading).toBe(true);
  });
});
