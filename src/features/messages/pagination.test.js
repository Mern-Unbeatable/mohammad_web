import { describe, expect, it, vi } from "vitest";

const { get } = vi.hoisted(() => ({ get: vi.fn() }));

vi.mock("@/config", () => ({
  crudService: { get },
  API_ENDPOINTS: {
    ADMIN: {
      MESSAGES: {
        LIST: "/admin/messages",
        THREAD: (id) => `/admin/messages/${id}/messages`,
      },
    },
  },
  unwrapApiData: (response) => response?.data,
  getApiErrorMessage: vi.fn(),
}));

const { olderMessagesParams, nextConversationsParams } = await import("./pagination.js");
const { fetchModerationThread } = await import("./moderation/adminMessagesThunks.js");

const run = (thunk) => thunk(vi.fn(), () => ({}), undefined);

describe("olderMessagesParams", () => {
  it("sends both the oldest timestamp and its id", () => {
    const messages = [
      { id: "m1", time: "2026-01-01T00:00:00.000Z" },
      { id: "m2", time: "2026-01-01T00:00:00.000Z" },
    ];
    expect(olderMessagesParams(messages)).toEqual({
      before: "2026-01-01T00:00:00.000Z",
      beforeId: "m1",
    });
  });

  it("returns no cursor for an empty thread", () => {
    expect(olderMessagesParams([])).toEqual({});
    expect(olderMessagesParams()).toEqual({});
  });
});

describe("nextConversationsParams", () => {
  it("uses the server cursor when there is one", () => {
    expect(nextConversationsParams({ page: 1, nextCursor: "abc" })).toEqual({
      page: 2,
      cursor: "abc",
    });
  });

  it("falls back to the next page number without a cursor", () => {
    expect(nextConversationsParams({ page: 3, nextCursor: null })).toEqual({ page: 4 });
    expect(nextConversationsParams(null)).toEqual({ page: 2 });
  });
});

describe("fetchModerationThread", () => {
  it("forwards beforeId with before for the admin thread", async () => {
    get.mockResolvedValue({ data: [], meta: { hasMore: false } });

    await run(fetchModerationThread({ conversationId: "c1", before: "t", beforeId: "m1" }));

    expect(get).toHaveBeenLastCalledWith("/admin/messages/c1/messages", {
      pageSize: 50,
      before: "t",
      beforeId: "m1",
    });
  });

  it("sends no cursor for the first page", async () => {
    get.mockResolvedValue({ data: [], meta: { hasMore: false } });

    await run(fetchModerationThread({ conversationId: "c1" }));

    expect(get).toHaveBeenLastCalledWith("/admin/messages/c1/messages", { pageSize: 50 });
  });
});
