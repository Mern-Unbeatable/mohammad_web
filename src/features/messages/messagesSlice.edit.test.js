import { describe, expect, it, vi } from "vitest";
import reducer, { initialState, messageUpdated } from "./messagesSlice";
import { editMessage } from "./messagesThunks";
import { toMessageModel } from "./messagesMappers";

vi.mock("./messagesApi", () => ({ getApiErrorMessage: (_err, fallback) => fallback }));

const loaded = {
  ...initialState,
  activeConversationId: "c1",
  messages: [
    { id: "m1", conversationId: "c1", from: "me", senderId: "me", body: "helo", editedAt: null },
    { id: "m2", conversationId: "c1", from: "them", senderId: "u2", body: "hi", editedAt: null },
  ],
};

const edit = (conversationId, body, editedAt = "2026-10-18T06:05:00.000Z") => ({
  conversationId,
  message: { id: "m1", senderId: "me", body, editedAt },
});

describe("message edits", () => {
  it("applies a saved edit to the open thread", () => {
    const state = reducer(
      loaded,
      editMessage.fulfilled(edit("c1", "hello"), "r1", { conversationId: "c1", messageId: "m1", body: "hello" }),
    );
    expect(state.messages[0]).toMatchObject({ body: "hello", editedAt: "2026-10-18T06:05:00.000Z", from: "me" });
    expect(state.messages[1]).toEqual(loaded.messages[1]);
  });

  it("applies realtime edits without touching the viewer-relative `from`", () => {
    const state = reducer(loaded, messageUpdated(edit("c1", "hello")));
    expect(state.messages[0]).toMatchObject({ body: "hello", from: "me" });
  });

  it("ignores edits for another conversation", () => {
    expect(reducer(loaded, messageUpdated(edit("c2", "hello")))).toEqual(loaded);
  });

  it("surfaces failures through the error toast state", () => {
    const state = reducer(
      loaded,
      editMessage.rejected(null, "r1", { conversationId: "c1", messageId: "m1", body: "x" }, "Failed to edit message"),
    );
    expect(state.error).toBe("Failed to edit message");
    expect(state.messages).toEqual(loaded.messages);
  });

  it("marks edited messages in the UI model", () => {
    expect(toMessageModel({ id: "m1", body: "x", editedAt: "2026-10-18T06:05:00Z" }, "me").edited).toBe(true);
    expect(toMessageModel({ id: "m1", body: "x", editedAt: null }, "me").edited).toBe(false);
  });
});
