import { describe, expect, it, vi } from "vitest";
import reducer from "./adminMessagesSlice";
import { fetchModerationConversations } from "./adminMessagesThunks";

vi.mock("./adminMessagesApi", () => ({ getApiErrorMessage: (_err, fallback) => fallback }));

const initial = reducer(undefined, { type: "@@init" });
const row = (id, isGroup = false) => ({ id, isGroup, name: id, participants: [], messageCount: 1 });
const meta = (extra = {}) => ({ page: 1, pageSize: 20, total: 1, totalPages: 1, ...extra });

const pending = (id, arg) => fetchModerationConversations.pending(id, arg);
const fulfilled = (id, arg, data, extraMeta) =>
  fetchModerationConversations.fulfilled({ data, meta: meta(extraMeta) }, id, arg);
const rejected = (id, arg, message = "Failed to load conversations") =>
  fetchModerationConversations.rejected(new Error(message), id, arg, message);
const run = (state, ...actions) => actions.reduce(reducer, state);

const ALL = { page: 1, search: "", type: "" };
const DIRECT = { page: 1, search: "", type: "direct" };
const GROUP = { page: 1, search: "", type: "group" };

const loadedAll = () => run(initial, pending("r1", ALL), fulfilled("r1", ALL, [row("d1"), row("g1", true)]));

describe("admin moderation list: type filters", () => {
  it("loads the list for the selected filter", () => {
    const next = run(initial, pending("r1", GROUP), fulfilled("r1", GROUP, [row("g1", true)]));
    expect(next.conversations.map((c) => c.id)).toEqual(["g1"]);
    expect(next.listLoading).toBe(false);
    expect(next.listError).toBeNull();
  });

  it("does not show the previous filter's rows while the new one loads", () => {
    const next = reducer(loadedAll(), pending("r2", GROUP));
    expect(next.conversations).toEqual([]);
    expect(next.listLoading).toBe(true);
    expect(next.meta.totalPages).toBe(1);
  });

  it("shows only the last filter's list when responses arrive out of order", () => {
    const state = run(loadedAll(), pending("r2", GROUP), pending("r3", DIRECT));
    const afterDirect = reducer(state, fulfilled("r3", DIRECT, [row("d2")]));
    const next = reducer(afterDirect, fulfilled("r2", GROUP, [row("g9", true)]));
    expect(next.conversations.map((c) => c.id)).toEqual(["d2"]);
    expect(next.listLoading).toBe(false);
  });

  it("keeps loading while a stale response from an abandoned filter arrives", () => {
    const state = run(loadedAll(), pending("r2", GROUP), pending("r3", DIRECT));
    const next = reducer(state, fulfilled("r2", GROUP, [row("g9", true)]));
    expect(next.listLoading).toBe(true);
    expect(next.conversations).toEqual([]);
  });

  it("shows an empty list when the filter has no conversations", () => {
    const next = run(loadedAll(), pending("r2", GROUP), fulfilled("r2", GROUP, [], { total: 0 }));
    expect(next.conversations).toEqual([]);
    expect(next.listLoading).toBe(false);
  });
});

describe("admin moderation list: failures, retry and paging", () => {
  it("records the error for the current filter and clears it on retry", () => {
    const failed = run(loadedAll(), pending("r2", GROUP), rejected("r2", GROUP));
    expect(failed.listError).toBe("Failed to load conversations");
    expect(failed.listLoading).toBe(false);
    expect(failed.conversations).toEqual([]);

    const retried = run(failed, pending("r3", GROUP), fulfilled("r3", GROUP, [row("g1", true)]));
    expect(retried.listError).toBeNull();
    expect(retried.conversations.map((c) => c.id)).toEqual(["g1"]);
  });

  it("ignores a failure from an abandoned filter", () => {
    const state = run(loadedAll(), pending("r2", GROUP), pending("r3", DIRECT));
    const next = reducer(state, rejected("r2", GROUP));
    expect(next.listError).toBeNull();
    expect(next.listLoading).toBe(true);
  });

  it("appends the next page without duplicates and keeps the cursor", () => {
    const more = { ...ALL, page: 2, cursor: "c1" };
    const next = run(
      loadedAll(),
      pending("r2", more),
      fulfilled("r2", more, [row("g1", true), row("d3")], { page: 2, nextCursor: "c2" }),
    );
    expect(next.conversations.map((c) => c.id)).toEqual(["d1", "g1", "d3"]);
    expect(next.meta.nextCursor).toBe("c2");
  });

  it("keeps the loaded rows when loading more fails", () => {
    const more = { ...ALL, page: 2, cursor: "c1" };
    const next = run(loadedAll(), pending("r2", more), rejected("r2", more));
    expect(next.conversations.map((c) => c.id)).toEqual(["d1", "g1"]);
    expect(next.listError).toBeNull();
    expect(next.error).toBe("Failed to load conversations");
  });

  it("keeps cached rows visible while refreshing the same filter", () => {
    const next = reducer(loadedAll(), pending("r2", { ...ALL, search: "lab" }));
    expect(next.conversations.map((c) => c.id)).toEqual(["d1", "g1"]);
    expect(next.listLoading).toBe(true);
  });
});
