import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router";
import { configureStore } from "@reduxjs/toolkit";
import { adminMessagesReducer } from "@/features/messages/moderation";
import AdminChatView from "../pages/AdminChatView";
import AdminChatModerationView from "../pages/AdminChatModerationView";
import { ADMIN_CHAT_MODERATION_PATH } from "../constant/constants";

const renderModeration = (state = {}) => {
  const store = configureStore({
    reducer: { adminMessages: adminMessagesReducer },
    preloadedState: {
      adminMessages: { ...adminMessagesReducer(undefined, { type: "@@init" }), ...state },
    },
  });
  return renderToStaticMarkup(
    <Provider store={store}>
      <AdminChatModerationView />
    </Provider>,
  );
};

const conversation = {
  id: "c1",
  name: "Lab team",
  isGroup: true,
  preview: "See you",
  time: "2026-10-01T10:00:00Z",
  participants: [
    { id: "u1", name: "Ana" },
    { id: "u2", name: "Ben" },
  ],
  messageCount: 1,
};

describe("AdminChatModerationView", () => {
  it("renders the empty list and the placeholder", () => {
    const html = renderModeration();
    expect(html).toContain("0 conversations");
    expect(html).toContain("No conversations found.");
    expect(html).toContain("Select a conversation");
  });

  it("renders rows with counts and Load more", () => {
    const html = renderModeration({
      conversations: [conversation],
      meta: { page: 1, total: 1, totalPages: 2 },
    });
    expect(html).toContain("1 conversation<");
    expect(html).toContain("Lab team");
    expect(html).toContain("2 members");
    expect(html).toContain("1 message<");
    expect(html).toContain("Load more");
  });

  it("renders the selected thread with system and member messages", () => {
    const html = renderModeration({
      conversations: [conversation],
      selectedId: "c1",
      selected: conversation,
      hasMore: true,
      messages: [
        { id: "m1", type: "SYSTEM", body: "Ana joined", time: "2026-10-01T10:00:00Z" },
        { id: "m2", type: "TEXT", body: "Hello", sender: "Ben", time: "2026-10-01T10:01:00Z" },
      ],
    });
    expect(html).toContain("Delete conversation");
    expect(html).toContain("Load older messages");
    expect(html).toContain("Ana joined");
    expect(html).toContain("Hello");
    expect(html).toContain('aria-label="Remove message"');
    expect(html).not.toContain("Select a conversation");
  });
});

describe("AdminChatView", () => {
  it("renders the header and both tabs", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={[ADMIN_CHAT_MODERATION_PATH]}>
        <Routes>
          <Route path="/admin/chat/*" element={<AdminChatView />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(html).toContain("Message members and moderate platform conversations.");
    expect(html).toContain("My conversations");
    expect(html).toContain("Moderation");
  });
});
