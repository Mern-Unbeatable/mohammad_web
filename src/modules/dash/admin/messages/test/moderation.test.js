import { describe, expect, it } from "vitest";
import {
  activeChatTab,
  chatTabPath,
  countLabel,
  hasMorePages,
  isSystemMessage,
  nextPage,
} from "../utils/moderation";
import { ADMIN_CHAT_MODERATION_PATH, CHAT_TAB } from "../constant/constants";

describe("chat tabs", () => {
  it("reads the tab from the path", () => {
    expect(activeChatTab(`${ADMIN_CHAT_MODERATION_PATH}`)).toBe(CHAT_TAB.MODERATION);
    expect(activeChatTab("/admin/chat/direct/1")).toBe(CHAT_TAB.INBOX);
  });

  it("maps the moderation tab to its path", () => {
    expect(chatTabPath(CHAT_TAB.MODERATION)).toBe(ADMIN_CHAT_MODERATION_PATH);
    expect(chatTabPath(CHAT_TAB.INBOX).startsWith("/admin/chat")).toBe(true);
  });
});

describe("countLabel", () => {
  it("pluralises everything but one", () => {
    expect(countLabel(0, "member")).toBe("0 members");
    expect(countLabel(1, "member")).toBe("1 member");
    expect(countLabel(4, "message")).toBe("4 messages");
  });
});

describe("paging", () => {
  it("defaults missing meta to a single page", () => {
    expect(hasMorePages(undefined)).toBe(false);
    expect(hasMorePages({ page: 1, totalPages: 3 })).toBe(true);
    expect(nextPage({ page: 2 })).toBe(3);
    expect(nextPage(null)).toBe(2);
  });
});

describe("isSystemMessage", () => {
  it("matches the SYSTEM type", () => {
    expect(isSystemMessage({ type: "SYSTEM" })).toBe(true);
    expect(isSystemMessage({ type: "TEXT" })).toBe(false);
  });
});
