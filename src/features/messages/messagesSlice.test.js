import { describe, expect, it, vi } from "vitest";
import reducer, {
  initialState,
  setActiveConversation,
  messageReceived,
  messageRemoved,
  conversationRemoved,
  conversationReadByOther,
  presenceChanged,
  presenceSet,
  resetMessages,
} from "./messagesSlice";
import {
  fetchConversations,
  fetchThread,
  fetchUnreadSummary,
  markConversationRead,
  sendMessage,
  startDirect,
} from "./messagesThunks";
import { logoutUser } from "../auth/authThunks";

vi.mock("./messagesApi", () => ({ getApiErrorMessage: (_err, fallback) => fallback }));

const conversation = (id, time, extra = {}) => ({
  id,
  isGroup: false,
  name: id,
  preview: "",
  time,
  unreadCount: 0,
  participants: [],
  ...extra,
});

const message = (id, conversationId, time, senderId = "u2") => ({
  id,
  conversationId,
  body: `body ${id}`,
  attachments: [],
  senderId,
  time,
});

const withConversations = (...rows) => ({ ...initialState, conversations: rows });

describe("messagesSlice realtime reducers", () => {
  it("bumps the conversation to the top and counts unread when not active", () => {
    const state = withConversations(
      conversation("a", "2026-09-26T10:00:00Z"),
      conversation("b", "2026-09-26T09:00:00Z"),
    );
    const next = reducer(
      state,
      messageReceived({
        conversationId: "b",
        message: message("m1", "b", "2026-09-26T11:00:00Z"),
        currentUserId: "u1",
      }),
    );
    expect(next.conversations.map((c) => c.id)).toEqual(["b", "a"]);
    expect(next.conversations[0]).toMatchObject({ unreadCount: 1, preview: "body m1" });
    expect(next.messages).toEqual([]);
  });

  it("appends to the open thread without unread and ignores duplicates", () => {
    let state = {
      ...withConversations(conversation("a", "2026-09-26T10:00:00Z")),
      activeConversationId: "a",
    };
    const payload = {
      conversationId: "a",
      message: message("m1", "a", "2026-09-26T11:00:00Z"),
      currentUserId: "u1",
    };
    state = reducer(state, messageReceived(payload));
    state = reducer(state, messageReceived(payload));
    expect(state.messages).toHaveLength(1);
    expect(state.conversations[0].unreadCount).toBe(0);
  });

  it("does not count the caller's own messages as unread", () => {
    const state = withConversations(conversation("a", "2026-09-26T10:00:00Z"));
    const next = reducer(
      state,
      messageReceived({
        conversationId: "a",
        message: message("m1", "a", "2026-09-26T11:00:00Z", "u1"),
        currentUserId: "u1",
      }),
    );
    expect(next.conversations[0].unreadCount).toBe(0);
  });

  it("removes deleted messages from the open thread", () => {
    const state = {
      ...initialState,
      activeConversationId: "a",
      messages: [message("m1", "a", "t1"), message("m2", "a", "t2")],
    };
    const next = reducer(state, messageRemoved({ conversationId: "a", messageId: "m1" }));
    expect(next.messages.map((m) => m.id)).toEqual(["m2"]);
  });

  it("clears the thread when the active conversation is removed", () => {
    const state = {
      ...withConversations(conversation("a", "t")),
      activeConversationId: "a",
      messages: [message("m1", "a", "t")],
    };
    const next = reducer(state, conversationRemoved("a"));
    expect(next.conversations).toEqual([]);
    expect(next.activeConversationId).toBeNull();
    expect(next.messages).toEqual([]);
  });

  it("updates the other participant's read marker", () => {
    const state = withConversations(
      conversation("a", "t", { participants: [{ id: "u2", lastReadAt: null }] }),
    );
    const next = reducer(
      state,
      conversationReadByOther({ conversationId: "a", userId: "u2", lastReadAt: "later" }),
    );
    expect(next.conversations[0].participants[0].lastReadAt).toBe("later");
  });

  it("tracks presence changes", () => {
    let state = reducer(initialState, presenceSet(["u1", "u1", "u2"]));
    expect(state.onlineUserIds).toEqual(["u1", "u2"]);
    state = reducer(state, presenceChanged({ userId: "u1", online: false }));
    state = reducer(state, presenceChanged({ userId: "u3", online: true }));
    expect(state.onlineUserIds).toEqual(["u2", "u3"]);
  });
});

describe("messagesSlice selection and thunks", () => {
  it("resets the thread and unread count when switching conversations", () => {
    const state = {
      ...withConversations(conversation("a", "t", { unreadCount: 4 })),
      activeConversationId: "b",
      messages: [message("m1", "b", "t")],
    };
    const next = reducer(state, setActiveConversation("a"));
    expect(next.messages).toEqual([]);
    expect(next.conversations[0].unreadCount).toBe(0);
    expect(next.activeDetail?.id).toBe("a");
  });

  it("ignores conversation pages for a tab the user already left", () => {
    const state = { ...initialState, listType: "group" };
    const next = reducer(
      state,
      fetchConversations.fulfilled(
        { data: [conversation("a", "t")], meta: initialState.conversationsMeta },
        "req",
        { type: "direct" },
      ),
    );
    expect(next.conversations).toEqual([]);
  });

  it("appends further conversation pages without duplicates", () => {
    const state = withConversations(conversation("a", "t2"));
    const next = reducer(
      state,
      fetchConversations.fulfilled(
        {
          data: [conversation("a", "t2"), conversation("b", "t1")],
          meta: { ...initialState.conversationsMeta, page: 2 },
        },
        "req",
        { type: "direct", page: 2 },
      ),
    );
    expect(next.conversations.map((c) => c.id)).toEqual(["a", "b"]);
  });

  it("prepends older messages when paging back", () => {
    const state = {
      ...initialState,
      activeConversationId: "a",
      messages: [message("m3", "a", "2026-09-26T12:00:00Z")],
    };
    const next = reducer(
      state,
      fetchThread.fulfilled(
        {
          conversationId: "a",
          data: [message("m1", "a", "2026-09-26T10:00:00Z"), message("m2", "a", "2026-09-26T11:00:00Z")],
          hasMore: true,
        },
        "req",
        { conversationId: "a", before: "2026-09-26T12:00:00Z" },
      ),
    );
    expect(next.messages.map((m) => m.id)).toEqual(["m1", "m2", "m3"]);
    expect(next.messagesHasMore).toBe(true);
  });

  it("keeps realtime messages newer than a refreshed first page", () => {
    const state = {
      ...initialState,
      activeConversationId: "a",
      messages: [message("m9", "a", "2026-09-26T13:00:00Z")],
    };
    const next = reducer(
      state,
      fetchThread.fulfilled(
        { conversationId: "a", data: [message("m1", "a", "2026-09-26T10:00:00Z")], hasMore: false },
        "req",
        { conversationId: "a" },
      ),
    );
    expect(next.messages.map((m) => m.id)).toEqual(["m1", "m9"]);
  });

  it("drops thread responses for a conversation that is no longer open", () => {
    const state = { ...initialState, activeConversationId: "b" };
    const next = reducer(
      state,
      fetchThread.fulfilled(
        { conversationId: "a", data: [message("m1", "a", "t")], hasMore: false },
        "req",
        { conversationId: "a" },
      ),
    );
    expect(next.messages).toEqual([]);
  });

  it("appends sent messages and moves the conversation to the top", () => {
    const state = {
      ...withConversations(
        conversation("a", "2026-09-26T10:00:00Z"),
        conversation("b", "2026-09-26T09:00:00Z"),
      ),
      activeConversationId: "b",
      sending: true,
    };
    const sent = message("m1", "b", "2026-09-26T11:00:00Z", "u1");
    const next = reducer(
      state,
      sendMessage.fulfilled({ conversationId: "b", message: sent }, "req", {}),
    );
    expect(next.sending).toBe(false);
    expect(next.messages).toEqual([sent]);
    expect(next.conversations[0].id).toBe("b");
  });

  it("switches tab and opens the conversation returned by startDirect", () => {
    const state = { ...initialState, listType: "group" };
    const direct = conversation("d", "2026-09-26T11:00:00Z");
    const next = reducer(state, startDirect.fulfilled(direct, "req", {}));
    expect(next.listType).toBe("direct");
    expect(next.activeConversationId).toBe("d");
    expect(next.conversations.map((c) => c.id)).toEqual(["d"]);
    expect(next.activeDetail).toEqual(direct);
  });
});

describe("messagesSlice unread totals", () => {
  const withUnread = (unread, ...rows) => ({
    ...withConversations(...rows),
    unread: { ...initialState.unread, ...unread },
  });

  it("stores the latest server summary and ignores stale responses", () => {
    let state = reducer(initialState, fetchUnreadSummary.pending("old"));
    state = reducer(state, fetchUnreadSummary.pending("new"));
    state = reducer(
      state,
      fetchUnreadSummary.fulfilled({ messages: 9, conversations: 3 }, "old"),
    );
    expect(state.unread).toMatchObject({ messages: 0, conversations: 0, loaded: false });
    state = reducer(
      state,
      fetchUnreadSummary.fulfilled({ messages: 4, conversations: 2 }, "new"),
    );
    expect(state.unread).toMatchObject({ messages: 4, conversations: 2, loaded: true });
  });

  it("does not surface badge refresh failures as a messages error", () => {
    const state = reducer(
      initialState,
      fetchUnreadSummary.rejected(null, "req", undefined, "Failed"),
    );
    expect(state.error).toBeNull();
  });

  it("increments totals for messages arriving in inactive conversations", () => {
    let state = withUnread(
      { messages: 1, conversations: 1 },
      conversation("a", "2026-09-26T10:00:00Z", { unreadCount: 1 }),
      conversation("b", "2026-09-26T09:00:00Z"),
    );
    const arrive = (id, conversationId) =>
      messageReceived({
        conversationId,
        message: message(id, conversationId, "2026-09-26T11:00:00Z"),
        currentUserId: "u1",
      });
    state = reducer(state, arrive("m1", "a"));
    expect(state.unread).toMatchObject({ messages: 2, conversations: 1 });
    state = reducer(state, arrive("m2", "b"));
    expect(state.unread).toMatchObject({ messages: 3, conversations: 2 });
  });

  it("clears a conversation's share when it is opened or marked read", () => {
    let state = withUnread(
      { messages: 5, conversations: 2 },
      conversation("a", "2026-09-26T10:00:00Z", { unreadCount: 3 }),
      conversation("b", "2026-09-26T09:00:00Z", { unreadCount: 2 }),
    );
    state = reducer(state, setActiveConversation("a"));
    expect(state.unread).toMatchObject({ messages: 2, conversations: 1 });
    state = reducer(
      state,
      markConversationRead.fulfilled({ conversationId: "b" }, "req", "b"),
    );
    expect(state.unread).toMatchObject({ messages: 0, conversations: 0 });
    state = reducer(
      state,
      fetchThread.fulfilled({ conversationId: "a", data: [], hasMore: false }, "req", {}),
    );
    expect(state.unread).toMatchObject({ messages: 0, conversations: 0 });
  });

  it("keeps totals when the chat page resets and clears them on logout", () => {
    const state = withUnread({ messages: 2, conversations: 1, loaded: true });
    const reset = reducer(state, resetMessages());
    expect(reset.unread).toMatchObject({ messages: 2, conversations: 1 });
    expect(reducer(reset, logoutUser.fulfilled(undefined, "req")).unread).toEqual(
      initialState.unread,
    );
  });
});
